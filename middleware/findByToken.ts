import {NextFunction, Response} from 'express';
import User from "../models/Users";
import {RequestWithUser} from "./auth";


const findByToken = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
        const getToken = req.get('Authorization');

        if (!getToken) {
            return res.status(400).send({ error: 'Provide token' });
        }

        const findPerson = await User.findOne({ token: getToken });

        if (!findPerson) {
            return res.status(404).send({ error: 'User not found' });
        }
        req.user = findPerson;

        next();
    } catch (e) {
        res.status(500).send({ error: 'Internal server error' });
    }
};

export default findByToken;
