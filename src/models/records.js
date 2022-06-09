import mongoose from "mongoose";

const recordSchema = mongoose.Schema({
    time_stamp: Date,
    device_id: String,
    value: Number,
    deleted: Boolean,
    record_id: String,
    createdAt: Date,
    updatedAt: Date,
}, { versionKey: false });

const record = mongoose.model('records', recordSchema, 'records');
export default record;