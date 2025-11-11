import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Breadcrumb, Spinner, Alert, Button, Form } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';

import { productService } from '../api/productService';
import { type Product } from '../types/Product';
import { type Variant } from '../types/Variant';
import { ProductImageGallery } from '../components/Products/ProductImageGallery';
import { ProductVariantSelector } from '../components/Products/ProductVariantSelector';
import { useCartContext } from '../context/CartContext'; 
import { formatPrice } from '../utils/formatPrice';

import '../components/Products/ProductVariantSelector.css';

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { addItem } = useCartContext(); 
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!id) {
      setError("No se especificó un ID de producto.");
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await productService.getProductById(id);
        setProduct(data);

        const firstAvailableVariant = data.variantes.find(v => v.stock > 0);
        if (firstAvailableVariant) {
          setSelectedVariant(firstAvailableVariant);
        }

      } catch (err) {
        setError("Error al cargar el producto.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleSelectVariant = (variant: Variant) => {
    setSelectedVariant(variant);
    setQuantity(1); 
  };
  
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(1, Math.min(Number(e.target.value), selectedVariant?.stock || 1));
    setQuantity(value);
  };

  const handleAddToCart = async () => {
    if (product && selectedVariant) {
      try {
        await addItem(product, selectedVariant, quantity);
      } catch (err) {
        console.error("Error al agregar item:", err);
        alert("Hubo un error al agregar el producto al carrito.");
      }
    } else {
      alert("Por favor, selecciona un talle.");
    }
  };

  const renderContent = () => {
    if (loading) {
      return <div className="text-center my-5"><Spinner animation="border" /></div>;
    }
    if (error) {
      return <Alert variant="danger">{error}</Alert>;
    }
    if (!product) {
      return <Alert variant="warning">Producto no encontrado.</Alert>;
    }

    const isAddToCartDisabled = !selectedVariant || selectedVariant.stock === 0;

    return (
      <Row>
        <Col md={7} lg={8}>
          <ProductImageGallery images={product.imagenes} productName={product.nombre} />
        </Col>
        <Col md={5} lg={4}>
          <h2 className="fw-bold">{product.nombre}</h2>
          <div>
            {product.descuento > 0 && (
              <span className="text-muted text-decoration-line-through me-2 fs-5">
                {formatPrice(product.precio_base)}
              </span>
            )}
            <span className="fs-3 fw-bold text-danger">
              {formatPrice(product.precio_final)}
            </span>
          </div>
          <hr className="my-4" />

          <ProductVariantSelector 
            variants={product.variantes}
            selectedVariant={selectedVariant}
            onSelectVariant={handleSelectVariant}
          />
          
          <hr className="my-4" />

          <Row className="align-items-end">
            <Col xs={4}>
              <Form.Group controlId="quantitySelect">
                <Form.Label>Cantidad</Form.Label>
                <Form.Control 
                  type="number"
                  value={quantity}
                  onChange={handleQuantityChange}
                  min={1}
                  max={selectedVariant?.stock || 1}
                  disabled={isAddToCartDisabled}
                />
              </Form.Group>
            </Col>
            <Col xs={8}>
              <Button 
                variant="dark" 
                className="w-100"
                onClick={handleAddToCart}
                disabled={isAddToCartDisabled}
              >
                {isAddToCartDisabled ? 'Sin Stock' : 'Agregar al Carrito'}
              </Button>
            </Col>
          </Row>

          {product.descripcion && (
            <div className="mt-4">
              <h5 className="fw-bold">Descripción</h5>
              <p style={{ whiteSpace: 'pre-wrap' }}>{product.descripcion}</p>
            </div>
          )}
        </Col>
      </Row>
    );
  };
  
  return (
    <Container className="my-4">
      <Row>
        <Col>
          <Breadcrumb>
            <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>Inicio</Breadcrumb.Item>
            <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/productos" }}>Productos</Breadcrumb.Item>
            <Breadcrumb.Item active>
              {loading ? 'Cargando...' : (product?.nombre || 'Detalle')}
            </Breadcrumb.Item>
          </Breadcrumb>
        </Col>
      </Row>
      {renderContent()}
    </Container>
  );
};

export default ProductDetailPage;