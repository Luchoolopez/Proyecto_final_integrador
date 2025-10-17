import React from "react";
import { Card, Badge } from "react-bootstrap";
import {LinkContainer} from 'react-router-bootstrap'
import { type Product } from "../../types/Product";
import './ProductCard'

interface ProductCardProps{
    product: Product;
}

const formatPrice = (price:number) => {
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
    }).format(price);
};

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <LinkContainer to={`/producto/${product.id}`} style={{ cursor: 'pointer' }}>
      <Card className="h-100 shadow-sm">
        <div className="position-relative">
          <Card.Img variant="top" src={product.imagen_principal} alt={product.nombre} />
          {product.descuento_porcentaje > 0 && (
            <Badge 
              bg="danger" 
              className="position-absolute top-0 end-0 m-2"
            >
              {product.descuento_porcentaje}% OFF
            </Badge>
          )}
        </div>
        <Card.Body className="d-flex flex-column">
          <Card.Title as="h5" className="flex-grow-1">{product.nombre}</Card.Title>
          <div className="mt-auto">
            {product.descuento_porcentaje > 0 && (
              <span className="text-muted text-decoration-line-through">
                {formatPrice(product.precio_original)}
              </span>
            )}
            <Card.Text className="fw-bold fs-5 mb-1">
              {formatPrice(product.precio_final)}
            </Card.Text>
            {product.info_cuotas && (
                <Card.Text className="text-danger small">
                    {product.info_cuotas}
                </Card.Text>
            )}
          </div>
        </Card.Body>
      </Card>
    </LinkContainer>
  );
};