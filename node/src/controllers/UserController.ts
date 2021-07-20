import { Request, Response } from 'express';
import Users from '../models/UserModel';
import bcrypt from 'bcrypt';
import { IResponse } from '../types/IResponse';
import { CallbackError } from 'mongoose';
import IUser from '../types/IUser';

const getDefaultResponse = (): IResponse => ({
  status: 200,
  message: 'Okay',
  type: '',
});

const GetUsers = async (req: Request, res: Response) => {
  let response: IResponse = getDefaultResponse();
  const from = Number(req.query.from || 0);
  const limit = Number(req.query.limit);

  try {
    const userQuery = Users.find({}).skip(from).limit(limit).exec();
    const userDocuments = Users.countDocuments().exec();
    const [users, items] = await Promise.all([userQuery, userDocuments]);

    return res.status(response.status).json({
      users,
      items,
    });
  } catch (error) {
    response = {
      status: 400,
      message: error.message,
      type: error.name,
    };
    return res.status(response.status).json(response);
  }
};

const CreateUser = async (req: Request, res: Response) => {
  let response = getDefaultResponse();
  const body = req.body;
  const { name, email, password, role } = body;

  // Check if email already exist on MongoDB
  const userQuery = await Promise.all([Users.findOne({email}).exec()]);

  // If the email does not exist in MongoDB, a new user is created.
  if (userQuery[0] === null) {
    const user = new Users({
      name,
      email,
      role,
      password: bcrypt.hashSync(password, 10),
    });
  
    try {
      const userDb = await user.save();
      res.status(201).json({
        user: userDb,
      });
    } catch (error) {
      response = {
        status: 400,
        message: error.message,
        type: error.name,
      };
      return res.status(response.status).json(response);
    }
  } else {
    response = {
      status: 400,
      message: 'User already created, please try with another email.',
      type: 'user_already_created',
    };
    return res.status(response.status).json(response);
  }
};

const UpdateUsers = (req: Request, res: Response) => {
  const id = req.params.id;

  let response = getDefaultResponse();

  Users.findByIdAndUpdate(
    id,
    req.body,
    { new: true, runValidators: true },
    (error: CallbackError, userDB: IUser | null) => {
      if (!userDB) {
        response = {
          status: 400,
          message: 'User not found',
          type: 'user_not_found',
        };
        return res.status(response.status).json(response);
      }

      if (error) {
        response = {
          status: 400,
          message: error.message,
          type: error.name,
        };
        return res.status(response.status).json(response);
      }

      res.json({
        user: userDB,
      });
    }
  );
};

const DeleteUser = (req: Request, res: Response) => {
  const id = req.params.id;
  let response = getDefaultResponse();

  Users.findByIdAndRemove(
    id,
    {},
    (error: CallbackError, userDB: IUser | null) => {
      if (error) {
        response = {
          status: 400,
          message: error.message,
        };
        return res.status(response.status).json(response);
      }

      if (!userDB) {
        response = {
          status: 400,
          message: 'User not found',
          type: 'user_not_found',
        };
        return res.status(response.status).json(response);
      }

      response = {
        status: 200,
        message: 'User deleted',
      };
      res.json(response);
    }
  );
};

export default {
  GetUsers,
  CreateUser,
  UpdateUsers,
  DeleteUser,
};
