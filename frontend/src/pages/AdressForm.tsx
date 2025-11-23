import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { addressService } from "../api/addressService";
import type { Address } from "../types/Address";
import { Button } from "react-bootstrap";

export const AddressForm = () => {
    const { id } = useParams(); 
    const navigate = useNavigate();
    const isEditing = Boolean(id);

    const [formData, setFormData] = useState<Partial<Address>>({
        calle: '', numero: '', ciudad: '', provincia: '', 
        codigo_postal: '', pais: 'Argentina', piso: '', dpto: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isEditing && id) {
            const fetchAddress = async () => {
                try {
                    const data = await addressService.getAddressById(id);
                    setFormData(data);
                } catch (error) {
                    console.error("Error cargando dirección", error);
                }
            };
            fetchAddress();
        }
    }, [id, isEditing]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isEditing && id) {
                await addressService.updateAddress(Number(id), formData);
            } else {
                await addressService.createAddress(formData);
            }
            navigate('/account/addresses');
        } catch (error) {
            console.error("Error guardando", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <h2 className="text-center fw-bold text-uppercase mb-4 title-divider">
                        {isEditing ? 'Editar Dirección' : 'Nueva Dirección'}
                    </h2>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label fw-bold">Dirección (Calle)</label>
                            <input 
                                type="text" className="form-control py-2" 
                                placeholder="Ej: Av. Pueyrredón"
                                name="calle" value={formData.calle} onChange={handleChange} required 
                            />
                        </div>
                        <div className="row mb-3">
                            <div className="col-md-4">
                                <label className="form-label fw-bold">Número</label>
                                <input 
                                    type="text" className="form-control py-2" placeholder="1234"
                                    name="numero" value={formData.numero} onChange={handleChange} required 
                                />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label fw-bold">Piso (Opcional)</label>
                                <input 
                                    type="text" className="form-control py-2" 
                                    name="piso" value={formData.piso || ''} onChange={handleChange} 
                                />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label fw-bold">Dpto (Opcional)</label>
                                <input 
                                    type="text" className="form-control py-2" 
                                    name="dpto" value={formData.dpto || ''} onChange={handleChange} 
                                />
                            </div>
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-bold">Código Postal</label>
                            <input 
                                type="text" className="form-control py-2" placeholder="Ej: 1429"
                                name="codigo_postal" value={formData.codigo_postal} onChange={handleChange} required 
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-bold">Ciudad</label>
                            <input 
                                type="text" className="form-control py-2" placeholder="Ej: CABA"
                                name="ciudad" value={formData.ciudad} onChange={handleChange} required 
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-bold">Provincia</label>
                            <input 
                                type="text" className="form-control py-2" 
                                name="provincia" value={formData.provincia} onChange={handleChange} required 
                            />
                        </div>
                        
                        <div className="mb-4">
                            <label className="form-label fw-bold">País</label>
                            <select 
                                className="form-select py-2" 
                                name="pais" value={formData.pais} onChange={handleChange}
                            >
                                <option value="Argentina">Argentina</option>
                            </select>
                        </div>

                        <Button 
                            type="submit" 
                            className="btn btn-save w-100 text-white fw-bold py-3"
                            disabled={loading}
                        >
                            {loading ? 'GUARDANDO...' : 'GUARDAR CAMBIOS'}
                        </Button>

                        <button 
                            type="button" 
                            className="btn btn-link text-secondary w-100 mt-2"
                            onClick={() => navigate('/account/addresses')}
                        >
                            Cancelar
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};