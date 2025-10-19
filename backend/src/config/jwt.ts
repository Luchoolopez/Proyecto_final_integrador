import dotenv from 'dotenv';

dotenv.config();

interface JwtConfig {
    secret: string;
    expiresIn: string;
    refreshSecret: string;
    refreshExpiresIn: string;
}

const jwtConfig: JwtConfig = {
    secret: process.env.JWT_SECRET || 'tu_secret_super_seguro_cambialo_en_produccion',
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'tu_refresh_secret_super_seguro',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
};

export default jwtConfig;