import Joi from "joi";

export default class Validation {
    static userSchema = Joi.object({
        //user_id: Joi.string().min(8).max(8).required(),
        username: Joi.string().required().messages({
            'string.empty': 'Username is a required field',
            'any.required': 'Username is a required field'
        }),
        email: Joi.string().email().required().messages({
            'string.empty': 'Email Address is a required field',
            'string.email': 'Email Address must be a valid email',
            'any.required': 'Email Address is a required field'
        }),
        password: Joi.string().pattern(/^[a-zA-Z0-9]{8,30}$/).required().messages({
            'string.empty': 'Password is a required field',
            'string.pattern.base': 'Password must be minimum 8 characters long. Only letters and numbers are valid.',
            'any.required': 'Password is a required field'
        }),
        role: Joi.string().valid('developer','administrator','user').insensitive().messages({
            'string.empty': 'Role is a required field',
            'any.only': 'Invalid role. Must be one of [developer, administrator, user]',
            'any.required': 'Role is a required field'
        }),
        company: Joi.string().required().insensitive().messages({
            'string.empty': 'Company is a required field',
            'any.required': 'Company is a required field'
        }),
        deleted: Joi.boolean(),
        createdAt: Joi.string().allow(''),
        updatedAt: Joi.string().allow(''),
    })


    static updateUserSchema = Joi.object({
        //user_id: Joi.string().min(8).max(8).required(),
        username: Joi.string().allow('').messages({
        }),
        email: Joi.string().email().allow('').messages({
            'string.email': 'Email Address must be a valid email',
        }),
        password: Joi.string().pattern(/^[a-zA-Z0-9]{8,30}$/).allow('').messages({
            'string.pattern.base': 'Password must be minimum 8 characters long. Only letters and numbers are valid.',
        }),
        role: Joi.string().valid('developer','administrator','user').insensitive().allow('').messages({
            'any.only': 'Invalid role. Must be either developer, administrator or user',
        }),
        company: Joi.string().insensitive().allow(''),
        deleted: Joi.boolean(),
        createdAt: Joi.string().allow(''),
        updatedAt: Joi.string().allow(''),
    })

    static loginUserSchema = Joi.object({
        email: Joi.string().email(),
        password: Joi.string().pattern(/^[a-zA-Z0-9]{8,30}$/),
    })

    static deleteUserSchema = Joi.object({
        user_id: Joi.string().pattern(/^U([0-9]{7})$/).required(),
        username: Joi.string().required()
    })

    static companySchema = Joi.object({
        //company_id: Joi.string().min(8).max(8).required(),
        name: Joi.string().required(),
        location: Joi.array().ordered(
            Joi.number().min(-90).max(90).required(),
            Joi.number().min(-180).max(180).required()
        ),
        razon_social: Joi.string().allow(''),
        deleted: Joi.boolean(),
        createdAt: Joi.string().allow(''),
        updatedAt: Joi.string().allow(''),
    })

    static deleteCompanySchema = Joi.object({
        name: Joi.string().required(),
        razon_social: Joi.string().allow('').required(),

    })

    static deviceSchema = Joi.object({
        //device_id: Joi.string().min(8).max(8).required(),
        description: Joi.string().allow(''),
        company_id: Joi.string().pattern(/^C([0-9]{7})$/).required(),
        alert: Joi.boolean().required(),
        alert_message: Joi.string().allow(''),
        max_value: Joi.string().alphanum().required(),
        min_value: Joi.string().alphanum().required(),
        deleted: Joi.boolean(),
        createdAt: Joi.string().allow(''),
        updatedAt: Joi.string().allow(''),
    })

    static deleteDeviceSchema = Joi.object({
        device_id: Joi.string().pattern(/^D([0-9]{7})$/).required(),
        company_id: Joi.string().pattern(/^C([0-9]{7})$/).required(),
    })

    static recordSchema = Joi.object({
        time_stamp: Joi.date().timestamp().required(),
        device_id: Joi.string().pattern(/^D([0-9]{7})$/).required(),
        value: Joi.number().integer(),
        deleted: Joi.boolean(),
        createdAt: Joi.string().allow(''),
        updatedAt: Joi.string().allow(''),
    })

    static deleteRecordSchema = Joi.object({
        start_date: Joi.date().timestamp().required(),
        end_date: Joi.date().timestamp().required(),
        device_id: Joi.string().pattern(/^D([0-9]{7})$/).required(),
    })
}