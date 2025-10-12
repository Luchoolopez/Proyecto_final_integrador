import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { FaUser, FaLock } from "react-icons/fa";
import "../../styles/Login/Login.css";

export const Login = () => {
    const [values, setValues] = useState({
        email: "",
        password: "",
    });

    const { login, loading, error } = useAuth();

    const handleChanges = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValues({
            ...values,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await login(values);
    };

    return (
        <div className="login-page-body">
            <div className="login-container">
                <div className="login-form">
                    <h2>Iniciar Sesión</h2>
                    {error && <div className="error-message">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <FaUser className="input-icon" />
                            <input
                                type="email"
                                placeholder="Correo electrónico"
                                name="email"
                                value={values.email}
                                onChange={handleChanges}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <FaLock className="input-icon" />
                            <input
                                type="password"
                                placeholder="Contraseña"
                                name="password"
                                value={values.password}
                                onChange={handleChanges}
                                required
                            />
                        </div>

                        <button type="submit" disabled={loading}>
                            {loading ? "Cargando..." : "Iniciar Sesión"}
                        </button>
                    </form>

                    <div className="divider">
                        <span></span>
                    </div>

                    {/* <GoogleAuthButton isLogin={true} /> */}

                    <div className="form-footer">
                        <span>¿No tienes una cuenta?</span>
                        <a href="/register">Regístrate</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
