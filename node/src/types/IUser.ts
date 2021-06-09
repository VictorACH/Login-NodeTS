import { Document } from 'mongoose';

export default interface IUser extends Document {
    name: string;
    email: string;
    password?: string;
    img: string;
    role: string;
    blocked: string;
    changePassword: Date;
    attempts: number;
}
