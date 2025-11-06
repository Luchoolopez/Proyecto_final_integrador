import { useState } from "react";
import { AxiosError } from "axios"; 
import { useNavigate } from "react-router-dom";

import type { LoginData, RegisterData } from "../types/user"; 
import { authService } from "../api/authService";

interface ApiError {
    message: string;
}

export const useAuth = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const login = async (values: LoginData) => {
        setLoading(true);
        setError(null);

        try {
            const data = await authService.login(values)

            localStorage.setItem("accessToken", data.accessToken);
            localStorage.setItem("refreshToken", data.refreshToken);
            localStorage.setItem("user", JSON.stringify(data.user));

            navigate("/", { replace: true });

        } catch (err) {
            const axiosError = err as AxiosError<ApiError>;
            const errorMessage = axiosError.response?.data?.message || "Error en el login. Inténtalo de nuevo.";
            setError(errorMessage);
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