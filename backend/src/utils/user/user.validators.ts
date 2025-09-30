export const UserValidators = {
    isValidEmail: (email:string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    isValidPassword: (password:string):boolean => {
        return password.length >= 6;
    },

    isValidPhone: (phone: string): boolean => {
        const phoneRegex = /^[+]?[\d\s\-()]{10,}$/;
        return phoneRegex.test(phone)
    },

    sanitizeUserInput: (userData: any): any => {
        const sanitized = {...userData};
        //elimina campos que no tendrian que ser actualizables
        delete sanitized.id;
        delete sanitized.fecha_creacion;
        delete sanitized.fecha_ultimo_acceso;
        return sanitized
    }
}