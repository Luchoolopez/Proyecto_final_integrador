import React, { useEffect, useState } from 'react';
import { Table, Button, Container, Badge, Alert, Form, InputGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { categoryService, type Category } from '../../api/categoryService';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaTimes } from 'react-icons/fa';

export const CategoryList = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchCategories = async () => {
        try {
            setLoading(true);
            // Enviamos active: false para traer TODAS (activas e inactivas)
            const data = await categoryService.getCategories({ active: false });
            setCategories(data);
        } catch (err) {
            setError('Error al cargar categorías');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleDelete = async (id: number) => {
        if (window.confirm('¿Estás seguro de eliminar esta categoría?')) {
            try {
                await categoryService.deleteCategory(id);
                setCategories(categories.filter(c => c.id !== id));
            } catch (err: any) {
                alert(err.response?.data?.message || 'Error al eliminar');
            }
        }
    };

    // Helper para ignorar acentos y mayúsculas
    const normalizeText = (text: string) => {
        return text
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase();
    };

    // Lógica de Filtrado y Ordenamiento
    const filteredCategories = categories
        .filter(category => {
            if (!searchTerm) return true;
            const searchLower = normalizeText(searchTerm);
            const nameLower = normalizeText(category.nombre);
            const descLower = category.descripcion ? normalizeText(category.descripcion) : '';
            return nameLower.includes(searchLower) || descLower.includes(searchLower);
        })
        .sort((a, b) => a.id - b.id);

    if (loading) return <div className="p-4 text-center">Cargando categorías...</div>;

    return (
        <Container className="py-4">
            {/* Estilos locales para adaptar el buscador al tema oscuro/claro perfectamente */}
            <style>{`
                /* Modo Claro (Default) */
                .search-addon {
                    background-color: #fff;
                    border-color: #ced4da;
                    color: #6c757d;
                }
                
                /* Modo Oscuro (Coincide con tu index.css) */
                [data-bs-theme="dark"] .search-addon {
                    background-color: #212529; /* Mismo fondo que form-control */
                    border-color: #495057;     /* Mismo borde que form-control */
                    color: #e9ecef;
                }
                
                /* Ajuste para el botón X en hover en modo oscuro */
                [data-bs-theme="dark"] .search-clear-btn:hover {
                    background-color: #343a40;
                    color: #fff;
                }
            `}</style>

            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Administrar Categorías</h2>
                <Link to="/admin/categorias/nueva" className="btn btn-primary">
                    <FaPlus className="me-2" /> Nueva Categoría
                </Link>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}

            {/* Buscador Mejorado */}
            <div className="mb-4">
                <InputGroup>
                    <InputGroup.Text className="search-addon border-end-0">
                        <FaSearch />
                    </InputGroup.Text>
                    
                    <Form.Control
                        type="text"
                        placeholder="Buscar por nombre o descripción..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="border-start-0 border-end-0 shadow-none"
                    />
                    
                    {/* Botón X (Limpiar) */}
                    {searchTerm && (
                        <Button 
                            variant="outline-secondary" 
                            className="search-addon search-clear-btn border-start-0"
                            onClick={() => setSearchTerm('')}
                        >
                            <FaTimes />
                        </Button>
                    )}
                </InputGroup>
            </div>

            <div className="table-responsive shadow-sm rounded">
                <Table hover className="mb-0 align-middle">
                    <thead className="table-dark">
                        <tr>
                            <th style={{ width: '80px' }}>ID</th>
                            <th>Nombre</th>
                            <th>Descripción</th>
                            <th style={{ width: '100px' }}>Estado</th>
                            <th style={{ width: '150px' }} className="text-end">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCategories.map((category) => (
                            <tr key={category.id}>
                                <td className="fw-bold">#{category.id}</td>
                                <td className="fw-medium">{category.nombre}</td>
                                <td className="text-muted small">{category.descripcion || '-'}</td>
                                <td>
                                    <Badge bg={category.activo ? 'success' : 'secondary'}>
                                        {category.activo ? 'Activo' : 'Inactivo'}
                                    </Badge>
                                </td>
                                <td className="text-end">
                                    <Link 
                                        to={`/admin/categorias/editar/${category.id}`} 
                                        className="btn btn-sm btn-outline-primary me-2"
                                        title="Editar"
                                    >
                                        <FaEdit />
                                    </Link>
                                    <Button 
                                        variant="outline-danger" 
                                        size="sm" 
                                        onClick={() => handleDelete(category.id)}
                                        title="Eliminar"
                                    >
                                        <FaTrash />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                        {filteredCategories.length === 0 && (
                            <tr>
                                <td colSpan={5} className="text-center py-4 text-muted">
                                    {searchTerm 
                                        ? `No se encontraron resultados para "${searchTerm}"` 
                                        : 'No hay categorías registradas'}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>
        </Container>
    );
};