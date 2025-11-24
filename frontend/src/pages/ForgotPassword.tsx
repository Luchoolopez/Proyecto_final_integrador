import React, { useState } from 'react';
import { Button, Form, Alert, Container, Row, Col, Breadcrumb } from 'react-bootstrap'; // Agregué Breadcrumb
import { Link } from 'react-router-dom';
import { authService } from '../api/authService';

export const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState<{ type: 'success' | 'danger', text: string } | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            await authService.forgotPassword(email);
            setMessage({ 
                type: 'success', 
                text: 'Si el correo existe, recibirás un enlace para recuperar tu cuenta. Revisa tu bandeja de entrada o spam.' 
            });
            setEmail(''); 
        } catch (error) {
            setMessage({ type: 'danger', text: 'Ocurrió un error al procesar la solicitud.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="py-5" style={{ minHeight: '80vh' }}>
            <Breadcrumb className="mb-5">
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>Inicio</Breadcrumb.Item>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/login" }}>Login</Breadcrumb.Item>
                <Breadcrumb.Item active>Recuperar Cuenta</Breadcrumb.Item>
            </Breadcrumb>

            <div className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
                <Row className="w-100 justify-content-center">
                    <Col md={6} lg={5} xl={4}>
                        <h2 className="text-center mb-4 fw-bold">
                            Recuperar Cuenta
                        </h2>
                        
                        <p className="text-center text-muted mb-4">
                            Ingresa tu correo electrónico y te enviaremos un enlace para que puedas crear una nueva contraseña.
                        </p>

                        {message && <Alert variant={message.type}>{message.text}</Alert>}

                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-4">
                                <Form.Label className="fw-bold">Email</Form.Label>
                                <Form.Control 
                                    type="email" 
                                    placeholder="ejemplo@correo.com" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </Form.Group>

                            <Button 
                                type="submit" 
                                className="w-100 fw-bold py-2 mb-3" 
                                variant="dark"
                                disabled={loading}
                            >
                                {loading ? 'Enviando...' : 'ENVIAR ENLACE'}
                            </Button>
                            
                            <div className="text-center">
                                <Link to="/login" className="text-decoration-none text-secondary">
                                    Volver al inicio de sesión
                                </Link>
                            </div>
                        </Form>
                    </Col>
                </Row>
            </div>
        </Container>
    );
};