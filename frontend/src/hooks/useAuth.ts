import { useState } from "react";
import { AxiosError } from "axios"; 
import { useNavigate } from "react-router-dom";

import type { LoginData, RegisterData, User, AuthData } from "../types/user"; 
import { authService } from "../api/authService";

interface ApiError {
    message: string;
}

export const useAuth = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const login = async (values: LoginData): Promise<User> => {
        setLoading(true);
        setError(null);

        try {
            const authData: AuthData = await authService.login(values);
            const {user, accessToken, refreshToken} = authData;

            if(!user || !accessToken){
                throw new Error("Respuesta de API invalida, fatlan 'user' o 'accessToken' dentro de 'Data'")
            }

            localStorage.setItem("accessToken",accessToken);
            localStorage.setItem("refreshToken", refreshToken);
            localStorage.setItem("user", JSON.stringify(user));

            return user;

        } catch (err) {
            const axiosError = err as AxiosError<ApiError>;
            const errorMessage = axiosError.response?.data?.message || (err as Error).message ||"Error en el login. Inténtalo de nuevo.";
            setError(errorMessage);

            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("user");

            throw new Error(errorMessage)
        } finally {
            setLoading(false);
        }
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
            navigate("/login");

        } catch (err) {
            const axiosError = err as AxiosError<ApiError>;
            const errorMessage = axiosError.response?.data?.message || "Error en el registro. Inténtalo de nuevo.";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        // setUser(null); // Limpia el estado global
        navigate("/login", { replace: true });
    };


    return {
        login,
        register,
        logout, 
        loading,
        error,
    };
};