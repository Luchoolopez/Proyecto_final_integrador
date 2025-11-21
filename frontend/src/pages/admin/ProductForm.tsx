import React, { useEffect, useState } from 'react';
import { Form, Button, Container, Row, Col, Alert, Card, InputGroup, Spinner } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { productService } from '../../api/productService';
import { categoryService, type Category } from '../../api/categoryService';
import { uploadService } from '../../api/uploadService';
import apiClient from '../../api/apiClient';
import { FaTrash, FaPlus, FaUpload } from 'react-icons/fa';

interface VariantField {
    id?: number;
    talle: string;
    stock: number;
}

interface ImageField {
    id?: number;
    imagen: string;
}

export const ProductForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = !!id;

    // Estados de carga y error
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);

    // Estado del Formulario (Datos principales)
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        precio_base: 0,
        descuento: 0,
        categoria_id: 0,
        genero: 'Unisex',
        es_nuevo: false,
        es_destacado: false,
        activo: true,
        imagen_principal: ''
    });

    // Estado para Variantes visuales
    const [variants, setVariants] = useState<VariantField[]>([
        { talle: 'M', stock: 0 }
    ]);
    const [variantsToDelete, setVariantsToDelete] = useState<number[]>([]);

    // Estado para Imágenes
    const [images, setImages] = useState<ImageField[]>([]);
    const [imagesToDelete, setImagesToDelete] = useState<number[]>([]);

    // Carga inicial de datos
    useEffect(() => {
        const loadData = async () => {
            try {
                const cats = await categoryService.getCategories({ active: false });
                setCategories(cats);

                if (isEditing) {
                    const product = await productService.getProductById(Number(id));

                    setFormData({
                        nombre: product.nombre,
                        descripcion: product.descripcion || '',
                        precio_base: product.precio_base,
                        descuento: product.descuento || 0,
                        categoria_id: (product as any).categoria_id || (product.categoria ? (product.categoria as any).id : 0),
                        genero: (product as any).genero || 'Unisex',
                        es_nuevo: (product as any).es_nuevo || false,
                        es_destacado: (product as any).es_destacado || false,
                        activo: product.activo !== undefined ? product.activo : true,
                        imagen_principal: product.imagen_principal || ''
                    });

                    if (product.variantes && product.variantes.length > 0) {
                        setVariants(product.variantes.map(v => ({
                            id: v.id,
                            talle: v.talle,
                            stock: v.stock
                        })));
                    }

                    if (product.imagenes && product.imagenes.length > 0) {
                        setImages(product.imagenes.map(i => ({ id: i.id, imagen: i.imagen })));
                    }
                }
            } catch (err) {
                setError('Error al cargar datos.');
                console.error(err);
            }
        };
        loadData();
    }, [id, isEditing]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    // --- Manejo de Imágenes ---
    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, isMain: boolean, index?: number) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const file = files[0];
        setUploading(true);
        setError(null);

        try {
            const url = await uploadService.uploadImage(file);

            if (isMain) {
                setFormData(prev => ({ ...prev, imagen_principal: url }));
            } else if (index !== undefined) {
                const newImages = [...images];
                newImages[index] = { ...newImages[index], imagen: url };
                setImages(newImages);
            } else {
                setImages([...images, { imagen: url }]);
            }
        } catch (err) {
            console.error(err);
            setError('Error al subir imagen.');
        } finally {
            setUploading(false);
            e.target.value = '';
        }
    };

    // --- Handlers Variantes ---
    const addVariant = () => setVariants([...variants, { talle: '', stock: 0 }]);

    const removeVariant = (index: number) => {
        const variantToRemove = variants[index];
        if (variantToRemove.id) {
            setVariantsToDelete([...variantsToDelete, variantToRemove.id]);
        }
        const newVariants = [...variants];
        newVariants.splice(index, 1);
        setVariants(newVariants);
    };

    const handleVariantChange = (index: number, field: 'talle' | 'stock', value: string) => {
        const newVariants = [...variants];
        newVariants[index] = {
            ...newVariants[index],
            [field]: field === 'stock' ? Number(value) : value
        };
        setVariants(newVariants);
    };

    // --- Handlers Galería ---
    const addImageField = () => setImages([...images, { imagen: '' }]);

    const removeImageField = (index: number) => {
        const imageToRemove = images[index];
        
        if (imageToRemove.id) {
            setImagesToDelete([...imagesToDelete, imageToRemove.id]);
        }

        const newImages = [...images];
        newImages.splice(index, 1);
        setImages(newImages);
    };

    const handleImageChange = (index: number, value: string) => {
        const newImages = [...images];
        newImages[index] = { ...newImages[index], imagen: value };
        setImages(newImages);
    };

    // --- SUBMIT ---
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Validaciones
        if (variants.some(v => !v.talle)) {
            setError("Todas las variantes deben tener un talle.");
            setLoading(false);
            return;
        }
        if (Number(formData.categoria_id) === 0) {
            setError("Debes seleccionar una categoría.");
            setLoading(false);
            return;
        }

        const flatPayload = {
            ...formData,
            precio_base: Number(formData.precio_base),
            descuento: Number(formData.descuento),
            categoria_id: Number(formData.categoria_id),
            variantes: variants, 
            imagenes: images.map(img => img.imagen).filter(url => url.trim() !== '')
        };

        try {
            if (isEditing) {
                // === LÓGICA DE EDICIÓN ===

                // 1. Variantes: Borrar
                if (variantsToDelete.length > 0) {
                    for (const vid of variantsToDelete) {
                        await productService.deleteVariant(vid);
                    }
                    setVariantsToDelete([]);
                }

                // 2. Variantes: Actualizar/Crear
                await Promise.all(variants.map(v => {
                    if (v.id) {
                        return productService.updateVariant(v.id, { talle: v.talle, stock: v.stock });
                    } else {
                        return productService.createVariant({
                            producto_id: Number(id),
                            talle: v.talle,
                            stock: v.stock
                        });
                    }
                }));

                // 3. Imágenes: Borrar las marcadas
                if (imagesToDelete.length > 0) {
                    for (const imgId of imagesToDelete) {
                        await apiClient.delete(`/product/images/${imgId}`);
                    }
                    setImagesToDelete([]);
                }

                // 4. Imágenes: Actualizar/Crear las restantes
                await Promise.all(images.map(img => {
                    if (!img.imagen.trim()) return Promise.resolve(); 

                    if (img.id) {
                        return apiClient.put(`/product/images/${img.id}`, { imagen: img.imagen });
                    } else {
                        return apiClient.post('/product/images', {
                            producto_id: Number(id),
                            imagen: img.imagen,
                            orden: 0
                        });
                    }
                }));

                // 5. Actualizar producto base
                await productService.updateProduct(Number(id), flatPayload);

                alert("Producto actualizado correctamente.");
            } else {
                // === LÓGICA DE CREACIÓN ===
                await productService.createProduct(flatPayload as any);
                alert("Producto creado correctamente.");
            }
            navigate('/admin/productos');
        } catch (err: any) {
            console.error('Error completo:', err);
            if (err.response?.data?.errors) {
                const errorMsg = Array.isArray(err.response.data.errors)
                    ? err.response.data.errors.map((e: any) => `${e.path}: ${e.message}`).join(', ')
                    : JSON.stringify(err.response.data.errors);
                setError(`Error de validación: ${errorMsg}`);
            } else {
                setError(err.response?.data?.message || err.message || 'Error al guardar.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="py-4">
            <h2 className="mb-4">{isEditing ? 'Editar Producto' : 'Nuevo Producto'}</h2>
            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
                <Row>
                    <Col md={8}>
                        <Card className="mb-4 shadow-sm border-0">
                            <Card.Body>
                                <h5 className="mb-3">Información General</h5>
                                <Row className="mb-3">
                                    <Col md={8}>
                                        <Form.Group>
                                            <Form.Label>Nombre del Producto</Form.Label>
                                            <Form.Control type="text" name="nombre" value={formData.nombre} onChange={handleChange} required />
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group>
                                            <Form.Label>Género</Form.Label>
                                            <Form.Select name="genero" value={formData.genero} onChange={handleChange}>
                                                <option value="Unisex">Unisex</option>
                                                <option value="Hombre">Hombre</option>
                                                <option value="Mujer">Mujer</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Form.Group className="mb-3">
                                    <Form.Label>Descripción</Form.Label>
                                    <Form.Control as="textarea" rows={3} name="descripcion" value={formData.descripcion} onChange={handleChange} />
                                </Form.Group>

                                <Row className="mb-3">
                                    <Col md={4}>
                                        <Form.Group>
                                            <Form.Label>Precio Base ($)</Form.Label>
                                            <Form.Control type="number" name="precio_base" value={formData.precio_base} onChange={handleChange} required min={0} />
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group>
                                            <Form.Label>Descuento (%)</Form.Label>
                                            <Form.Control type="number" name="descuento" value={formData.descuento} onChange={handleChange} min={0} max={100} />
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group>
                                            <Form.Label>Categoría</Form.Label>
                                            <Form.Select name="categoria_id" value={formData.categoria_id} onChange={handleChange} required>
                                                <option value="0">Seleccionar...</option>
                                                {categories.map(c => (
                                                    <option key={c.id} value={c.id}>{c.nombre}</option>
                                                ))}
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>

                        <Card className="mb-4 shadow-sm border-0">
                            <Card.Body>
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h5 className="mb-0">Variantes (Talle y Stock)</h5>
                                    <Button variant="outline-secondary" size="sm" onClick={addVariant}>
                                        <FaPlus /> Agregar Variante
                                    </Button>
                                </div>

                                {variants.map((variant, index) => (
                                    <Row key={index} className="mb-2 align-items-end">
                                        <Col xs={5}>
                                            <Form.Control
                                                placeholder="Talle (ej: M, 42)"
                                                value={variant.talle}
                                                onChange={(e) => handleVariantChange(index, 'talle', e.target.value)}
                                            />
                                        </Col>
                                        <Col xs={5}>
                                            <Form.Control
                                                type="number"
                                                placeholder="Stock"
                                                value={variant.stock}
                                                onChange={(e) => handleVariantChange(index, 'stock', e.target.value)}
                                                min={0}
                                            />
                                        </Col>
                                        <Col xs={2}>
                                            <Button variant="outline-danger" onClick={() => removeVariant(index)}><FaTrash /></Button>
                                        </Col>
                                    </Row>
                                ))}
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col md={4}>
                        <Card className="mb-4 shadow-sm border-0">
                            <Card.Body>
                                <h5 className="mb-3">Configuración</h5>
                                <Form.Check type="switch" label="Activo" name="activo" checked={formData.activo} onChange={handleChange} className="mb-2" />
                                <Form.Check type="switch" label="Es Nuevo" name="es_nuevo" checked={formData.es_nuevo} onChange={handleChange} className="mb-2" />
                                <Form.Check type="switch" label="Destacado" name="es_destacado" checked={formData.es_destacado} onChange={handleChange} className="mb-2" />
                            </Card.Body>
                        </Card>

                        <Card className="mb-4 shadow-sm border-0">
                            <Card.Body>
                                <h5 className="mb-3">Imagen Principal</h5>
                                <input
                                    type="file"
                                    id="mainImageUpload"
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    onChange={(e) => handleFileUpload(e, true)}
                                />
                                <div className="d-grid gap-2 mb-2">
                                    <Button
                                        variant="outline-primary"
                                        onClick={() => document.getElementById('mainImageUpload')?.click()}
                                        disabled={uploading}
                                    >
                                        {uploading ? <Spinner size="sm" animation="border" /> : <><FaUpload className="me-2" /> Subir Imagen</>}
                                    </Button>
                                </div>
                                <Form.Control
                                    type="text"
                                    placeholder="O pega URL manual..."
                                    name="imagen_principal"
                                    value={formData.imagen_principal}
                                    onChange={handleChange}
                                    className="mb-2 form-control-sm"
                                />
                                {formData.imagen_principal && (
                                    <div className="text-center p-2 border rounded position-relative">
                                        <img src={formData.imagen_principal} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain' }} />
                                        <Button variant="danger" size="sm" className="position-absolute top-0 end-0 m-1" onClick={() => setFormData({ ...formData, imagen_principal: '' })}>
                                            <FaTrash />
                                        </Button>
                                    </div>
                                )}
                            </Card.Body>
                        </Card>

                        <Card className="mb-4 shadow-sm border-0">
                            <Card.Body>
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h5 className="mb-0">Galería</h5>
                                    <div className="d-flex gap-1">
                                        <input
                                            type="file"
                                            id="galleryUpload"
                                            accept="image/*"
                                            style={{ display: 'none' }}
                                            onChange={(e) => handleFileUpload(e, false)}
                                        />
                                        <Button variant="outline-secondary" size="sm" onClick={() => document.getElementById('galleryUpload')?.click()} disabled={uploading}>
                                            <FaUpload />
                                        </Button>
                                        <Button variant="outline-secondary" size="sm" onClick={addImageField}>
                                            <FaPlus /> URL
                                        </Button>
                                    </div>
                                </div>
                                {images.map((img, index) => (
                                    <InputGroup className="mb-2" key={index}>
                                        <Form.Control
                                            placeholder="URL imagen"
                                            value={img.imagen}
                                            onChange={(e) => handleImageChange(index, e.target.value)}
                                        />
                                        <Button variant="outline-danger" onClick={() => removeImageField(index)}><FaTrash /></Button>
                                    </InputGroup>
                                ))}
                            </Card.Body>
                        </Card>

                        <div className="d-grid gap-2">
                            <Button variant="primary" size="lg" type="submit" disabled={loading || uploading}>
                                {loading ? 'Guardando...' : 'Guardar Producto'}
                            </Button>
                            <Button variant="outline-secondary" onClick={() => navigate('/admin/productos')}>Cancelar</Button>
                        </div>
                    </Col>
                </Row>
            </Form>
        </Container>
    );
};