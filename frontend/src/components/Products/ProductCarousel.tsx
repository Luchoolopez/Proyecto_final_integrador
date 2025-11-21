import React, { useRef } from 'react';
import { Container, Button } from 'react-bootstrap';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { ProductCard } from './ProductCard';
import { type Product } from '../../types/Product';
import './ProductCarousel.css';

interface ProductCarouselProps {
    title: string;
    products: Product[];
}

export const ProductCarousel: React.FC<ProductCarouselProps> = ({ title, products }) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const { current } = scrollRef;
            // Ancho de la tarjeta + gap (aprox)
            const scrollAmount = current.clientWidth / 2; // Desliza media pantalla
            
            if (direction === 'left') {
                current.scrollLeft -= scrollAmount;
            } else {
                current.scrollLeft += scrollAmount;
            }
        }
    };

    if (!products || products.length === 0) return null;

    return (
        <Container className="my-5 position-relative">
            <h2 className="text-center mb-4 fw-bold">{title}</h2>
            
            {/* Flecha Izquierda */}
            <Button 
                variant="light"
                className="position-absolute start-0 top-50 translate-middle-y z-3 shadow rounded-circle d-none d-md-flex align-items-center justify-content-center border"
                style={{ width: '45px', height: '45px', left: '-20px' }}
                onClick={() => scroll('left')}
            >
                <FaChevronLeft />
            </Button>

            {/* Contenedor de Productos */}
            <div className="product-carousel-container" ref={scrollRef}>
                {products.map((product) => (
                    <div key={product.id} className="product-carousel-item">
                        <ProductCard product={product} />
                    </div>
                ))}
            </div>

            {/* Flecha Derecha */}
            <Button 
                variant="light"
                className="position-absolute end-0 top-50 translate-middle-y z-3 shadow rounded-circle d-none d-md-flex align-items-center justify-content-center border"
                style={{ width: '45px', height: '45px', right: '-20px' }}
                onClick={() => scroll('right')}
            >
                <FaChevronRight />
            </Button>
        </Container>
    );
};