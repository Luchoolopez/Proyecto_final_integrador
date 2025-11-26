import bcrypt from 'bcrypt';

export class ServiceHelpers {
    //permite facilitar el manejo de errores
    static handleServiceError(error: unknown, serviceName: string): never {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error(`Error desconocido: ${error}`);
    }

    //divide los user en db en paginas
    static buildPagination(page: number, limit: number) {
        const offSet = (page - 1) * limit;
        return { limit, offSet };
    }


    //manda datos del user menos datos sensibles
    static excludeUserSensitiveFields(user:any):any {
        const {password, ...userWithoutPassword} = user;
        return userWithoutPassword
    }

    static comparePassword(plain:string, hash:string):Promise<boolean> {
        return bcrypt.compare(plain, hash);
    }

    static hashPassword(plain:string):Promise<string>{
        const saltRounds = 10;
        return bcrypt.hash(plain, saltRounds);
    };
}