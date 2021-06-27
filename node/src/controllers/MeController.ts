import { Request, Response } from 'express';
import Users from '../models/UserModel';
import { IResponse } from '../types/IResponse';

const getDefaultResponse = (): IResponse => ({
  status: 200,
  message: 'Okay',
  type: '',
});

const GetUser = async (req: Request, res: Response) => {
    let response: IResponse = getDefaultResponse();
    const _id = req.body.user._id;
  
    try {
      const userQuery = Users.findById({_id}).exec();
      const [user] = await Promise.all([userQuery]);

      return res.status(response.status).json({
        user
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

export default {
  GetUser
};