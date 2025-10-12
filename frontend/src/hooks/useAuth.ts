import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface LoginValues {
    email: string;
    password: string;
}

interface RegisterValues {
    nombre: string;
    email: string;
    password: string;
    role?: string;
}

export const useAuth = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>("");
    const navigate = useNavigate();

    // LOGIN
    const login = async (values: LoginValues) => {
        setLoading(true);
        setError("");

        try {
            const response = await axios.post("http://localhost:3000/api/auth/login", values);

            if (response.data && response.data.token) {
                localStorage.setItem("token", response.data.token);

                if (response.data.user) {
                    localStorage.setItem("user", JSON.stringify(response.data.user));
                }

                navigate("/", { replace: true });
                window.location.reload();
            } else {
                setError("Credenciales incorrectas");
            }
        } catch {
            setError("Error en la autenticación. Por favor, inténtalo de nuevo.");
        } finally {
            setLoading(false);
        }
    };

    // REGISTER
    const register = async (values: RegisterValues) => {
        setLoading(true);
        setError("");

        if (values.password.length < 4) {
            setError("La contraseña debe tener al menos 4 caracteres");
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post("http://localhost:3000/api/auth/register", {
                ...values,
                tempPassword: false,
            });

            if (response.status === 201) {
                navigate("/login");
            }
        } catch {
            setError("Error en el registro. Por favor, inténtalo de nuevo.");
        } finally {
            setLoading(false);
        }
    };

    return {
        login,
        register,
        loading,
        error,
    };
};
