import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaFileInvoice } from 'react-icons/fa';
import { Spinner, Alert, Badge } from 'react-bootstrap';
import { orderService, type Order } from '../../../api/orderService';
import { formatPrice } from '../../../utils/formatPrice';

export const PurchaseCard = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMyOrders = async () => {
            setLoading(true);
            try {
                const data = await orderService.getMyOrders();
                setOrders(data);
            } catch (err) {
                console.error(err);
                setError('No se pudieron cargar tus compras.');
            } finally {
                setLoading(false);
            }
        };

        fetchMyOrders();
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pendiente': return 'warning';
            case 'confirmado': return 'info';
            case 'armando': return 'primary';
            case 'enviado': return 'primary';
            case 'entregado': return 'success';
            case 'cancelado': return 'danger';
            default: return 'secondary';
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-AR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="card p-4 text-center">
                <Spinner animation="border" size="sm" /> Cargando compras...
            </div>
        );
    }

    if (error) {
        return (
            <div className="card p-4">
                <Alert variant="danger" className="mb-0">{error}</Alert>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="card p-5 text-center">
                <h5 className="text-muted">Aún no has realizado compras</h5>
                <Link to="/productos" className="btn btn-dark mt-3">Ir a la tienda</Link>
            </div>
        );
    }

    const handleDownloadInvoice = async (e: React.MouseEvent, orderId: number) => {
        e.stopPropagation(); // Evita que se abra/cierre el acordeón al hacer click
        try {
            await orderService.downloadInvoice(orderId);
        } catch (err) {
            console.error("Error descargando factura", err);
            alert("No se pudo descargar la factura. Intenta más tarde.");
        }
    };


    return (
        <div className="card border-0 shadow-sm">
            <div className="card-header bg-body border-bottom d-flex justify-content-between align-items-center py-3">
                <h5 className="mb-0 fw-bold">Mis compras</h5>
                <Badge bg="secondary">{orders.length} {orders.length === 1 ? 'Pedido' : 'Pedidos'}</Badge>
            </div>

            <div className="accordion accordion-flush" id="purchase-accordion">
                {orders.map((order) => (
                    <div className="accordion-item" key={order.id}>
                        <h2 className="accordion-header" id={`heading${order.id}`}>
                            <button
                                className='accordion-button collapsed'
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target={`#collapse${order.id}`}
                                aria-expanded="false"
                                aria-controls={`collapse${order.id}`}
                            >
                                <div className="d-flex justify-content-between w-100 me-3 align-items-center">
                                    <div>
                                        <span className="fw-bold d-block">Orden #{order.numero_pedido || order.id}</span>
                                        <small className="text-muted">{formatDate(order.fecha)}</small>
                                    </div>

                                    <div className="d-flex align-items-center gap-3">
                                        {/* NUEVO BOTÓN DE FACTURA */}
                                        {['confirmado', 'armando', 'enviado', 'entregado'].includes(order.estado) && (
                                            <button
                                                className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-2"
                                                onClick={(e) => handleDownloadInvoice(e, order.id)}
                                                title="Descargar Factura"
                                            >
                                                <FaFileInvoice />
                                                <span className="d-none d-md-inline">Factura</span>
                                            </button>
                                        )}

                                        <div className="text-end">
                                            <Badge bg={getStatusColor(order.estado)} className="text-uppercase">
                                                {order.estado}
                                            </Badge>
                                            <div className="fw-bold mt-1">{formatPrice(Number(order.total))}</div>
                                        </div>
                                    </div>
                                </div>
                            </button>
                        </h2>
                        <div
                            id={`collapse${order.id}`}
                            className="accordion-collapse collapse"
                            aria-labelledby={`heading${order.id}`}
                            data-bs-parent="#purchase-accordion"
                        >
                            <div className="accordion-body bg-light bg-opacity-10">
                                {order.detalles && order.detalles.map((detalle, idx) => (
                                    <div key={idx} className="d-flex align-items-center mb-3 border-bottom pb-2">
                                        <div className="me-3">
                                            <div className="bg-secondary bg-opacity-25 rounded d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px' }}>
                                                <span style={{ fontSize: '20px' }}>🛍️</span>
                                            </div>
                                        </div>
                                        <div className="flex-grow-1">
                                            <p className="mb-0 fw-medium">{detalle.nombre_producto}</p>
                                            <small className="text-muted">
                                                Cant: {detalle.cantidad} x {formatPrice(Number(detalle.precio_unitario))}
                                            </small>
                                        </div>
                                        <div className="text-end fw-bold">
                                            {formatPrice(Number(detalle.precio_unitario) * detalle.cantidad)}
                                        </div>
                                    </div>
                                ))}

                                {(order.estado === 'enviado' || order.estado === 'entregado') && order.tracking_number && (
                                    <div className="mt-3 p-3 bg-white border rounded">
                                        <p className="mb-1 small text-muted text-uppercase fw-bold">Seguimiento de envío ({order.shipping_provider})</p>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <span className="fw-bold font-monospace">{order.tracking_number}</span>
                                            <Button variant="outline-primary" size="sm" href="#" target="_blank">
                                                Seguir Envío
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

import { Button } from 'react-bootstrap';