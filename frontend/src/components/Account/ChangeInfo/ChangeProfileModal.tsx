import React from "react";
import { Modal, Button } from "react-bootstrap";

interface ChangeProfileModalProps {
    show: boolean;
    onClose: () => void;
    title: string;
    message: string;
    isSuccess: boolean;
}

export const ChangeProfileModal: React.FC<ChangeProfileModalProps> = ({
    show,
    onClose,
    title,
    message,
    isSuccess
}) => {
    return (
        <Modal show={show} onHide={onClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="text-center">
                    <p className={isSuccess ? "text-success fw-bold" : "text-danger fw-bold"}>
                        {isSuccess ? "✅" : "❌"} {message}
                    </p>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant={isSuccess ? "success" : "danger"} onClick={onClose}>
                    {isSuccess ? "Aceptar" : "Cerrar"}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};