import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth"; // Tu hook de autenticación
import { Link } from "react-router-dom";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";

export const Register = () => {
    const [values, setValues] = useState({
        nombre: "",
        email: "",
        password: "",
        role: "user",
    });

    // Descomenta la siguiente línea y elimina la de abajo cuando integres tu hook real
    // const { register, loading, error } = useAuth();
    const { register, loading, error } = { register: async () => {}, loading: false, error: null }; // Mock para ejemplo

    const handleChanges = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        //await register(values);
    };

    return (
        <Container className="my-5">
            <Row className="justify-content-md-center">
                <Col md={6} lg={5}>
                    <h2 className="text-center mb-4 fw-bold">Crear cuenta</h2>
                    
                    {error && <Alert variant="danger">{error}</Alert>}

                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="registerName">
                            <Form.Label>NOMBRE</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Tu nombre completo"
                                name="nombre"
                                onChange={handleChanges}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="registerEmail">
                            <Form.Label>EMAIL</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="ejemplo@correo.com"
                                name="email"
                                onChange={handleChanges}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="registerPassword">
                            <Form.Label>CONTRASEÑA</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Mínimo 6 caracteres"
                                name="password"
                                onChange={handleChanges}
                                minLength={4}
                                required
                            />
                        </Form.Group>

                        <Button variant="dark" type="submit" className="w-100 mt-2" disabled={loading}>
                            {loading ? "Cargando..." : "CREAR CUENTA"}
                        </Button>
                    </Form>
                    
                    <p className="text-center mt-3">
                        ¿Ya tenés cuenta? <Link to="/login" className="form-link fw-bold">Iniciar sesión</Link>
                    </p>
                </Col>
            </Row>
        </Container>
    );
};

export default Register;