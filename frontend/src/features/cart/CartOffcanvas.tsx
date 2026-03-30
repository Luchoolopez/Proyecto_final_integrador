import React, { useState } from 'react';
import { Offcanvas, Button, Alert, Card, Row, Col, Badge } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useCartContext } from '../../context/CartContext';
import { useAuthContext } from '../../context/AuthContext';

// Formateador de precios
const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
    }).format(price);
};

// Opciones de envío disponibles
const SHIPPING_OPTIONS = [
    {
        id: 'envio',
        label: 'Envío a Domicilio',
        sublabel: 'Correo Argentino — Estándar',
        icon: '🚚',
        cost: 'A calcular',
    },
    {
        id: 'local',
        label: 'Retiro en Local',
        sublabel: 'Sin costo · Disponible en 24–48 hs',
        icon: '🏪',
        cost: 'Gratis',
    },
];

interface CartOffcanvasProps {}

export const CartOffcanvas: React.FC<CartOffcanvasProps> = () => {
    const {
        isCartOpen,
        closeCart,
        cartItems,
        loading,
        error,
        removeItem,
        updateItem,
        clearCart,
    } = useCartContext();

    const { isAuthenticated, openAuthModal } = useAuthContext();
    const navigate = useNavigate();

    // Estado del método de envío seleccionado
    const [selectedShipping, setSelectedShipping] = useState<'envio' | 'local'>('envio');

    const total = cartItems.reduce((acc, item) => {
        const itemPrice = typeof item.product.precio_final === 'string'
            ? parseFloat(item.product.precio_final)
            : item.product.precio_final;
        return acc + (itemPrice * item.quantity);
    }, 0);

    const FREE_SHIPPING_THRESHOLD = 190000;
    const faltaParaFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - total);

    const handleInitiatePayment = () => {
        if (isAuthenticated) {
            closeCart();
            navigate('/checkout', { state: { metodoEnvio: selectedShipping } });
        } else {
            closeCart();
            openAuthModal();
        }
    };

    const renderBody = () => {
        if (loading) {
            return <p className="text-center">Cargando carrito...</p>;
        }

        if (error) {
            return <Alert variant="danger">{error}</Alert>;
        }

        if (cartItems.length === 0) {
            return (
                <div className="text-center mt-5">
                    <h5>Tu carrito está vacío</h5>
                    <p>Aún no has añadido productos.</p>
                    <Link to="/productos" className="btn btn-dark btn-buy border" onClick={closeCart}>
                        Ir a comprar
                    </Link>
                </div>
            );
        }

        return (
            <>
                {/* Lista de Items */}
                <div className="cart-items-list mb-3 flex-grow-1 overflow-auto">
                    {cartItems.map(item => (
                        <Card key={`${item.product.id}-${item.variant.id}`} className="mb-3 border-0 border-bottom rounded-0">
                            <Row className="g-0 align-items-center">
                                <Col xs={3}>
                                    <Card.Img
                                        src={item.product.imagen_principal}
                                        style={{ width: '100%', height: '80px', objectFit: 'cover', borderRadius: '4px' }}
                                    />
                                </Col>
                                <Col xs={9}>
                                    <Card.Body className="py-2 pe-0 ps-2">
                                        <div className="d-flex justify-content-between">
                                            <Card.Title as="h6" className="mb-1 text-truncate" style={{ maxWidth: '150px' }}>
                                                {item.product.nombre}
                                            </Card.Title>
                                            <Button
                                                variant="link"
                                                size="sm"
                                                className="text-danger p-0 text-decoration-none"
                                                onClick={() => removeItem(item.variant.id)}
                                            >
                                                <small>Eliminar</small>
                                            </Button>
                                        </div>

                                        <Card.Text className="text-muted small mb-1">
                                            Talle: {item.variant.talle}
                                        </Card.Text>

                                        <div className="d-flex justify-content-between align-items-end">
                                            <Card.Text className="fw-bold mb-0 text-primary">
                                                {formatPrice(Number(item.product.precio_final))}
                                            </Card.Text>

                                            <div className="d-flex align-items-center gap-2">
                                                <small className="text-muted">Cant:</small>
                                                <input
                                                    type="number"
                                                    value={item.quantity}
                                                    onChange={(e) => updateItem(item.variant.id, parseInt(e.target.value))}
                                                    min={1}
                                                    max={item.variant.stock}
                                                    className="form-control form-control-sm p-1 text-center"
                                                    style={{ width: '50px' }}
                                                />
                                            </div>
                                        </div>
                                    </Card.Body>
                                </Col>
                            </Row>
                        </Card>
                    ))}
                </div>

                {/* Footer Fijo con Resumen */}
                <div className="cart-footer-summary border-top pt-3">

                    {/* Barra de envío gratis */}
                    {faltaParaFreeShipping > 0 ? (
                        <p className="small text-center text-success mb-2">
                            Agregá <strong>{formatPrice(faltaParaFreeShipping)}</strong> más para <strong>envío gratis</strong>
                        </p>
                    ) : (
                        <p className="small text-center text-success mb-2 fw-semibold">
                            🎉 ¡Tenés envío gratis!
                        </p>
                    )}

                    {/* Subtotal */}
                    <div className="d-flex justify-content-between text-muted small mb-2 px-1">
                        <span>Subtotal</span>
                        <span>{formatPrice(total)}</span>
                    </div>

                    {/* ---- SELECTOR DE MEDIOS DE ENVÍO ---- */}
                    <div className="mb-3">
                        <p className="small fw-semibold text-uppercase text-muted mb-2 px-1" style={{ letterSpacing: '0.05em' }}>
                            Medio de entrega
                        </p>
                        <div className="d-flex flex-column gap-2">
                            {SHIPPING_OPTIONS.map(option => (
                                <div
                                    key={option.id}
                                    onClick={() => setSelectedShipping(option.id as 'envio' | 'local')}
                                    className="d-flex align-items-center justify-content-between p-2 rounded border"
                                    style={{
                                        cursor: 'pointer',
                                        borderColor: selectedShipping === option.id
                                            ? 'var(--bs-primary)'
                                            : 'var(--bs-border-color)',
                                        backgroundColor: selectedShipping === option.id
                                            ? 'rgba(var(--bs-primary-rgb), 0.08)'
                                            : 'transparent',
                                        transition: 'all 0.15s ease',
                                    }}
                                >
                                    <div className="d-flex align-items-center gap-2">
                                        <span style={{ fontSize: '1.2rem' }}>{option.icon}</span>
                                        <div>
                                            <div className="fw-semibold small">{option.label}</div>
                                            <div className="text-muted" style={{ fontSize: '0.75rem' }}>{option.sublabel}</div>
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-center gap-2">
                                        <Badge
                                            bg={option.id === 'local' ? 'success' : 'secondary'}
                                            pill
                                            style={{ fontSize: '0.7rem' }}
                                        >
                                            {option.cost}
                                        </Badge>
                                        <div
                                            style={{
                                                width: '16px',
                                                height: '16px',
                                                borderRadius: '50%',
                                                border: `2px solid ${selectedShipping === option.id ? 'var(--bs-primary)' : 'var(--bs-border-color)'}`,
                                                backgroundColor: selectedShipping === option.id ? 'var(--bs-primary)' : 'transparent',
                                                flexShrink: 0,
                                                transition: 'all 0.15s ease',
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* ---- FIN SELECTOR ---- */}

                    <Button variant="dark" className="w-100 py-2 mb-2" onClick={handleInitiatePayment}>
                        Iniciar Compra
                    </Button>

                    <Button variant="outline-secondary" size="sm" className="w-100" onClick={clearCart}>
                        Vaciar Carrito
                    </Button>
                </div>
            </>
        );
    };

    return (
        <Offcanvas
            show={isCartOpen}
            onHide={closeCart}
            placement="end"
            style={{ maxWidth: '400px', width: '100%' }}
        >
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>Carrito de Compras</Offcanvas.Title>
            </Offcanvas.Header>

            <Offcanvas.Body className="d-flex flex-column">
                {renderBody()}
            </Offcanvas.Body>
        </Offcanvas>
    );
};