import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { useSubscription } from '../../hooks/useSubscription'; 

interface Props {
    show: boolean;
    handleClose: () => void;
}

export const SubscribeModal: React.FC<Props> = ({ show, handleClose }) => {
    const [email, setEmail] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    
    // Usamos el hook
    const { subscribe, loading, error, setError } = useSubscription();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const result = await subscribe(email);

        if (result.success) {
            setSuccessMsg('¡Te suscribiste con éxito! Gracias.');
            setEmail('');
            setTimeout(() => {
                handleClose();
                setSuccessMsg(''); 
            }, 2000);
        }
    };

    const handleHide = () => {
        setError(null);
        setSuccessMsg('');
        handleClose();
    }

    return (
        <Modal show={show} onHide={handleHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Suscribite a novedades</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Ingresa tu email para recibir ofertas exclusivas.</p>

                {error && <Alert variant="danger">{error}</Alert>}
                {successMsg && <Alert variant="success">{successMsg}</Alert>}

                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Control
                            type="email"
                            placeholder="tu@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </Form.Group>
                    <div className="d-grid">
                        <Button variant="dark" type="submit" disabled={loading}>
                            {loading ? 'Suscribiendo...' : 'Suscribirme'}
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};