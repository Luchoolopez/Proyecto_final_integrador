import React, { useState } from "react";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { useAuth } from "../../hooks/useAuth";
import "../../styles/Login/Login.css";

export const Register = () => {
    const [values, setValues] = useState({
        nombre: "",
        email: "",
        password: "",
        role: "user",
    });

    const { register, loading, error } = useAuth();

    const handleChanges = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await register(values);
    };

    return (
        <div className="login-page-body">
            <div className="login-container">
                <div className="login-form">
                    <h2>Registrarse</h2>
                    {error && <div className="error-message">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <input
                                type="text"
                                placeholder="Nombre"
                                name="nombre"
                                onChange={handleChanges}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <FaEnvelope className="input-icon" />
                            <input
                                type="email"
                                placeholder="Correo electrónico"
                                name="email"
                                onChange={handleChanges}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <FaLock className="input-icon" />
                            <input
                                type="password"
                                placeholder="Contraseña (mínimo 4 caracteres)"
                                name="password"
                                onChange={handleChanges}
                                minLength={4}
                                required
                            />
                        </div>

                        <button type="submit" disabled={loading}>
                            {loading ? "Cargando..." : "Registrarse"}
                        </button>
                    </form>

                    <div className="divider">
                        <span></span>
                    </div>

                    {/* <GoogleAuthButton isLogin={false} /> */}

                    <div className="form-footer">
                        <span>¿Ya tienes una cuenta?</span>
                        <a href="/iniciar-sesion">Inicia Sesión</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
