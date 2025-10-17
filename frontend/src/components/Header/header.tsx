import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { CiUser } from "react-icons/ci";
import { IoSearchOutline } from "react-icons/io5";
import { FiShoppingCart } from "react-icons/fi";
import './header.style.css';
import { ThemeToggleButton } from '../ThemeToggleButton';

export const Header = () => {
    return (
        // CAMBIOS:
        // 1. Quitamos `bg="light"` para que Bootstrap aplique el color de fondo del tema actual.
        // 2. Dejamos `className="header"` para nuestros estilos personalizados.
        <Navbar expand="lg" className="header" sticky="top">
            <Container fluid>
                <Navbar.Brand href="/" className="d-none d-lg-block">Concept & Hab</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" className="d-lg-none border-0" />
                <Navbar.Brand href="/" className="d-lg-none mobile-logo">Concept & Hab</Navbar.Brand>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mx-auto">
                        <Nav.Link href="/new">NEW IN</Nav.Link>
                        <Nav.Link href="/sale">SALE</Nav.Link>
                        <NavDropdown title="MEN / NO GENDER" id="men-dropdown">
                            <NavDropdown.Item href="/men/tshirts">T-Shirts</NavDropdown.Item>
                            <NavDropdown.Item href="/men/pants">Pants</NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown title="WOMEN" id="women-dropdown">
                            <NavDropdown.Item href="/women/tops">Tops</NavDropdown.Item>
                            <NavDropdown.Item href="/women/dresses">Dresses</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
                <Nav className="flex-row">
                    <Nav.Link href="#search" className="nav-icon"><IoSearchOutline size={30} /></Nav.Link>
                    <Nav.Link href="/login" className="nav-icon"><CiUser size={30} /></Nav.Link>
                    <Nav.Link href="/cart" className="nav-icon"><FiShoppingCart size={30} /></Nav.Link>
                    {/* 2. Añadimos el botón para cambiar el tema aquí */}
                    <div className="nav-icon d-flex align-items-center ms-2"><ThemeToggleButton /></div>
                </Nav>
            </Container>
        </Navbar>
    );
};