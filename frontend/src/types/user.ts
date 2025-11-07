export type UserRole = 'user' | 'admin';

export interface User {
    id: number;
    nombre: string;
    email: string;
    rol: UserRole;
    telefono?: string | null; 
    createdAt: string;       
    updatedAt: string;
}

export interface LoginData {
    email: string;
    password: string; 
}

export interface RegisterData extends LoginData {
    nombre: string;
    telefono?: string; 
}

export interface AuthData {
    accessToken: string;
    refreshToken: string;
    user: User;
}

export interface AuthResponse{
    success: boolean;
    message: string;
    data: AuthData;
}