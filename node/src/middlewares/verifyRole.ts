import { Request, Response, NextFunction } from 'express';
import { IResponse } from '../types/IResponse';
import IUser from '../types/IUser';

const verifyRole = (req: Request, res: Response, next: NextFunction) => {
  let response: IResponse = {
      status: 200,
      message: 'Okay',
      type: ''
  };
  
  const userBody = req.body.user! as IUser;

  if (userBody.role === 'ADMIN_ROLE') {
    next();
  } else {
    response = {
      status: 401,
      message: 'Insufficient Privileges. You do not have the level of access necessary to perform the operation you requested.',
      type:'no_privileges'
    }
    return res.status(response.status).json(response);
  }
};
 
export { verifyRole };