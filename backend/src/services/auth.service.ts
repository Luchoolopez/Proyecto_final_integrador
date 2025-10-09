import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { nanoid } from 'nanoid';

import { User } from '../models/user.model';
import { USER_CONSTANTS, ERROR_MESSAGES } from '../utils/user/user.constants';
import { UserValidators } from '../utils/user/user.validators';
import { ServiceHelpers } from '../utils/user/user.helpers';
import { UserFormatter } from '../utils/user/user.formatter';
import { RefreshToken } from '../models/refresh_token.model';

import type { RegisterDto, LoginDto, RefreshDto, LogoutDto, TokenPair } from '../types/auth.types';

export class AuthService {
  private static async hashPassword(plain: string): Promise<string> {
    const rounds = Number(process.env.BCRYPT_SALT_ROUNDS ?? 10);
    return bcrypt.hash(plain, rounds);
  }

  private static async comparePassword(plain: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(plain, hashed);
  }

  private static signAccessToken(user: { id: number; email: string; rol?: string }): string {
    const secret = process.env.JWT_ACCESS_SECRET!;
    const ttl = Number(process.env.JWT_ACCESS_TTL ?? 900);
    const payload = { sub: user.id, email: user.email, rol: user.rol };
    return jwt.sign(payload, secret, { expiresIn: ttl });
  }

  private static signRefreshToken(userId: number, jti: string): string {
    const secret = process.env.JWT_REFRESH_SECRET!;
    const ttl = Number(process.env.JWT_REFRESH_TTL ?? 60 * 60 * 24 * 30);
    const payload = { sub: userId, jti };
    return jwt.sign(payload, secret, { expiresIn: ttl });
  }

  private static async persistRefreshToken(args: {
    userId: number; refreshToken: string; jti: string; expiresAt: Date; ip?: string; userAgent?: string;
  }): Promise<void> {
    const tokenHash = this.sha256(args.refreshToken);
    await RefreshToken.create({
      usuario_id: args.userId,
      jti: args.jti,
      hash_token: tokenHash,
      expira_en: args.expiresAt,
      revocado_en: null,
      ip: args.ip ?? null,
      agente_usuario: args.userAgent ?? null,
    });
  }

  private static async issueTokenPair(
    user: { id: number; email: string; rol?: string },
    ctx?: { ip?: string; userAgent?: string }
  ): Promise<TokenPair> {
    const jti = nanoid();
    const accessToken = this.signAccessToken(user);
    const refreshToken = this.signRefreshToken(user.id, jti);

    // construir args sin props undefined (exactOptionalPropertyTypes)
    const persistArgs: {
      userId: number; refreshToken: string; jti: string; expiresAt: Date; ip?: string; userAgent?: string;
    } = {
      userId: user.id,
      refreshToken,
      jti,
      expiresAt: new Date(Date.now() + this.refreshTtlMs()),
    };
    if (ctx?.ip) persistArgs.ip = ctx.ip;
    if (ctx?.userAgent) persistArgs.userAgent = ctx.userAgent;

    await this.persistRefreshToken(persistArgs);

    return { accessToken, refreshToken };
  }

  private static sha256(value: string): string {
    return crypto.createHash('sha256').update(value).digest('hex');
  }

  private static refreshTtlMs(): number {
    return Number(process.env.JWT_REFRESH_TTL ?? 60 * 60 * 24 * 30) * 1000;
  }

  static async register(dto: RegisterDto): Promise<{ user: any; tokens: TokenPair }> {
    try {
      const { nombre, email, telefono, password } = dto;

      if (!UserValidators.isValidEmail(email)) {
        throw new Error(ERROR_MESSAGES.WRONG_FORMAT_EMAIL);
      }
      if (!UserValidators.isValidPassword(password) || password.length < USER_CONSTANTS.PASSWORD_MIN_LENGTH) {
        throw new Error(ERROR_MESSAGES.WRONG_FORMAT_PASSWORD);
      }
      if (telefono && !UserValidators.isValidPhone(telefono)) {
        throw new Error(ERROR_MESSAGES.WRONG_FORMAT_PHONE);
      }

      const exists = await UserValidators.emailExists(email);
      if (exists) {
        throw new Error(ERROR_MESSAGES.EMAIL_ALREADY_EXISTS);
      }

      const passwordHash = await this.hashPassword(password);

      const created = await User.create({
        nombre,
        email,
        telefono: telefono ?? null,
        password: passwordHash,
        rol: 'usuario',
        activo: false
      });

      const tokens = await this.issueTokenPair({ id: created.id, email: created.email, rol: created.rol });

      const safeUser = UserFormatter.formatUserResponse(created);
      return { user: safeUser, tokens };
    } catch (error) {
      ServiceHelpers.handleServiceError(error, 'AuthService.register');
    }
  }

  static async login(dto: LoginDto, ctx?: { ip?: string; userAgent?: string }): Promise<{ user: any; tokens: TokenPair }> {
    try {
      const { email, password } = dto;

      if (!UserValidators.isValidEmail(email)) {
        throw new Error(ERROR_MESSAGES.WRONG_FORMAT_EMAIL);
      }
      if (!password) {
        throw new Error(ERROR_MESSAGES.WRONG_FORMAT_PASSWORD);
      }

      const user = await User.findOne({ where: { email } });
      if (!user) {
        throw new Error(ERROR_MESSAGES.INVALID_CREDENTIALS);
      }

      const ok = await this.comparePassword(password, user.password);
      if (!ok) {
        throw new Error(ERROR_MESSAGES.INVALID_CREDENTIALS);
      }

      user.fecha_ultimo_acceso = new Date();
      await user.save();

      const tokens = await this.issueTokenPair({ id: user.id, email: user.email, rol: user.rol }, ctx);

      const safeUser = UserFormatter.formatUserResponse(user);
      return { user: safeUser, tokens };
    } catch (error) {
      ServiceHelpers.handleServiceError(error, 'AuthService.login');
    }
  }

  static async logout(dto: LogoutDto): Promise<void> {
    try {
      const { refreshToken } = dto;
      if (!refreshToken) return;

      const tokenHash = this.sha256(refreshToken);
      const stored = await RefreshToken.findOne({ where: { hash_token: tokenHash, revocado_en: null } });
      if (!stored) return;

      stored.revocado_en = new Date();
      await stored.save();
    } catch (error) {
      ServiceHelpers.handleServiceError(error, 'AuthService.logout');
    }
  }

  static async refresh(dto: RefreshDto, ctx?: { ip?: string; userAgent?: string }): Promise<TokenPair> {
    try {
      const { refreshToken } = dto;
      if (!refreshToken) throw new Error(ERROR_MESSAGES.UNAUTHORIZED);

      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!);
      const payload = decoded as jwt.JwtPayload;
      const userId = Number(payload.sub);
      const jti = (payload as any).jti as string | undefined;
      if (!userId || !jti) throw new Error(ERROR_MESSAGES.UNAUTHORIZED);

      const tokenHash = this.sha256(refreshToken);
      const stored = await RefreshToken.findOne({ where: { hash_token: tokenHash, usuario_id: userId, revocado_en: null } });
      if (!stored) throw new Error(ERROR_MESSAGES.UNAUTHORIZED);

      if (new Date(stored.expira_en).getTime() <= Date.now()) {
        await stored.destroy().catch(() => {});
        throw new Error(ERROR_MESSAGES.UNAUTHORIZED);
      }

      stored.revocado_en = new Date();
      await stored.save();

      const user = await User.findByPk(userId);
      if (!user) throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);

      const newJti = nanoid();
      const accessToken = this.signAccessToken({ id: user.id, email: user.email, rol: user.rol });
      const newRefreshToken = this.signRefreshToken(user.id, newJti);

      const persistArgs2: {
        userId: number; refreshToken: string; jti: string; expiresAt: Date; ip?: string; userAgent?: string;
      } = {
        userId: user.id,
        refreshToken: newRefreshToken,
        jti: newJti,
        expiresAt: new Date(Date.now() + this.refreshTtlMs()),
      };
      if (ctx?.ip) persistArgs2.ip = ctx.ip;
      if (ctx?.userAgent) persistArgs2.userAgent = ctx.userAgent;

      await this.persistRefreshToken(persistArgs2);

      return { accessToken, refreshToken: newRefreshToken };
    } catch (error) {
      ServiceHelpers.handleServiceError(error, 'AuthService.refresh');
    }
  }
}
