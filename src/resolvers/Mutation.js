import Joi from "joi";
import Validation from "../validation/joi.schemas.js";

export async function postUser(parent, args, context, info) {
    let existingUser = await checkEmailAndUsernameExistence(context.user, args.email.toLowerCase(), args.username);
    //console.log(existingUser);
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

    return newUser;
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
        console.error(`Something went wrong in checkEmailExistence: ${e}`);
        throw e; 
    }
}