import { Server, Socket } from 'socket.io';
import { verifyToken } from '../utils/auth';
import { ChatService } from '../services/chatService';
import { SocketWithUser } from '../types';
import logger from '../utils/logger';

export const setupSocket = (io: Server) => {
    const chatService = new ChatService();

    io.use(async (socket: Socket, next) => {
        const token = socket.handshake.auth.token;
        try {
            const decoded = verifyToken(token);
            const user = await chatService.userRepository.findById(decoded.id);
            if (!user) throw new Error('User not found');
            (socket as SocketWithUser).data.user = user;
            next();
        } catch (error) {
            logger.error('Socket authentication failed', error);
            next(new Error('Authentication error'));
        }
    });

    io.on('connection', async (socket: SocketWithUser) => {
        const user = socket.data.user;

        const status = await chatService.handleUserConnect(user._id.toString());
        io.emit('userStatus', status);

        socket.emit('messageHistory', await chatService.getMessageHistory());
        io.emit('userList', await chatService.getUserList());

        socket.on('sendMessage', async (content: string, type: 'text' | 'image' | 'file' = 'text') => {
            const message = await chatService.sendMessage(user._id.toString(), content, type);
            const populatedMessage = await chatService.messageRepository.findById(message._id.toString());
            io.emit('newMessage', populatedMessage);
        });

        socket.on('disconnect', async () => {
            const status = await chatService.handleUserDisconnect(user._id.toString());
            io.emit('userStatus', status);
            io.emit('userList', await chatService.getUserList());
        });
    });
};