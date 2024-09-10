import User, {IUser} from "../models/Users";
import bcrypt from "bcrypt";
import {randomUUID} from "crypto";
import {NextFunction, Request, Response} from 'express';


export interface RequestWithUser extends Request {
    user?: IUser;
}

const auth = async (req: RequestWithUser , res: Response , next: NextFunction) => {
    try{
        const user = await User.findOne({username: req.body.username})

        if(!user){
            return res.status(400).send({error:'User or password are wrong'})
        }

        const comparePswrd = await bcrypt.compare(req.body.password , user.password)

        if(!comparePswrd){
            return res.status(400).send({error:'User or password are wrong'})
        }
        user.token = randomUUID();

        await user.save();
        req.user = user as IUser;

        return next();
    }catch (e) {
        next(e)
    }
}

export default auth;