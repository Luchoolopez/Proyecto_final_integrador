import React, { useEffect, useState } from 'react'; 
import { Container, Button, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Carousel } from "../components/Carousel";
import { ProductCarousel } from "../components/Products/ProductCarousel";
import { productService } from '../api/productService';
import { type Product } from '../types/Product';

const Home = () => {
    const [newProducts, setNewProducts] = useState<Product[]>([]);
    const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchHomeProducts = async () => {
            try {
                setLoading(true);
                
                // Hacemos las dos peticiones en paralelo para que cargue más rápido
                const [featuredRes, newRes] = await Promise.all([
                    // 1. Traer Destacados (es_destacado = true)
                    productService.getProducts({ 
                        limit: 10, 
                        es_destacado: true, 
                        active: true,
                        sort: 'fecha_creacion,DESC'
                    }),
                    // 2. Traer Nuevos (es_nuevo = true)
                    productService.getProducts({ 
                        limit: 10, 
                        es_nuevo: true, 
                        active: true,
                        sort: 'fecha_creacion,DESC'
                    })
                ]);

                setFeaturedProducts(featuredRes.productos);
                setNewProducts(newRes.productos);

            } catch (err) {
                console.error(err);
                setError('No se pudieron cargar los productos.');
            } finally {
                setLoading(false);
            }
        };

        fetchHomeProducts();
    }, []);

    return (
        <>
            {/* Banner Principal */}
            <Carousel />
            
            {/* Sección de Bienvenida */}
            <Container className="my-5 text-center">
                <h1 className="display-5 fw-bold mb-3">Bienvenidos a Concept & Hab</h1>
                <p className="lead text-muted mb-4">
                    Descubre lo último en moda urbana. Calidad y estilo en cada prenda.
                </p>
                <Button as={Link} to="/productos" variant="dark" size="lg" className="px-4">
                    Ver Catálogo Completo
                </Button>
            </Container>

            {/* Contenido Dinámico */}
            {loading ? (
                <div className="text-center py-5">
                    <Spinner animation="border" />
                </div>
            ) : error ? (
                <Container>
                    <Alert variant="warning" className="text-center">{error}</Alert>
                </Container>
            ) : (
                <>
                    {/* 1. Carrusel de Destacados (Arriba) */}
                    {featuredProducts.length > 0 && (
                        <ProductCarousel title="Productos Destacados" products={featuredProducts} />
                    )}

                    {/* 2. Carrusel de Nuevos Ingresos (Abajo) */}
                    {newProducts.length > 0 && (
                        <ProductCarousel title="Nuevos Ingresos" products={newProducts} />
                    )}

                    {/* Mensaje si no hay nada */}
                    {featuredProducts.length === 0 && newProducts.length === 0 && (
                        <Container className="text-center text-muted py-4">
                            <p>No hay productos destacados ni nuevos ingresos para mostrar por el momento.</p>
                        </Container>
                    )}
                </>
            )}
        </>
    );
}

export default Home;