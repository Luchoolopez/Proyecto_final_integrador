import React from 'react';
import { Offcanvas, Button, Alert, Card, Row, Col } from 'react-bootstrap';
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

export const CartOffcanvas = () => {
    const {
        isCartOpen,
        closeCart,
        cartItems,
        loading,
        error,
        removeItem,
        updateItem,
        clearCart
    } = useCartContext();

    const { isAuthenticated, openAuthModal } = useAuthContext(); 
    const navigate = useNavigate();

    const total = cartItems.reduce((acc, item) => {
        const itemPrice = parseFloat(item.product.precio_final as any);
        return acc + (itemPrice * item.quantity);
    }, 0);

    const handleInitiatePayment = () => {
        closeCart();
        if (isAuthenticated) {
            navigate('/checkout');
        } else {
            
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
                    <Button as={Link} className='btn-buy border' to="/productos" variant="dark" onClick={closeCart}>
                        Ir a comprar
                    </Button>
                </div>
            );
        }

        return (
            <>
                {/* Lista de Items */}
                <div className="cart-items-list mb-3">
                    {cartItems.map(item => (
                        <Card key={item.variant.id} className="mb-3 border-0 border-bottom rounded-0">
                            <Row g={0}>
                                <Col xs={4}>
                                    <Card.Img src={item.product.imagen_principal} />
                                </Col>
                                <Col xs={8}>
                                    <Card.Body className="py-0 pe-0">
                                        <Card.Title as="h6" className="mb-1">{item.product.nombre}</Card.Title>
                                        <Card.Text className="text-muted small">
                                            Talle: {item.variant.talle}
                                        </Card.Text>
                                        <Card.Text className="fw-bold mb-2">
                                            {formatPrice(item.product.precio_final)}
                                        </Card.Text>

                                        <div className="d-flex justify-content-between align-items-center">
                                            <input
                                                type="number"
                                                value={item.quantity}
                                                onChange={(e) => updateItem(item.variant.id, parseInt(e.target.value))}
                                                min={1}
                                                max={item.variant.stock}
                                                className="form-control form-control-sm"
                                                style={{ width: '60px' }}
                                            />
                                            <Button variant="link" size="sm" className="text-danger" onClick={() => removeItem(item.variant.id)}>
                                                Eliminar
                                            </Button>
                                        </div>
                                    </Card.Body>
                                </Col>
                            </Row>
                        </Card>
                    ))}
                </div>

                {/* Footer Fijo con Resumen */}
                <div className="cart-footer-summary">
                    <hr />
                    <div className="d-flex justify-content-between fs-5 fw-bold">
                        <span>Total:</span>
                        <span>{formatPrice(total)}</span>
                    </div>

                    <Button variant="dark" className="w-100 mt-3" onClick={handleInitiatePayment}>
                        Iniciar Pago
                    </Button>

                    <Button variant="outline-danger" size="sm" className="w-100 mt-2" onClick={clearCart}>
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