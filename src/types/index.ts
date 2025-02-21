import { Types } from 'mongoose';
import { Socket } from 'socket.io';

export interface IUser {
    _id: Types.ObjectId;
    username: string;
    password: string;
    online: boolean;
}

export interface IMessage {
    _id: Types.ObjectId;
    user: Types.ObjectId | IUser;
    content: string;
    type: 'text' | 'image' | 'file' | 'system';
    timestamp: Date;
}

export interface IUserStatus {
    user: {
        id: string;
        username: string;
        online: boolean;
    };
    action: 'joined' | 'left';
}

export interface SocketWithUser extends Socket {
    data: {
        user: IUser;
    };
}