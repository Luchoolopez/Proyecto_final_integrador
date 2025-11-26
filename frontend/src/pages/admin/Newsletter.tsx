import React, { useState } from 'react';
import { Container, Card, Form, Button } from 'react-bootstrap';
import { useSubscription } from '../../hooks/useSubscription';
import { ConfirmModal } from '../../components/ConfirmModal'; 
import { ToastNotification } from '../../components/ToastNotification'; 

export const Newsletter = () => {
    const [subject, setSubject] = useState('');
    const [content, setContent] = useState('');
    
    const [showConfirm, setShowConfirm] = useState(false);

    const [toastConfig, setToastConfig] = useState<{
        show: boolean;
        message: string;
        variant: 'success' | 'error' | 'warning' | 'info';
        title?: string;
    }>({
        show: false,
        message: '',
        variant: 'success'
    });

    const { sendNewsletter, loading } = useSubscription();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setShowConfirm(true);
    };

    const handleConfirmSend = async () => {
        const result = await sendNewsletter({ subject, content });

        if (result.success) {
            setSubject('');
            setContent('');
            setToastConfig({
                show: true,
                message: `¡Enviado con éxito! Se mandó a ${result.data?.recipientsCount} personas.`,
                variant: 'success',
                title: 'Envío Exitoso'
            });
        } else {
            setToastConfig({
                show: true,
                message: result.error || 'Hubo un error al enviar el correo.',
                variant: 'error',
                title: 'Error de Envío'
            });
        }
    };

    return (
        <Container className="py-4">
            <h2 className="mb-4">Gestión de Newsletter</h2>
            
            <Card className="shadow-sm">
                <Card.Header className="bg-dark text-white">
                    <h5 className="mb-0">Redactar Correo Masivo</h5>
                </Card.Header>
                <Card.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Asunto del Correo</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="Ej: ¡Nuevos ingresos de invierno!" 
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Mensaje</Form.Label>
                            <Form.Control 
                                as="textarea" 
                                rows={8} 
                                placeholder="Escribe aquí el contenido..." 
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                required
                            />
                            <Form.Text className="text-muted">
                                * Los saltos de línea se respetarán en el correo enviado.
                            </Form.Text>
                        </Form.Group>

                        <div className="d-flex justify-content-end">
                            <Button variant="primary" type="submit" disabled={loading} size="lg">
                                {loading ? 'Enviando...' : 'Enviar Newsletter'}
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>


            <ConfirmModal 
                show={showConfirm}
                onClose={() => setShowConfirm(false)}
                onConfirm={handleConfirmSend}
                title="Confirmar envío masivo"
                message="¿Estás seguro de que deseas enviar este correo a TODOS los suscriptores activos? Esta acción no se puede deshacer."
                confirmText="Sí, enviar"
                cancelText="Cancelar"
                variant="primary" 
            />

            <ToastNotification 
                show={toastConfig.show}
                onClose={() => setToastConfig(prev => ({ ...prev, show: false }))}
                message={toastConfig.message}
                variant={toastConfig.variant}
                title={toastConfig.title}
            />
        </Container>
    );
};