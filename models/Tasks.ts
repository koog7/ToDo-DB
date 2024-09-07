import mongoose from "mongoose";

const Schema = mongoose.Schema;


const TaskSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    status: {
        type: String,
        enum: ['new', 'in_progress', 'complete'],
        default: 'new',
    }
})


export default TaskSchema;