import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config';

export const hashPassword = async (password: string): Promise<string> => {
    return bcrypt.hash(password, 10);
};

export const comparePassword = async (password: string, hashed: string): Promise<boolean> => {
    return bcrypt.compare(password, hashed);
};

export const generateToken = (userId: string): string => {
    return jwt.sign({ id: userId }, config.jwtSecret, { expiresIn: '1h' });
};

export const verifyToken = (token: string): { id: string } => {
    return jwt.verify(token, config.jwtSecret) as { id: string };
};