import User from '../models/User';
import { IUser } from 'types';

import logger from '../utils/logger';

export class UserRepository {
    async findById(id: string): Promise<IUser | null> {
        try {
            return await User.findById(id);
        } catch (error) {
            logger.error(`Error finding user by ID: ${id}`, error);
            throw error;
        }
    }

    async findByUsername(username: string): Promise<IUser | null> {
        try {
            return await User.findOne({ username });
        } catch (error) {
            logger.error(`Error finding user by username: ${username}`, error);
            throw error;
        }
    }

    async create(username: string, password: string): Promise<IUser> {
        try {
            const user = new User({ username, password });
            return await user.save();
        } catch (error) {
            logger.error(`Error creating user: ${username}`, error);
            throw error;
        }
    }

    async updateOnlineStatus(id: string, online: boolean): Promise<IUser | null> {
        try {
            return await User.findByIdAndUpdate(id, { online }, { new: true });
        } catch (error) {
            logger.error(`Error updating user status: ${id}`, error);
            throw error;
        }
    }

    async findAll(): Promise<IUser[]> {
        try {
            return await User.find().select('username online');
        } catch (error) {
            logger.error('Error fetching all users', error);
            throw error;
        }
    }
}