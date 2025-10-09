import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ERROR_MESSAGES } from '../utils/user/user.constants';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      res.status(401).json({ message: ERROR_MESSAGES.UNAUTHORIZED });
      return;
    }

    const [scheme, token] = authHeader.split(' ');
    if (scheme !== 'Bearer' || !token) {
      res.status(401).json({ message: ERROR_MESSAGES.UNAUTHORIZED });
      return;
    }

    const secret = process.env.JWT_ACCESS_SECRET;
    if (!secret) {
      console.error('Falta JWT_ACCESS_SECRET en variables de entorno');
      res.status(500).json({ message: 'Error de configuración del servidor' });
      return;
    }

    const decoded = jwt.verify(token, secret) as any;

    (req as any).user = {
      id: decoded.sub,             
      email: decoded.email,
      role: decoded.rol ?? 'usuario',
    };

    next();
  } catch (error) {
    res.status(401).json({ message: ERROR_MESSAGES.UNAUTHORIZED });
  }
};
