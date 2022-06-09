import mongoose from "mongoose";

const companySchema = mongoose.Schema({
    name: String,
    location: [Number],
    razon_social: String,
    deleted: Boolean,
    company_id: String,
    createdAt: Date,
    updatedAt: Date,
}, { versionKey: false });

const company = mongoose.model('companies', companySchema, 'companies');
export default company;