import jwt from 'jsonwebtoken';
import { config } from '../config';
import { logger } from './logger';

interface TokenPayload {
  userId: string;
}

export const generateTokens = (userId: string) => {
  const payload: TokenPayload = { userId };
  
  // 현재 시간 로깅
  const now = new Date();
  logger.info('Generating tokens', { 
    currentTime: now.toISOString(),
    userId,
    expiresIn: config.jwt.expiresIn,
    refreshExpiresIn: config.jwt.refreshExpiresIn,
    secret: config.jwt.secret.substring(0, 10) + '...' // 시크릿 키의 일부만 로깅
  });

  const accessToken = jwt.sign(
    payload,
    config.jwt.secret as jwt.Secret,
    { expiresIn: config.jwt.expiresIn } as unknown as jwt.SignOptions
  );

  const refreshToken = jwt.sign(
    payload,
    config.jwt.secret as jwt.Secret,
    { expiresIn: config.jwt.refreshExpiresIn } as unknown as jwt.SignOptions
  );

  // 생성된 토큰의 페이로드 확인
  const decodedAccess = jwt.decode(accessToken) as TokenPayload & { iat: number; exp: number };
  logger.info('Generated access token', {
    issuedAt: new Date(decodedAccess.iat * 1000).toISOString(),
    expiresAt: new Date(decodedAccess.exp * 1000).toISOString(),
    payload: decodedAccess
  });

  return {
    token: accessToken,
    refreshToken,
  };
};

export const verifyToken = (token: string): TokenPayload => {
  try {
    logger.info('Verifying token', { 
      token: token.substring(0, 20) + '...',
      currentTime: new Date().toISOString(),
      secret: config.jwt.secret.substring(0, 10) + '...' // 시크릿 키의 일부만 로깅
    });
    
    // 토큰 디코딩 (검증 없이)
    const decoded = jwt.decode(token);
    logger.info('Token decoded (without verification)', {
      decoded,
      currentTime: new Date().toISOString()
    });

    // 토큰 검증
    const verified = jwt.verify(token, config.jwt.secret as jwt.Secret) as TokenPayload;
    logger.info('Token verified successfully', { 
      userId: verified.userId,
      currentTime: new Date().toISOString()
    });
    
    if (!verified.userId) {
      logger.error('Token missing userId');
      throw new Error('Invalid token payload');
    }
    
    return verified;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      logger.error('Token has expired', {
        error: error.message,
        expiredAt: error.expiredAt
      });
      throw new Error('Token has expired');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      logger.error('Invalid token', {
        error: error.message
      });
      throw new Error('Invalid token');
    }
    logger.error('Token verification failed', {
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    throw error;
  }
};

console.log('JWT_SECRET:', config.jwt.secret); 