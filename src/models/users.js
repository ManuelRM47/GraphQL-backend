import mongoose from "mongoose";
import Joi from "joi";

const userSchema = mongoose.Schema({
            username: String,
            email: String,
            password: String,
            role: String,
            company: String,
            deleted: Boolean,
            createdAt: Date,
            updatedAt: Date,
            user_id: String
});

userSchema.methods.joiAssert = function (obj) {
    const joi = Joi;
    const schema = {
        //user_id: Joi.string().min(8).max(8).required(),
        username: joi.string().required().messages({
            'string.empty': 'Username is a required field',
            'any.required': 'Username is a required field'
        }),
        email: joi.string().email().required().messages({
            'string.empty': 'Email Address is a required field',
            'string.email': 'Email Address must be a valid email',
            'any.required': 'Email Address is a required field'
        }),
        password: joi.string().pattern(/^[a-zA-Z0-9]{8,30}$/).required().messages({
            'string.empty': 'Password is a required field',
            'string.pattern.base': 'Password must be minimum 8 characters long. Only letters and numbers are valid.',
            'any.required': 'Password is a required field'
        }),
        role: joi.string().valid('developer','administrator','user').insensitive().messages({
            'string.empty': 'Role is a required field',
            'any.only': 'Invalid role. Must be one of [developer, administrator, user]',
            'any.required': 'Role is a required field'
        }),
        company: joi.string().required().insensitive().messages({
            'string.empty': 'Company is a required field',
            'any.required': 'Company is a required field'
        }),
        deleted: joi.boolean(),
        createdAt: joi.string().allow(''),
        updatedAt: joi.string().allow(''),
    }

    return joi.assert(obj,schema);
}

const User = mongoose.model('users',userSchema);
export default User;