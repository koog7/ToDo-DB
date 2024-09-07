import mongoose from "mongoose";
import bcrypt from 'bcrypt';
const Schema = mongoose.Schema;

const SALT_WORK_FACTOR = 10;

export interface IUser{
    username: string;
    password: string;
    token?: string;
}

const UsersSchema = new Schema<IUser>({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password:{
        type: String,
        required: true,
    },
    token:{
        type: String,
        required: true,
    }
})

UsersSchema.pre('save' , async function (next){
    if(!this.isModified('password')){
        return next();
    }

    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR)
    this.password = await bcrypt.hash(this.password , salt)

    next()
})

UsersSchema.set('toJSON', {
    transform: (_doc , ret) =>{
        delete ret.password;
        return ret;
    }
})


const User = mongoose.model('User' , UsersSchema);
export default User;