import Joi from "joi";
import Validation from "../validation/joi.schemas.js";
import { Pagination } from '@limit0/mongoose-graphql-pagination';
import moment from 'moment-timezone';

//? Users API
export async function getAllUsers(parent, args, context, info) {
    return await context.user.find();
}

export async function getUserByAccount(parent, args, context, info) {
    const userInfo = {
        email: args.email.toLowerCase(),
        password: args.password,
    }

    Joi.assert(userInfo,Validation.loginUserSchema);

    try {
        const results = await context.user.findOne({
            email: userInfo.email,
            password: userInfo.password,
            deleted: false
        });

        if (!results) {
            throw new Error("Account not found");
        }
        return results;
    } catch (e) {
        console.error(`Something went wrong in getUserByAccount - ${e}`);
        throw e; 
    }
}

export async function getUserByUsername(parent, args, context, info) {
    try {

        const results = await context.user.findOne({
            username: args.username,
            user_id: args.user_id,
            deleted: false
        });

        if (!results) {
            throw new Error("Account not found");
        }
        return results;
    } catch (e) {
        console.error(`Something went wrong in getUserByUsername - ${e}`);
        throw e; 
    }
}

export async function getUsersDatagrid(parent, args, context, info) {
    try {
        const usersPipeline = [
            {
                $match: {
                    company: args.company,
                    deleted: false
                },
            }
        ];
        return await context.user.aggregate(usersPipeline);
    } catch (e) {
        console.error(`Unable to get users from database: ${e}`);
        return { error: e };
    }
}

//? Companies API
export async function getAllCompanies(parent, args, context, info) {
    return await context.company.find();
}

export async function getCompanyByName(parent, args, context, info) {
    return await context.company.findOne({name: args.name});
}

export async function getRecordsByDevice(parent, args, context, info) {

    let query = {};
    let startDate = moment(args.start_date);
    let endDate = moment(args.end_date);


    if (!!startDate && !!endDate) {
        if(startDate.isSameOrAfter(endDate))
        {
            throw new Error("End date cannot be older then start date");
        }

        query = {
            deleted: false,
            device_id: args.device_id,
            time_stamp: {
                $gte: startDate.toDate(),
                $lte: endDate.toDate()
            } 
        }
        
    } else {
        query = {
            deleted: false,
            device_id: args.device_id,
        }
    }

    return new Pagination(context.record, { criteria: query, pagination: args.pagination, sort: args.sort,});
}

export async function getRecordsForGraph(parent, args, context, info) {
    
    let pipeline = [];
    let startDate = moment(args.start_date);
    let endDate = moment(args.end_date);

    if (!!startDate && !!endDate) {
        if(startDate.isSameOrAfter(endDate))
        {
            throw new Error("End date cannot be older then start date");
        }

        pipeline.push({
            $match: {
                deleted: false,
                device_id: args.device_id,
                time_stamp: {
                    $gte: startDate.toDate(),
                    $lte: endDate.toDate() 
                } 
            }
        })

    } else {
        pipeline.push({
            $match: {
                deleted: false,
                device_id: args.device_id,
            },
        })
    }

    if (!!args.first) {
        pipeline.push({
            $limit: args.first
        })
    }

    pipeline.push({
        $sort: {
            time_stamp: 1,
        },
    })

    return await context.record.aggregate(pipeline);
}

//? Devices API
export async function getAllDevices(parent, args, context, info) {
    return await context.device.find();
}

//? Records API
export async function getAllRecords(parent, args, context, info) {
    return await context.record.find().sort({time_stamp: -1});
}
