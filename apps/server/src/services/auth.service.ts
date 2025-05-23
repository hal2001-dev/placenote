import { supabase } from '../config/supabase';
import { generateTokens } from '../utils/jwt';
import { User, UserCreateInput, UserLoginInput, AuthResponse } from '../models/user';
import { logger } from '../utils/logger';
import { verifyToken } from '../utils/jwt';

export class AuthService {
  async register(input: UserCreateInput): Promise<AuthResponse> {
    logger.info('Starting user registration', { email: input.email });
    
    try {
      // 1. Create user profile first
      const { data: userData, error: userError } = await supabase
        .from('users')
        .insert([
          {
            email: input.email,
            nickname: input.nickname,
            password: input.password, // TODO: 비밀번호 해싱 구현
          },
        ])
        .select()
        .single();

      if (userError) {
        logger.error('User profile creation failed', userError);
        throw new Error('프로필 생성에 실패했습니다.');
      }

      if (!userData) {
        logger.error('No user data returned from profile creation');
        throw new Error('사용자 생성에 실패했습니다.');
      }

      logger.info('User profile created successfully', { userId: userData.id });

      // 2. Generate tokens
      const { token, refreshToken } = generateTokens(userData.id);

      return {
        user: userData,
        token,
        refreshToken,
      };
    } catch (error) {
      logger.error('Registration process failed', error);
      throw error;
    }
  }

  async login(input: UserLoginInput): Promise<AuthResponse> {
    logger.info('Starting user login', { email: input.email });

    try {
      // 사용자 정보 조회
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select()
        .eq('email', input.email)
        .single();

      if (userError) {
        logger.error('User not found', userError);
        throw new Error('이메일 또는 비밀번호가 일치하지 않습니다.');
      }

      if (!userData) {
        logger.error('User not found', { email: input.email });
        throw new Error('이메일 또는 비밀번호가 일치하지 않습니다.');
      }

      // 비밀번호 검증 (실제 구현에서는 bcrypt 등을 사용해야 함)
      // TODO: 비밀번호 해싱 구현
      if (input.password !== userData.password) {
        logger.error('Invalid password', { email: input.email });
        throw new Error('이메일 또는 비밀번호가 일치하지 않습니다.');
      }

      logger.info('Login successful', { userId: userData.id });

      // 토큰 생성
      const { token, refreshToken } = generateTokens(userData.id);

      return {
        user: userData,
        token,
        refreshToken,
      };
    } catch (error) {
      logger.error('Login failed', error);
      throw error;
    }
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    logger.info('Starting token refresh');

    try {
      // 리프레시 토큰 검증
      const decoded = verifyToken(refreshToken);
      logger.info('Refresh token verified', { userId: decoded.userId });

      // 사용자 정보 조회
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', decoded.userId)
        .single();

      if (userError) {
        logger.error('Failed to fetch user profile during token refresh', userError);
        throw new Error('사용자 정보를 가져오는데 실패했습니다.');
      }

      if (!userData) {
        logger.error('User not found during token refresh', { userId: decoded.userId });
        throw new Error('사용자를 찾을 수 없습니다.');
      }

      logger.info('User profile fetched successfully during token refresh', { userId: userData.id });

      // 새로운 토큰 생성
      const { token, refreshToken: newRefreshToken } = generateTokens(userData.id);

      return {
        user: userData,
        token,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      logger.error('Token refresh failed', error);
      throw error;
    }
  }

  async getUserProfile(userId: string): Promise<User> {
    logger.info('Fetching user profile', { userId });

    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (userError) {
      logger.error('Failed to fetch user profile', userError);
      throw new Error('사용자 정보를 가져오는데 실패했습니다.');
    }

    if (!userData) {
      logger.error('User profile not found', { userId });
      throw new Error('사용자를 찾을 수 없습니다.');
    }

    logger.info('User profile fetched successfully', { userId });
    return userData;
  }

  async getCurrentUser(token: string): Promise<User> {
    logger.info('Fetching current user profile');

    try {
      // JWT 토큰 검증
      const decoded = verifyToken(token);
      logger.info('Token verified', { userId: decoded.userId });

      // 사용자 정보 조회
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', decoded.userId)
        .single();

      if (userError) {
        logger.error('Failed to fetch user profile', userError);
        throw new Error('사용자 정보를 가져오는데 실패했습니다.');
      }

      if (!userData) {
        logger.error('User not found', { userId: decoded.userId });
        throw new Error('사용자를 찾을 수 없습니다.');
      }

      logger.info('User profile fetched successfully', { userId: userData.id });
      return userData;
    } catch (error) {
      logger.error('Failed to get current user', error);
      throw error;
    }
  }
} 