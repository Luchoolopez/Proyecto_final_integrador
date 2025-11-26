import React from "react";
import { Card, Badge } from "react-bootstrap";
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
        maximumFractionDigits: 0,
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
    <Card className="h-100 border-0 shadow-sm product-card overflow-hidden">
        
        <Link to={`/producto/${product.id}`} className="text-decoration-none text-body position-relative d-block">
            <div className="image-container">
                <Card.Img 
                    variant="top" 
                    src={imageUrl} 
                    alt={product.nombre}
                    className="product-card-img" 
                />
                
                <div className="img-overlay"></div>
                
                <div className="card-action-overlay">
                    <span className="btn btn-light btn-sm fw-bold px-4 rounded-pill">VER DETALLE</span>
                </div>
            </div>

            {product.descuento > 0 && (
                <Badge 
                    bg="danger"
                    className="position-absolute top-0 end-0 m-2 px-2 py-1 fw-bold"
                    style={{ borderRadius: '0px', fontSize: '0.75rem', letterSpacing: '1px' }}
                >
                    {Math.floor(product.descuento)}% OFF 
                </Badge>
            )}
        </Link>
        
        <Card.Body className="d-flex flex-column p-3">
            
            <Link to={`/producto/${product.id}`} className="text-decoration-none text-body">
                <Card.Title 
                    as="h6" 
                    className="fw-bold mb-2 text-truncate text-uppercase product-title" 
                    title={product.nombre}
                >
                    {product.nombre}
                </Card.Title>
            </Link>
            
            <div className="mt-auto">
                <div className="d-flex align-items-center gap-2 flex-wrap">
                    {product.descuento > 0 ? (
                        <>
                            <span className="text-muted text-decoration-line-through small">
                                {formatPrice(product.precio_base)}
                            </span>
                            <span className="fw-bold fs-5 text-danger">
                                {formatPrice(product.precio_final)}
                            </span>
                        </>
                    ) : (
                        <span className="fw-bold fs-5">
                            {formatPrice(product.precio_final)}
                        </span>
                    )}
                </div>

                {(product as any).info_cuotas && (
                    <Card.Text className="text-secondary small mt-1 fst-italic" style={{ fontSize: '0.75rem' }}>
                        {(product as any).info_cuotas}
                    </Card.Text>
                )}
            </div>
        </Card.Body>
    </Card>
  );
};