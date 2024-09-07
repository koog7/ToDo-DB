import mongoose from "mongoose";

const Schema = mongoose.Schema;

interface ITask {
    user: mongoose.Schema.Types.ObjectId;
    title: string;
    description?: string;
    status: 'new' | 'in_progress' | 'complete';
}

const TaskSchema = new Schema<ITask>({
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

const Task = mongoose.model('Task' , TaskSchema);
export default Task;