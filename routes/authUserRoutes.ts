import express from "express";
import {randomUUID} from "crypto";
import User from "../models/Users";
import mongoose from "mongoose";
import auth, {RequestWithUser} from "../middleware/auth";

const authUserRouter = express.Router();
authUserRouter.use(express.json());

authUserRouter.post('/',  async (req , res, next) =>{
    try {

        const existingUser = await User.findOne({ username: req.body.username });
        if (existingUser) {
            return res.status(400).send({error: 'Username claimed'});
        }

        const user = new User({
            username: req.body.username,
            password: req.body.password,
            token: randomUUID(),
        })


        await user.save()
        res.send(user)
    }catch (e) {
        if(e instanceof mongoose.Error.ValidationError){
            return res.status(400).send(e)
        }
        return next(e)
    }
})

authUserRouter.post('/sessions', auth , async (req: RequestWithUser, res, next) =>{
    try {
        const user = req.user;

        if (!user) {
            return res.status(400).send({error: 'Not authenticated'});
        }

        res.send(req.user)
    }catch (e) {
        if(e instanceof mongoose.Error.ValidationError){
            return res.status(400).send(e)
        }
        return next(e)
    }
})

export default authUserRouter;