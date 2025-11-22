import React from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';
import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';

interface ToastNotificationProps {
    show: boolean;
    onClose: () => void;
    message: string;
    variant?: 'success' | 'error' | 'warning' | 'info';
    title?: string;
}

export const ToastNotification: React.FC<ToastNotificationProps> = ({
    show,
    onClose,
    message,
    variant = 'success',
    title
}) => {
    const getIcon = () => {
        switch (variant) {
            case 'success':
                return <CheckCircle size={20} className="text-success" />;
            case 'error':
                return <XCircle size={20} className="text-danger" />;
            case 'warning':
                return <AlertCircle size={20} className="text-warning" />;
            case 'info':
                return <Info size={20} className="text-info" />;
        }
    };

    const getTitle = () => {
        if (title) return title;
        switch (variant) {
            case 'success':
                return 'Éxito';
            case 'error':
                return 'Error';
            case 'warning':
                return 'Advertencia';
            case 'info':
                return 'Información';
        }
    };

    const getBgClass = () => {
        switch (variant) {
            case 'success':
                return 'bg-success text-white';
            case 'error':
                return 'bg-danger text-white';
            case 'warning':
                return 'bg-warning';
            case 'info':
                return 'bg-info text-white';
        }
    };

    return (
        <ToastContainer position="top-center" className="p-3" style={{ zIndex: 9999, position: 'fixed' }}>
            <Toast show={show} onClose={onClose} delay={3000} autohide>
                <Toast.Header className={getBgClass()}>
                    <div className="d-flex align-items-center gap-2 me-auto">
                        {getIcon()}
                        <strong>{getTitle()}</strong>
                    </div>
                </Toast.Header>
                <Toast.Body className="bg-white text-dark">{message}</Toast.Body>
            </Toast>
        </ToastContainer>
    );
};