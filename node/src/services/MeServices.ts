import Repository from '../repository/MeRepository';

/**
 * Find user by id.
 * @param _id string
 * @returns IUser | null
 */
const findByIdService = async (_id: string) => {
    const userInfo = Repository.findById(_id);
    return userInfo;    
};

export default {
    findByIdService
}