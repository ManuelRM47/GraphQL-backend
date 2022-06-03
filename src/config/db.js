import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.ATLAS_URI);
        console.log('Connection to DB was successful');
    } catch (e) {
        console.error(e);
    }
}