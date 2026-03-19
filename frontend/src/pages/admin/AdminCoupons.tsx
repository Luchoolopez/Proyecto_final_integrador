import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Table, Spinner, Badge, Card } from 'react-bootstrap';
import { couponService } from '../../api/couponService';
import { type Coupon } from '../../types/Promo';
import { ToastNotification } from '../../components/ToastNotification';

export const AdminCoupons = () => {
    const [cupones, setCupones] = useState<Coupon[]>([]);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    // Estado para el Toast
    const [toast, setToast] = useState({
        show: false,
        message: '',
        variant: 'success' as 'success' | 'error'
    });

    // Estado inicial del formulario
    const initialFormState = {
        codigo: '',
        tipo: 'porcentaje' as 'porcentaje' | 'monto_fijo',
        valor: '',
        monto_minimo: 0,
        usos_maximos: '',
        limite_uso_por_usuario: 1,
        fecha_inicio: '',
        fecha_fin: ''
    };
    const [formData, setFormData] = useState(initialFormState);

    // Cargar cupones al inicio
    useEffect(() => {
        fetchCupones();
    }, []);

    const fetchCupones = async () => {
        try {
            setFetching(true);
            const response = await couponService.getAll();
            setCupones(response.data.data);
        } catch (error: any) {
            setToast({ show: true, message: 'Error al cargar los cupones', variant: 'error' });
        } finally {
            setFetching(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<any>) => {
        const { name, value } = e.target;
        setFormData({ 
            ...formData, 
            [name]: name === 'codigo' ? value.toUpperCase() : value 
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Preparamos los datos parseando los números
            const payload = {
                ...formData,
                valor: Number(formData.valor),
                monto_minimo: Number(formData.monto_minimo),
                usos_maximos: formData.usos_maximos ? Number(formData.usos_maximos) : null,
                limite_uso_por_usuario: Number(formData.limite_uso_por_usuario),
            };

            await couponService.create(payload);
            setToast({ show: true, message: 'Cupón creado exitosamente', variant: 'success' });
            setFormData(initialFormState); // Limpiar formulario
            fetchCupones(); // Recargar la tabla
        } catch (error: any) {
            setToast({ show: true, message: error.response?.data?.message || 'Error al crear cupón', variant: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('¿Estás seguro de eliminar este cupón?')) return;
        
        try {
            await couponService.delete(id);
            setToast({ show: true, message: 'Cupón eliminado', variant: 'success' });
            fetchCupones();
        } catch (error: any) {
            setToast({ show: true, message: 'Error al eliminar', variant: 'error' });
        }
    };

    const handleToggleStatus = async (cupon: Coupon) => {
        try {
            await couponService.update(cupon.id, { activo: !cupon.activo });
            setToast({ show: true, message: 'Estado actualizado', variant: 'success' });
            fetchCupones();
        } catch (error) {
            setToast({ show: true, message: 'Error al actualizar estado', variant: 'error' });
        }
    };

    return (
        <div className="admin-container p-4">
            <h2 className="mb-4">Gestión de Cupones</h2>

            {/* FORMULARIO DE CREACIÓN */}
            <Card className="mb-4 shadow-sm">
                <Card.Header className="bg-primary text-white">
                    <h5 className="mb-0">Crear Nuevo Cupón</h5>
                </Card.Header>
                <Card.Body>
                    <Form onSubmit={handleSubmit}>
                        <Row className="g-3">
                            <Col md={3}>
                                <Form.Group>
                                    <Form.Label>Código (ej: VERANO2026)</Form.Label>
                                    <Form.Control required name="codigo" value={formData.codigo} onChange={handleChange} className="text-uppercase" />
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Form.Group>
                                    <Form.Label>Tipo de Descuento</Form.Label>
                                    <Form.Select name="tipo" value={formData.tipo} onChange={handleChange}>
                                        <option value="porcentaje">Porcentaje (%)</option>
                                        <option value="monto_fijo">Monto Fijo ($)</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Form.Group>
                                    <Form.Label>Valor</Form.Label>
                                    <Form.Control required type="number" step="0.01" name="valor" value={formData.valor} onChange={handleChange} placeholder={formData.tipo === 'porcentaje' ? 'Ej: 15' : 'Ej: 5000'} />
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Form.Group>
                                    <Form.Label>Monto Mín. Compra ($)</Form.Label>
                                    <Form.Control type="number" name="monto_minimo" value={formData.monto_minimo} onChange={handleChange} />
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Form.Group>
                                    <Form.Label>Usos Máx. (Global)</Form.Label>
                                    <Form.Control type="number" name="usos_maximos" value={formData.usos_maximos} onChange={handleChange} placeholder="Vacío = Ilimitado" />
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Form.Group>
                                    <Form.Label>Usos Máx. (Por Usuario)</Form.Label>
                                    <Form.Control type="number" required min="1" name="limite_uso_por_usuario" value={formData.limite_uso_por_usuario} onChange={handleChange} />
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Form.Group>
                                    <Form.Label>Fecha Inicio</Form.Label>
                                    <Form.Control required type="date" name="fecha_inicio" value={formData.fecha_inicio} onChange={handleChange} />
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Form.Group>
                                    <Form.Label>Fecha Fin</Form.Label>
                                    <Form.Control required type="date" name="fecha_fin" value={formData.fecha_fin} onChange={handleChange} />
                                </Form.Group>
                            </Col>
                            <Col xs={12} className="d-flex justify-content-end mt-4">
                                <Button variant="primary" type="submit" disabled={loading}>
                                    {loading ? <Spinner size="sm" animation="border" /> : 'Guardar Cupón'}
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Card.Body>
            </Card>

            {/* TABLA DE CUPONES EXISTENTES */}
            <Card className="shadow-sm">
                <Card.Header className="bg-dark text-white d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Cupones Activos e Historial</h5>
                    {fetching && <Spinner size="sm" animation="border" />}
                </Card.Header>
                <Card.Body className="p-0">
                    <div className="table-responsive">
                        <Table hover className="mb-0 align-middle">
                            <thead className="table-light">
                                <tr>
                                    <th>Código</th>
                                    <th>Tipo</th>
                                    <th>Valor</th>
                                    <th>Mínimo</th>
                                    <th>Usos</th>
                                    <th>Vigencia</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cupones.length === 0 && !fetching ? (
                                    <tr><td colSpan={8} className="text-center py-4">No hay cupones creados aún.</td></tr>
                                ) : (
                                    cupones.map((cupon) => (
                                        <tr key={cupon.id}>
                                            <td className="fw-bold text-primary">{cupon.codigo}</td>
                                            <td>{cupon.tipo === 'porcentaje' ? 'Porcentaje' : 'Monto Fijo'}</td>
                                            <td>{cupon.tipo === 'porcentaje' ? `${cupon.valor}%` : `$${cupon.valor}`}</td>
                                            <td>${cupon.monto_minimo}</td>
                                            <td>
                                                {cupon.usos_actuales} / {cupon.usos_maximos || '∞'}
                                                <small className="d-block text-muted">Límite por user: {cupon.limite_uso_por_usuario}</small>
                                            </td>
                                            <td>
                                                <small>
                                                    Desde: {new Date(cupon.fecha_inicio).toLocaleDateString()}<br/>
                                                    Hasta: {new Date(cupon.fecha_fin).toLocaleDateString()}
                                                </small>
                                            </td>
                                            <td>
                                                <Badge bg={cupon.activo ? 'success' : 'secondary'} style={{ cursor: 'pointer' }} onClick={() => handleToggleStatus(cupon)}>
                                                    {cupon.activo ? 'Activo' : 'Inactivo'}
                                                </Badge>
                                            </td>
                                            <td>
                                                <Button variant="outline-danger" size="sm" onClick={() => handleDelete(cupon.id)}>
                                                    <i className="bi bi-trash"></i>
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </Table>
                    </div>
                </Card.Body>
            </Card>

            <ToastNotification show={toast.show} onClose={() => setToast({ ...toast, show: false })} message={toast.message} variant={toast.variant} />
        </div>
    );
};
