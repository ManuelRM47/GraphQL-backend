import mongoose from "mongoose";

const recordSchema = mongoose.Schema({
    time_stamp: String,
    device_id: String,
    value: Number,
    deleted: Boolean,
    record_id: String,
    createdAt: String,
    updatedAt: String,
}, { versionKey: false });

const record = mongoose.model('records', recordSchema, 'records');
export default record;