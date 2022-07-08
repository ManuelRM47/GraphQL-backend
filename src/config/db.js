import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

export const connectDB = () => {
    try {
        mongoose.connect(process.env.ATLAS_URI, 
        { 
            useNewUrlParser: true,
            useFindAndModify: false,
            useUnifiedTopology: true,
            useCreateIndex: true 
        });
        console.log('Connection to DB was successful');
    } catch (e) {
        console.error(e);
    }
}