import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { ProductCard } from './ProductCard';
import { type Product } from '../../types/Product';

interface ProductGridProps {
  products: Product[];
}

export const ProductGrid: React.FC<ProductGridProps> = ({ products }) => {
  return (
    <Row xs={2} md={2} lg={4} className="g-4">
      {products.map((product) => (
        <Col key={product.id}>
          <ProductCard product={product} />
        </Col>
      ))}
    </Row>
  );
};