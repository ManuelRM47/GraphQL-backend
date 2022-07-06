import Joi from 'joi';
import Validation from '../validation/joi.schemas.js';

//? Records API
export async function postRecord(parent, args, context, info) {
    const newRecord = {
        time_stamp: new Date(),
        ISO_time_stamp: new Date().toISOString(),
        device_id: args.device_id,
        value: args.value,
        deleted: false
    }

    Joi.assert(newRecord, Validation.recordSchema);
    const RecordID = await getRecordID(context.generate);

    newRecord.record_id = `R${RecordID.count}`;
    newRecord.createdAt = new Date();
    newRecord.updatedAt = new Date();

    await context.record.create(newRecord);

    return newRecord;
}

export async function deleteRecords(parent, args, context, info) {
    const deletionLapse = {
        start_date: new Date(args.start_date),
        end_date: new Date(args.end_date),
        device_id: args.device_id,
    }
    
    Joi.assert(deletionLapse,Validation.deleteRecordSchema);
    const deletedRecords = await context.record.find({device_id: args.device_id, time_stamp: { $gte: args.start_date, $lte: args.end_date}, deleted: false });

    const recordsResponse = await context.record.updateMany(
        { device_id: args.device_id, time_stamp: { $gte: args.start_date, $lte: args.end_date}, deleted: false },
        { $set:{
            updatedAt: new Date(),
            deleted: true
        }}
    )

    if (recordsResponse.matchedCount > 0) {
        return deletedRecords;
    } else {
        throw new Error("Records not found with provided time lapse on selected device_id");
    }

}

async function getRecordID(model) {
    try {
        const testResponse = await model.findOneAndUpdate(
            { generate_id: "RECORD_ID" },
            { $inc: { "count": 1 }}
        )
        return testResponse
    } catch (e) {
        console.error(`Unable to generate record ID - ${e}`);
        return { error: e };
    }
}