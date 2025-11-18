import React from "react";
import { Card, Badge, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { type Product } from "../../types/Product"; 
import './ProductCard.css';

interface ProductCardProps {
    product: Product;
}

const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
    }).format(price);
};

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    
    let imageUrl = product.imagen_principal;

    if (!imageUrl && product.imagenes && product.imagenes.length > 0) {
        imageUrl = product.imagenes[0].imagen;
    }

    if (!imageUrl) {
        imageUrl = "https://via.placeholder.com/400x500?text=Sin+Imagen";
    }

  return (
    <Card className="h-100 shadow-sm product-card">
        
        <Link to={`/producto/${product.id}`} className="text-decoration-none text-body">
            <div className="position-relative">
                <Card.Img 
                    variant="top" 
                    
                    src={imageUrl} 

                    alt={product.nombre}
                    className="product-card-img" 
                />
                
                {product.descuento > 0 && (
                    <Badge 
                        bg="danger" 
                        className="position-absolute top-0 end-0 m-2"
                    >
                        {Math.floor(product.descuento)}% OFF
                    </Badge>
                )}
            </div>
        </Link>
        
        <Card.Body className="d-flex flex-column">
            
            <Link to={`/producto/${product.id}`} className="text-decoration-none text-body">
                <Card.Title as="h5" className="flex-grow-1">{product.nombre}</Card.Title>
            </Link>
            
            <div className="mt-auto">
                
                {product.descuento > 0 && (
                    <span className="text-muted text-decoration-line-through me-2">
                        {formatPrice(product.precio_base)}
                    </span>
                )}

                <Card.Text className="fw-bold fs-5 mb-1 d-inline">
                    {formatPrice(product.precio_final)}
                </Card.Text>

                {(product as any).info_cuotas && (
                    <Card.Text className="text-danger small">
                        {(product as any).info_cuotas}
                    </Card.Text>
                )}
            </div>

            <div className="card-buttons-overlay">
                <Link to={`/producto/${product.id}`} className="btn btn-outline-secondary card-button">
                    VER
                </Link>
            </div>
        </Card.Body>
    </Card>
  );
};