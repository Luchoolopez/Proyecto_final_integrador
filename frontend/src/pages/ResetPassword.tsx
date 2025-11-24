import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Form, Alert, Container, Row, Col } from 'react-bootstrap';
import { authService } from '../api/authService';

export const ResetPassword = () => {
    const { token } = useParams(); 
    const navigate = useNavigate();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState<{ type: 'success' | 'danger', text: string } | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            setMessage({ type: 'danger', text: 'Las contraseñas no coinciden.' });
            return;
        }

        if (!token) {
            setMessage({ type: 'danger', text: 'Token no válido o faltante.' });
            return;
        }

        setLoading(true);
        setMessage(null);

        try {
            await authService.resetpassword(token, password);
            setMessage({ type: 'success', text: '¡Contraseña actualizada! Redirigiendo al login...' });
            
            setTimeout(() => {
                navigate('/login');
            }, 3000);

        } catch (error: any) {
            const errorMsg = error.response?.data?.message || 'Hubo un error al cambiar la contraseña.';
            setMessage({ type: 'danger', text: errorMsg });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="py-5" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center' }}>
            <Row className="w-100 justify-content-center">
                <Col md={6} lg={5}>
                    <h2 className="text-center fw-bold mb-4">
                        Restablecer Contraseña
                    </h2>
                    
                    {message && <Alert variant={message.type}>{message.text}</Alert>}

                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">Nueva Contraseña</Form.Label>
                            <Form.Control 
                                type="password" 
                                placeholder="Ingresa tu nueva clave" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                            />
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Label className="fw-bold">Repetir Nueva Contraseña</Form.Label>
                            <Form.Control 
                                type="password" 
                                placeholder="Repite la clave" 
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                minLength={6}
                            />
                        </Form.Group>

                        <Button 
                            type="submit" 
                            className="w-100 fw-bold py-2" 
                            variant="dark"
                            disabled={loading}
                        >
                            {loading ? 'Guardando...' : 'CAMBIAR CONTRASEÑA'}
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};