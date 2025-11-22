import { User } from "../models/user.model";
import { Op } from 'sequelize';
import { UserValidators } from "../utils/user/user.validators";
import { ServiceHelpers } from "../utils/user/user.helpers";
import { UserFormatter } from "../utils/user/user.formatter";
import { USER_CONSTANTS, ERROR_MESSAGES } from "../utils/user/user.constants";

interface UserFilters {
    search?: string;
    rol?: 'usuario' | 'admin';
    activo?: boolean;
}

export class UserService {
    async getUser(id: number): Promise<User | null> {
        try {
            if (!id) {
                throw new Error(ERROR_MESSAGES.USER_NOT_FOUND)
            }
            const user = await User.findByPk(id);
            if (!user) {
                throw new Error(ERROR_MESSAGES.USER_NOT_FOUND)
            }
            return user;
        } catch (error) {
            throw ServiceHelpers.handleServiceError(error, 'UserService.getUser');
        }
    }

    async getUsers(filters: UserFilters = {}, page: number = 1, limit: number = 10) {
        try {
            const offset = (page - 1) * limit;
            const whereClause: any = {};

            if (filters.search) {
                whereClause[Op.or] = [
                    { nombre: { [Op.like]: `%${filters.search}%` } },
                    { email: { [Op.like]: `%${filters.search}%` } }
                ];
            }

            if (filters.rol) {
                whereClause.rol = filters.rol;
            }

            if (filters.activo !== undefined) {
                whereClause.activo = filters.activo;
            }

            const { count, rows } = await User.findAndCountAll({
                where: whereClause,
                limit,
                offset,
                order: [['fecha_creacion', 'DESC']] 
            });

            return {
                total: count,
                totalPages: Math.ceil(count / limit),
                currentPage: page,
                users: UserFormatter.formatUserListResponse(rows)
            };

        } catch (error) {
            throw ServiceHelpers.handleServiceError(error, 'UserService.getUsers');
        }
    }

    async updateUser(id: number, updateData: any): Promise<User> {
        try {
            const user = await User.findByPk(id);
            if (!user) {
                throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
            }

            const sanitizedData = UserValidators.sanitizeUserInput(updateData);

            if (sanitizedData.email && sanitizedData.email !== user.email) {
                if (!UserValidators.isValidEmail(sanitizedData.email)) {
                    throw new Error(ERROR_MESSAGES.WRONG_FORMAT_EMAIL);
                }
                const emailExists = await UserValidators.emailExists(sanitizedData.email, id);
                if (emailExists) {
                    throw new Error(ERROR_MESSAGES.EMAIL_ALREADY_EXISTS);
                }
            }

            if (sanitizedData.telefono && !UserValidators.isValidPhone(sanitizedData.telefono)) {
                throw new Error(ERROR_MESSAGES.WRONG_FORMAT_PHONE);
            }

            if (sanitizedData.password && !UserValidators.isValidPassword(sanitizedData.password)) {
                throw new Error(`La contraseña debe tener al menos ${USER_CONSTANTS.PASSWORD_MIN_LENGTH} caracteres`);
            }

            if (sanitizedData.rol) {
                if (!['usuario', 'admin'].includes(sanitizedData.rol)) {
                    throw new Error(ERROR_MESSAGES.INVALID_ROL);
                }
            }

            await user.update(sanitizedData);
            return UserFormatter.formatUserResponse(user);
        } catch (error) {
            throw ServiceHelpers.handleServiceError(error, 'UserService.updateUser');

        }
    }

    async changePassword(id: number, oldPassword: string, newPassword: string): Promise<void> {
        try {
            if (!id) {
                throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
            }
            const user = await User.findByPk(id);
            if (!user) {
                throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
            }

            const isMatch = await ServiceHelpers.comparePassword(oldPassword, user.password);
            if (!isMatch) {
                throw new Error(ERROR_MESSAGES.INVALID_PASSWORD);
            }

            user.password = await ServiceHelpers.hashPassword(newPassword);
            await user.save();

        } catch (error) {
            throw ServiceHelpers.handleServiceError(error, 'UserService.changePassword');
        }
    }

    async deleteUser(id: number): Promise<User> {
        try {
            if (!id) {
                throw new Error(ERROR_MESSAGES.USER_NOT_FOUND)
            }
            const user = await User.findByPk(id);
            if (!user) {
                throw new Error(ERROR_MESSAGES.USER_NOT_FOUND)
            }
            await user.destroy();
            return user;
        } catch (error) {
            throw ServiceHelpers.handleServiceError(error, 'UserService.deleteUser');
        }
    }
}