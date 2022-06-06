import mongoose from "mongoose";

const generationSchema = mongoose.Schema({
    count: Number,
    note: String,
    generate_id: String
}, { versionKey: false });

const generate = mongoose.model('generation', generationSchema,'generation');
export default generate;