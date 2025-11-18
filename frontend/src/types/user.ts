export interface ApiResponse<T>{
    success:boolean;
    message?:string;
    data:T;
}

export type UserRole = 'user' | 'admin';

export interface User {
    id: number;
    nombre: string;
    email: string;
    rol: UserRole;
    telefono?: string | null;
    activo:boolean;
    fecha_creacion: string;
    fecha_ultimo_acceso: string;
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
