import express from "express";
import User from "../models/Users";
import Task from "../models/Tasks";
import mongoose from "mongoose";

const tasksRouter = express.Router();
tasksRouter.use(express.json());


tasksRouter.get('/' , async (req , res , next) =>{
    try{
        const getToken = req.get('Authorization');

        if(!getToken){
            return res.status(400).send({error: 'Provide token'})
        }

        const findPerson = await User.findOne({token:getToken})

        if (!findPerson) {
            return res.status(404).send({ error: 'User not found' });
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

tasksRouter.post('/'  , async (req , res, next) => {
    try{
        const getToken = req.get('Authorization');

        if(!getToken){
            return res.status(400).send({error: 'Provide token'})
        }

        const findPerson = await User.findOne({token:getToken})

        if (!findPerson) {
            return res.status(404).send({ error: 'User not found' });
        }

        if(!req.body.title){
            res.status(400).send({error: 'Title are empty'})
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


export default tasksRouter