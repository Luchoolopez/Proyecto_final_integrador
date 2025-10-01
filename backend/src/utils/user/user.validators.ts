import { Op } from "sequelize";
import { User } from "../../models/user.model";

export const UserValidators = {
    isValidEmail: (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    isValidPassword: (password: string): boolean => {
        return password.length >= 6;
    },

    isValidPhone: (phone: string): boolean => {
        const phoneRegex = /^[+]?[\d\s\-()]{10,}$/;
        return phoneRegex.test(phone)
    },

    sanitizeUserInput: (userData: any): any => {
        const sanitized = { ...userData };
        //elimina campos que no tendrian que ser actualizables
        delete sanitized.id;
        delete sanitized.rol;
        delete sanitized.fecha_creacion;
        delete sanitized.fecha_ultimo_acceso;
        return sanitized
    },

        emailExists: async (email: string, excludeUserId?: number): Promise<boolean> => {
        try {
            const whereClause: any = { email };
            
            if (excludeUserId) {
                whereClause.id = { [Op.ne]: excludeUserId };
            }

            const count = await User.count({ where: whereClause });
            return count > 0;
        } catch (error) {
            throw new Error(`Error al verificar email: ${error}`);
        }
    }
};

