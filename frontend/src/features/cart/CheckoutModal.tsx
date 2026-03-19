import React, { useState } from 'react';
import { Modal, Button, Form, Row, Col, Spinner, Alert, ButtonGroup } from 'react-bootstrap';
import { useCartContext } from '../../context/CartContext';
import { orderService } from '../../api/orderService';
import apiClient from '../../api/apiClient';
import { ToastNotification } from '../../components/ToastNotification';

interface CheckoutModalProps {
    show: boolean;
    handleClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ show, handleClose }) => {
    const { total, clearCart } = useCartContext();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    // NUEVO ESTADO: Controla si es envío o retiro local
    const [metodoEnvio, setMetodoEnvio] = useState<'envio' | 'local'>('envio');
    
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
            let direccion_id = undefined;

            // Paso 1: Crear la dirección SOLO si eligió envío a domicilio
            if (metodoEnvio === 'envio') {
                const addressResponse = await apiClient.post('/address', {
                    calle: formData.calle,
                    numero: formData.numero,
                    ciudad: formData.ciudad,
                    provincia: formData.provincia,
                    codigo_postal: formData.cp,
                    pais: 'Argentina',
                    es_principal: false
                });
                direccion_id = addressResponse.data.data.id;
            }

            // Paso 2: Crear la orden
            const orderPayload = {
                direccion_id, // Va a ser undefined si es local
                notas: formData.notas || `Contacto: ${formData.telefono}`,
                // Cambiamos el proveedor según lo que eligió
                shipping_provider: metodoEnvio === 'envio' ? 'correo_argentino' : 'retiro_local',
                shipping_service: metodoEnvio === 'envio' ? 'estandar' : 'sucursal'
            };

            await orderService.createOrder(orderPayload);

            setToast({
                show: true,
                message: '¡Compra realizada con éxito! Tu pedido ha sido registrado.',
                variant: 'success'
            });
            
            setTimeout(() => {
                clearCart();
                handleClose();
                setFormData({
                    calle: '', numero: '', ciudad: '', provincia: 'Buenos Aires', cp: '', telefono: '', notas: ''
                });
            }, 2000);

        } catch (err: any) {
            console.error(err);
            const errorMsg = err.response?.data?.message || 'Error al procesar la compra. Intenta nuevamente.';
            setError(errorMsg);
            setToast({ show: true, message: errorMsg, variant: 'error' });
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
                        
                        {/* SELECTOR DE MÉTODO DE ENTREGA */}
                        <div className="mb-4 text-center">
                            <Form.Label className="fw-bold d-block mb-2">¿Cómo querés recibir tu pedido?</Form.Label>
                            <ButtonGroup className="w-100">
                                <Button 
                                    variant={metodoEnvio === 'envio' ? 'primary' : 'outline-primary'}
                                    onClick={() => setMetodoEnvio('envio')}
                                >
                                    Envío a Domicilio
                                </Button>
                                <Button 
                                    variant={metodoEnvio === 'local' ? 'primary' : 'outline-primary'}
                                    onClick={() => setMetodoEnvio('local')}
                                >
                                    Retiro en Local
                                </Button>
                            </ButtonGroup>
                        </div>

                        {/* MENSAJE RETIRO LOCAL */}
                        {metodoEnvio === 'local' && (
                            <Alert variant="info" className="text-center">
                                📍 <strong>Retiro por sucursal</strong><br/>
                                Te avisaremos por email cuando tu pedido esté listo para retirar en nuestro local.
                            </Alert>
                        )}

                        {/* FORMULARIO DE DIRECCIÓN (Se oculta si elige Local) */}
                        {metodoEnvio === 'envio' && (
                            <div className="border p-3 rounded mb-3 bg-body-secondary">
                                <h6 className="mb-3 border-bottom pb-2">Datos de Envío</h6>
                                <Row className="mb-3">
                                    <Col md={8}>
                                        <Form.Group>
                                            <Form.Label>Calle</Form.Label>
                                            <Form.Control required name="calle" value={formData.calle} onChange={handleChange} />
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group>
                                            <Form.Label>Número</Form.Label>
                                            <Form.Control required name="numero" value={formData.numero} onChange={handleChange} />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row className="mb-3">
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>Ciudad</Form.Label>
                                            <Form.Control required name="ciudad" value={formData.ciudad} onChange={handleChange} />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>Código Postal</Form.Label>
                                            <Form.Control required name="cp" value={formData.cp} onChange={handleChange} />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Form.Group className="mb-3">
                                    <Form.Label>Provincia</Form.Label>
                                    <Form.Control required name="provincia" value={formData.provincia} onChange={handleChange} />
                                </Form.Group>
                            </div>
                        )}

                        {/* DATOS DE CONTACTO (Siempre visibles) */}
                        <Form.Group className="mb-3">
                            <Form.Label>Teléfono de Contacto</Form.Label>
                            <Form.Control required name="telefono" value={formData.telefono} onChange={handleChange} placeholder="Ej: 11 1234 5678" />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Notas adicionales (opcional)</Form.Label>
                            <Form.Control as="textarea" rows={2} name="notas" value={formData.notas} onChange={handleChange} placeholder="Ej: Timbre roto, tocar puerta" />
                        </Form.Group>

                        <div className="d-flex justify-content-between align-items-center border-top pt-3 mt-3">
                            <span className="fw-bold">Total a Pagar:</span>
                            <span className="fs-4 text-primary fw-bold">
                                {new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(total)}
                            </span>
                        </div>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose} disabled={loading}>Cancelar</Button>
                        <Button variant="success" type="submit" disabled={loading}>
                            {loading ? <Spinner size="sm" animation="border" /> : 'Confirmar Pedido'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            <ToastNotification show={toast.show} onClose={() => setToast({ ...toast, show: false })} message={toast.message} variant={toast.variant} />
        </>
    );
};