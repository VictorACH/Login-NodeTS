import Users from '../models/UserModel';

/**
 * Find user by id.
 * @param _id string
 * @returns IUser | null
 */
const findById = async (_id: string) => {
    const userQuery = Users.findById({_id}).exec();
    return userQuery;
}

export default {
    findById
}