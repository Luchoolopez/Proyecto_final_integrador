import { Nav, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import { MdDashboard } from "react-icons/md";
import { FaBoxOpen, FaTag, FaStore, FaEnvelope } from "react-icons/fa"; // Agregué FaEnvelope
import { LuClipboardList } from "react-icons/lu";
import { HiMiniUsers } from "react-icons/hi2";
import { ThemeToggleButton } from "../ThemeToggleButton";
import "./AdminSidebar.css";

export const AdminSidebar = () => {
  const { user, logout } = useAuthContext();

  return (
    <Nav as="nav" className="admin-sidebar vh-100 bg-dark border-end d-flex flex-column justify-content-between p-3">
      <div>
        <div className="mb-4 text-center">
          <h3 className="admin-sidebar-title text-uppercase fw-bold text-white mb-0">
            {user?.nombre}
          </h3>
          <small className="text-secondary">{user?.rol}</small>
        </div>

        <div className="admin-sidebar-links d-flex flex-column gap-2">
          {/*<Nav.Link as={Link} to="/admin" className="admin-nav-link text-white">
            <MdDashboard className="admin-nav-icon" />
            <span>Dashboard</span>
          </Nav.Link>*/}

          <Nav.Link as={Link} to="/admin/productos" className="admin-nav-link text-white">
            <FaBoxOpen className="admin-nav-icon" />
            <span>Productos</span>
          </Nav.Link>

          <Nav.Link as={Link} to="/admin/categorias" className="admin-nav-link text-white">
            <FaTag className="admin-nav-icon" />
            <span>Categorías</span>
          </Nav.Link>

          <Nav.Link as={Link} to="/admin/ordenes" className="admin-nav-link text-white">
            <LuClipboardList className="admin-nav-icon" />
            <span>Órdenes</span>
          </Nav.Link>

          <Nav.Link as={Link} to="/admin/usuarios" className="admin-nav-link text-white">
            <HiMiniUsers className="admin-nav-icon" />
            <span>Usuarios</span>
          </Nav.Link>

          {/* Opción de Newsletter agregada */}
          <Nav.Link as={Link} to="/admin/newsletter" className="admin-nav-link text-white">
            <FaEnvelope className="admin-nav-icon" />
            <span>Newsletter</span>
          </Nav.Link>

          <div className="border-top border-secondary my-2 opacity-50"></div>

          <Nav.Link as={Link} to="/" className="admin-nav-link text-white" title="Ir a la tienda">
            <FaStore className="admin-nav-icon" />
            <span>Ver Tienda</span>
          </Nav.Link>
        </div>
      </div>

      <div className="mt-3">
        <div className="d-flex justify-content-center align-items-center mb-3 p-2 border rounded border-secondary text-white">
            <span className="me-2 small">Tema:</span>
            <ThemeToggleButton />
        </div>
        <Button variant="outline-light" className="w-100 logout-btn" onClick={logout}>
          Cerrar sesión
        </Button>
      </div>
    </Nav>
  );
};