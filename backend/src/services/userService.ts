import User, { IUser } from '../models/User';

export const createUser = async (userData: Partial<IUser>) => {
  const user = await User.create(userData);
  return user;
};

export const findUserById = async (id: string) => {
  return await User.findById(id);
};
