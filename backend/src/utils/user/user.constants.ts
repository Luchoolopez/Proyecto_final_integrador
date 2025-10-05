export const USER_CONSTANTS = {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100,
    PASSWORD_MIN_LENGTH: 6
} as const;

export const ERROR_MESSAGES = {
    USER_NOT_FOUND: 'Usuario no encontrado',
    EMAIL_ALREADY_EXISTS: 'El email ya está registrado',
    WRONG_FORMAT_EMAIL: 'Email con formato invalido',
    WRONG_FORMAT_PHONE: 'Telefono con formato invalido',
    WRONG_FORMAT_PASSWORD: 'Contraseña con formato invalido',
    INVALID_ROL: 'Rol invalido',
    INVALID_CREDENTIALS: 'Credenciales inválidas',
    INVALID_PASSWORD: 'Contraseña invalida',
    UNAUTHORIZED: 'No autorizado'
} as const;