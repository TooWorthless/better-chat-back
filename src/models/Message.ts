import { Schema, model, Document } from 'mongoose';
import { IMessage } from '../types';

const messageSchema = new Schema<IMessage>({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    type: { type: String, enum: ['text', 'image', 'file', 'system'], default: 'text' },
    timestamp: { type: Date, default: Date.now },
});

export default model<IMessage>('Message', messageSchema);