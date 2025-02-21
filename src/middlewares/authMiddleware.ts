import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/auth';
import logger from '../utils/logger';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        logger.warn('No token provided');
        res.status(401).json({ message: 'No token provided' });
        return;
    }

    try {
        const decoded = verifyToken(token);
        req.user = { id: decoded.id };
        next();
    } catch (error) {
        logger.error('Invalid token', error);
        res.status(401).json({ message: 'Invalid token' });
    }
};

declare global {
    namespace Express {
        interface Request {
            user?: { id: string };
        }
    }
}