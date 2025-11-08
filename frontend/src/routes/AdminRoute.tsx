import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

export const AdminRoute = () => {
    const { isAuthenticated, user, loading } = useAuthContext();

    console.log("Auth check:", { isAuthenticated, user, loading });

    if (loading) {
        return <div>Verificando sesion...</div>
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    if (user?.rol !== 'admin') {
        return <Navigate to="/" replace />
    }

    return <Outlet/>;
}