import { useState } from "react";
import { AxiosError } from "axios"; 
import { useNavigate } from "react-router-dom";
import type { LoginData, RegisterData, User, AuthData } from "../types/user"; 
import { authService } from "../api/authService";

interface ApiError { message: string; }

export const useAuth = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    // Función interna para centralizar el guardado de sesión
    const saveSession = (authData: AuthData) => {
        const {user, accessToken, refreshToken} = authData;
        if(!user || !accessToken) throw new Error("Respuesta de API inválida");
        
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("user", JSON.stringify(user));
        return user;
    };

    const login = async (values: LoginData): Promise<User> => {
        setLoading(true);
        setError(null);

        try {
            const authData = await authService.login(values);
            return saveSession(authData);
        } catch (err) {
            const errorMessage = (err as AxiosError<ApiError>).response?.data?.message || "Error en el login.";
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally { setLoading(false); }
    };

    // NUEVO: Hook para manejar la respuesta de Google
    const loginWithGoogle = async (idToken: string): Promise<User> => {
        setLoading(true);
        setError(null);
        try {
            const authData = await authService.googleLogin(idToken);
            return saveSession(authData);
        } catch (err) {
            const errorMessage = (err as AxiosError<ApiError>).response?.data?.message || "Error con Google.";
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally { setLoading(false); }
    };

    const register = async (values: RegisterData) => {
        setLoading(true);
        setError(null);

        if (values.password.length < 6) {
            setError("La contraseña debe tener al menos 6 caracteres");
            setLoading(false);
            return;
        }

        try {
            await authService.register(values);
            navigate("/login", { state: { successMessage: "¡Registrado correctamente!" } });
        } catch (err) {
            setError((err as AxiosError<ApiError>).response?.data?.message || "Error en el registro. Inténtalo de nuevo.");
        } finally { setLoading(false); }
    };

    const logout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        navigate("/login", { replace: true });
    };

    return { login, loginWithGoogle, register, logout, loading, error };
};