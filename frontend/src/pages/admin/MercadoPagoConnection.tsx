import React, { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Button, Card, Spinner } from 'react-bootstrap';
import { mercadopagoService } from '../../api/mercadopagoService';
import { ToastNotification } from '../../components/ToastNotification';

export const AdminHome = () => {
    const location = useLocation();
    const params = useMemo(() => new URLSearchParams(location.search), [location.search]);
    const mpStatusParam = params.get('mp');

    const [loading, setLoading] = useState(true);
    const [connected, setConnected] = useState(false);
    const [mpInfo, setMpInfo] = useState<{ user_id?: string; connected_at?: string; expires_at?: string } | null>(null);
    const [toast, setToast] = useState({ show: false, message: '', variant: 'success' as 'success' | 'error' | 'info' });

    const fetchStatus = async () => {
        setLoading(true);
        try {
            const data = await mercadopagoService.getStatus();
            setConnected(data.connected);
            setMpInfo(data.config || null);
        } catch (err: any) {
            console.error('Error cargando estado de Mercado Pago', err);
            setToast({ show: true, message: 'No se pudo consultar el estado de Mercado Pago', variant: 'error' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStatus();
    }, []);

    useEffect(() => {
        if (mpStatusParam === 'connected') {
            setToast({ show: true, message: 'Mercado Pago vinculado correctamente.', variant: 'success' });
        } else if (mpStatusParam === 'error') {
            setToast({ show: true, message: 'No se pudo vincular Mercado Pago. Intenta nuevamente.', variant: 'error' });
        }
    }, [mpStatusParam]);

    const handleConnect = async () => {
        setLoading(true);
        try {
            const { authUrl } = await mercadopagoService.connect();
            window.location.href = authUrl;
        } catch (err: any) {
            console.error('Error al iniciar conexión con Mercado Pago', err);
            setToast({ show: true, message: err?.response?.data?.message || 'No se pudo iniciar la conexión', variant: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-4">
            <h2 className="mb-4">Panel de Administración</h2>

            <Card className="mb-4">
                <Card.Header>
                    <h5 className="mb-0">Integración con Mercado Pago</h5>
                </Card.Header>
                <Card.Body>
                    {loading ? (
                        <div className="d-flex align-items-center gap-2">
                            <Spinner size="sm" animation="border" />
                            <span>Cargando estado...</span>
                        </div>
                    ) : (
                        <>
                            {connected ? (
                                <>
                                    <p className="mb-2">
                                        ✅ Mercado Pago está vinculado.
                                    </p>
                                    <ul>
                                        <li><strong>User ID:</strong> {mpInfo?.user_id}</li>
                                        <li><strong>Conectado el:</strong> {mpInfo?.connected_at}</li>
                                        <li><strong>Expira el:</strong> {mpInfo?.expires_at}</li>
                                    </ul>
                                    <Button variant="outline-primary" onClick={fetchStatus}>
                                        Actualizar estado
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <p className="mb-3">
                                        Para procesar pagos con Mercado Pago necesitas vincular la cuenta de vendedor.
                                    </p>
                                    <Button variant="primary" onClick={handleConnect} disabled={loading}>
                                        {loading ? 'Redirigiendo...' : 'Vincular Mercado Pago'}
                                    </Button>
                                </>
                            )}
                        </>
                    )}
                </Card.Body>
            </Card>

            <ToastNotification
                show={toast.show}
                onClose={() => setToast({ ...toast, show: false })}
                message={toast.message}
                variant={toast.variant}
            />
        </div>
    );
};
