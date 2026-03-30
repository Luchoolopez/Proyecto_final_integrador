import React, { useState } from 'react';
import { Container, Card, Form, Button, Badge, ListGroup, InputGroup } from 'react-bootstrap';
import { useSubscription } from '../../hooks/useSubscription';
import apiClient from '../../api/apiClient';
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
    const [sendToAll, setSendToAll] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<string[]>([]);
    const [selectedRecipients, setSelectedRecipients] = useState<Record<string, boolean>>({});
    const [searchLoading, setSearchLoading] = useState(false);

    // Debounced search for subscribers when selecting recipients
    React.useEffect(() => {
        if (sendToAll) {
            setSearchQuery('');
            setSearchResults([]);
            setSelectedRecipients({});
            return;
        }

        if (searchQuery.trim().length < 2) {
            setSearchResults([]);
            return;
        }

        setSearchLoading(true);
        const t = setTimeout(async () => {
            try {
                const resp = await apiClient.get(`/subscription/search?q=${encodeURIComponent(searchQuery)}`);
                if (resp.data && resp.data.data) {
                    setSearchResults(resp.data.data);
                    // ensure selectedRecipients contains keys for results
                    setSelectedRecipients(prev => {
                        const next = { ...prev };
                        resp.data.data.forEach((e: string) => { if (!(e in next)) next[e] = false; });
                        return next;
                    });
                }
            } catch (err) {
                console.error('Error buscando suscriptores', err);
            } finally {
                setSearchLoading(false);
            }
        }, 350);

        return () => clearTimeout(t);
    }, [sendToAll, searchQuery]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validación frontend simple para coincidir con backend
        if (subject.trim().length < 5) {
            setToastConfig({
                show: true,
                message: 'El asunto debe tener al menos 5 caracteres.',
                variant: 'warning',
                title: 'Validación'
            });
            return;
        }

        if (content.trim().length < 10) {
            setToastConfig({
                show: true,
                message: 'El mensaje debe tener al menos 10 caracteres.',
                variant: 'warning',
                title: 'Validación'
            });
            return;
        }

        setShowConfirm(true);
    };

    const handleConfirmSend = async () => {
        const recipients = Object.keys(selectedRecipients).filter(k => selectedRecipients[k]);
        const payload: any = { subject, content };
        if (sendToAll) payload.all = true;
        else payload.recipients = recipients;

        const result = await sendNewsletter(payload);

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

                        <Form.Group className="mb-3">
                            <Form.Label>Destinatarios</Form.Label>
                            <div>
                                <Form.Check
                                    type="radio"
                                    id="toAll"
                                    label="Enviar a todos los suscriptores activos"
                                    checked={sendToAll}
                                    onChange={() => setSendToAll(true)}
                                />
                                <Form.Check
                                    type="radio"
                                    id="toSelected"
                                    label="Seleccionar destinatarios"
                                    checked={!sendToAll}
                                    onChange={() => setSendToAll(false)}
                                />
                            </div>

                            {!sendToAll && (
                                <div style={{ marginTop: 8 }}>
                                    <Form.Control
                                        type="search"
                                        placeholder="Buscar por email (mínimo 2 caracteres)"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                    <div style={{ marginTop: 8 }}>
                                        {/* Selected recipients shown as badges */}
                                        <div className="mb-2">
                                            {Object.keys(selectedRecipients).filter(k => selectedRecipients[k]).map(email => (
                                                <Badge bg="secondary" key={email} className="me-1 mb-1" style={{ display: 'inline-flex', alignItems: 'center' }}>
                                                    <span style={{ marginRight: 8 }}>{email}</span>
                                                    <Button variant="link" size="sm" onClick={() => setSelectedRecipients(prev => ({ ...prev, [email]: false }))} style={{ color: '#fff', padding: 0, lineHeight: 1 }}>×</Button>
                                                </Badge>
                                            ))}
                                        </div>

                                        {searchLoading && <small className="text-muted">Buscando...</small>}
                                        {!searchLoading && searchQuery.trim().length < 2 && (
                                            <small className="text-muted">Escribe al menos 2 caracteres para buscar</small>
                                        )}
                                        {!searchLoading && searchResults.length === 0 && searchQuery.trim().length >= 2 && (
                                            <small className="text-muted">No se encontraron coincidencias</small>
                                        )}

                                        <ListGroup style={{ maxHeight: 220, overflowY: 'auto', marginTop: 8 }}>
                                            {searchResults.map(email => (
                                                <ListGroup.Item key={email} className="d-flex justify-content-between align-items-center">
                                                    <div>{email}</div>
                                                    <div>
                                                        {selectedRecipients[email] ? (
                                                            <Button size="sm" variant="outline-danger" onClick={() => setSelectedRecipients(prev => ({ ...prev, [email]: false }))}>Quitar</Button>
                                                        ) : (
                                                            <Button size="sm" variant="outline-primary" onClick={() => setSelectedRecipients(prev => ({ ...prev, [email]: true }))}>Agregar</Button>
                                                        )}
                                                    </div>
                                                </ListGroup.Item>
                                            ))}
                                        </ListGroup>
                                    </div>
                                </div>
                            )}
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
                title="Confirmar envío"
                message={sendToAll ? '¿Estás seguro de que deseas enviar este correo a TODOS los suscriptores activos? Esta acción no se puede deshacer.' : '¿Estás seguro de que deseas enviar este correo a los destinatarios seleccionados?'}
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