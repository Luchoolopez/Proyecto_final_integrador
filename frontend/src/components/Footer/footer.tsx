import { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaFacebook, FaInstagram } from 'react-icons/fa';
import { Link } from 'react-router-dom'; 
import { SubscribeModal } from '../subscribe/SubscribeModal';
import './footer.style.css';

export const Footer = () => {
    const [showModal, setShowModal] = useState(false);

    return (
        <footer className="footer bg-body-tertiary text-center pt-5 pb-4 border-top ">
            <Container>
                <Row>
                    <Col md={4} className="mb-4">
                        <h5>Concept & Hab</h5>
                        <p>
                            Ropa con estilo único para personas auténticas.
                            Diseños que marcan la diferencia.
                        </p>
                    </Col>

                    <Col md={4} className="mb-4">
                        <h5>Categorías</h5>
                        <ul className="list-unstyled">
                            <li>
                                <Link to="/productos/descuentos" className="footer-link">Sale</Link>
                            </li>
                            <li>
                                <Link to="/productos/hombre" className="footer-link">Men</Link>
                            </li>
                            <li>
                                <Link to="/productos/mujer" className="footer-link">Women</Link>
                            </li>

                            <li>
                                <a 
                                    href="#" 
                                    className="footer-link"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setShowModal(true);
                                    }}
                                >
                                    Suscribite
                                </a>
                            </li>
                        </ul>
                    </Col>

                    <Col md={4} className="mb-4">
                        <h5>Seguinos</h5>
                        <div className="social-icons">
                            <a href="https://www.facebook.com/DazurIndumentaria/?locale=es_LA" target="_blank" rel="noopener noreferrer" className="footer-link me-3">
                                <FaFacebook size={30} />
                            </a>
                            <a href="https://www.instagram.com/cyh.indumentariaa" target="_blank" rel="noopener noreferrer" className="footer-link">
                                <FaInstagram size={30} />
                            </a>
                        </div>
                    </Col>
                </Row>
                <hr />
                <Row>
                    <Col className="text-center">
                        <p className="mb-0">&copy; {new Date().getFullYear()} Concept & Hab. Todos los derechos reservados.</p>
                    </Col>
                </Row>
            </Container>

            <SubscribeModal 
                show={showModal} 
                handleClose={() => setShowModal(false)} 
            />
        </footer>
    );
};