import Joi from "joi";
import Validation from "../validation/joi.schemas.js";
import { pubsub } from "../constants.js";

//? Users API
//Registers a new user to the database
export async function postUser(parent, args, context, info) {
    let existingUser = await checkEmailAndUsernameExistence(context.user, args.email.toLowerCase(), args.username);
    if(!!existingUser) {
        if(existingUser.deleted){
            throw new Error("Email or username already exists with a deleted user");
        } else {
            throw new Error("Email or username already exists");
        }
    }

    const newUser = {
        username: args.username,
        email: args.email.toLowerCase(),
        password: args.password,
        role: args.role.toLowerCase(),
        company: args.company,
        deleted: false,
    }

    Joi.assert(newUser,Validation.userSchema);
    const userID = await getUserID(context.generate);
    newUser.user_id = `U${userID.count}`;
    newUser.createdAt = new Date();
    newUser.updatedAt = new Date();
    
    await context.user.create(newUser);
    pubsub.publish('USER_POSTED', {userPosted: newUser});

    return newUser;
}

//Updates a user found by email and password
export async function updateUser(parent, args, context, info) {
    let existingUser = await checkEmailAndUsernameExistence(context.user, args.email.toLowerCase(), args.username);
    if(!!existingUser) {
        if(existingUser.deleted){
            throw new Error("Email or username already exists with a deleted user");
        } else {
            throw new Error("Email or username already exists");
        }
    }

    const updatedUser = {
        username: args.username,
        email: args.email.toLowerCase(),
        password: args.password,
        role: args.role.toLowerCase(),
        company: args.company,
    }

    Joi.assert(updatedUser, Validation.updateUserSchema);
    updatedUser.user_id = args.user_id;
    updatedUser.updatedAt = new Date();

    let userNewValues = {};
    if (updatedUser.username) userNewValues.username = updatedUser.username;
    if (updatedUser.email) userNewValues.email = updatedUser.email;
    if (updatedUser.password) userNewValues.password = updatedUser.password;
    if (updatedUser.role) userNewValues.role = updatedUser.role;
    if (updatedUser.company) userNewValues.company = updatedUser.company;
    userNewValues.updatedAt = updatedUser.updateOne;

    userNewValues = { $set: userNewValues };
    //console.log(userNewValues);

    const usersResponse = await context.user.updateOne(
        { user_id: args.user_id, deleted: false },
        userNewValues
    )

    if (usersResponse.matchedCount > 0) {
        const confirmedUser = await context.user.findOne({ user_id: args.user_id });
        pubsub.publish('USER_UPDATED',{userUpdated: confirmedUser});
        return confirmedUser;
    } else {
        throw new Error("User not found with user_id provided");
    }
}

//Updates a user found by email and password
export async function deleteUser(parent, args, context, info) {

    let deletedUser = {
        user_id: args.user_id,
        username: args.username,
    }

    Joi.assert(deletedUser, Validation.deleteUserSchema);

    deletedUser = await context.user.findOne({ user_id: args.user_id });

    const usersResponse = await context.user.updateOne(
        { user_id: args.user_id, username: args.username, deleted: false },
        { $set: {
            updatedAt: new Date(),
            deleted: true,
        }}
    )

    if (usersResponse.matchedCount > 0) {
        pubsub.publish('USER_DELETED', {userDeleted: deletedUser});
        return deletedUser;
    } else {
        throw new Error("User not found with username and user_id provided");
    }
}


async function checkEmailAndUsernameExistence(model, email, username) {
    try {
        const pipeline = [
            {
                $match: { $or: [ { email: email, }, { username: username } ] }
            },
        ];
        const results = await model.aggregate(pipeline);
        return results[0];
    } catch (e) {
        console.error(`Something went wrong in checkEmailExistence - ${e}`);
        throw e; 
    }
}

async function getUserID(model) {
    try {
        const testResponse = await model.findOneAndUpdate(
            { generate_id: "USER_ID" },
            { $inc: { "count": 1 }}
        )
        return testResponse;
    } catch (e) {
        console.error(`Unable to generate user ID - ${e}`);
        return { error: e };
    }
}
