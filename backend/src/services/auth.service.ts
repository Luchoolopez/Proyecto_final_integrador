import { User } from '../models/user.model';
import { AuthHelpers } from '../utils/auth/auth.helpers';
import { TokenManager } from '../utils/auth/token.manager';
import { AUTH_ERROR_MESSAGES } from '../utils/auth/auth.constants';
import { ServiceHelpers } from '../utils/user/user.helpers';

interface RegisterData {
    nombre: string;
    email: string;
    password: string;
    telefono?: string | undefined;
}

interface LoginData {
    email: string;
    password: string;
}

interface AuthResponse {
    user: any;
    accessToken: string;
    refreshToken: string;
}

export class AuthService {
    async register(data: RegisterData): Promise<AuthResponse> {
        try {
            // Verificar si el email ya existe
            const existingUser = await User.findOne({ where: { email: data.email } });
            if (existingUser) {
                throw new Error(AUTH_ERROR_MESSAGES.EMAIL_ALREADY_EXISTS);
            }

            // Hash de la contraseña
            const hashedPassword = await AuthHelpers.hashPassword(data.password);

            // Crear usuario
            const user = await User.create({
                nombre: data.nombre,
                email: data.email,
                password: hashedPassword,
                telefono: data.telefono || null,
                rol: 'usuario', // Por defecto es usuario
                activo: true,
            });

            // Generar tokens
            const tokenPayload = {
                id: user.id,
                email: user.email,
                rol: user.rol,
            };

            const accessToken = TokenManager.generateAccessToken(tokenPayload);
            const refreshToken = TokenManager.generateRefreshToken(tokenPayload);

            // Actualizar último acceso
            await user.update({ fecha_ultimo_acceso: new Date() });

            return {
                user: AuthHelpers.sanitizeUserForResponse(user),
                accessToken,
                refreshToken,
            };
        } catch (error) {
            throw ServiceHelpers.handleServiceError(error, 'AuthService.register');
        }
    }

    async login(data: LoginData): Promise<AuthResponse> {
        try {
            // Buscar usuario por email
            const user = await User.findOne({ where: { email: data.email } });
            if (!user) {
                throw new Error(AUTH_ERROR_MESSAGES.INVALID_CREDENTIALS);
            }

            // Verificar si la cuenta está activa
            if (!user.activo) {
                throw new Error(AUTH_ERROR_MESSAGES.ACCOUNT_INACTIVE);
            }

            // Verificar contraseña
            const isPasswordValid = await AuthHelpers.comparePassword(data.password, user.password);
            if (!isPasswordValid) {
                throw new Error(AUTH_ERROR_MESSAGES.INVALID_CREDENTIALS);
            }

            // Generar tokens
            const tokenPayload = {
                id: user.id,
                email: user.email,
                rol: user.rol,
            };

            const accessToken = TokenManager.generateAccessToken(tokenPayload);
            const refreshToken = TokenManager.generateRefreshToken(tokenPayload);

            // Actualizar último acceso
            await user.update({ fecha_ultimo_acceso: new Date() });

            return {
                user: AuthHelpers.sanitizeUserForResponse(user),
                accessToken,
                refreshToken,
            };
        } catch (error) {
            throw ServiceHelpers.handleServiceError(error, 'AuthService.login');
        }
    }

    async refreshToken(oldRefreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
        try {
            // Verificar refresh token
            const decoded = TokenManager.verifyRefreshToken(oldRefreshToken);

            // Verificar que el usuario existe y está activo
            const user = await User.findByPk(decoded.id);
            if (!user) {
                throw new Error(AUTH_ERROR_MESSAGES.USER_NOT_FOUND);
            }

            if (!user.activo) {
                throw new Error(AUTH_ERROR_MESSAGES.ACCOUNT_INACTIVE);
            }

            // Generar nuevos tokens
            const tokenPayload = {
                id: user.id,
                email: user.email,
                rol: user.rol,
            };

            const accessToken = TokenManager.generateAccessToken(tokenPayload);
            const refreshToken = TokenManager.generateRefreshToken(tokenPayload);

            return { accessToken, refreshToken };
        } catch (error) {
            throw ServiceHelpers.handleServiceError(error, 'AuthService.refreshToken');
        }
    }

    async validateToken(token: string): Promise<any> {
        try {
            const decoded = TokenManager.verifyAccessToken(token);
            
            const user = await User.findByPk(decoded.id);
            if (!user || !user.activo) {
                throw new Error(AUTH_ERROR_MESSAGES.UNAUTHORIZED);
            }

            return AuthHelpers.sanitizeUserForResponse(user);
        } catch (error) {
            throw ServiceHelpers.handleServiceError(error, 'AuthService.validateToken');
        }
    }
}