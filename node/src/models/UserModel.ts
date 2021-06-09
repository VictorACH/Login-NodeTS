import mongoose from 'mongoose';
import mongooseUniqueValidator from 'mongoose-unique-validator';
import IUser from '../types/IUser';

const validRoles = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} is not a valid role'
};

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'The field "Name" is required']
    },
    email: {
        type: String,
        required: [true, 'The field "Email" is required']
    },
    password: {
        type: String,
        required: [true, 'The field "Password" is required']
    },
    img: {
        type: String,
        default: null,
        required: false
    },
    role: {
        type: String,
        required: true,
        default: 'USER_ROLE',
        enum: validRoles
    },
    blocked: {
        type: String,
        required: false,
        default: 'N'
    },
    changePassword: {
        type: Date,
        default: null,
        required: false
    },
    attempts: {
        type: Number,
        default: 0,
        required: false
    },
});

/**
 * Avoid returning the 'password' field when creating the user
 */
userSchema.methods.toJSON = function() {
    const userObject = this.toObject() as IUser;
    delete userObject.password;

    return userObject;
}

userSchema.plugin(mongooseUniqueValidator, {
    message: '{PATH} need be unique'
})

export default mongoose.model<IUser>('Users', userSchema)