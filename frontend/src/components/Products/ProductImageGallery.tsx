import React, { useState, useEffect } from 'react';
import { Row, Col, Image } from 'react-bootstrap';
import { type ProductImage } from '../../types/Product';
import './ProductImageGallery.css'; 

interface ProductImageGalleryProps {
  images: ProductImage[];
  productName: string; 
}

export const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({ images, productName }) => {
  const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (images && images.length > 0) {
      setSelectedImage(images[0].imagen);
    }
  }, [images]);
  
  if (!selectedImage) {
    return (
      <div className="main-image-placeholder">
        <Image 
          src="https://via.placeholder.com/600x700?text=Cargando..." 
          alt="Cargando producto" 
          fluid 
        />
      </div>
    );
  }

  return (
    <div>
      <div className="main-image-container mb-3">
        <Image 
          src={selectedImage} 
          alt={`Imagen principal de ${productName}`} 
          fluid 
        />
      </div>
      
      <Row className="g-2">
        {images.map((image) => (
          <Col xs={3} sm={2} key={image.id}>
            <Image
              src={image.imagen}
              alt={`Miniatura de ${productName}`}
              fluid
              className={`thumbnail-image ${image.imagen === selectedImage ? 'active' : ''}`}
              onClick={() => setSelectedImage(image.imagen)}
              style={{ cursor: 'pointer' }}
            />
          </Col>
        ))}
      </Row>
    </div>
  );
};