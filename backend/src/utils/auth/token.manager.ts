import jwt, { SignOptions } from 'jsonwebtoken';
import jwtConfig from '../../config/jwt';
import { AUTH_ERROR_MESSAGES } from './auth.constants';

interface TokenPayload {
    id: number;
    email: string;
    rol: 'usuario' | 'admin';
}

export class TokenManager {
    static generateAccessToken(payload: TokenPayload): string {
        return jwt.sign(
            payload, 
            jwtConfig.secret, 
            { expiresIn: jwtConfig.expiresIn } as SignOptions
        );
    }

    static generateRefreshToken(payload: TokenPayload): string {
        return jwt.sign(
            payload, 
            jwtConfig.refreshSecret, 
            { expiresIn: jwtConfig.refreshExpiresIn } as SignOptions
        );
    }

    static verifyAccessToken(token: string): TokenPayload {
        try {
            return jwt.verify(token, jwtConfig.secret) as TokenPayload;
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                throw new Error(AUTH_ERROR_MESSAGES.TOKEN_EXPIRED);
            }
            throw new Error(AUTH_ERROR_MESSAGES.TOKEN_INVALID);
        }
    }

    static verifyRefreshToken(token: string): TokenPayload {
        try {
            return jwt.verify(token, jwtConfig.refreshSecret) as TokenPayload;
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                throw new Error(AUTH_ERROR_MESSAGES.TOKEN_EXPIRED);
            }
            throw new Error(AUTH_ERROR_MESSAGES.TOKEN_INVALID);
        }
    }

    static decodeToken(token: string): TokenPayload | null {
        try {
            return jwt.decode(token) as TokenPayload;
        } catch {
            return null;
        }
    }
}