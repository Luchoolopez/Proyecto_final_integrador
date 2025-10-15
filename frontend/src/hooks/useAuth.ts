import { useState } from "react";
import axios, { AxiosError } from "axios"; // Importa AxiosError
import { useNavigate } from "react-router-dom";

import type { LoginData, RegisterData, AuthResponse } from "../types/user"; 

interface ApiError {
    message: string;
}

const API_URL = "http://localhost:3000/api/auth";

export const useAuth = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    // Aquí podrías obtener la función para actualizar el usuario de tu AuthContext
    // const { setUser } = useAuthContext(); 

    const login = async (values: LoginData) => {
        setLoading(true);
        setError(null);

        try {
            const { data } = await axios.post<AuthResponse>(`${API_URL}/login`, values);

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
            await axios.post(`${API_URL}/register`, values);
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