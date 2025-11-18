import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';

export const AuthPromptModal = () => {
    const { isAuthModalOpen, closeAuthModal } = useAuthContext();
    const navigate = useNavigate();

    const handleLogin = () => {
        closeAuthModal();
        navigate('/login');
    };

    const handleRegister = () => {
        closeAuthModal();
        navigate('/register');
    };

    return (
        <Modal show={isAuthModalOpen} onHide={closeAuthModal} centered>
            <Modal.Header closeButton>
                <Modal.Title>Acceso Requerido</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Para continuar con la compra, necesitas iniciar sesión o crear una cuenta.</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-secondary" onClick={handleRegister}>
                    Crear Cuenta
                </Button>
                <Button variant="dark" onClick={handleLogin}>
                    Iniciar Sesión
                </Button>
            </Modal.Footer>
        </Modal>
    );
};