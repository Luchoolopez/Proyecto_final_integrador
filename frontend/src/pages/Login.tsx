import React, { useState, useEffect } from "react";
import { useAuthContext } from '../context/AuthContext';
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeSlash } from "react-bootstrap-icons";
import { Container, Row, Col, Form, Button, Breadcrumb, InputGroup, Alert } from "react-bootstrap";
import type { LoginData, User } from "../types/user";
import { GoogleLogin } from '@react-oauth/google';

export const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const { login, loginWithGoogle, loading, error } = useAuthContext();
    const navigate = useNavigate();
    const location = useLocation();
    
    const [successMessage, setSuccessMessage] = useState(location.state?.successMessage);

    useEffect(() => {
        if (location.state?.successMessage) {
            window.history.replaceState(null, '');
        }

        const timer = setTimeout(() => {
            setSuccessMessage(null);
        }, 7000);

        return () => clearTimeout(timer); 
    }, [location.state]); 

    // Función para manejar la redirección según el rol
    const handleNavigation = (user: User) => {
        if (user.rol === 'admin') {
            navigate('/admin/productos');
        } else {
            navigate('/');
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const values: LoginData = { email, password };
        try {
            const user = await login(values) as User | void;
            if (user) handleNavigation(user);
        } catch (error) {
            console.error("Error al iniciar sesión", error);
        }
    };

    // Manejador para el éxito de Google
    const handleGoogleSuccess = async (credentialResponse: any) => {
        if (credentialResponse.credential) {
            try {
                const user = await loginWithGoogle(credentialResponse.credential) as User | void;
                if (user) handleNavigation(user);
            } catch (error) {
                console.error("Error al iniciar sesión con Google", error);
            }
        }
    };

    return (
        <Container className="my-5">
            <Row>
                <Col>
                    <Breadcrumb>
                        <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>Inicio</Breadcrumb.Item>
                        <Breadcrumb.Item active>Login</Breadcrumb.Item>
                    </Breadcrumb>
                </Col>
            </Row>

            <Row className="justify-content-md-center">
                <Col md={6} lg={5}>
                    {successMessage && (
                        <Alert 
                            variant="success" 
                            onClose={() => setSuccessMessage(null)} 
                            dismissible
                        >
                            {successMessage}
                        </Alert>
                    )}

                    <h2 className="text-center mb-4 fw-bold">Iniciar sesión</h2>

                    {error && <Alert variant="danger">{error}</Alert>}

                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="loginEmail">
                            <Form.Label>EMAIL</Form.Label>
                            <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </Form.Group>

                        <Form.Group className="mb-2" controlId="loginPassword">
                            <Form.Label>CONTRASEÑA</Form.Label>
                            <InputGroup>
                                <Form.Control type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required />
                                <Button variant="outline-secondary" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <EyeSlash /> : <Eye />}
                                </Button>
                            </InputGroup>
                        </Form.Group>

                        <div className="text-end mb-3">
                            <Link to="/forgot-password" className="form-link">¿Olvidaste tu contraseña?</Link>
                        </div>

                        <Button variant="dark" type="submit" className="w-100 border" disabled={loading}>
                            {loading ? "Cargando..." : "INICIAR SESIÓN"}
                        </Button>
                    </Form>

                    {/* Botón de Google integrado debajo del formulario */}
                    <div className="d-flex justify-content-center mt-4">
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={() => console.log('Login con Google falló')}
                            useOneTap
                            theme="filled_blue"
                            shape="pill"
                            text="signin_with"
                        />
                    </div>

                    <p className="text-center mt-3">
                        ¿No tenés cuenta aún? <Link to="/register" className="form-link fw-bold">Crear cuenta</Link>
                    </p>
                </Col>
            </Row>
        </Container>
    );
};

export default Login;