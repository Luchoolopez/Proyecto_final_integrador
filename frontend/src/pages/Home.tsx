import React, { useState } from 'react'; 
import { Container, Row, Col } from 'react-bootstrap';
import { Carousel } from "../components/Carousel";
import { useAuthContext } from "../context/AuthContext";
import {ProductCard} from "../components/ProductCard/ProductCard"; 
import { MOCK_PRODUCTS } from '../mocks/mockProduct';
import { type Product } from '../types/Product';

const Home = () => {
    const { user } = useAuthContext();
    
    // 3. Guarda tus productos en un estado
    const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);

    return (
        <>
            <Carousel />
            
            <Container className="my-5"> 
                <h2 className="mb-4 text-center">Productos Destacados</h2>
                <p className="text-center">Bienvenido, {user?.nombre || 'invitado'}</p>
                
                <Row xs={2} md={2} lg={4} className="g-4">
                    {products.map((product) => (
                        <Col key={product.id}>
                            <ProductCard product={product} /> 
                        </Col>
                    ))}
                </Row>
            </Container>
        </>
    )
}

export default Home;