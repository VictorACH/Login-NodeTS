import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config/config';
import { getDefaultResponse } from '../Helpers/DefaultResponse'
import { IResponse } from '../types/IResponse';
import IUser from '../types/IUser';

type TokenInterface  = {
    user: IUser
}

let response: IResponse = getDefaultResponse();

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.get('Authorization')!;

    jwt.verify( token, config.TOKEN.seed, (error: jwt.VerifyErrors | null, decoded: string | unknown) => {
        if (error) {
            response = {
                status: 401,
                message: error.message,
                type: error.name
            }
            return res.status(response.status).json(response);
        }

        req.body.user = (decoded as unknown as TokenInterface).user;
        next();
    });
};

export default {
    verifyToken
}