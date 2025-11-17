import { Navbar, Nav, Container, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { CiUser } from "react-icons/ci";
import { IoSearchOutline } from "react-icons/io5";
import { FiShoppingCart } from "react-icons/fi";
import './header.style.css';
import { ThemeToggleButton } from '../ThemeToggleButton';
import { useSearch } from '../../context/SearchContext';
import { useCartContext } from '../../context/CartContext';
import { useAuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const Header = () => {
    const { openSearch } = useSearch();
    const { itemCount, openCart } = useCartContext();
    const { isAuthenticated } = useAuthContext();
    const navigate = useNavigate();

    const handleLoginBtn = () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        navigate('/profile'); 
    };

    return (
        <Navbar expand="lg" className="header" sticky="top">
            <Container fluid>
                <div className="d-none d-lg-flex w-100 justify-content-between align-items-center">
                    <Navbar.Brand href="/">Concept & Hab</Navbar.Brand>
                    <Nav className="mx-auto">
                        
                        <Nav.Link href="/"><span>INICIO</span></Nav.Link>
                        <Nav.Link as={Link} to="/productos/descuentos"><span>SALE</span></Nav.Link>
                        <Nav.Link as={Link} to="/productos/hombre"><span>MEN</span></Nav.Link>
                        <Nav.Link as={Link} to="/productos/mujer"><span>WOMEN</span></Nav.Link>

                    </Nav>
                    <Nav className="flex-row">
                        <Nav.Link className="nav-icon" onClick={openSearch}><IoSearchOutline size={30} /></Nav.Link>                        
                        <Nav.Link className="nav-icon" onClick={handleLoginBtn} style={{ cursor: 'pointer' }}><CiUser size={30} /></Nav.Link>
                        <Nav.Link onClick={openCart} className="nav-icon position-relative" style={{ cursor: 'pointer' }}>
                            <FiShoppingCart size={30} />
                            {itemCount > 0 && (
                                <Badge pill bg="danger" style={{ position: 'absolute', top: 0, right: 0 }}>
                                    {itemCount}
                                </Badge>
                            )}
                        </Nav.Link>

                        <div className="nav-icon d-flex align-items-center ms-2"><ThemeToggleButton /></div>
                    </Nav>
                </div>

                <div className="d-lg-none w-100 mobile-header-layout">
                    <div className="mobile-header-top">
                        <Navbar.Brand href="/">Concept & Hab</Navbar.Brand>
                    </div>
                    <div className="mobile-header-bottom">
                        <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-0" />
                        <Nav className="flex-row">
                            <Nav.Link className="nav-icon" onClick={openSearch}><IoSearchOutline size={26} /></Nav.Link>
                            <Nav.Link className="nav-icon" onClick={handleLoginBtn} style={{ cursor: 'pointer' }}><CiUser size={26} /></Nav.Link>                            
                            <Nav.Link onClick={openCart} className="nav-icon position-relative" style={{ cursor: 'pointer' }}>
                                <FiShoppingCart size={26} />
                                {itemCount > 0 && (
                                    <Badge pill bg="danger" style={{ position: 'absolute', top: 0, right: 0, fontSize: '0.6em' }}>
                                        {itemCount}
                                    </Badge>
                                )}
                            </Nav.Link>
                            
                            <div className="nav-icon d-flex align-items-center ms-2"><ThemeToggleButton /></div>
                        </Nav>
                    </div>
                </div>

                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mx-auto d-lg-none text-center pt-3">
                        <Nav.Link as={Link} to="/productos/descuentos"><span>SALE</span></Nav.Link>
                        <Nav.Link as={Link} to="/productos/hombre"><span>MEN</span></Nav.Link>
                        <Nav.Link as={Link} to="/productos/mujer"><span>WOMEN</span></Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};