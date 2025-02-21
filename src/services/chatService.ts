import { UserRepository } from '../repositories/userRepository';
import { MessageRepository } from '../repositories/messageRepository';
import { IMessage, IUserStatus } from '../types';
import logger from '../utils/logger';

export class ChatService {
    userRepository: UserRepository;
    messageRepository: MessageRepository;

    constructor() {
        this.userRepository = new UserRepository();
        this.messageRepository = new MessageRepository();
    }

    async handleUserConnect(userId: string): Promise<IUserStatus> {
        const user = await this.userRepository.updateOnlineStatus(userId, true);
        if (!user) throw new Error('User not found');
        logger.info(`User connected: ${user.username}`);
        return { user: { id: user._id.toString(), username: user.username, online: true }, action: 'joined' };
    }

    async handleUserDisconnect(userId: string): Promise<IUserStatus> {
        const user = await this.userRepository.updateOnlineStatus(userId, false);
        if (!user) throw new Error('User not found');
        logger.info(`User disconnected: ${user.username}`);
        return { user: { id: user._id.toString(), username: user.username, online: false }, action: 'left' };
    }

    async getMessageHistory(): Promise<IMessage[]> {
        return this.messageRepository.findRecent();
    }

    async getUserList(): Promise<{ id: string; username: string; online: boolean }[]> {
        const users = await this.userRepository.findAll();
        return users.map((u) => ({ id: u._id.toString(), username: u.username, online: u.online }));
    }

    async sendMessage(userId: string, content: string, type: IMessage['type']): Promise<IMessage> {
        const message = await this.messageRepository.create(userId, content, type);
        logger.info(`Message sent by user ${userId}: ${content}`);
        return message;
    }
}