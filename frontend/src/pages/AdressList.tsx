import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Breadcrumb } from "react-bootstrap";
import { IoLocationSharp } from "react-icons/io5";
import { addressService } from "../api/addressService";
import type { Address } from "../types/Address";
import { Button } from "react-bootstrap";

export const AddressList = () => {
    const [addresses, setAddresses] = useState<Address[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        loadAddresses();
    }, []);

    const loadAddresses = async () => {
        try {
            const data = await addressService.getAddresses();
            setAddresses(data);
        } catch (error) {
            console.error("Error", error);
        }
    };

    return (
        <div className="container py-5">
            <Breadcrumb className="breadcrum-principal text-decoration-none">
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>Inicio</Breadcrumb.Item>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/account" }}>Mi Cuenta</Breadcrumb.Item>
                <Breadcrumb.Item active>Mis Direcciones</Breadcrumb.Item>
            </Breadcrumb>

            <h2 className="text-center mb-4 fw-bold text-uppercase title-divider">Mis Direcciones</h2>

            <div className="row">
                <div className="col-md-8 mx-auto">
                    {addresses.map((address) => (
                        <div key={address.id} className="card mb-3 shadow-sm border-1">
                            <div className="card-body">
                                {address.es_principal && (
                                    <div className="mb-2 text-primary fw-bold">
                                        <IoLocationSharp /> Principal
                                    </div>
                                )}
                                <h5 className="card-title fw-bold">
                                    {address.calle} {address.numero}
                                </h5>
                                <p className="card-text text-muted mb-1">
                                    {address.ciudad}, {address.provincia}, {address.codigo_postal}
                                </p>
                                <p className="card-text text-muted">
                                    {address.pais}
                                </p>

                                <Link
                                    to={`/account/addresses/edit/${address.id}`}
                                    className="text-primary text-decoration-none fw-bold"
                                >
                                    Editar &gt;
                                </Link>
                            </div>
                        </div>
                    ))}

                    <Button
                        type="submit" className="btn-save"
                        onClick={() => navigate('/account/addresses/add')}
                    >
                        AGREGAR UNA NUEVA DIRECCIÓN
                    </Button>


                </div>
            </div>
        </div>
    );
};