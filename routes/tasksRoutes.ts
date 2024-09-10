import express from "express";
import Task from "../models/Tasks";
import mongoose from "mongoose";
import {RequestWithUser} from "../middleware/auth";
import findByToken from "../middleware/findByToken";

const tasksRouter = express.Router();
tasksRouter.use(express.json());


tasksRouter.get('/', findByToken , async (req: RequestWithUser , res , next) =>{
    try{
        const findPerson = req.user;

        if(!findPerson || !findPerson._id){
            return res.status(400).send({ error: 'User not found' });
        }

        const allTask = await Task.find({user: findPerson._id})
        res.send(allTask)

    }catch (e) {
        if(e instanceof mongoose.Error.ValidationError){
            return res.status(400).send(e)
        }
        return next(e)
    }
})

tasksRouter.post('/', findByToken, async (req : RequestWithUser, res, next) => {
    try{
        const findPerson = req.user;

        if(!findPerson || !findPerson._id){
            return res.status(400).send({ error: 'User not found' });
        }

        if(!req.body.title){
            res.status(400).send({error: 'Title are empty'})
        }
        if(!req.body.status){
            res.status(400).send({error: 'Status are empty'})
        }
        const newTask = new Task({
            user: findPerson._id,
            title: req.body.title.trim()? req.body.title : res.status(400).send({error: 'Title are empty'}),
            description: req.body.description? req.body.description : null,
            status: req.body.status.trim()? req.body.status : 'new',
        })

        await newTask.save()
        res.send(newTask)
    }catch (e) {
        if(e instanceof mongoose.Error.ValidationError){
            return res.status(400).send(e)
        }
        return next(e)
    }
});


tasksRouter.delete('/:id', findByToken  , async (req : RequestWithUser, res, next) => {
    try{
        const {id} = req.params;
        const findPerson = req.user;

        if(!findPerson || !findPerson._id){
            return res.status(400).send({ error: 'User not found' });
        }

        const getTask = await Task.findById(id)

        if(!getTask){
            return res.status(400).send({ error: 'Task not found' });
        }

        if (getTask.user.toString() === findPerson._id.toString()) {
            await Task.findByIdAndDelete(id);
            res.send({success: 'Success delete'});
        }else{
            res.status(403).send({error: 'You cant delete not your task'});
        }
    }catch (e) {
        if(e instanceof mongoose.Error.ValidationError){
            return res.status(400).send(e)
        }
        return next(e)
    }
});


tasksRouter.put('/:id', findByToken  , async (req: RequestWithUser , res, next) => {
    try{
        const {id} = req.params;
        const findPerson = req.user;

        if(!findPerson || !findPerson._id){
            return res.status(400).send({ error: 'User not found' });
        }

        const updateData = req.body;

        const getTask = await Task.findById(id)

        if(!getTask){
            return res.status(400).send({ error: 'Task not found' });
        }

        if (getTask.user.toString() === findPerson._id.toString()) {
            await Task.findByIdAndUpdate(id , { $set: updateData });
            const updatedTask = await Task.find({_id: id})
            res.send(updatedTask);
        }else{
            res.status(403).send({error: 'You cant update not your task'});
        }
    }catch (e) {
        if(e instanceof mongoose.Error.ValidationError){
            return res.status(400).send(e)
        }
        return next(e)
    }
});


export default tasksRouter