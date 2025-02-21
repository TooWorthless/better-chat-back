import { Request, Response } from 'express';
import { AuthService } from '../services/authService';

export class AuthController {
    private authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }

    async register(req: Request, res: Response) {
        try {
            const { username, password } = req.body;
            const user = await this.authService.register(username, password);
            res.status(201).json({ message: 'User registered', user });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    async login(req: Request, res: Response) {
        try {
            const { username, password } = req.body;
            const result = await this.authService.login(username, password);
            res.json(result);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }
}