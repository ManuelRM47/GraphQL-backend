import mongoose from "mongoose";

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
}, { versionKey: false });

const user = mongoose.model('users', userSchema, 'users');
export default user;