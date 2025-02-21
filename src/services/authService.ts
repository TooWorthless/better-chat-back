import { UserRepository } from '../repositories/userRepository';
import { hashPassword, comparePassword, generateToken } from '../utils/auth';
import logger from '../utils/logger';

export class AuthService {
    userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository();
    }

    async register(username: string, password: string): Promise<{ id: string; username: string }> {
        const existingUser = await this.userRepository.findByUsername(username);
        if (existingUser) {
            throw new Error('Username already exists');
        }

        const hashedPassword = await hashPassword(password);
        const user = await this.userRepository.create(username, hashedPassword);
        logger.info(`User registered: ${username}`);
        return { id: user._id.toString(), username: user.username };
    }

    async login(
        username: string,
        password: string,
    ): Promise<{ token: string; user: { id: string; username: string } }> {
        const user = await this.userRepository.findByUsername(username);
        if (!user || !(await comparePassword(password, user.password))) {
            throw new Error('Invalid credentials');
        }

        const token = generateToken(user._id.toString());
        logger.info(`User logged in: ${username}`);
        return { token, user: { id: user._id.toString(), username: user.username } };
    }
}