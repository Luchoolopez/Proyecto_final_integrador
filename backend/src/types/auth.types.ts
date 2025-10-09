// Entradas
export interface RegisterDto { nombre: string; email: string; telefono?: string; password: string }
export interface LoginDto { email: string; password: string }
export interface RefreshDto { refreshToken: string }
export interface LogoutDto { refreshToken: string }

// Tokens
export interface TokenPair { accessToken: string; refreshToken: string }
export interface JwtPayload { sub: number; email: string; rol?: string; iat: number; exp: number }
