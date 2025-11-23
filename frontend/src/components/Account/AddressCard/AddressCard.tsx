import { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Importante para navegar
import { IoLocationSharp } from "react-icons/io5";
import { addressService } from "../../../api/addressService";
import type { Address } from "../../../types/Address";

export const AddressCard = () => {
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAddresses = async () => {
            try {
                const data = await addressService.getAddresses();
                setAddresses(data);
            } catch (error) {
                console.error("Error", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAddresses();
    }, []);

    const principalAddress = addresses.find(addr => addr.es_principal) || addresses[0];

    return (
        <div className="card h-50" style={{ minHeight: '180px' }}> 
            <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0 fw-bold" style={{ fontSize: '1rem' }}>Mis Direcciones</h5>
                {addresses.length > 0 && (
                    <Link to="/account/addresses" className="text-muted text-decoration-none small">
                        Editar {'>'}
                    </Link>
                )}
            </div>

            <div className="card-body d-flex flex-column justify-content-center">
                {loading ? (
                    <p className="text-muted text-center">Cargando...</p>
                ) : addresses.length === 0 ? (
                    <div className="text-center">
                        <p className="text-muted mb-3">No tienes direcciones guardadas.</p>
                        <Link 
                            to="/account/addresses/add" 
                            className="btn btn-outline-primary btn-sm"
                        >
                            + Agregar Dirección
                        </Link>
                    </div>
                ) : (
                    <div>
                        <p className="mb-1 fw-bold">
                            <IoLocationSharp className="text-primary me-1" /> 
                            {principalAddress.calle} {principalAddress.numero}
                        </p>
                        <p className="mb-0 text-muted small">
                            {principalAddress.ciudad}, {principalAddress.provincia}
                        </p>
                        <p className="mb-0 text-muted small">CP: {principalAddress.codigo_postal}</p>
                    </div>
                )}
            </div>
        </div>
    );
};