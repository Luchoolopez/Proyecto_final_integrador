import { User } from "../models/user.model";
import { Op } from 'sequelize';
import { UserValidators } from "../utils/user/user.validators";
import { ServiceHelpers } from "../utils/user/user.helpers";
import { UserFormatter } from "../utils/user/user.formatter";
import { USER_CONSTANTS, ERROR_MESSAGES } from "../utils/user/user.constants";

/*
GET    /api/users/profile             # Obtener datos usuario logueado
PUT    /api/users/profile             # Actualizar datos
DELETE /api/users/profile             # Eliminar cuenta
PUT    /api/users/password            # Cambiar contraseña (logueado)
POST   /api/users/forgot-password     # Solicitar reset password
POST   /api/users/reset-password      # Confirmar reset password
GET    /api/users/verify-email        # Verificar email
POST   /api/users/resend-verification # Reenviar verificación
*/


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

    async getUsers(): Promise<any[]> {
        try {
            const users = await User.findAll();
            return UserFormatter.formatUserListResponse(users);
        } catch (error) {
            throw ServiceHelpers.handleServiceError(error, 'UserService.getUsers');
        }
    }

    async updateUser(id: number, updateData: any): Promise<any> {
        try {
            const user = await User.findByPk(id);
            if (!user) {
                throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
            }

            //eliminar campos no actualizables
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
                throw new Error(`La contrasenia debe tener al menos ${USER_CONSTANTS.PASSWORD_MIN_LENGTH} caracteres`);
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
        try{
            if(!id){
                throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
            }
            const user = await User.findByPk(id);
            if(!user){
                throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
            }

            const isMatch = await ServiceHelpers.comparePassword(oldPassword, user.password);
            if(!isMatch){
                throw new Error(ERROR_MESSAGES.INVALID_PASSWORD);
            }

            user.password = await ServiceHelpers.hashPassword(newPassword);
            await user.save();

        }catch(error){
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
