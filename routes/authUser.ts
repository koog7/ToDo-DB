import express from "express";

const authUserRouter = express.Router();
authUserRouter.use(express.json());


authUserRouter.post('/', async (req , res, next) =>{
    res.send('test')
})

export default authUserRouter;