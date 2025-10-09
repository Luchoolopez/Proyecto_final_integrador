import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { user, tokens } = await AuthService.register(req.body);
      res.status(201).json({ user, tokens });
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const ua = req.headers['user-agent'];
      const ctx = {
        ...(req.ip ? { ip: req.ip } : {}),
        ...(typeof ua === 'string' ? { userAgent: ua } : {}),
      };
      const { user, tokens } = await AuthService.login(req.body, ctx);
      res.status(200).json({ user, tokens });
    } catch (error) {
      next(error);
    }
  }

  static async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await AuthService.logout(req.body);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  static async refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const ua = req.headers['user-agent'];
      const ctx = {
        ...(req.ip ? { ip: req.ip } : {}),
        ...(typeof ua === 'string' ? { userAgent: ua } : {}),
      };
      const tokens = await AuthService.refresh(req.body, ctx);
      res.status(200).json(tokens);
    } catch (error) {
      next(error);
    }
  }
}
