import { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';
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
                            <li><a href="/productos/descuentos" className="footer-link">Sale</a></li>
                            <li><a href="/productos/hombre" className="footer-link">Men</a></li>
                            <li><a href="/productos/mujer" className="footer-link">Women</a></li>

                            
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
                            <a href="https://www.facebook.com/DazurIndumentaria/?locale=es_LA" className="footer-link me-3"><FaFacebook size={30} /></a>
                            <a href="https://www.instagram.com/cyh.indumentariaa" className="footer-link"><FaInstagram size={30} /></a>
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