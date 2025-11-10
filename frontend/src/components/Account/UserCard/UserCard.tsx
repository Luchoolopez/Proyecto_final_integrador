import { useAuthContext } from "../../../context/AuthContext";
import { Link } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { IoIosMail } from "react-icons/io";
import { BsFillTelephoneFill } from "react-icons/bs";



export const UserCard = () => {
    const { user } = useAuthContext();
    return (
        <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Mis datos</h5>
                <Link to="/info" className="text-secondary text-decoration-none">Editar {'>'}</Link>
            </div>
            <ul className="list-group list-group-flush">
                <li className="list-group-item d-flex align-items-center">
                    <FaUser className="me-3" />
                    {user?.nombre}
                </li>
                <li className="list-group-item d-flex align-items-center">
                    <IoIosMail className="me-3" />
                    {user?.email}
                </li>
                <li className="list-group-item d-flex align-items-center">
                    <BsFillTelephoneFill className="me-3"/>
                    {user?.telefono ? user.telefono : 'Registra tu Numero'}
                </li>
            </ul>
        </div>
    )
}