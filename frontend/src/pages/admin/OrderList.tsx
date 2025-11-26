import React, { useEffect, useState } from 'react';
import { Container, Table, Badge, Button, Modal, Form, Row, Col, Card, Pagination } from 'react-bootstrap';
import { FaEye } from 'react-icons/fa';
import { orderService, type Order } from '../../api/orderService';
import { formatPrice } from '../../utils/formatPrice';
import { useTheme } from '../../context/ThemeContext';
import { ToastNotification } from '../../components/ToastNotification';
import { ConfirmModal } from '../../components/ConfirmModal';

export const OrderList = () => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(1);
    const [page, setPage] = useState(1);
    const [filterStatus, setFilterStatus] = useState('todos');

    const [showModal, setShowModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    const [showConfirm, setShowConfirm] = useState(false);

    const [editStatus, setEditStatus] = useState('');
    const [tracking, setTracking] = useState('');
    const [provider, setProvider] = useState('');

    const [toast, setToast] = useState({
        show: false,
        message: '',
        variant: 'success' as 'success' | 'error' | 'warning' | 'info'
    });

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const data = await orderService.getAllOrders({
                page,
                limit: 10,
                estado: filterStatus
            });
            setOrders(data.orders);
            setTotalPages(data.totalPages);
        } catch (err) {
            console.error("Error cargando órdenes", err);
            setToast({ show: true, message: 'Error al cargar el listado de órdenes', variant: 'error' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [page, filterStatus]);

    const handleOpenModal = (order: Order) => {
        setSelectedOrder(order);
        setEditStatus(order.estado);
        setTracking(order.tracking_number || '');
        setProvider(order.shipping_provider || '');
        setShowModal(true);
    };

    const executeSave = async () => {
        if (!selectedOrder) return;

        try {
            await orderService.updateOrderStatus(selectedOrder.id, {
                estado: editStatus,
                tracking_number: tracking,
                shipping_provider: provider
            });
            
            setToast({ show: true, message: 'Orden actualizada correctamente', variant: 'success' });
            setShowModal(false);
            fetchOrders();
        } catch (err) {
            setToast({ show: true, message: 'Error al actualizar la orden', variant: 'error' });
        }
    };

    const handleSaveUpdate = () => {
        if (editStatus === 'enviado' && !tracking) {
            setShowConfirm(true);
        } else {
            executeSave();
        }
    };

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

    return (
        <Container className="py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Gestión de Órdenes</h2>
                <Form.Select
                    style={{ width: '200px' }}
                    value={filterStatus}
                    onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
                >
                    <option value="todos">Todos los estados</option>
                    <option value="pendiente">Pendientes</option>
                    <option value="confirmado">Confirmados</option>
                    <option value="armando">Armando</option>
                    <option value="enviado">Enviados</option>
                    <option value="entregado">Entregados</option>
                    <option value="cancelado">Cancelados</option>
                </Form.Select>
            </div>

            <div className="table-responsive shadow-sm rounded">
                <Table hover className="mb-0 align-middle">
                    <thead className="table-dark">
                        <tr>
                            <th>ID</th>
                            <th>Fecha</th>
                            <th>Cliente</th>
                            <th>Total</th>
                            <th>Estado</th>
                            <th className="text-end">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={6} className="text-center py-5">Cargando...</td></tr>
                        ) : orders.map(order => (
                            <tr key={order.id}>
                                <td className="fw-bold">#{order.id}</td>
                                <td>{new Date(order.fecha).toLocaleDateString()}</td>
                                <td>
                                    <div className="fw-bold">{order.usuario?.nombre}</div>
                                    <div className="small text-muted">{order.usuario?.email}</div>
                                </td>
                                <td className="fw-bold">{formatPrice(Number(order.total))}</td>
                                <td>
                                    <Badge bg={getStatusColor(order.estado)} className="text-uppercase px-3 py-2">
                                        {order.estado}
                                    </Badge>
                                </td>
                                <td className="text-end">
                                    <Button variant="outline-dark" size="sm" onClick={() => handleOpenModal(order)}>
                                        <FaEye className="me-1" /> Detalle
                                    </Button>
                                </td>
                            </tr>
                        ))}
                        {!loading && orders.length === 0 && (
                            <tr><td colSpan={6} className="text-center py-4">No se encontraron órdenes.</td></tr>
                        )}
                    </tbody>
                </Table>
            </div>

            {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-4">
                    <Pagination>
                        <Pagination.Prev onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} />
                        <Pagination.Item active>{page}</Pagination.Item>
                        <Pagination.Next onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} />
                    </Pagination>
                </div>
            )}

            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Orden #{selectedOrder?.id} - {selectedOrder?.usuario?.nombre}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedOrder && (
                        <>
                            <Row className="mb-4">
                                <Col md={6}>
                                    <Card className={`h-100 border ${isDark ? 'bg-dark' : 'bg-light'}`}>
                                        <Card.Body>
                                            <h6 className="fw-bold mb-3">Estado & Envío</h6>
                                            <Form.Group className="mb-3">
                                                <Form.Label className="small text-muted">Estado del Pedido</Form.Label>
                                                <Form.Select 
                                                    value={editStatus} 
                                                    onChange={(e) => setEditStatus(e.target.value)}
                                                    className="fw-bold"
                                                >
                                                    <option value="pendiente">Pendiente</option>
                                                    <option value="confirmado">Confirmado</option>
                                                    <option value="armando">Armando</option>
                                                    <option value="enviado">Enviado</option>
                                                    <option value="entregado">Entregado</option>
                                                    <option value="cancelado">Cancelado</option>
                                                </Form.Select>
                                            </Form.Group>

                                            {(editStatus === 'enviado' || editStatus === 'entregado') && (
                                                <div className={`p-2 rounded border ${isDark ? 'bg-secondary bg-opacity-10' : 'bg-white'}`}>
                                                    <Form.Control 
                                                        size="sm" placeholder="Proveedor (ej: Correo Arg)" className="mb-2"
                                                        value={provider} onChange={(e) => setProvider(e.target.value)} 
                                                    />
                                                    <Form.Control 
                                                        size="sm" placeholder="Tracking Number"
                                                        value={tracking} onChange={(e) => setTracking(e.target.value)} 
                                                    />
                                                </div>
                                            )}
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col md={6}>
                                    <Card className={`h-100 border ${isDark ? 'bg-dark' : 'bg-light'}`}>
                                        <Card.Body>
                                            <h6 className="fw-bold mb-3">Dirección de Entrega</h6>
                                            {selectedOrder.direccion ? (
                                                <div className="small">
                                                    <p className="mb-1 fw-bold">
                                                        {selectedOrder.direccion.calle} {selectedOrder.direccion.numero}
                                                    </p>
                                                    <p className="mb-1">
                                                        {selectedOrder.direccion.ciudad}, {selectedOrder.direccion.provincia}
                                                    </p>
                                                    <p className="mb-0">CP: {selectedOrder.direccion.codigo_postal}</p>
                                                </div>
                                            ) : (
                                                <p className="text-muted small">Sin dirección registrada</p>
                                            )}
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                            
                            <h6 className="fw-bold mb-3">Productos</h6>
                            <Table size="sm" bordered responsive>
                                <thead className={isDark ? 'table-dark' : 'bg-light'}>
                                    <tr>
                                        <th>Producto</th>
                                        <th>Talle</th>
                                        <th className="text-center">Cant</th>
                                        <th className="text-end">Precio</th>
                                        <th className="text-end">Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedOrder.detalles?.map((item, idx) => (
                                        <tr key={idx}>
                                            <td>{item.nombre_producto}</td>
                                            <td>{item.talle}</td>
                                            <td className="text-center">{item.cantidad}</td>
                                            <td className="text-end">{formatPrice(Number(item.precio_unitario))}</td>
                                            <td className="text-end fw-medium">
                                                {formatPrice(Number(item.precio_unitario) * item.cantidad)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr className={isDark ? 'table-dark' : ''}>
                                        <td colSpan={4} className="text-end fw-bold">TOTAL</td>
                                        <td className="text-end fw-bold fs-5">
                                            {formatPrice(Number(selectedOrder.total))}
                                        </td>
                                    </tr>
                                </tfoot>
                            </Table>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={handleSaveUpdate}>
                        Guardar Cambios
                    </Button>
                </Modal.Footer>
            </Modal>
            
            <ConfirmModal
                show={showConfirm}
                onClose={() => setShowConfirm(false)}
                onConfirm={executeSave}
                title="¿Confirmar envío?"
                message="Estás marcando como ENVIADO sin número de seguimiento. ¿Deseas continuar?"
                confirmText="Sí, guardar"
                variant="warning"
            />

            <ToastNotification
                show={toast.show}
                onClose={() => setToast({ ...toast, show: false })}
                message={toast.message}
                variant={toast.variant}
            />
        </Container>
    );
};