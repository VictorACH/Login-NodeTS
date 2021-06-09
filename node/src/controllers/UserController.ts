import { Request, Response } from 'express';
import Users from '../models/UserModel';
import bcrypt from 'bcrypt';
import { IResponse } from '../types/IResponse';
import { CallbackError } from 'mongoose';
import IUser from '../types/IUser';

let response: IResponse = {
    status: 200,
    message: 'Okay',
    type: ''
};
    
const GetUsers = (req: Request, res: Response) => {
    
    const from = Number(req.query.from || 0);
    const limit = Number(req.query.limit);

    Users.find({})
        .skip(from)
        .limit(limit)
        .exec((error: CallbackError, users: IUser[]) => {
            if (error) {
                response = {
                    status: 400,
                    message: error.message,
                    type: error.name
                }
                return res.status(response.status).json(response)
            }

            Users.countDocuments({}, (error, items) => {
                res.json({
                    users,
                    items
                });
            });
        })
}

const CreateUser = (req: Request, res: Response) => {
    const body = req.body;

    const user = new Users({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    user.save((error: CallbackError, userDB: IUser) => {

        if (error) {
            response = {
                status: 400,
                message: error.message,
                type: error.name
            }
            return res.status(response.status).json(response)
        }

        res.status(201).json({
            user: userDB
        })

    });
}

const UpdateUsers =  (req: Request, res: Response) => {
    const id = req.params.id;
    
    Users.findByIdAndUpdate(id, req.body, { new: true , runValidators: true }, (error: CallbackError, userDB: IUser | null) => {
        if (!userDB) {
            response = {
                status: 400,
                message: 'User not found',
                type: 'user_not_found'
            }
            return res.status(response.status).json(response)
        }

        if (error) {
            response = {
                status: 400,
                message: error.message,
                type: error.name
            }
            return res.status(response.status).json(response)
        }

        res.json({
            user: userDB
        });
    });
}

const DeleteUser = (req: Request, res: Response) => {
    const id = req.params.id;

    Users.findByIdAndRemove(id, {}, (error: CallbackError, userDB: IUser | null) => {
        if (error) {
            response = {
                status: 400,
                message: error.message
            }
            return res.status(response.status).json(response)
        }

        if ( !userDB ) {
            response = {
                status: 400,
                message: 'User not found',
                type: 'user_not_found'
            }
            return res.status(response.status).json(response)
        }

        response = {
            status: 200,
            message: 'User deleted'
        }
        res.json(response);
    });
}


export default {
    GetUsers,
    CreateUser,
    UpdateUsers,
    DeleteUser
}