import { User } from "../models/user.model";
import { Op } from 'sequelize';
import { UserValidators } from "../utils/user/user.validators";
import { ServiceHelpers } from "../utils/user/user.helpers";
import { UserFormatter } from "../utils/user/user.formatter";
import { USER_CONSTANTS, ERROR_MESSAGES } from "../utils/user/user.constants";

export class UserService {
    async createUser(userData: { nombre: string; email: string; password: string; rol:'usuario' | 'admin'; telefono?: string | null; activo?: boolean; }): Promise<any> {
        try {
            if(!UserValidators.isValidEmail(userData.email)){
                throw new Error('Email invalido')
            };

            if(!UserValidators.isValidPassword(userData.password)){
                throw new Error(`La contraseña debe tener al menos ${USER_CONSTANTS.PASSWORD_MIN_LENGTH} caracteres`);
            };

            if(userData.telefono && !UserValidators.isValidPhone(userData.telefono)){
                throw new Error('Teléfono con formato invalido')
            };

            const rol = userData.rol ?? 'usuario';
            if(!['usuario', 'admin'].includes(rol)){
                throw new Error(ERROR_MESSAGES.INVALID_ROL)
            }

            //verificar que el mail sea unico
            const emailExists = await UserValidators.emailExists(userData.email);
            if(emailExists){
                throw new Error(ERROR_MESSAGES.EMAIL_ALREADY_EXISTS)
            };

            //crear usuario
            const userToCreate = {
                ...userData,
                rol,
                activo: userData.activo ?? true

            };
            const user = await User.create(userToCreate);
            return UserFormatter.formatUserResponse(user);
        } catch (error) {
            throw ServiceHelpers.handleServiceError(error, 'UserService.createUser');
        }
    }

    async updateUser(id:number, updateData:any):Promise<any>{
        try{
            const user = await User.findByPk(id);
            if(!user){
                throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
            }

            //eliminar campos no actualizables
            const sanitizedData = UserValidators.sanitizeUserInput(updateData);

            if(sanitizedData.email && sanitizedData.email !== user.email){
                if(!UserValidators.isValidEmail(sanitizedData.email)){
                    throw new Error(ERROR_MESSAGES.WRONG_FORMAT_EMAIL);
                }
            }

            const emailExists = await UserValidators.emailExists(sanitizedData.email, id);

            if(emailExists){
                throw new Error(ERROR_MESSAGES.EMAIL_ALREADY_EXISTS);
            }

            if(sanitizedData.telefono && !UserValidators.isValidPhone(sanitizedData.telefono)){
                throw new Error(ERROR_MESSAGES.WRONG_FORMAT_PHONE);
            }

            if(sanitizedData.password && !UserValidators.isValidPassword(sanitizedData.password)){
                throw new Error(`La contrasenia debe tener al menos ${USER_CONSTANTS.PASSWORD_MIN_LENGTH} caracteres`);
            }

            if(sanitizedData.rol){
                if(!['usuario', 'admin'].includes(sanitizedData.rol)){
                    throw new Error(ERROR_MESSAGES.INVALID_ROL);
                }
            }

            await user.update(sanitizedData);
            return UserFormatter.formatUserResponse(user);
        }catch(error){
            throw ServiceHelpers.handleServiceError(error, 'UserService.updateUser');

        }
    }


}
