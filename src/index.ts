import { createApp } from './app';
import { config } from './config';
import logger from './utils/logger';

const { app, io } = createApp();

const server = app.listen(config.port, () => {
    logger.info(`Server running on port ${config.port}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    logger.info('Shutting down server');
    server.close(() => {
        io.close();
        process.exit(0);
    });
});