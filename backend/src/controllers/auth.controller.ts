import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { registerSchema, loginSchema, refreshTokenSchema } from '../validations/auth.schema';
import { success, ZodError } from 'zod';

export class AuthController {
    private authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }

    register = async (req: Request, res: Response): Promise<Response> => {
        try {
            const parsed = registerSchema.parse(req.body);
            const result = await this.authService.register(parsed);

            return res.status(201).json({
                success: true,
                message: 'Usuario registrado exitosamente',
                data: result,
            });
        } catch (error) {
            if (error instanceof ZodError) {
                return res.status(400).json({
                    success: false,
                    message: 'Error al registrarse.',
                    errors: error.issues,
                });
            }

            if (error instanceof Error) {
                return res.status(400).json({
                    success: false,
                    message: error.message,
                });
            }

            return res.status(500).json({
                success: false,
                message: 'Error al registrar usuario',
            });
        }
    };

    login = async (req: Request, res: Response): Promise<Response> => {
        try {
            const parsed = loginSchema.parse(req.body);
            const result = await this.authService.login(parsed);

            return res.status(200).json({
                success: true,
                message: 'Login exitoso',
                data: result,
            });
        } catch (error) {
            if (error instanceof ZodError) {
                return res.status(400).json({
                    success: false,
                    message: 'Errores de validación',
                    errors: error.issues,
                });
            }

            if (error instanceof Error) {
                return res.status(401).json({
                    success: false,
                    message: error.message,
                });
            }

            return res.status(500).json({
                success: false,
                message: 'Error al iniciar sesión',
            });
        }
    };

    refreshToken = async (req: Request, res: Response): Promise<Response> => {
        try {
            const parsed = refreshTokenSchema.parse(req.body);
            const result = await this.authService.refreshToken(parsed.refreshToken);

            return res.status(200).json({
                success: true,
                message: 'Token renovado exitosamente',
                data: result,
            });
        } catch (error) {
            if (error instanceof ZodError) {
                return res.status(400).json({
                    success: false,
                    message: 'Errores de validación',
                    errors: error.issues,
                });
            }

            if (error instanceof Error) {
                return res.status(401).json({
                    success: false,
                    message: error.message,
                });
            }

            return res.status(500).json({
                success: false,
                message: 'Error al renovar token',
            });
        }
    };

    logout = async (req: Request, res: Response): Promise<Response> => {
        return res.status(200).json({
            success: true,
            message: 'Logout exitoso',
        });
    };

    forgotPassword = async (req: Request, res: Response) => {
        try {
            const { email } = req.body;

            if (!email) {
                return res.status(400).json({ success: false, message: 'El email es requerido.' });
            }

            await this.authService.requestPasswordReset(email);

            res.status(200).json({
                success: true,
                message: 'Si el correo existe, recibirás las instrucciones para recuperar tu contraseña.'
            });

        } catch (error: any) {
            console.error('Error en forgotPassword:', error);
            res.status(500).json({ success: false, message: 'Error procesando la solicitud.' });
        }
    };

    resetPassword = async (req: Request, res: Response) => {
        try {
            const { token, newPassword } = req.body;

            if (!token || !newPassword) {
                return res.status(400).json({ success: false, message: 'Token y nueva contraseña son requeridos.' });
            }

            await this.authService.resetPassword(token, newPassword);

            res.status(200).json({
                success: true,
                message: 'Contraseña actualizada exitosamente. Ahora puedes iniciar sesión.'
            });

        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    };

    me = async (req: Request, res: Response): Promise<Response> => {
        try {
            return res.status(200).json({
                success: true,
                data: req.user,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Error al obtener información del usuario',
            });
        }
    };
}