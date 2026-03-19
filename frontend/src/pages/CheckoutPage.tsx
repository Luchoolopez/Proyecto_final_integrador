import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Form, Alert, Spinner, Card, Badge } from 'react-bootstrap';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useCartContext } from '../context/CartContext';
import { useAuthContext } from '../context/AuthContext';
import { orderService } from '../api/orderService';
import { addressService } from '../api/addressService';
import { ToastNotification } from '../components/ToastNotification';
import type { Address } from '../types/Address';

const formatPrice = (price: number) =>
    new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(price);

// ─── Tipos ────────────────────────────────────────────────────────────────────
type MetodoEnvio = 'envio' | 'local';
type MetodoPago = 'tarjeta' | 'efectivo' | 'mercadopago' | 'transferencia';

interface NewAddressForm {
    calle: string;
    numero: string;
    piso: string;
    dpto: string;
    ciudad: string;
    provincia: string;
    cp: string;
}

const EMPTY_ADDRESS_FORM: NewAddressForm = {
    calle: '', numero: '', piso: '', dpto: '',
    ciudad: '', provincia: 'Buenos Aires', cp: '',
};

// ─── Opciones de métodos de pago ──────────────────────────────────────────────
const PAYMENT_OPTIONS: { id: MetodoPago; icon: string; label: string; sub: string; disabled?: boolean }[] = [
    {
        id: 'tarjeta',
        icon: '💳',
        label: 'Tarjeta de crédito / débito',
        sub: 'Visa, Mastercard, Cabal y más',
    },
    {
        id: 'transferencia',
        icon: '🏦',
        label: 'Transferencia bancaria',
        sub: 'CBU / CVU · Te enviamos los datos por email',
    },
    {
        id: 'efectivo',
        icon: '💵',
        label: 'Efectivo',
        sub: 'Pagás al retirar o al recibir (coordinar con el local)',
    },
    {
        id: 'mercadopago',
        icon: '🔵',
        label: 'Mercado Pago',
        sub: 'Próximamente disponible',
        disabled: true,
    },
];

// ─── Componente principal ─────────────────────────────────────────────────────
export const CheckoutPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { cartItems, total, clearCart } = useCartContext();
    const { user } = useAuthContext();

    const [metodoEnvio, setMetodoEnvio] = useState<MetodoEnvio>(
        location.state?.metodoEnvio ?? 'envio'
    );
    const [metodoPago, setMetodoPago] = useState<MetodoPago>('tarjeta');

    // ── Estado direcciones ──────────────────────────────────────────────────
    const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
    const [loadingAddresses, setLoadingAddresses] = useState(true);
    // 'saved' = usa una guardada; 'new' = formulario de nueva dirección
    const [addressMode, setAddressMode] = useState<'saved' | 'new'>('saved');
    const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
    const [newAddressForm, setNewAddressForm] = useState<NewAddressForm>(EMPTY_ADDRESS_FORM);

    // ── Estado destinatario (pre-cargado desde cuenta) ──────────────────────
    const [recipient, setRecipient] = useState({
        nombre: user?.nombre ?? '',
        email: user?.email ?? '',
        telefono: user?.telefono ?? '',
    });
    const handleRecipientChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        setRecipient({ ...recipient, [e.target.name]: e.target.value });
    const [notas, setNotas] = useState('');

    // ── Estado de envío / UI ────────────────────────────────────────────────
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', variant: 'success' as 'success' | 'error' });

    // ── Cargar direcciones guardadas ────────────────────────────────────────
    useEffect(() => {
        addressService.getAddresses()
            .then(addresses => {
                // Eliminar duplicados por dirección normalizada
                const seen = new Set<string>();
                const unique = addresses.filter(a => {
                    const key = `${a.calle.trim().toLowerCase()}|${a.numero.trim()}|${a.ciudad.trim().toLowerCase()}|${a.provincia.trim().toLowerCase()}|${a.codigo_postal.trim()}`;
                    if (seen.has(key)) return false;
                    seen.add(key);
                    return true;
                });
                setSavedAddresses(unique);
                if (unique.length > 0) {
                    const principal = unique.find(a => a.es_principal) ?? unique[0];
                    setSelectedAddressId(principal.id);
                    setAddressMode('saved');
                } else {
                    setAddressMode('new');
                }
            })
            .catch(() => setAddressMode('new'))
            .finally(() => setLoadingAddresses(false));
    }, []);

    const handleNewAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewAddressForm({ ...newAddressForm, [e.target.name]: e.target.value });
    };

    // ── Submit ──────────────────────────────────────────────────────────────
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            let direccion_id: number | undefined;

            if (metodoEnvio === 'envio') {
                if (addressMode === 'saved' && selectedAddressId) {
                    // Usar dirección ya guardada
                    direccion_id = selectedAddressId;
                } else {
                    // Crear nueva dirección y usarla
                    const created = await addressService.createAddress({
                        calle: newAddressForm.calle,
                        numero: newAddressForm.numero,
                        piso: newAddressForm.piso || undefined,
                        dpto: newAddressForm.dpto || undefined,
                        ciudad: newAddressForm.ciudad,
                        provincia: newAddressForm.provincia,
                        codigo_postal: newAddressForm.cp,
                        pais: 'Argentina',
                        es_principal: false,
                    });
                    direccion_id = created.id;
                }
            }

            await orderService.createOrder({
                direccion_id,
                notas: notas || `Contacto: ${recipient.nombre} — ${recipient.telefono} | Pago: ${metodoPago}`,
                shipping_provider: metodoEnvio === 'envio' ? 'correo_argentino' : 'retiro_local',
                shipping_service: metodoEnvio === 'envio' ? 'estandar' : 'sucursal',
            });

            setOrderSuccess(true);
            setToast({ show: true, message: '¡Pedido realizado con éxito!', variant: 'success' });
            await clearCart();
        } catch (err: any) {
            const msg = err.response?.data?.message || 'Error al procesar la compra. Intenta nuevamente.';
            setError(msg);
            setToast({ show: true, message: msg, variant: 'error' });
        } finally {
            setLoading(false);
        }
    };

    // ─── Pantalla de éxito ────────────────────────────────────────────────────
    if (orderSuccess) {
        return (
            <Container className="my-5 text-center" style={{ maxWidth: 520 }}>
                <div style={{ fontSize: '4rem' }}>🎉</div>
                <h2 className="fw-bold mt-3">¡Pedido confirmado!</h2>
                <p className="text-muted">
                    Te enviaremos un email con los detalles de tu compra.
                    {metodoEnvio === 'local' && ' Te avisaremos cuando esté listo para retirar.'}
                    {metodoPago === 'transferencia' && ' Recibirás los datos bancarios en tu email.'}
                </p>
                <div className="d-flex gap-3 justify-content-center mt-4">
                    <Link to="/account" className="btn btn-dark">Ver mis pedidos</Link>
                    <Link to="/productos" className="btn btn-outline-secondary">Seguir comprando</Link>
                </div>
            </Container>
        );
    }

    if (cartItems.length === 0) {
        return (
            <Container className="my-5 text-center">
                <h3>Tu carrito está vacío</h3>
                <Link to="/productos" className="btn btn-dark mt-3">Ir a comprar</Link>
            </Container>
        );
    }

    // ─── Renderizado del selector de dirección ────────────────────────────────
    const renderAddressSection = () => {
        if (loadingAddresses) {
            return (
                <div className="text-center py-3">
                    <Spinner size="sm" animation="border" className="me-2" />
                    <span className="text-muted small">Cargando direcciones...</span>
                </div>
            );
        }

        return (
            <>
                {/* Si hay direcciones guardadas → mostrar selector */}
                {savedAddresses.length > 0 && (
                    <div className="mb-3">
                        {/* Tabs: Usar guardada / Nueva */}
                        <div className="d-flex gap-2 mb-3">
                            <button
                                type="button"
                                className={`btn btn-sm ${addressMode === 'saved' ? 'btn-dark' : 'btn-outline-secondary'}`}
                                onClick={() => setAddressMode('saved')}
                            >
                                Mis direcciones
                            </button>
                            <button
                                type="button"
                                className={`btn btn-sm ${addressMode === 'new' ? 'btn-dark' : 'btn-outline-secondary'}`}
                                onClick={() => setAddressMode('new')}
                            >
                                + Nueva dirección
                            </button>
                        </div>

                        {/* Lista de direcciones guardadas */}
                        {addressMode === 'saved' && (
                            <div className="d-flex flex-column gap-2">
                                {savedAddresses.map(addr => (
                                    <div
                                        key={addr.id}
                                        onClick={() => setSelectedAddressId(addr.id)}
                                        className="d-flex align-items-start gap-3 p-3 rounded border"
                                        style={{
                                            cursor: 'pointer',
                                            borderColor: selectedAddressId === addr.id ? 'var(--bs-primary)' : 'var(--bs-border-color)',
                                            backgroundColor: selectedAddressId === addr.id ? 'rgba(var(--bs-primary-rgb), 0.07)' : 'transparent',
                                            transition: 'all 0.15s',
                                        }}
                                    >
                                        <div className="flex-grow-1 small">
                                            <div className="fw-semibold">
                                                {addr.calle} {addr.numero}
                                                {addr.piso && `, Piso ${addr.piso}`}
                                                {addr.dpto && ` Dpto. ${addr.dpto}`}
                                            </div>
                                            <div className="text-muted">
                                                {addr.ciudad}, {addr.provincia} — CP {addr.codigo_postal}
                                            </div>
                                            {addr.es_principal && (
                                                <Badge bg="secondary" pill className="mt-1" style={{ fontSize: '0.7rem' }}>
                                                    Principal
                                                </Badge>
                                            )}
                                        </div>
                                        <div
                                            style={{
                                                width: 16,
                                                height: 16,
                                                borderRadius: '50%',
                                                border: `2px solid ${selectedAddressId === addr.id ? 'var(--bs-primary)' : 'var(--bs-border-color)'}`,
                                                backgroundColor: selectedAddressId === addr.id ? 'var(--bs-primary)' : 'transparent',
                                                flexShrink: 0,
                                                marginTop: 2,
                                                transition: 'all 0.15s',
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Formulario nueva dirección */}
                {addressMode === 'new' && (
                    <div>
                        <Row className="mb-3">
                            <Col sm={8}>
                                <Form.Group>
                                    <Form.Label>Calle <span className="text-danger">*</span></Form.Label>
                                    <Form.Control required name="calle" value={newAddressForm.calle} onChange={handleNewAddressChange} placeholder="Av. Siempreviva" />
                                </Form.Group>
                            </Col>
                            <Col sm={4}>
                                <Form.Group>
                                    <Form.Label>Número <span className="text-danger">*</span></Form.Label>
                                    <Form.Control required name="numero" value={newAddressForm.numero} onChange={handleNewAddressChange} placeholder="742" />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row className="mb-3">
                            <Col sm={6}>
                                <Form.Group>
                                    <Form.Label>Piso <span className="text-muted small">(opcional)</span></Form.Label>
                                    <Form.Control name="piso" value={newAddressForm.piso} onChange={handleNewAddressChange} placeholder="3" />
                                </Form.Group>
                            </Col>
                            <Col sm={6}>
                                <Form.Group>
                                    <Form.Label>Departamento <span className="text-muted small">(opcional)</span></Form.Label>
                                    <Form.Control name="dpto" value={newAddressForm.dpto} onChange={handleNewAddressChange} placeholder="B" />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row className="mb-3">
                            <Col sm={6}>
                                <Form.Group>
                                    <Form.Label>Ciudad <span className="text-danger">*</span></Form.Label>
                                    <Form.Control required name="ciudad" value={newAddressForm.ciudad} onChange={handleNewAddressChange} />
                                </Form.Group>
                            </Col>
                            <Col sm={6}>
                                <Form.Group>
                                    <Form.Label>Código Postal <span className="text-danger">*</span></Form.Label>
                                    <Form.Control required name="cp" value={newAddressForm.cp} onChange={handleNewAddressChange} />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group>
                            <Form.Label>Provincia <span className="text-danger">*</span></Form.Label>
                            <Form.Control required name="provincia" value={newAddressForm.provincia} onChange={handleNewAddressChange} />
                        </Form.Group>
                    </div>
                )}
            </>
        );
    };

    // ─── Render principal ─────────────────────────────────────────────────────
    return (
        <>
            <Container className="my-5">
                {/* Breadcrumb */}
                <Row className="mb-4">
                    <Col>
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb small">
                                <li className="breadcrumb-item"><Link to="/">Inicio</Link></li>
                                <li className="breadcrumb-item active">Checkout</li>
                            </ol>
                        </nav>
                        <h2 className="fw-bold">Finalizar compra</h2>
                    </Col>
                </Row>

                <Form onSubmit={handleSubmit}>
                    <Row className="g-4">

                        {/* ── Columna izquierda ─────────────────────────────── */}
                        <Col lg={7}>
                            {error && <Alert variant="danger" className="mb-3">{error}</Alert>}

                            {/* 1. Datos del destinatario */}
                            <Card className="mb-4 shadow-sm">
                                <Card.Body>
                                    <h5 className="fw-bold mb-3">1. Datos del destinatario</h5>
                                    <p className="text-muted small mb-3">
                                        Pre-cargado desde tu cuenta. Podés modificarlos para este pedido.
                                    </p>
                                    <Row className="mb-3">
                                        <Col sm={12}>
                                            <Form.Group>
                                                <Form.Label>Nombre completo <span className="text-danger">*</span></Form.Label>
                                                <Form.Control
                                                    required
                                                    name="nombre"
                                                    value={recipient.nombre}
                                                    onChange={handleRecipientChange}
                                                    placeholder="Juan Pérez"
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row className="mb-3">
                                        <Col sm={7}>
                                            <Form.Group>
                                                <Form.Label>Email <span className="text-danger">*</span></Form.Label>
                                                <Form.Control
                                                    required
                                                    type="email"
                                                    name="email"
                                                    value={recipient.email}
                                                    onChange={handleRecipientChange}
                                                    placeholder="juan@mail.com"
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col sm={5}>
                                            <Form.Group>
                                                <Form.Label>Teléfono <span className="text-danger">*</span></Form.Label>
                                                <Form.Control
                                                    required
                                                    name="telefono"
                                                    value={recipient.telefono}
                                                    onChange={handleRecipientChange}
                                                    placeholder="11 1234-5678"
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>

                            {/* 2. Método de entrega */}
                            <Card className="mb-4 shadow-sm">
                                <Card.Body>
                                    <h5 className="fw-bold mb-3">2. Método de entrega</h5>
                                    <div className="d-flex flex-column gap-2">
                                        {[
                                            { id: 'envio' as MetodoEnvio, icon: '🚚', label: 'Envío a Domicilio', sub: 'Correo Argentino · Estándar' },
                                            { id: 'local' as MetodoEnvio, icon: '🏪', label: 'Retiro en Local', sub: 'Sin costo · 24–48 hs hábiles' },
                                        ].map(opt => (
                                            <div
                                                key={opt.id}
                                                onClick={() => setMetodoEnvio(opt.id)}
                                                className="d-flex align-items-center gap-3 p-3 rounded border"
                                                style={{
                                                    cursor: 'pointer',
                                                    borderColor: metodoEnvio === opt.id ? 'var(--bs-primary)' : 'var(--bs-border-color)',
                                                    backgroundColor: metodoEnvio === opt.id ? 'rgba(var(--bs-primary-rgb), 0.07)' : 'transparent',
                                                    transition: 'all 0.15s',
                                                }}
                                            >
                                                <span style={{ fontSize: '1.4rem' }}>{opt.icon}</span>
                                                <div className="flex-grow-1">
                                                    <div className="fw-semibold">{opt.label}</div>
                                                    <div className="text-muted small">{opt.sub}</div>
                                                </div>
                                                <div style={{
                                                    width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
                                                    border: `2px solid ${metodoEnvio === opt.id ? 'var(--bs-primary)' : 'var(--bs-border-color)'}`,
                                                    backgroundColor: metodoEnvio === opt.id ? 'var(--bs-primary)' : 'transparent',
                                                    transition: 'all 0.15s',
                                                }} />
                                            </div>
                                        ))}
                                    </div>
                                </Card.Body>
                            </Card>

                            {/* 3. Dirección (solo si eligió envío) */}
                            {metodoEnvio === 'envio' && (
                                <Card className="mb-4 shadow-sm">
                                    <Card.Body>
                                        <h5 className="fw-bold mb-3">3. Dirección de envío</h5>
                                        {renderAddressSection()}
                                    </Card.Body>
                                </Card>
                            )}

                            {/* Mensaje retiro local */}
                            {metodoEnvio === 'local' && (
                                <Alert variant="info" className="mb-4">
                                    📍 <strong>Retiro en nuestro local</strong><br />
                                    Te avisaremos por email cuando tu pedido esté listo. Sin costo adicional.
                                </Alert>
                            )}

                            {/* 3. Método de pago */}
                            <Card className="mb-4 shadow-sm">
                                <Card.Body>
                                    <h5 className="fw-bold mb-3">
                                        {metodoEnvio === 'envio' ? '4.' : '3.'} Método de pago
                                    </h5>
                                    <div className="d-flex flex-column gap-2">
                                        {PAYMENT_OPTIONS.map(opt => (
                                            <div
                                                key={opt.id}
                                                onClick={() => !opt.disabled && setMetodoPago(opt.id)}
                                                className="d-flex align-items-center gap-3 p-3 rounded border"
                                                style={{
                                                    cursor: opt.disabled ? 'not-allowed' : 'pointer',
                                                    opacity: opt.disabled ? 0.5 : 1,
                                                    borderColor: metodoPago === opt.id && !opt.disabled ? 'var(--bs-primary)' : 'var(--bs-border-color)',
                                                    backgroundColor: metodoPago === opt.id && !opt.disabled ? 'rgba(var(--bs-primary-rgb), 0.07)' : 'transparent',
                                                    transition: 'all 0.15s',
                                                }}
                                            >
                                                <span style={{ fontSize: '1.4rem' }}>{opt.icon}</span>
                                                <div className="flex-grow-1">
                                                    <div className="fw-semibold d-flex align-items-center gap-2">
                                                        {opt.label}
                                                        {opt.disabled && (
                                                            <Badge bg="warning" text="dark" pill style={{ fontSize: '0.65rem' }}>
                                                                Próximamente
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <div className="text-muted small">{opt.sub}</div>
                                                </div>
                                                <div style={{
                                                    width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
                                                    border: `2px solid ${metodoPago === opt.id && !opt.disabled ? 'var(--bs-primary)' : 'var(--bs-border-color)'}`,
                                                    backgroundColor: metodoPago === opt.id && !opt.disabled ? 'var(--bs-primary)' : 'transparent',
                                                    transition: 'all 0.15s',
                                                }} />
                                            </div>
                                        ))}
                                    </div>

                                    {/* Nota informativa según método de pago */}
                                    {metodoPago === 'tarjeta' && (
                                        <Alert variant="light" className="mt-3 mb-0 small border">
                                            💳 Procesamos el pago de forma segura. Los datos de tu tarjeta son encriptados.
                                        </Alert>
                                    )}
                                    {metodoPago === 'transferencia' && (
                                        <Alert variant="light" className="mt-3 mb-0 small border">
                                            🏦 Recibirás el CBU/CVU y el importe exacto en tu email al confirmar el pedido.
                                        </Alert>
                                    )}
                                    {metodoPago === 'efectivo' && (
                                        <Alert variant="light" className="mt-3 mb-0 small border">
                                            💵 Te contactaremos para coordinar el pago en efectivo al momento de la entrega o retiro.
                                        </Alert>
                                    )}
                                </Card.Body>
                            </Card>

                            {/* Notas adicionales */}
                            <Card className="mb-4 shadow-sm">
                                <Card.Body>
                                    <h5 className="fw-bold mb-3">
                                        {metodoEnvio === 'envio' ? '5.' : '4.'} Notas adicionales
                                    </h5>
                                    <Form.Group>
                                        <Form.Label className="text-muted small">Opcional — instrucciones especiales para tu pedido</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={2}
                                            value={notas}
                                            onChange={e => setNotas(e.target.value)}
                                            placeholder="Ej: Dejar en portería, timbre roto, entregar en horario de la tarde..."
                                        />
                                    </Form.Group>
                                </Card.Body>
                            </Card>
                        </Col>

                        {/* ── Columna derecha: resumen ──────────────────────── */}
                        <Col lg={5}>
                            <Card className="shadow-sm sticky-top" style={{ top: '116px' }}>
                                <Card.Body>
                                    <h5 className="fw-bold mb-3">Resumen del pedido</h5>

                                    {/* Items */}
                                    <div className="mb-3">
                                        {cartItems.map(item => (
                                            <div
                                                key={`${item.product.id}-${item.variant.id}`}
                                                className="d-flex align-items-center gap-2 mb-2"
                                            >
                                                <img
                                                    src={item.product.imagen_principal}
                                                    alt={item.product.nombre}
                                                    style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 4, flexShrink: 0 }}
                                                />
                                                <div className="flex-grow-1 small">
                                                    <div className="fw-semibold text-truncate" style={{ maxWidth: 160 }}>
                                                        {item.product.nombre}
                                                    </div>
                                                    <div className="text-muted">
                                                        Talle {item.variant.talle} × {item.quantity}
                                                    </div>
                                                </div>
                                                <div className="fw-semibold small text-nowrap">
                                                    {formatPrice(Number(item.product.precio_final) * item.quantity)}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <hr />

                                    <div className="d-flex justify-content-between small mb-1">
                                        <span>Subtotal</span>
                                        <span>{formatPrice(total)}</span>
                                    </div>
                                    <div className="d-flex justify-content-between small mb-3 align-items-center">
                                        <span>Envío</span>
                                        {metodoEnvio === 'local' ? (
                                            <Badge bg="success" pill>Gratis</Badge>
                                        ) : total >= 190000 ? (
                                            <Badge bg="success" pill>Gratis</Badge>
                                        ) : (
                                            <span className="text-muted">A calcular</span>
                                        )}
                                    </div>
                                    <div className="d-flex justify-content-between fw-bold fs-5 mb-1">
                                        <span>Total</span>
                                        <span className="text-primary">{formatPrice(total)}</span>
                                    </div>
                                    {metodoPago === 'tarjeta' && (
                                        <p className="text-muted small mb-3">
                                            O hasta 6 cuotas sin interés con débito
                                        </p>
                                    )}

                                    <Button
                                        type="submit"
                                        variant="dark"
                                        size="lg"
                                        className="w-100 mt-2"
                                        disabled={loading}
                                    >
                                        {loading
                                            ? <><Spinner size="sm" animation="border" className="me-2" />Procesando...</>
                                            : 'Confirmar pedido'
                                        }
                                    </Button>

                                    <Button
                                        variant="link"
                                        className="w-100 mt-2 text-muted small"
                                        onClick={() => navigate(-1)}
                                        type="button"
                                    >
                                        ← Volver al carrito
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>

                    </Row>
                </Form>
            </Container>

            <ToastNotification
                show={toast.show}
                onClose={() => setToast({ ...toast, show: false })}
                message={toast.message}
                variant={toast.variant}
            />
        </>
    );
};

export default CheckoutPage;
