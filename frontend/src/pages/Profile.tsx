import { useAuthContext } from "../context/AuthContext"
export const Profile = () => {
    const { user, logout } = useAuthContext();
    
    return(
        <div>
            <h2>Vista provisoria del perfil</h2>
            <p>Nombre: {user?.nombre}</p>
            <p>Email: {user?.email}</p>
            <p>Rol: {user?.rol}</p>
            <p>Telefono: {user?.telefono}</p>
            <p>id: {user?.id}</p>
            <button onClick={logout}>Cerrar sesion</button>
        </div>
    )
}