import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth"; // Tu hook de autenticación
import { Link } from "react-router-dom"; // Para la navegación
import { Eye, EyeSlash } from "react-bootstrap-icons"; // Íconos para el campo de contraseña
import { Container, Row, Col, Form, Button, Breadcrumb, InputGroup, Alert } from "react-bootstrap";

export const Login = () => {
    const [values, setValues] = useState({
        email: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);

    // Descomenta la siguiente línea y elimina la de abajo cuando integres tu hook real
    // const { login, loading, error } = useAuth();
    const { login, loading, error } = { login: async () => {}, loading: false, error: null }; // Mock para ejemplo

    const handleChanges = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValues({
            ...values,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        //await login(values);
    };

    return (
        <Container className="my-5">
            <Row>
                <Col>
                    <Breadcrumb>
                        <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>Inicio</Breadcrumb.Item>
                        <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/mi-cuenta" }}>Mi Cuenta</Breadcrumb.Item>
                        <Breadcrumb.Item active>Login</Breadcrumb.Item>
                    </Breadcrumb>
                </Col>
            </Row>

            <Row className="justify-content-md-center">
                <Col md={6} lg={5}>
                    <h2 className="text-center mb-4 fw-bold">Iniciar sesión</h2>
                    
                    {error && <Alert variant="danger">{error}</Alert>}

                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="loginEmail">
                            <Form.Label>EMAIL</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={values.email}
                                onChange={handleChanges}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-2" controlId="loginPassword">
                            <Form.Label>CONTRASEÑA</Form.Label>
                            <InputGroup>
                                <Form.Control
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={values.password}
                                    onChange={handleChanges}
                                    required
                                />
                                <Button variant="outline-secondary" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <EyeSlash /> : <Eye />}
                                </Button>
                            </InputGroup>
                        </Form.Group>

                        <div className="text-end mb-3">
                           <Link to="/recuperar-contrasena" className="form-link">¿Olvidaste tu contraseña?</Link>
                        </div>

                        <Button variant="dark" type="submit" className="w-100" disabled={loading}>
                            {loading ? "Cargando..." : "INICIAR SESIÓN"}
                        </Button>
                    </Form>

                    <p className="text-center mt-3">
                        ¿No tenés cuenta aún? <Link to="/register" className="form-link fw-bold">Crear cuenta</Link>
                    </p>
                </Col>
            </Row>
        </Container>
    );
};

export default Login;