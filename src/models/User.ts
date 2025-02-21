import { Schema, model, Document } from 'mongoose';
import { IUser } from '../types';

const userSchema = new Schema<IUser>({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    online: { type: Boolean, default: false },
});

export default model<IUser>('User', userSchema);