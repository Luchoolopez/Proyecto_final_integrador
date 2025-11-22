import React, { useState } from 'react';
import { Modal, Button, Form, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { useCartContext } from '../../context/CartContext';
import { orderService } from '../../api/orderService';
import apiClient from '../../api/apiClient';
import { ToastNotification } from '../../components/ToastNotification';

interface CheckoutModalProps {
    show: boolean;
    handleClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ show, handleClose }) => {
    const { cartItems, total, clearCart } = useCartContext();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    // Estado Toast
    const [toast, setToast] = useState({
        show: false,
        message: '',
        variant: 'success' as 'success' | 'error'
    });
    
    const [formData, setFormData] = useState({
        calle: '',
        numero: '',
        ciudad: '',
        provincia: 'Buenos Aires',
        cp: '',
        telefono: '',
        notas: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Paso 1: Crear la dirección
            const addressResponse = await apiClient.post('/address', {
                calle: formData.calle,
                numero: formData.numero,
                ciudad: formData.ciudad,
                provincia: formData.provincia,
                codigo_postal: formData.cp,
                pais: 'Argentina',
                es_principal: false
            });

            const direccion_id = addressResponse.data.data.id;

            // Paso 2: Crear la orden
            const orderPayload = {
                direccion_id,
                notas: formData.notas || `Contacto: ${formData.telefono}`,
                shipping_provider: 'correo_argentino',
                shipping_service: 'estandar'
            };

            await orderService.createOrder(orderPayload);

            // Éxito - Mostrar toast
            setToast({
                show: true,
                message: '¡Compra realizada con éxito! Tu pedido ha sido registrado.',
                variant: 'success'
            });
            
            // Esperar un momento para que se vea el toast
            setTimeout(() => {
                clearCart();
                handleClose();
                // Resetear formulario
                setFormData({
                    calle: '',
                    numero: '',
                    ciudad: '',
                    provincia: 'Buenos Aires',
                    cp: '',
                    telefono: '',
                    notas: ''
                });
            }, 2000);

        } catch (err: any) {
            console.error(err);
            const errorMsg = err.response?.data?.message 
                || err.response?.data?.error
                || 'Error al procesar la compra. Intenta nuevamente.';
            setError(errorMsg);
            
            setToast({
                show: true,
                message: errorMsg,
                variant: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Modal show={show} onHide={handleClose} centered backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title>Finalizar Compra</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        {error && <Alert variant="danger">{error}</Alert>}
                        
                        <p className="text-muted small mb-3">
                            Ingresa los datos de envío para completar tu pedido.
                        </p>

                        <Row className="mb-3">
                            <Col md={8}>
                                <Form.Group>
                                    <Form.Label>Calle</Form.Label>
                                    <Form.Control 
                                        required 
                                        name="calle"
                                        value={formData.calle}
                                        onChange={handleChange}
                                        placeholder="Ej: Av. Siempreviva"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label>Número</Form.Label>
                                    <Form.Control 
                                        required 
                                        name="numero"
                                        value={formData.numero}
                                        onChange={handleChange}
                                        placeholder="123"
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Ciudad</Form.Label>
                                    <Form.Control 
                                        required 
                                        name="ciudad"
                                        value={formData.ciudad}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Código Postal</Form.Label>
                                    <Form.Control 
                                        required 
                                        name="cp"
                                        value={formData.cp}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-3">
                            <Form.Label>Provincia</Form.Label>
                            <Form.Control 
                                required 
                                name="provincia"
                                value={formData.provincia}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Teléfono de Contacto</Form.Label>
                            <Form.Control 
                                required 
                                name="telefono"
                                value={formData.telefono}
                                onChange={handleChange}
                                placeholder="Ej: 11 1234 5678"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Notas adicionales (opcional)</Form.Label>
                            <Form.Control 
                                as="textarea"
                                rows={2}
                                name="notas"
                                value={formData.notas}
                                onChange={handleChange}
                                placeholder="Ej: Timbre roto, tocar puerta"
                            />
                        </Form.Group>

                        <div className="d-flex justify-content-between align-items-center border-top pt-3 mt-3">
                            <span className="fw-bold">Total a Pagar:</span>
                            <span className="fs-4 text-primary fw-bold">
                                {new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(total)}
                            </span>
                        </div>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose} disabled={loading}>
                            Cancelar
                        </Button>
                        <Button variant="success" type="submit" disabled={loading}>
                            {loading ? <Spinner size="sm" animation="border" /> : 'Confirmar Pedido'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            {/* Toast de Notificaciones */}
            <ToastNotification
                show={toast.show}
                onClose={() => setToast({ ...toast, show: false })}
                message={toast.message}
                variant={toast.variant}
            />
        </>
    );
};