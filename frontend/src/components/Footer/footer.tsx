import { Container, Row, Col } from 'react-bootstrap';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';
import './footer.style.css';

export const Footer = () => {
    return (
        <footer className="footer text-black pt-5 pb-4">
            <Container>
                <Row>
                    <Col md={4} className="mb-4">
                        <h5>FloydStyle</h5>
                        <p>
                            Ropa con estilo único para personas auténticas.
                            Diseños que marcan la diferencia.
                        </p>
                    </Col>

                    <Col md={4} className="mb-4">
                        <h5>Links Rápidos</h5>
                        <ul className="list-unstyled">
                            <li><a href="/about" className="footer-link">Sobre Nosotros</a></li>
                            <li><a href="/contact" className="footer-link">Contacto</a></li>
                            <li><a href="/faq" className="footer-link">Preguntas Frecuentes</a></li>
                            <li><a href="/shipping" className="footer-link">Políticas de Envío</a></li>
                        </ul>
                    </Col>

                    <Col md={4} className="mb-4">
                        <h5>Síguenos</h5>
                        <div className="social-icons">
                            <a href="https://facebook.com" className="footer-link me-3"><FaFacebook size={30} /></a>
                            <a href="https://twitter.com" className="footer-link me-3"><FaTwitter size={30} /></a>
                            <a href="https://instagram.com" className="footer-link"><FaInstagram size={30} /></a>
                        </div>
                    </Col>
                </Row>
                <hr className="bg-light" />
                <Row>
                    <Col className="text-center">
                        <p className="mb-0">&copy; {new Date().getFullYear()} FloydStyle. Todos los derechos reservados.</p>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};