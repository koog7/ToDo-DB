import express from 'express';
import mongoose from "mongoose";
import authUserRouter from "./routes/authUserRoutes";
import tasksRoutes from "./routes/tasksRoutes";

const app = express();
const port = 8000;


app.use(express.json())
app.use('/users' , authUserRouter)
app.use('/tasks' , tasksRoutes)
const run = async () => {

    try{
        await mongoose.connect('mongodb://127.0.0.1:27017/todo');
        console.log('Connected to MongoDB');
    }catch (e) {
        console.error('Error connecting to MongoDB:', e);
    }

    app.listen(port, () => {
        console.log('We are live on http://localhost:' + port);
    });

    process.on('exit', () => {
        mongoose.disconnect();
    });
};

run()