import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Card, Spinner, Table, Badge } from 'react-bootstrap';
import { promotionService } from '../../api/promotionService';
import { categoryService } from '../../api/categoryService';
import { productService } from '../../api/productService'; // <-- IMPORTAMOS PRODUCTOS
import { ToastNotification } from '../../components/ToastNotification';

export const AdminPromotions = () => {
    const [promociones, setPromociones] = useState<any[]>([]);
    const [categoriasBD, setCategoriasBD] = useState<any[]>([]);
    const [productosBD, setProductosBD] = useState<any[]>([]); // <-- NUEVO ESTADO PARA PRODUCTOS
    
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [toast, setToast] = useState({ show: false, message: '', variant: 'success' as 'success' | 'error' });

    const initialFormState = {
        nombre: '',
        tipo: 'porcentaje',
        valor: '',
        lleva_n: '',
        paga_m: '',
        fecha_inicio: '',
        fecha_fin: '',
        acumulable: false,
    };

    const [formData, setFormData] = useState(initialFormState);
    const [selectedCategorias, setSelectedCategorias] = useState<number[]>([]);
    const [selectedProductos, setSelectedProductos] = useState<number[]>([]); // <-- NUEVO ESTADO
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchPromociones();
        fetchCategoriasYProductos();
    }, []);

    const fetchPromociones = async () => {
        try {
            setFetching(true);
            const res = await promotionService.getAll();
            setPromociones(res.data.data);
        } catch (err) {
            setToast({ show: true, message: 'Error al cargar promociones', variant: 'error' });
        } finally {
            setFetching(false);
        }
    };

    // Cargamos tanto las categorías como los productos para mostrar en las listas
    const fetchCategoriasYProductos = async () => {
        try {
            const [categorias, resProd] = await Promise.all([
                categoryService.getCategories(),
                productService.getProducts({ limit: 1000 }) // Traemos muchos productos para el listado
            ]);
            setCategoriasBD(categorias);
            setProductosBD(resProd.productos);
        } catch (err) {
            console.error("Error al cargar datos auxiliares", err);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    // Función para tildar o destildar Categorías
    const toggleCategoria = (id: number) => {
        setSelectedCategorias(prev => 
            prev.includes(id) ? prev.filter(cId => cId !== id) : [...prev, id]
        );
    };

    // Función para tildar o destildar Productos
    const toggleProducto = (id: number) => {
        setSelectedProductos(prev => 
            prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                ...formData,
                valor: formData.valor ? Number(formData.valor) : null,
                lleva_n: formData.lleva_n ? Number(formData.lleva_n) : null,
                paga_m: formData.paga_m ? Number(formData.paga_m) : null,
                categoriasIds: selectedCategorias,
                productosIds: selectedProductos // <-- ENVIAMOS LOS PRODUCTOS AL BACKEND
            };

            await promotionService.create(payload);
            setToast({ show: true, message: 'Promoción Automática activada', variant: 'success' });
            setFormData(initialFormState);
            setSelectedCategorias([]);
            setSelectedProductos([]);
            fetchPromociones();
        } catch (err: any) {
            setToast({ show: true, message: err.response?.data?.message || 'Error al crear', variant: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('¿Eliminar esta promoción?')) return;
        await promotionService.delete(id);
        fetchPromociones();
    };

    const handleToggle = async (id: number) => {
        await promotionService.toggleStatus(id);
        fetchPromociones();
    };

    const productosFiltrados = productosBD.filter(prod => 
        prod.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="admin-container p-4">
            <h2 className="mb-4">Ofertas Automáticas (Sin código)</h2>

            <Card className="mb-4 shadow-sm border-0">
                <Card.Header className="bg-success text-white py-3">
                    <h5 className="mb-0 fw-bold"><i className="bi bi-lightning-charge-fill me-2"></i>Crear Nueva Oferta</h5>
                </Card.Header>
                <Card.Body className="p-4 bg-body-tertiary">
                    <Form onSubmit={handleSubmit}>
                        <Row className="g-4">
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="fw-bold">Nombre de la Campaña (Interno)</Form.Label>
                                    <Form.Control required placeholder="Ej: Hot Sale Invierno - Remeras" name="nombre" value={formData.nombre} onChange={handleChange} />
                                </Form.Group>
                            </Col>
                            
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="fw-bold">Tipo de Oferta Automática</Form.Label>
                                    <Form.Select name="tipo" value={formData.tipo} onChange={handleChange}>
                                        <option value="porcentaje">% de Descuento (Ej: 20% OFF)</option>
                                        <option value="nxm">Lleva N Paga M (Ej: 3x2, 2x1)</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>

                            {formData.tipo === 'porcentaje' ? (
                                <Col md={4}>
                                    <Form.Group>
                                        <Form.Label className="fw-bold">Porcentaje de Descuento</Form.Label>
                                        <Form.Control required type="number" name="valor" placeholder="Ej: 30" value={formData.valor} onChange={handleChange} />
                                    </Form.Group>
                                </Col>
                            ) : (
                                <>
                                    <Col md={2}>
                                        <Form.Group>
                                            <Form.Label className="fw-bold">Llevás (N)</Form.Label>
                                            <Form.Control required type="number" name="lleva_n" placeholder="Ej: 3" value={formData.lleva_n} onChange={handleChange} />
                                        </Form.Group>
                                    </Col>
                                    <Col md={2}>
                                        <Form.Group>
                                            <Form.Label className="fw-bold">Pagás (M)</Form.Label>
                                            <Form.Control required type="number" name="paga_m" placeholder="Ej: 2" value={formData.paga_m} onChange={handleChange} />
                                        </Form.Group>
                                    </Col>
                                </>
                            )}

                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label className="fw-bold">Fecha Inicio</Form.Label>
                                    <Form.Control required type="datetime-local" name="fecha_inicio" value={formData.fecha_inicio} onChange={handleChange} />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label className="fw-bold">Fecha Fin</Form.Label>
                                    <Form.Control required type="datetime-local" name="fecha_fin" value={formData.fecha_fin} onChange={handleChange} />
                                </Form.Group>
                            </Col>

                            {/* --- SECCIÓN MEJORADA DE SELECCIÓN --- */}
                            <Col md={12} className="border-top pt-4 mt-4">
                                <h5 className="fw-bold text-primary mb-3">¿A qué se aplica esta oferta automáticamente?</h5>
                                <p className="text-muted small mb-4">
                                    Si no seleccionás nada, la oferta aplicará a <strong>TODA LA TIENDA</strong>. Podés combinar categorías y productos específicos.
                                </p>
                                
                                <Row>
                                    {/* LISTA DE CATEGORÍAS */}
                                    <Col md={6}>
                                        <Form.Label className="fw-bold">1. Limitar por Categorías</Form.Label>
                                        <div className="border rounded p-3 bg-body" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                            {categoriasBD.length === 0 ? (
                                                <span className="text-muted small">No hay categorías cargadas.</span>
                                            ) : (
                                                categoriasBD.map(cat => (
                                                    <Form.Check 
                                                        key={`cat-${cat.id}`}
                                                        type="checkbox"
                                                        id={`categoria-${cat.id}`}
                                                        label={cat.nombre}
                                                        checked={selectedCategorias.includes(cat.id)}
                                                        onChange={() => toggleCategoria(cat.id)}
                                                        className="mb-2"
                                                    />
                                                ))
                                            )}
                                        </div>
                                    </Col>

                                    {/* LISTA DE PRODUCTOS */}
                                    <Col md={6}>
                                        <Form.Label className="fw-bold">2. Limitar por Productos Específicos</Form.Label>
                                        <Form.Control 
                                            type="text"
                                            placeholder="Buscar producto..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="mb-2"
                                        />
                                        <div className="border rounded p-3 bg-body" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                            {productosFiltrados.length === 0 ? (
                                                <span className="text-muted small">No se encontraron productos.</span>
                                            ) : (
                                                productosFiltrados.map(prod => (
                                                    <Form.Check 
                                                        key={`prod-${prod.id}`}
                                                        type="checkbox"
                                                        id={`producto-${prod.id}`}
                                                        label={prod.nombre}
                                                        checked={selectedProductos.includes(prod.id)}
                                                        onChange={() => toggleProducto(prod.id)}
                                                        className="mb-2"
                                                    />
                                                ))
                                            )}
                                        </div>
                                    </Col>
                                </Row>

                                <Row className="mt-4">
                                    <Col md={12}>
                                        <div className="bg-body p-3 border rounded border-warning">
                                            <Form.Check 
                                                type="switch" 
                                                id="acumulable-switch" 
                                                name="acumulable" 
                                                label="Permitir que el cliente sume un Cupón Manual a esta oferta" 
                                                checked={formData.acumulable} 
                                                onChange={handleChange}
                                                className="fw-bold"
                                            />
                                        </div>
                                    </Col>
                                </Row>
                            </Col>
                            {/* ------------------------------------- */}

                            <Col xs={12} className="d-flex justify-content-end mt-4 border-top pt-3">
                                <Button variant="success" type="submit" disabled={loading} size="lg">
                                    {loading ? <Spinner size="sm" animation="border" /> : '🚀 Activar Oferta Automática'}
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Card.Body>
            </Card>

            {/* TABLA DE PROMOCIONES ACTIVAS */}
            <Card className="shadow-sm border-0">
                <Card.Header className="bg-dark text-white d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Promociones Vigentes</h5>
                    {fetching && <Spinner size="sm" animation="border" />}
                </Card.Header>
                <Card.Body className="p-0">
                    <Table hover className="mb-0 align-middle">
                        <thead className="table-light">
                            <tr>
                                <th>Campaña</th>
                                <th>Regla</th>
                                <th>Aplica a</th>
                                <th>Vigencia</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {promociones.map(promo => (
                                <tr key={promo.id}>
                                    <td className="fw-bold">{promo.nombre}</td>
                                    <td>
                                        <Badge bg="info" text="dark">
                                            {promo.tipo === 'porcentaje' ? `${promo.valor}% OFF` : `Llevá ${promo.lleva_n} Pagá ${promo.paga_m}`}
                                        </Badge>
                                    </td>
                                    <td>
                                        {promo.categorias?.length === 0 && promo.productos?.length === 0 ? (
                                            <Badge bg="dark">Toda la tienda</Badge>
                                        ) : (
                                            <div style={{ maxWidth: '200px', display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                                                {promo.categorias?.map((c:any) => <Badge bg="secondary" key={`c-${c.id}`}>Cat: {c.nombre}</Badge>)}
                                                {promo.productos?.map((p:any) => <Badge bg="primary" key={`p-${p.id}`}>Prod: {p.nombre}</Badge>)}
                                            </div>
                                        )}
                                    </td>
                                    <td>
                                        <small>{new Date(promo.fecha_inicio).toLocaleDateString()} - {new Date(promo.fecha_fin).toLocaleDateString()}</small>
                                    </td>
                                    <td>
                                        <Badge bg={promo.activa ? 'success' : 'secondary'} style={{cursor:'pointer'}} onClick={() => handleToggle(promo.id)}>
                                            {promo.activa ? 'Activa' : 'Pausada'}
                                        </Badge>
                                    </td>
                                    <td>
                                        <Button variant="outline-danger" size="sm" onClick={() => handleDelete(promo.id)}><i className="bi bi-trash"></i></Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>

            <ToastNotification show={toast.show} onClose={() => setToast({ ...toast, show: false })} message={toast.message} variant={toast.variant} />
        </div>
    );
};