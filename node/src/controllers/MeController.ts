import { Request, Response } from 'express';
import Services from '../services/MeServices';

const GetUser = async (req: Request, res: Response) => {
    const _id: string = req.body.user._id;
    const findUserInfo = Services.findByIdService(_id);
    const [responseServices] = await Promise.all([findUserInfo]);
    
    if (!responseServices) 
        return res.status(204).json();
    
    return res.status(200).json({
        'user': responseServices
    });
};

export default {
    GetUser
};