import React from 'react';
import { Link } from 'react-router-dom';

export const PurchaseCard = () => {
    const orders = [
        {
            id: '98881',
            date: '06/09/2025',
            productsCount: 3,
            imageUrl: 'https://via.placeholder.com/80x80/FF0000/FFFFFF?text=Product',
            paymentStatus: 'Pagado',
            deliveryStatus: 'Enviado',
            total: '33.900',
            detailsLink: '/order/98881',
            trackLink: '/track/98881'
        },
        {
            id: '95348',
            date: '07/06/2025',
            productsCount: 1,
            imageUrl: 'https://via.placeholder.com/80x80/00FF00/000000?text=Product',
            paymentStatus: 'Pagado',
            deliveryStatus: 'Entregado',
            total: '15.500',
            detailsLink: '/order/95348',
            trackLink: '/track/95348'
        },
        {
            id: '93278',
            date: '19/04/2025',
            productsCount: 2,
            imageUrl: 'https://via.placeholder.com/80x80/0000FF/FFFFFF?text=Product',
            paymentStatus: 'Pendiente',
            deliveryStatus: 'En Proceso',
            total: '22.100',
            detailsLink: '/order/93278',
            trackLink: '/track/93278'
        },
        {
            id: '87445',
            date: '30/11/2024',
            productsCount: 1,
            imageUrl: 'https://via.placeholder.com/80x80/FFFF00/000000?text=Product',
            paymentStatus: 'Pagado',
            deliveryStatus: 'Cancelado',
            total: '10.000',
            detailsLink: '/order/87445',
            trackLink: '/track/87445'
        },
        {
            id: '81980',
            date: '02/07/2024',
            productsCount: 4,
            imageUrl: 'https://via.placeholder.com/80x80/FF00FF/FFFFFF?text=Product',
            paymentStatus: 'Pagado',
            deliveryStatus: 'Entregado',
            total: '45.000',
            detailsLink: '/order/81980',
            trackLink: '/track/81980'
        },
    ];

 return (
        <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Mis compras</h5>
            </div>

            <div className="accordion accordion-flush" id="purchase-accordion">
                {orders.map((order, index) => (
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
                                <div>
                                    Orden #{order.id}
                                    <br />
                                    <small>{order.date}</small>
                                </div>
                            </button>
                        </h2>
                        <div
                            id={`collapse${order.id}`}
                            className="accordion-collapse collapse"
                            aria-labelledby={`heading${order.id}`}
                        >
                            <div className="accordion-body d-flex align-items-center">
                                <div className="me-3 position-relative">
                                    <img
                                        src={order.imageUrl}
                                        alt={`Producto de la orden ${order.id}`}
                                        className="img-fluid rounded"
                                        style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                                    />
                                    <span className="position-absolute top-0 start-0 translate-middle badge rounded-pill bg-danger">
                                        {order.productsCount} PRODUCTOS
                                    </span>
                                </div>
                                <div className="flex-grow-1 d-flex flex-column justify-content-center">
                                    <div className="d-flex justify-content-between align-items-center mb-1">
                                        <div>
                                            <p className="mb-0 small">Pago: <strong>{order.paymentStatus}</strong></p>
                                            <p className="mb-0 small">Envío: <strong>{order.deliveryStatus}</strong></p>
                                        </div>
                                        <div className="text-end">
                                            <p className="mb-0 fs-5 fw-bold">Total: ${order.total}</p>
                                            <Link to={order.detailsLink} className="text-decoration-none small">Ver detalle</Link>
                                        </div>
                                    </div>
                                </div>
                                <div className="ms-3">
                                    <Link to={order.trackLink} className="btn btn-warning">SEGUÍ TU ORDEN</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};