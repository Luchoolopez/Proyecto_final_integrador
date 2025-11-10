// frontend/src/pages/CartPage.tsx
import React from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { useCartContext } from '../context/CartContext';
import { Link } from 'react-router-dom';

export const CartPage = () => {
    const { cartItems, loading, error, removeItem, updateItem, clearCartItems } = useCartContext();

    if (loading) {
        return <Container className="my-5 text-center"><p>Cargando carrito...</p></Container>;
    }

    if (error) {
        return <Container className="my-5"><Alert variant="danger">{error}</Alert></Container>;
    }

    if (cartItems.length === 0) {
        return (
            <Container className="my-5 text-center">
                <h2>Tu carrito está vacío</h2>
                <p>Aún no has añadido productos.</p>
                <Button as={Link} to="/" variant="dark">Ir a comprar</Button>
            </Container>
        )
    }

    // Calcular total
    const total = cartItems.reduce((acc, item) => {
        // Usamos el precio_final que ya calculó el backend
        const itemPrice = parseFloat(item.variante.producto.precio_final as any);
        return acc + (itemPrice * item.cantidad);
    }, 0);

    return (
        <Container className="my-5">
            <h1 className="mb-4">Mi Carrito</h1>
            <Row>
                <Col md={8}>
                    {cartItems.map(item => (
                        <Card key={item.id} className="mb-3">
                            <Row g={0}>
                                <Col md={3}>
                                    <Card.Img src={item.variante.producto.imagen_principal} />
                                </Col>
                                <Col md={9}>
                                    <Card.Body>
                                        <Card.Title>{item.variante.producto.nombre}</Card.Title>
                                        <Card.Text>
                                            Talle: {item.variante.talle} <br />
                                            Precio: ${new Intl.NumberFormat('es-AR').format(item.variante.producto.precio_final)}
                                        </Card.Text>

                                        <div className="d-flex justify-content-between align-items-center">
                                            <div>
                                                <label htmlFor={`qty-${item.id}`}>Cantidad:</label>
                                                <input
                                                    id={`qty-${item.id}`}
                                                    type="number"
                                                    value={item.cantidad}
                                                    onChange={(e) => updateItem(item.id, parseInt(e.target.value))}
                                                    min={1}
                                                    style={{ width: '60px', marginLeft: '10px' }}
                                                />
                                            </div>
                                            <Button variant="outline-danger" size="sm" onClick={() => removeItem(item.id)}>
                                                Eliminar
                                            </Button>
                                        </div>
                                    </Card.Body>
                                </Col>
                            </Row>
                        </Card>
                    ))}
                </Col>

                <Col md={4}>
                    <Card>
                        <Card.Body>
                            <Card.Title>Resumen del Pedido</Card.Title>
                            <hr />
                            <div className="d-flex justify-content-between">
                                <strong>Subtotal:</strong>
                                <strong>${new Intl.NumberFormat('es-AR').format(total)}</strong>
                            </div>
                            <div className="d-flex justify-content-between mt-2">
                                <strong>Envío:</strong>
                                <strong>A calcular</strong>
                            </div>
                            <hr />
                            <div className="d-flex justify-content-between fw-bold fs-5">
                                <strong>Total:</strong>
                                <strong>${new Intl.NumberFormat('es-AR').format(total)}</strong>
                            </div>
                            <Button variant="dark" className="w-100 mt-3">Iniciar Pago</Button>
                            <Button variant="outline-danger" className="w-100 mt-2" onClick={clearCartItems}>
                                Vaciar Carrito
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default CartPage;