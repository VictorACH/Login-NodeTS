import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config/config';
import { getDefaultResponse } from '../Helpers/DefaultResponse'
import { IResponse } from '../types/IResponse';
import Services from '../services/LoginService';

let response: IResponse = getDefaultResponse();

const LoginUser = async (req: Request, res: Response) => {
    const body = req.body;

    const findUserInfo = Services.findUser(body.email, body.password);
    const [userResult] = await Promise.all([findUserInfo]);
    response = userResult as IResponse;

    if (response.status && response.status !== 200) {
        return res.status(response.status).json(response);
    } else {
        const token = jwt.sign(
            {
                user: userResult,
            },
            config.TOKEN.seed,
            { expiresIn: config.TOKEN.token_expired }
        );

        res.json({
            access_token: token,
        });
    }
};

export default {
    LoginUser,
};
