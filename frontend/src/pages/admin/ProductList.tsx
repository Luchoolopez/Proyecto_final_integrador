import React, { useEffect, useState } from 'react';
import { Table, Button, Container, Badge, Alert, Form, InputGroup, Pagination } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { productService, type ProductFilters } from '../../api/productService';
import { type Product } from '../../types/Product';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaTimes } from 'react-icons/fa';
import { formatPrice } from '../../utils/formatPrice';
import { ToastNotification } from '../../components/ToastNotification';
import { ConfirmModal } from '../../components/ConfirmModal';

export const ProductList = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showActive, setShowActive] = useState<string>('true');

    // Estados de paginación
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const LIMIT = 10;

    const [showConfirm, setShowConfirm] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [toast, setToast] = useState({
        show: false,
        message: '',
        variant: 'success' as 'success' | 'error' | 'warning' | 'info'
    });

    // MODIFICADO: Ahora recibe 'page' como argumento para evitar conflictos de estado
    const fetchProducts = async (page: number, search = '') => {
        try {
            setLoading(true);

            const filters: ProductFilters = {
                sort: 'id,DESC',
                talles: [],
                limit: LIMIT,
                page: page, // Usamos el argumento recibido
                active: showActive === 'all' ? undefined : showActive === 'true',
                busqueda: search
            };

            const data = await productService.getProducts(filters);
            setProducts(data.productos);
            setTotalPages(data.pagination.totalPages);
            setCurrentPage(data.pagination.page); // Aseguramos sincronización
        } catch (err) {
            setError('Error al cargar productos');
        } finally {
            setLoading(false);
        }
    };

    // Efecto al cambiar filtro Activo/Inactivo (Resetea a página 1)
    useEffect(() => {
        setCurrentPage(1);
        fetchProducts(1, searchTerm);
    }, [showActive]);

    // Efecto del buscador con Debounce (Resetea a página 1)
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            setCurrentPage(1);
            fetchProducts(1, searchTerm);
        }, 500);
        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    // Función para cambiar de página
    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            fetchProducts(page, searchTerm);
            window.scrollTo(0, 0); 
        }
    };

    const handleDeleteClick = (id: number) => {
        setDeleteId(id);
        setShowConfirm(true);
    };

    const executeDelete = async () => {
        if (!deleteId) return;

        try {
            await productService.deleteProduct(deleteId);

            if (showActive === 'true') {
                setProducts(products.filter(p => p.id !== deleteId));
            } else {
                setProducts(products.map(p => p.id === deleteId ? { ...p, activo: false } : p));
            }

            setToast({ show: true, message: 'Producto eliminado (desactivado) correctamente', variant: 'success' });

        } catch (err: any) {
            setToast({ show: true, message: 'Error al eliminar el producto', variant: 'error' });
        }
    };

    return (
        <Container className="py-4">
            <style>{`
                .search-addon { background-color: #fff; border-color: #ced4da; color: #6c757d; }
                [data-bs-theme="dark"] .search-addon { background-color: #212529; border-color: #495057; color: #e9ecef; }
                [data-bs-theme="dark"] .search-clear-btn:hover { background-color: #343a40; color: #fff; }
            `}</style>

            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Administrar Productos</h2>
                <Link to="/admin/productos/nuevo" className="btn btn-primary">
                    <FaPlus className="me-2" /> Nuevo Producto
                </Link>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}

            <div className="d-flex gap-2 mb-4">
                <div className="flex-grow-1">
                    <InputGroup>
                        <InputGroup.Text className="search-addon border-end-0"><FaSearch /></InputGroup.Text>
                        <Form.Control
                            type="text"
                            placeholder="Buscar por nombre, descripción o SKU..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="border-start-0 border-end-0 shadow-none"
                        />
                        {searchTerm && (
                            <Button variant="outline-secondary" className="search-addon search-clear-btn border-start-0" onClick={() => setSearchTerm('')}>
                                <FaTimes />
                            </Button>
                        )}
                    </InputGroup>
                </div>
                <div style={{ width: '200px' }}>
                    <Form.Select value={showActive} onChange={(e) => setShowActive(e.target.value)}>
                        <option value="true">Ver Activos</option>
                        <option value="false">Ver Inactivos</option>
                    </Form.Select>
                </div>
            </div>

            <div className="table-responsive shadow-sm rounded">
                <Table hover className="mb-0 align-middle">
                    <thead className="table-dark">
                        <tr>
                            <th style={{ width: '50px' }}>ID</th>
                            <th style={{ width: '80px' }}>Img</th>
                            <th>Nombre</th>
                            <th>Categoría</th>
                            <th>Precio</th>
                            <th>Stock</th>
                            <th>Estado</th>
                            <th className="text-end">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={8} className="text-center py-5">Cargando...</td></tr>
                        ) : products.map((product) => (
                            <tr key={product.id}>
                                <td className="fw-bold">#{product.id}</td>
                                <td>
                                    <img
                                        src={product.imagen_principal || 'https://via.placeholder.com/50'}
                                        alt="miniatura"
                                        style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                                    />
                                </td>
                                <td className="fw-medium">
                                    {product.nombre}
                                    {product.sku && <div className="text-muted small" style={{ fontSize: '0.75em' }}>SKU: {product.sku}</div>}
                                </td>
                                <td>{product.categoria?.nombre || '-'}</td>
                                <td>
                                    {formatPrice(product.precio_final)}
                                </td>
                                <td>{product.stock_total}</td>
                                <td>
                                    <Badge bg={product.activo ? 'success' : 'secondary'}>
                                        {product.activo ? 'Activo' : 'Inactivo'}
                                    </Badge>
                                </td>
                                <td className="text-end">
                                    <Link to={`/admin/productos/editar/${product.id}`} className="btn btn-sm btn-outline-primary me-2">
                                        <FaEdit />
                                    </Link>
                                    <Button variant="outline-danger" size="sm" onClick={() => handleDeleteClick(product.id)}>
                                        <FaTrash />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                        {!loading && products.length === 0 && (
                            <tr>
                                <td colSpan={8} className="text-center py-4 text-muted">
                                    {showActive === 'true' ? 'No hay productos activos' : 'No hay productos inactivos'}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>

            {/* AGREGADO: Controles de Paginación */}
            {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-4">
                    <Pagination>
                        <Pagination.First 
                            onClick={() => handlePageChange(1)} 
                            disabled={currentPage === 1} 
                        />
                        <Pagination.Prev 
                            onClick={() => handlePageChange(currentPage - 1)} 
                            disabled={currentPage === 1} 
                        />
                        
                        {[...Array(totalPages)].map((_, index) => {
                            const pageNum = index + 1;
                            if (
                                pageNum === 1 || 
                                pageNum === totalPages || 
                                (pageNum >= currentPage - 2 && pageNum <= currentPage + 2)
                            ) {
                                return (
                                    <Pagination.Item 
                                        key={pageNum} 
                                        active={pageNum === currentPage}
                                        onClick={() => handlePageChange(pageNum)}
                                    >
                                        {pageNum}
                                    </Pagination.Item>
                                );
                            } else if (
                                pageNum === currentPage - 3 || 
                                pageNum === currentPage + 3
                            ) {
                                return <Pagination.Ellipsis key={pageNum} />;
                            }
                            return null;
                        })}

                        <Pagination.Next 
                            onClick={() => handlePageChange(currentPage + 1)} 
                            disabled={currentPage === totalPages} 
                        />
                        <Pagination.Last 
                            onClick={() => handlePageChange(totalPages)} 
                            disabled={currentPage === totalPages} 
                        />
                    </Pagination>
                </div>
            )}

            <ConfirmModal
                show={showConfirm}
                onClose={() => setShowConfirm(false)}
                onConfirm={executeDelete}
                title="¿Eliminar producto?"
                message="Estás seguro de eliminar este producto? (Se desactivará)"
                confirmText="Eliminar"
                variant="danger"
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