import React, { useState, useEffect } from "react"; // --- 1. Importar useEffect
import { useAuthContext } from '../context/AuthContext';
import { Link, useNavigate, useLocation } from "react-router-dom"; // --- 2. Importar useLocation
import { Eye, EyeSlash } from "react-bootstrap-icons";
import { Container, Row, Col, Form, Button, Breadcrumb, InputGroup, Alert } from "react-bootstrap";
import type { LoginData, User } from "../types/user";

export const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const { login, loading, error } = useAuthContext();
    const navigate = useNavigate();

    
    const location = useLocation();
    
    const [successMessage, setSuccessMessage] = useState(location.state?.successMessage);

    useEffect(() => {
        
        if (location.state?.successMessage) {
            window.history.replaceState(null, '');
        }

        
        const timer = setTimeout(() => {
            setSuccessMessage(null);
        }, 7000);

        return () => clearTimeout(timer); 
    }, [location.state]); 
    

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const values: LoginData = { email, password };
        try{
            const user = await login(values) as User | void;
            if(user){
                if(user.rol === 'admin'){
                    navigate('/admin/productos');
                }else{
                    navigate('/')
                }
            }
        }catch(error){
            console.error("Error al iniciar sesion", error);
        }
    };

    return (
        <Container className="my-5">
            <Row>
                <Col>
                    <Breadcrumb>
                        <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>Inicio</Breadcrumb.Item>
                        <Breadcrumb.Item active>Login</Breadcrumb.Item>
                    </Breadcrumb>
                </Col>
            </Row>

            <Row className="justify-content-md-center">
                <Col md={6} lg={5}>
                    
                    
                    {successMessage && (
                        <Alert 
                            variant="success" 
                            onClose={() => setSuccessMessage(null)} 
                            dismissible
                        >
                            {successMessage}
                        </Alert>
                    )}

                    <h2 className="text-center mb-4 fw-bold">Iniciar sesión</h2>

                    {error && <Alert variant="danger">{error}</Alert>}

                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="loginEmail">
                            <Form.Label>EMAIL</Form.Label>
                            <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </Form.Group>

                        <Form.Group className="mb-2" controlId="loginPassword">
                            <Form.Label>CONTRASEÑA</Form.Label>
                            <InputGroup>
                                <Form.Control type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required />
                                <Button variant="outline-secondary" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <EyeSlash /> : <Eye />}
                                </Button>
                            </InputGroup>
                        </Form.Group>

                        <div className="text-end mb-3">
                            <Link to="/forgot-password" className="form-link">¿Olvidaste tu contraseña?</Link>
                        </div>

                        <Button variant="dark" type="submit" className="w-100 border" disabled={loading}>
                            {loading ? "Cargando..." : "INICIAR SESIÓN"}
                        </Button>
                    </Form>

                    <p className="text-center mt-3">
                        ¿No tenés cuenta aún? <Link to="/register" className="form-link fw-bold">Crear cuenta</Link>
                    </p>
                </Col>
            </Row>
        </Container>
    );
};

export default Login;