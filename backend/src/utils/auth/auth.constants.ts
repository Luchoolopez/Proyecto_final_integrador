export const AUTH_CONSTANTS = {
    TOKEN_PREFIX: 'Bearer',
    TOKEN_EXPIRATION: '1h',
    REFRESH_TOKEN_EXPIRATION: '7d',
    MAX_LOGIN_ATTEMPTS: 5,
    LOCKOUT_TIME: 15 * 60 * 1000, // 15 minutos
} as const;

export const AUTH_ERROR_MESSAGES = {
    INVALID_CREDENTIALS: 'Credenciales inválidas',
    USER_NOT_FOUND: 'Usuario no encontrado',
    EMAIL_ALREADY_EXISTS: 'El email ya está registrado',
    ACCOUNT_LOCKED: 'Cuenta bloqueada por múltiples intentos fallidos',
    TOKEN_EXPIRED: 'Token expirado',
    TOKEN_INVALID: 'Token inválido',
    UNAUTHORIZED: 'No autorizado',
    MISSING_TOKEN: 'Token no proporcionado',
    ACCOUNT_INACTIVE: 'Cuenta inactiva',
} as const;