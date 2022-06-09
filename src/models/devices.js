import mongoose from "mongoose";

const deviceSchema = mongoose.Schema({
    description: String,
    company_id: String,
    alert: Boolean,
    alert_message: String,
    max_value: String,
    min_value: String,
    deleted: Boolean,
    device_id: String,
    createdAt: Date,
    updatedAt: Date,
}, { versionKey: false });

const device = mongoose.model('devices', deviceSchema, 'devices');
export default device;