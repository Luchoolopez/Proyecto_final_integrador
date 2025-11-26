import React, { useState } from 'react';
import { Offcanvas, Button, Alert, Card, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useCartContext } from '../../context/CartContext';
import { useAuthContext } from '../../context/AuthContext'; 
import { CheckoutModal } from './CheckoutModal'; // Asegúrate de que este archivo exista

// Formateador de precios
const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
    }).format(price);
};

interface CartOffcanvasProps {
    // Si recibes props desde MainLayout, agrégalas aquí. 
    // Si usas contexto global para abrir/cerrar, quizas no necesites props.
    // Asumo por tu código anterior que usas el contexto para abrir/cerrar.
}

export const CartOffcanvas: React.FC<CartOffcanvasProps> = () => {
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

    // Estado para controlar el Modal de Checkout
    const [showCheckoutModal, setShowCheckoutModal] = useState(false);

    const total = cartItems.reduce((acc, item) => {
        // Aseguramos que el precio sea un número
        const itemPrice = typeof item.product.precio_final === 'string' 
            ? parseFloat(item.product.precio_final) 
            : item.product.precio_final;
        return acc + (itemPrice * item.quantity);
    }, 0);

    const handleInitiatePayment = () => {
        if (isAuthenticated) {
            // Si está autenticado, cerramos el carrito y abrimos el modal de checkout
            closeCart();
            setShowCheckoutModal(true);
        } else {
            // Si no, pedimos login
            closeCart(); // Opcional: cerrar carrito para mostrar login
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
                                            <Card.Title as="h6" className="mb-1 text-truncate" style={{maxWidth: '150px'}}>
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
                    <div className="d-flex justify-content-between fs-5 fw-bold mb-3">
                        <span>Total:</span>
                        <span>{formatPrice(total)}</span>
                    </div>

                    <Button variant="dark" className="w-100 py-2 mb-2" onClick={handleInitiatePayment}>
                        Iniciar Pago
                    </Button>

                    <Button variant="outline-secondary" size="sm" className="w-100" onClick={clearCart}>
                        Vaciar Carrito
                    </Button>
                </div>
            </>
        );
    };

    return (
        <>
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

            {/* Modal de Checkout Simulado */}
            <CheckoutModal 
                show={showCheckoutModal} 
                handleClose={() => setShowCheckoutModal(false)} 
            />
        </>
    );
};