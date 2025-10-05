import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { userSchema } from "../validations/user.schema";
import { ERROR_MESSAGES } from "../utils/user/user.constants";
import { ZodError } from "zod";

export class UserController {
    private userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    async getUser(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            if (!id || isNaN(Number(id))) {
                return res.status(404).json({
                    success: false,
                    message: ERROR_MESSAGES.INVALID_ID
                });
            }
            const user = await this.userService.getUser(Number(id));

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: ERROR_MESSAGES.USER_NOT_FOUND
                });
            }

            return res.status(200).json({
                success: true,
                data: user
            });
        } catch (error) {
            if (error instanceof ZodError) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation error',
                    errors: error.message
                });
            }
            return res.status(500).json({
                success: false,
                message: 'Error al obtener el usuario'
            });
        }
    }

    async getUsers(req: Request, res: Response): Promise<Response> {
        try {
            const users = await this.userService.getUsers();
            return res.status(200).json({
                success: true,
                count: users.length,
                data: users
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Error al obtener los usuarios'
            })
        }
    }

    async updateUser(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            if (!id || isNaN(Number(id))) {
                return res.status(404).json({
                    success: false,
                    message: ERROR_MESSAGES.INVALID_ID
                });
            }
            const parsed = userSchema.parse(req.body);
            const updated = await this.userService.updateUser(Number(id), parsed);
            if (!updated) {
                return res.status(400).json({
                    success: false,
                    message: 'Los datos para actualizar no son validos'
                });
            }
            return res.status(200).json({
                success: true,
                data: updated
            })
        } catch (error) {
            if (error instanceof ZodError) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation error',
                    errors: error.message
                });
            }
            return res.status(500).json({
                success: false,
                message: ERROR_MESSAGES.GET_USER_ERROR
            });
        }
    }

    async changePassword(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const { oldPassword, newPassword } = req.body;
            if (!id || isNaN(Number(id))) {
                return res.status(400).json({
                    success: false,
                    message: ERROR_MESSAGES.INVALID_ID
                });
            }

            if (!oldPassword || !newPassword) {
                return res.status(400).json({
                    success: false,
                    message: 'Las contrasenias son requeridas'
                });
            }

            await this.userService.changePassword(Number(id), oldPassword, newPassword);

            return res.status(200).json({
                success: true,
                message: 'Contrasenia actualizada exitosamente'
            });
        } catch (error) {
            if (error instanceof Error) {
                return res.status(400).json({
                    success: false,
                    message: error.message
                });
            }

            return res.status(500).json({
                success: false,
                message: 'Error al cambiar la contrasenia'
            });
        }
    }

    async deleteUser(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            if (!id || isNaN(Number(id))) {
                return res.status(400).json({
                    success: false,
                    message: ERROR_MESSAGES.INVALID_ID
                });
            }
            const eliminated = await this.userService.deleteUser(Number(id));
            if (!eliminated) {
                return res.status(400).json({
                    success: false,
                    message: 'Perfil no encontrado para eliminar'
                });
            }

            return res.status(200).json({
                success: true,
                message: 'Perfil elimando exitosamente'
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: error
            })
        }
    }
}
