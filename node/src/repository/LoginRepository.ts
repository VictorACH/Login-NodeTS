import Users from '../models/UserModel';
import IUser from '../types/IUser';

/**
 * Find user by email.
 * @param email string
 * @param return IUser | null
 */
const findUserByEmail = async (email: string) => {
    return Users.findOne({ email: email });    
}

/**
 * Block user if exceeded tries login and returns.
 * @param user IUser
 * @returns IResponse
 */
const updateAttemps = async (user: IUser) => {
    Users.findOneAndUpdate(
        { email: user.email },
        {
            $set: {
                attempts: user.attempts + 1,
                blocked: 'S',
            },
        },
        { new: true },
        (error) => {
            if (error) {
                console.log(error);
            }
        }
    );
}

/**
 * If the password is incorrect, add +1 to the attempts.
 * @param user IUser
 * @param bodyPassword string
 * @returns IResponse
 */
const incorrectPassword = async (user: IUser) => {
    Users.findOneAndUpdate(
        { email: user.email },
        {
            $set: {
                attempts: user.attempts + 1,
            },
        },
        { new: true },
        (error) => {
            if (error) {
                console.log(error);
            }
        }
    );
}

/**
 * If login its okay set attempts to 0
 * @param user IUser
 */
const setAttempsTo0 = async (user: IUser) => {
    Users.findOneAndUpdate(
        { email: user.email },
        {
            $set: {
                attempts: 0,
            },
        },
        { new: true },
        (error) => {
            if (error) {
                console.log(error);
            }
        }
    );
}

export default {
    findUserByEmail,
    updateAttemps,
    incorrectPassword,
    setAttempsTo0
}