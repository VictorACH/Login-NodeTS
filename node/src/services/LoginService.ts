import Repository from '../repository/LoginRepository';
import bcrypt from 'bcrypt';
import IUser from '../types/IUser';
import { getDefaultResponse } from '../Helpers/DefaultResponse'
import { IResponse } from '../types/IResponse';

let response: IResponse = getDefaultResponse();
const findUser = async (email: string, bodyPassword: string) => {
    const userResult = Repository.findUserByEmail(email);
    const [user] = await Promise.all([userResult]);

    /**
    * Return status 400 if user doesn't exist on database.
    */
    if ( !user ) 
        return response = {
            status: 400,
            message: 'Incorrect username or password, please try again.',
            type: 'incorrect_user_or_password',
        };
    
    /**
     * Reset response for every try.
     */
    response = {
        status: 200,
        message: '',
        type: ''
    };

    (user.attempts >= 3) ? updateAttemps(user) : checkPassword(user, bodyPassword);

    if (response.status !== 400)
        setAttempsTo0(user);
        
    return (response.status !== 200) ? response : user;        
};

/**
 * Block user if exceeded tries login and returns reponse.
 * @param user IUser
 * @returns IResponse
 */
const updateAttemps = async (user: IUser) => {
    Repository.updateAttemps(user);

    return response = {
        status: 400,
        message: 'Max tries exceeded. Please recover your password.',
        type: 'max_tries_exceeded',
    };
};

/**
 * If the password is incorrect, add +1 to the attempts and returns response.
 * @param user IUser
 * @param bodyPassword string
 * @returns IResponse
 */
const checkPassword = async (user: IUser, bodyPassword: string) => {
    if (!bcrypt.compareSync(bodyPassword, user.password as string)) {
        Repository.incorrectPassword(user);

        return response = {
            status: 400,
            message: 'Incorrect username or password, please try again.',
            type: 'incorrect_user_or_password',
        };
    }
};

/**
 * If login its okay set attempts to 0
 * @param user IUser
 */
const setAttempsTo0 = async (user: IUser) => {
    Repository.setAttempsTo0(user);
};

export default {
    findUser,
    updateAttemps,
    checkPassword,
    setAttempsTo0
}