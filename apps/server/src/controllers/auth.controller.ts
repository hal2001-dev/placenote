import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { UserCreateInput, UserLoginInput } from '../models/user';
import { logger } from '../utils/logger';
import { createClient } from '@supabase/supabase-js';
import { config } from '../config';
import jwt from 'jsonwebtoken';

const supabase = createClient(
  config.supabase.url,
  config.supabase.serviceRoleKey
);

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

  signUp = async (req: Request, res: Response) => {
    try {
      const { email, password, name } = req.body;

      // Check if user already exists
      const { data: existingUser } = await supabase
        .from('users')
        .select()
        .eq('email', email)
        .single();

      if (existingUser) {
        return res.status(400).json({
          message: 'User already exists',
        });
      }

      // Create user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        throw authError;
      }

      // Create user profile in database
      const { data: userData, error: userError } = await supabase
        .from('users')
        .insert([
          {
            id: authData.user?.id,
            email,
            name,
          },
        ])
        .select()
        .single();

      if (userError) {
        throw userError;
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: userData.id },
        config.jwt.secret,
        { expiresIn: config.jwt.expiresIn }
      );

      res.status(201).json({
        message: 'User created successfully',
        user: userData,
        token,
      });
    } catch (error) {
      console.error('Signup error:', error);
      res.status(500).json({
        message: 'Error creating user',
      });
    }
  };

  signIn = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      // Sign in with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        return res.status(401).json({
          message: 'Invalid credentials',
        });
      }

      // Get user profile
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select()
        .eq('id', authData.user.id)
        .single();

      if (userError) {
        throw userError;
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: userData.id },
        config.jwt.secret,
        { expiresIn: config.jwt.expiresIn }
      );

      res.json({
        message: 'Signed in successfully',
        user: userData,
        token,
      });
    } catch (error) {
      console.error('Signin error:', error);
      res.status(500).json({
        message: 'Error signing in',
      });
    }
  };

  signOut = async (req: Request, res: Response) => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }

      res.json({
        message: 'Signed out successfully',
      });
    } catch (error) {
      console.error('Signout error:', error);
      res.status(500).json({
        message: 'Error signing out',
      });
    }
  };
} 