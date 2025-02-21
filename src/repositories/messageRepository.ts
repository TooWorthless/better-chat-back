import Message from '../models/Message';
import { IMessage } from 'types';

import logger from '../utils/logger';

export class MessageRepository {
    async create(userId: string, content: string, type: IMessage['type']): Promise<IMessage> {
        try {
            const message = new Message({ user: userId, content, type });
            return await message.save();
        } catch (error) {
            logger.error(`Error creating message for user: ${userId}`, error);
            throw error;
        }
    }

    async findRecent(limit: number = 50): Promise<IMessage[]> {
        try {
            return await Message.find()
                .populate('user', 'username')
                .sort({ timestamp: -1 })
                .limit(limit);
        } catch (error) {
            logger.error('Error fetching recent messages', error);
            throw error;
        }
    }

    async findById(id: string): Promise<IMessage | null> {
        try {
            return await Message.findById(id).populate('user', 'username');
        } catch (error) {
            logger.error(`Error finding message by ID: ${id}`, error);
            throw error;
        }
    }
}