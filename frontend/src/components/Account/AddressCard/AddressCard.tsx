//import { useAuthContext } from "../../../context/AuthContext";
import { Link } from "react-router-dom";
import { IoLocationSharp } from "react-icons/io5";





export const AddressCard = () => {
    //const { user } = useAuthContext();
    return (
        <div className="card">
            <div className="card-header d-flex justify-content-between align-items">
                <h5 className="mb-0">Mis direcciones</h5>
                <Link to="/info" className="text-secondary text-decoration-none">Editar {'>'}</Link>
            </div>
            <ul className="list-group list-group-flush">
                <li className="list-group-item align-items-center">
                    <p><strong><IoLocationSharp className="me-2"/> Principal</strong></p>
                    <p>Direccion</p>
                    <p>Ciudad, Codigo postal</p>
                    <p>Provincia</p>
                    <p>Pais</p>
                </li>
            </ul>
        </div>
    )
}