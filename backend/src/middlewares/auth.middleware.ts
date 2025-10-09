import { Request, Response, NextFunction } from 'express';
import { TokenManager } from '../utils/auth/token.manager';
import { AuthHelpers } from '../utils/auth/auth.helpers';
import { User } from '../models/user.model';
import { AUTH_ERROR_MESSAGES } from '../utils/auth/auth.constants';

// Extender la interfaz Request para incluir el usuario
declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

export class AuthMiddleware {
    static async authenticate(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const token = AuthHelpers.extractTokenFromHeader(req.headers.authorization);

            if (!token) {
                res.status(401).json({
                    success: false,
                    message: AUTH_ERROR_MESSAGES.MISSING_TOKEN,
                });
                return;
            }

            const decoded = TokenManager.verifyAccessToken(token);

            const user = await User.findByPk(decoded.id);
            if (!user || !user.activo) {
                res.status(401).json({
                    success: false,
                    message: AUTH_ERROR_MESSAGES.UNAUTHORIZED,
                });
                return;
            }

            req.user = AuthHelpers.sanitizeUserForResponse(user);
            next();
        } catch (error) {
            if (error instanceof Error) {
                res.status(401).json({
                    success: false,
                    message: error.message,
                });
                return;
            }

            res.status(401).json({
                success: false,
                message: AUTH_ERROR_MESSAGES.UNAUTHORIZED,
            });
        }
    }

    static authorizeRoles(...roles: ('usuario' | 'admin')[]) {
        return (req: Request, res: Response, next: NextFunction): void => {
            if (!req.user) {
                res.status(401).json({
                    success: false,
                    message: AUTH_ERROR_MESSAGES.UNAUTHORIZED,
                });
                return;
            }

            if (!roles.includes(req.user.rol)) {
                res.status(403).json({
                    success: false,
                    message: 'No tienes permisos para realizar esta acción',
                });
                return;
            }

            next();
        };
    }
}