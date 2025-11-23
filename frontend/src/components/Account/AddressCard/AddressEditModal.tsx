// components/Account/AddressCard/AddressEditModal.tsx
import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { type Address } from '../../../types/Address';
import { addressService } from '../../../api/addressService';

interface Props {
    show: boolean;
    handleClose: () => void;
    addressToEdit: Address | null;
    onUpdateSuccess: () => void;
}

export const AddressEditModal: React.FC<Props> = ({ show, handleClose, addressToEdit, onUpdateSuccess }) => {
    const [formData, setFormData] = useState<Partial<Address>>({});

    useEffect(() => {
        if (addressToEdit) setFormData(addressToEdit);
    }, [addressToEdit]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!addressToEdit) return;
        try {
            await addressService.updateAddress(addressToEdit.id, formData);
            onUpdateSuccess();
            handleClose();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton><Modal.Title>Editar Dirección</Modal.Title></Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Calle</Form.Label>
                        <Form.Control name="calle" value={formData.calle || ''} onChange={handleChange} />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Numero</Form.Label>
                        <Form.Control name="numero" value={formData.numero || ''} onChange={handleChange} />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>piso</Form.Label>
                        <Form.Control name="codigo_postal" value={formData.piso || ''} onChange={handleChange} />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Dpto</Form.Label>
                        <Form.Control name="dpto" value={formData.dpto || ''} onChange={handleChange} />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Codigo Postal</Form.Label>
                        <Form.Control name="codigo_postal" value={formData.codigo_postal || ''} onChange={handleChange} />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Ciudad</Form.Label>
                        <Form.Control name="ciudad" value={formData.ciudad || ''} onChange={handleChange} />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Provincia</Form.Label>
                        <Form.Control name="provincia" value={formData.provincia || ''} onChange={handleChange} />
                    </Form.Group>

                    <Button variant="dark" type="submit" className="w-100">Guardar Cambios</Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};