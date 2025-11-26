import React, { useState, useEffect, useMemo } from 'react';
import { Image } from 'react-bootstrap';
import { type ProductImage } from '../../types/Product';
import './ProductImageGallery.css';

interface ProductImageGalleryProps {
  images: ProductImage[];
  productName: string;
  mainImage?: string;
}

export const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({
  images = [],
  productName,
  mainImage
}) => {
  const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);

  // Combinar imagen principal y galeria
  const allImages = useMemo(() => {
    const gallery = [...images];
    if (mainImage && !gallery.some(img => img.imagen === mainImage)) {
      gallery.unshift({
        id: -1,
        imagen: mainImage,
        alt_text: 'Imagen Principal'
      });
    }
    return gallery;
  }, [images, mainImage]);

  // 2. Seleccionar la primera por defecto si cambia la lista
  useEffect(() => {
    if (allImages.length > 0) {
      if (!selectedImage || !allImages.some(img => img.imagen === selectedImage)) {
        setSelectedImage(allImages[0].imagen);
      }
    }
  }, [allImages, selectedImage]);

  const currentImage = selectedImage || (allImages.length > 0 ? allImages[0].imagen : undefined);

  if (!currentImage) {
    return (
      <div className="main-image-container d-flex align-items-center justify-content-center">
        <p className="text-muted">Sin imagen</p>
      </div>
    );
  }

  return (
    <div className="gallery-container">
      
      {/* Columna de Miniaturas */}
      {allImages.length > 1 && (
        <div className="thumbnails-column">
          {allImages.map((image, index) => (
            <img
              key={image.id || index}
              src={image.imagen}
              alt={`Vista ${index}`}
              className={`thumbnail-image ${image.imagen === currentImage ? 'active' : ''}`}
              onClick={() => setSelectedImage(image.imagen)}
              onMouseEnter={() => setSelectedImage(image.imagen)}
            />
          ))}
        </div>
      )}

      {/* Imagen Principal */}
      <div className="main-image-container">
        <Image
          src={currentImage}
          alt={`Imagen principal de ${productName}`}
          fluid
        />
      </div>
    </div>
  );
};