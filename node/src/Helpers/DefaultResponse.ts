import { IResponse } from '../types/IResponse';

export const getDefaultResponse = (): IResponse => ({
    status: 200,
    message: 'Okay',
    type: '',
});