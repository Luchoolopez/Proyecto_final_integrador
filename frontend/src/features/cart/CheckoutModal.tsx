import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Spinner, Alert, ButtonGroup } from 'react-bootstrap';
import { useCartContext } from '../../context/CartContext';
import { orderService, type CreateOrderPayload } from '../../api/orderService';
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
    
    // Controla si es envío o retiro local
    const [metodoEnvio, setMetodoEnvio] = useState<'envio' | 'local'>('envio');
    
    // ESTADOS PARA PROMOCIONES Y CUPONES
    const [codigoCupon, setCodigoCupon] = useState('');
    const [cuponAplicado, setCuponAplicado] = useState<string | null>(null);
    const [isCalculating, setIsCalculating] = useState(false);
    const [totales, setTotales] = useState({
        subtotal: total,
        descuentoPromociones: 0,
        descuentoCupon: 0,
        totalFinal: total
    });
    
    const [toast, setToast] = useState({
        show: false,
        message: '',
        variant: 'success' as 'success' | 'error'
    });
    
    const [formData, setFormData] = useState({
        calle: '', numero: '', ciudad: '', provincia: 'Buenos Aires', cp: '', telefono: '', notas: ''
    });

    // Cada vez que se abre el modal, consultamos al backend los totales
    // por si hay una promo automática (Ej: Hot Sale) o cambia el carrito
    useEffect(() => {
        if (show) {
            calcularTotales(cuponAplicado || '');
        }
    }, [show, total]);

    // Función que conecta con tu nuevo motor de reglas del backend
    const calcularTotales = async (codigo: string) => {
        try {
            setIsCalculating(true);
            const response = await apiClient.post('/cart/apply-coupon', { codigoCupon: codigo });
            const data = response.data.data;
            
            setTotales({
                subtotal: data.subtotal,
                descuentoPromociones: data.descuentoPromociones,
                descuentoCupon: data.descuentoCupon,
                totalFinal: data.totalFinal
            });
            
            if (codigo && !cuponAplicado) {
                setCuponAplicado(codigo);
                setToast({ show: true, message: '¡Cupón aplicado!', variant: 'success' });
            }
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || 'Error al calcular los totales.';
            setToast({ show: true, message: errorMsg, variant: 'error' });
            if (codigo && !cuponAplicado) {
                setCodigoCupon(''); // Limpiar si falló al intentar aplicarlo
            }
        } finally {
            setIsCalculating(false);
        }
    };

    const handleApplyCoupon = () => {
        if (!codigoCupon.trim()) return;
        calcularTotales(codigoCupon.trim().toUpperCase());
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            let direccion_id = undefined;

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

            const orderPayload: CreateOrderPayload = {
                direccion_id,
                notas: formData.notas || `Contacto: ${formData.telefono}`,
                shipping_provider: metodoEnvio === 'envio' ? 'correo_argentino' : 'retiro_local',
                shipping_service: metodoEnvio === 'envio' ? 'estandar' : 'sucursal',
                codigo_cupon: cuponAplicado || undefined // <-- Enviamos el cupón al backend
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
                setCuponAplicado(null);
                setCodigoCupon('');
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
            <Modal show={show} onHide={handleClose} centered backdrop="static" size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Finalizar Compra</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Row>
                            {/* COLUMNA IZQUIERDA: DATOS DE ENVÍO */}
                            <Col md={7} className="border-end pe-4">
                                {error && <Alert variant="danger">{error}</Alert>}
                                
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

                                {metodoEnvio === 'local' && (
                                    <Alert variant="info" className="text-center">
                                        📍 <strong>Retiro por sucursal</strong><br/>
                                        Te avisaremos por email cuando tu pedido esté listo para retirar en nuestro local.
                                    </Alert>
                                )}

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

                                <Form.Group className="mb-3">
                                    <Form.Label>Teléfono de Contacto</Form.Label>
                                    <Form.Control required name="telefono" value={formData.telefono} onChange={handleChange} placeholder="Ej: 11 1234 5678" />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Notas adicionales (opcional)</Form.Label>
                                    <Form.Control as="textarea" rows={2} name="notas" value={formData.notas} onChange={handleChange} placeholder="Ej: Timbre roto, tocar puerta" />
                                </Form.Group>
                            </Col>

                            {/* COLUMNA DERECHA: CUPONES Y DESGLOSE */}
                            <Col md={5}>
                                <div className="border p-3 rounded bg-body-tertiary mb-3">
                                    <Form.Label className="fw-bold">Código de Descuento</Form.Label>
                                    <div className="d-flex gap-2">
                                        <Form.Control 
                                            type="text" 
                                            placeholder="Ingresá tu código" 
                                            className="text-uppercase"
                                            value={codigoCupon}
                                            onChange={(e) => setCodigoCupon(e.target.value.toUpperCase())}
                                            disabled={!!cuponAplicado || isCalculating}
                                        />
                                        <Button 
                                            variant={cuponAplicado ? "success" : "outline-primary"}
                                            onClick={handleApplyCoupon}
                                            disabled={!!cuponAplicado || isCalculating || !codigoCupon.trim()}
                                        >
                                            {isCalculating ? <Spinner size="sm" animation="border" /> : (cuponAplicado ? 'Aplicado' : 'Aplicar')}
                                        </Button>
                                    </div>
                                </div>

                                <div className="bg-white border rounded p-3">
                                    <h6 className="fw-bold mb-3 border-bottom pb-2">Resumen de Compra</h6>
                                    
                                    <div className="d-flex justify-content-between mb-2">
                                        <span className="text-muted">Subtotal:</span>
                                        <span>{new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(totales.subtotal)}</span>
                                    </div>
                                    
                                    {totales.descuentoPromociones > 0 && (
                                        <div className="d-flex justify-content-between mb-2 text-success">
                                            <span>Promociones:</span>
                                            <span>-{new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(totales.descuentoPromociones)}</span>
                                        </div>
                                    )}

                                    {totales.descuentoCupon > 0 && (
                                        <div className="d-flex justify-content-between mb-2 text-success">
                                            <span>Cupón ({cuponAplicado}):</span>
                                            <span>-{new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(totales.descuentoCupon)}</span>
                                        </div>
                                    )}

                                    <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
                                        <span className="fw-bold fs-5">Total a Pagar:</span>
                                        <span className="fs-4 text-primary fw-bold">
                                            {isCalculating ? <Spinner size="sm" animation="border" variant="primary" /> : new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(totales.totalFinal)}
                                        </span>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose} disabled={loading}>Cancelar</Button>
                        <Button variant="success" type="submit" disabled={loading || isCalculating}>
                            {loading ? <Spinner size="sm" animation="border" /> : 'Confirmar Pedido'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            <ToastNotification show={toast.show} onClose={() => setToast({ ...toast, show: false })} message={toast.message} variant={toast.variant} />
        </>
    );
};