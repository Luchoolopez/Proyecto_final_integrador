import React, { useState, useEffect, useRef } from 'react';
import { Container, Card, Button, Table, Modal, Form, Spinner } from 'react-bootstrap';
import Cropper from 'react-cropper';
import type { ReactCropperElement } from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { carouselService } from '../../api/carouselService';
import type { CarouselImage } from '../../api/carouselService';
import { ToastNotification } from '../../components/ToastNotification';

export const CarouselManager = () => {
    const [images, setImages] = useState<CarouselImage[]>([]);
    const [loading, setLoading] = useState(false);
    
    const [showModal, setShowModal] = useState(false);
    const [imageToCrop, setImageToCrop] = useState<string>('');
    const [altText, setAltText] = useState('');
    const cropperRef = useRef<ReactCropperElement>(null);

    const [toast, setToast] = useState<{ show: boolean; message: string; variant: 'success' | 'error' | 'warning' | 'info' }>({ show: false, message: '', variant: 'success' });

    useEffect(() => { loadImages(); }, []);

    const loadImages = async () => {
        try {
            const data = await carouselService.getAllAdmin();
            setImages(data);
        } catch (error) {
            setToast({ show: true, message: 'Error al cargar imágenes', variant: 'error' });
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const reader = new FileReader();
        reader.onload = () => {
            setImageToCrop(reader.result as string);
            setShowModal(true);
        };
        reader.readAsDataURL(files[0]);
        e.target.value = ''; 
    };

    const handleCropAndUpload = async () => {
        const cropper = cropperRef.current?.cropper;
        if (!cropper) return;

        setLoading(true);
        cropper.getCroppedCanvas().toBlob(async (blob) => {
            if (!blob) { setLoading(false); return; }

            const fileToUpload = new File([blob], `carousel-${Date.now()}.webp`, { type: 'image/webp' });

            try {
                await carouselService.upload(fileToUpload, altText, images.length);
                setToast({ show: true, message: 'Imagen subida con éxito', variant: 'success' });
                setShowModal(false);
                setAltText('');
                loadImages();
            } catch (error) {
                setToast({ show: true, message: 'Error al subir la imagen', variant: 'error' });
            } finally {
                setLoading(false);
            }
        }, 'image/webp');
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('¿Seguro que quieres eliminar esta imagen del carrusel?')) return;
        try {
            await carouselService.delete(id);
            setToast({ show: true, message: 'Imagen eliminada', variant: 'success' });
            loadImages();
        } catch (error) {
            setToast({ show: true, message: 'Error al eliminar', variant: 'error' });
        }
    };

    return (
        <Container className="py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Gestión de Carrusel</h2>
                <div>
                    <input type="file" id="file-upload" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
                    <label htmlFor="file-upload" className="btn btn-primary mb-0">
                        + Subir Nueva Imagen
                    </label>
                </div>
            </div>

            <Card className="shadow-sm">
                <Table responsive hover className="mb-0">
                    <thead className="bg-light">
                        <tr>
                            <th>Orden</th>
                            <th>Imagen</th>
                            <th>Texto Alternativo</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {images.length === 0 ? (
                            <tr><td colSpan={5} className="text-center py-4">No hay imágenes en el carrusel.</td></tr>
                        ) : (
                            images.map((img) => (
                                <tr key={img.id} className="align-middle">
                                    <td>{img.orden}</td>
                                    <td>
                                        <img src={img.imagen} alt="carrusel" style={{ width: '150px', height: 'auto', borderRadius: '4px' }} />
                                    </td>
                                    <td>{img.alt_text || '-'}</td>
                                    <td>{img.activo ? <span className="badge bg-success">Activo</span> : <span className="badge bg-secondary">Oculto</span>}</td>
                                    <td>
                                        <Button variant="outline-danger" size="sm" onClick={() => handleDelete(img.id)}>Eliminar</Button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </Table>
            </Card>

            <Modal show={showModal} onHide={() => !loading && setShowModal(false)} size="lg" backdrop="static">
                <Modal.Header closeButton={!loading}>
                    <Modal.Title>Recortar Imagen</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p className="text-muted small">Encuadra la imagen. El sistema generará automáticamente la versión para celulares.</p>
                    <div style={{ width: '100%', height: '400px', backgroundColor: '#f8f9fa' }}>
                        <Cropper
                            ref={cropperRef}
                            src={imageToCrop}
                            style={{ height: '100%', width: '100%' }}
                            aspectRatio={21 / 9} 
                            guides={true}
                            viewMode={1}
                            background={false}
                            responsive={true}
                            autoCropArea={1}
                        />
                    </div>
                    <Form.Group className="mt-3">
                        <Form.Label>Texto Alternativo (SEO) - Opcional</Form.Label>
                        <Form.Control 
                            type="text" 
                            placeholder="Ej: Nueva colección de invierno 2026" 
                            value={altText} 
                            onChange={(e) => setAltText(e.target.value)} 
                            disabled={loading}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)} disabled={loading}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={handleCropAndUpload} disabled={loading}>
                        {loading ? <><Spinner size="sm" className="me-2"/> Subiendo...</> : 'Recortar y Subir'}
                    </Button>
                </Modal.Footer>
            </Modal>

            <ToastNotification show={toast.show} message={toast.message} variant={toast.variant} onClose={() => setToast({ ...toast, show: false })} />
        </Container>
    );
};
