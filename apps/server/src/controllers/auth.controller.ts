import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { UserCreateInput, UserLoginInput } from '../models/user';
import { logger } from '../utils/logger';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  register = async (req: Request, res: Response) => {
    try {
      const input: UserCreateInput = req.body;
      const result = await this.authService.register(input);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : 'Registration failed' });
    }
  };

  login = async (req: Request, res: Response) => {
    try {
      const input: UserLoginInput = req.body;
      const result = await this.authService.login(input);
      res.json(result);
    } catch (error) {
      res.status(401).json({ message: error instanceof Error ? error.message : 'Login failed' });
    }
  };

  refreshToken = async (req: Request, res: Response) => {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        return res.status(400).json({ message: 'Refresh token is required' });
      }

      const result = await this.authService.refreshToken(refreshToken);
      res.json(result);
    } catch (error) {
      res.status(401).json({ message: error instanceof Error ? error.message : 'Token refresh failed' });
    }
  };

  async getCurrentUser = async (req: Request, res: Response) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      logger.info('token', token); 
      
      if (!token) {
        return res.status(401).json({ message: '인증 토큰이 필요합니다.' });
      }

      const user = await this.authService.getCurrentUser(token);
      res.json(user);
    } catch (error) {
      logger.error('Failed to get current user', error);
      res.status(401).json({ message: error instanceof Error ? error.message : '사용자 정보를 가져오는데 실패했습니다.' });
    }
  }

  async getUserProfile = async (req: Request, res: Response) => {
    try {
      const userId = req.params.userId;
      const user = await this.authService.getUserProfile(userId);
      res.json(user);
    } catch (error) {
      logger.error('Failed to get user profile', error);
      res.status(404).json({ message: error instanceof Error ? error.message : '사용자 정보를 가져오는데 실패했습니다.' });
    }
  }
} 