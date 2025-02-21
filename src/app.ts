import express, { Express } from 'express';
import http from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import multer from 'multer';
import path from 'path';
import { config } from './config';
import { AuthController } from './controllers/authController';
import { authMiddleware } from './middlewares/authMiddleware';
import { errorHandler } from './middlewares/errorHandler';
import { setupSocket } from './sockets/chatSocket';
import logger from './utils/logger';

export const createApp = (): { app: Express; io: Server } => {
    const app = express();
    const server = http.createServer(app);
    const io = new Server(server, {
        cors: {
            origin: 'http://localhost:3000',
            methods: ['GET', 'POST'],
        },
    });

    app.use(express.json());

    // Подключение к MongoDB
    mongoose
        .connect(config.mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        } as mongoose.ConnectOptions)
        .then(() => logger.info('MongoDB connected'))
        .catch((err) => logger.error('MongoDB connection error', err));

    // Настройка загрузки файлов
    const storage = multer.diskStorage({
        destination: './uploads/',
        filename: (req, file, cb) => {
            cb(null, `${Date.now()}-${file.originalname}`);
        },
    });
    const upload = multer({ storage });
    app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

    const authController = new AuthController();

    // Роуты
    app.post('/api/auth/register', authController.register.bind(authController));
    app.post('/api/auth/login', authController.login.bind(authController));
    app.post('/api/upload', authMiddleware, upload.single('file'), (req, res) => {
        if (!req.file) {
            res.status(400).json({ message: 'No file uploaded' });
            return;
        }
        logger.info(`File uploaded: ${req.file.filename}`);
        res.json({ fileUrl: `/uploads/${req.file.filename}` });
    });

    // Socket.IO
    setupSocket(io);

    // Обработка ошибок
    app.use(errorHandler);

    return { app, io };
};