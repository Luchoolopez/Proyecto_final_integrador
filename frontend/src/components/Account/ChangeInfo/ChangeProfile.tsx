import React, { useState } from "react";
import { useAuthContext } from "../../../context/AuthContext";
import { Breadcrumb, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useUser } from "../../../hooks/useUser";
import './ChangeProfile.css';

export const ChangeProfile = () => {
    const { user } = useAuthContext();
    const { updateUser, loading, error } = useUser();

    const [nombre, setNombre] = useState(user?.nombre || "");
    const [email, setEmail] = useState(user?.email || "");
    const [telefono, setTelefono] = useState(user?.telefono || "");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        const dataToSend = {
            nombre:nombre,
            email:email,
            telefono: telefono || null
        };

        const updatedUser = await updateUser(user.id, dataToSend);

        if (updatedUser) {
            alert("✅ Perfil actualizado correctamente");
            console.log("Usuario actualizado: ", updatedUser);
        } else {
            alert("❌ No se pudo actualizar el perfil");
        }
    };

    return (
        <>
            <div className="container mt-4">
                <Breadcrumb className="breadcrum-principal text-decoration-none">
                    <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>
                        Inicio
                    </Breadcrumb.Item>
                    <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/account" }}>
                        Mi cuenta
                    </Breadcrumb.Item>
                    <Breadcrumb.Item active>Info</Breadcrumb.Item>
                </Breadcrumb>

                <h1 className="title-divider text-center my-3">MI CUENTA</h1>
            </div>

            <div className="d-flex justify-content-center align-items-center mt-4 mb-5">
                <form className="profile-form p-4 rounded shadow-sm" onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="InputNombre" className="form-label fw-bold">
                            Nombre
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="InputNombre"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="InputEmail" className="form-label fw-bold">
                            Email
                        </label>
                        <input
                            type="email"
                            className="form-control"
                            id="InputEmail"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="InputTelefono" className="form-label fw-bold">
                            Teléfono (opcional)
                        </label>
                        <div className="input-group">
                            <span className="input-group-text">+54</span>
                            <input
                                type="tel"
                                className="form-control"
                                id="InputTelefono"
                                value={telefono}
                                onChange={(e) => setTelefono(e.target.value)}
                            />
                        </div>
                    </div>

                    {error && <p className="text-danger">{error}</p>}

                    <div className="text-center">
                        <Button type="submit" className="btn-save" disabled={loading}>
                            {loading ? "Guardando..." : "GUARDAR CAMBIOS"}
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
};
