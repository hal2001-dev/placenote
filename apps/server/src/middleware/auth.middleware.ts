import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { logger } from '../utils/logger';
import { supabase } from '../config/supabase';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      logger.error('No authorization header');
      return res.status(401).json({ message: '인증 헤더가 없습니다.' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      logger.error('No token in authorization header');
      return res.status(401).json({ message: '토큰이 없습니다.' });
    }

    logger.info('Verifying token in middleware', { 
      token: token.substring(0, 20) + '...',
      currentTime: new Date().toISOString()
    });

    try {
      // 토큰 검증
      const decoded = verifyToken(token);
      logger.info('Token verified in middleware', { 
        userId: decoded.userId,
        currentTime: new Date().toISOString()
      });

      // 사용자 정보 조회
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', decoded.userId)
        .single();

      if (error) {
        logger.error('Failed to fetch user data', error);
        return res.status(401).json({ message: '사용자 정보를 가져오는데 실패했습니다.' });
      }

      if (!user) {
        logger.error('User not found', { userId: decoded.userId });
        return res.status(401).json({ message: '사용자를 찾을 수 없습니다.' });
      }

      // 사용자 정보를 request 객체에 추가
      req.user = user;
      next();
    } catch (error) {
      logger.error('Token verification failed in middleware', { 
        error: error instanceof Error ? error.message : 'Unknown error',
        currentTime: new Date().toISOString()
      });
      return res.status(401).json({ message: '유효하지 않은 토큰입니다.' });
    }
  } catch (error) {
    logger.error('Auth middleware error', error);
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
}; 