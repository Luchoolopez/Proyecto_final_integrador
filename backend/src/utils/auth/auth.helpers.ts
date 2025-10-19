import bcrypt from 'bcrypt';

export class AuthHelpers {
    static async hashPassword(password: string): Promise<string> {
        const saltRounds = 10;
        return bcrypt.hash(password, saltRounds);
    }

    static async comparePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
        return bcrypt.compare(plainPassword, hashedPassword);
    }

    static extractTokenFromHeader(authHeader: string | undefined): string | null {
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return null;
        }
        return authHeader.substring(7);
    }

    static sanitizeUserForResponse(user: any) {
        const userData = user.toJSON ? user.toJSON() : user;
        const { password, ...userWithoutPassword } = userData;
        return userWithoutPassword;
    }
}