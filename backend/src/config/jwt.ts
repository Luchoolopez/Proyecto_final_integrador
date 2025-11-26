import dotenv from 'dotenv';

dotenv.config();

if (!process.env.JWT_SECRET || !process.env.JWT_REFRESH_SECRET) {
    throw new Error('ERROR: Las claves secretas de JWT no están definidas en el archivo .env');
}

interface JwtConfig {
    secret: string;
    expiresIn: string;
    refreshSecret: string;
    refreshExpiresIn: string;
}

const jwtConfig: JwtConfig = {
    secret: process.env.JWT_SECRET!, 
    expiresIn: process.env.JWT_EXPIRES_IN || '4h',
    refreshSecret: process.env.JWT_REFRESH_SECRET!,
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
};

export default jwtConfig;