import React, { useEffect, useState } from 'react';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { categoryService } from '../../api/categoryService';

export const CategoryForm = () => {
    const { id } = useParams(); // Si hay ID, es edición
    const navigate = useNavigate();
    const isEditing = !!id;

    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        activo: true
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isEditing) {
            const fetchCategory = async () => {
                try {
                    const category = await categoryService.getCategoryById(Number(id));
                    setFormData({
                        nombre: category.nombre,
                        descripcion: category.descripcion || '',
                        activo: category.activo
                    });
                } catch (err) {
                    setError('Error al cargar la categoría');
                }
            };
            fetchCategory();
        }
    }, [id, isEditing]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isEditing) {
                await categoryService.updateCategory(Number(id), formData);
            } else {
                await categoryService.createCategory(formData);
            }
            navigate('/admin/categorias');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al guardar la categoría');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="py-4" style={{ maxWidth: '600px' }}>
            <h2 className="mb-4">{isEditing ? 'Editar Categoría' : 'Nueva Categoría'}</h2>
            
            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control
                        type="text"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        required
                        minLength={2}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Descripción</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        name="descripcion"
                        value={formData.descripcion}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Check
                        type="checkbox"
                        label="Activo"
                        name="activo"
                        checked={formData.activo}
                        onChange={handleChange}
                    />
                </Form.Group>

                <div className="d-flex gap-2">
                    <Button variant="primary" type="submit" disabled={loading}>
                        {loading ? 'Guardando...' : 'Guardar'}
                    </Button>
                    <Button variant="secondary" onClick={() => navigate('/admin/categorias')}>
                        Cancelar
                    </Button>
                </div>
            </Form>
        </Container>
    );
};