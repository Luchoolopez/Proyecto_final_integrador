import { useEffect, useState } from 'react';
import './Carousel.style.css';
import { carouselService } from '../api/carouselService';
import type { CarouselImage } from '../api/carouselService';

export const Carousel = () => {
    const [images, setImages] = useState<CarouselImage[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const data = await carouselService.getActive();
                setImages(data);
            } catch (error) {
                console.error('Error al cargar las imágenes del carrusel:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchImages();
    }, []);

    // --- LA FUNCIÓN PARA CELULARES (Vertical) ---
    const generarImagenCelular = (urlOriginal: string) => {
        if (!urlOriginal.includes('cloudinary.com')) return urlOriginal;
        const transformacion = 'c_pad,b_auto,w_800,h_1200';
        return urlOriginal.replace('/upload/', `/upload/${transformacion}/`);
    };

    // --- NUEVA FUNCIÓN PARA TABLETS Y NOTEBOOKS PEQUEÑAS (Casi Cuadrada) ---
    const generarImagenTablet = (urlOriginal: string) => {
        if (!urlOriginal.includes('cloudinary.com')) return urlOriginal;
        // Ajustamos la imagen a un formato 4:3 (1200x900) ideal para esas pantallas medias
        const transformacion = 'c_pad,b_auto,w_1200,h_900';
        return urlOriginal.replace('/upload/', `/upload/${transformacion}/`);
    };

    if (loading) return null; 
    if (images.length === 0) return null;

    return (
        <div id="carouselHomePage" className="carousel slide" data-bs-ride="carousel">
            <div className="carousel-indicators">
                {images.map((_, index) => (
                    <button
                        key={index}
                        type="button"
                        data-bs-target="#carouselHomePage"
                        data-bs-slide-to={index}
                        className={index === 0 ? 'active' : ''}
                        aria-current={index === 0 ? 'true' : 'false'}
                        aria-label={`Slide ${index + 1}`}
                    ></button>
                ))}
            </div>

            <div className="carousel-inner">
                {images.map((image, index) => (
                    <div key={image.id} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                        
                        {/* ETIQUETA PICTURE MÚLTIPLE */}
                        <picture>
                            {/* 1. Celulares (hasta 767px) */}
                            <source 
                                media="(max-width: 767px)" 
                                srcSet={generarImagenCelular(image.imagen)} 
                            />
                            
                            {/* 2. Tablets y Laptops pequeñas (de 768px hasta 1259px) */}
                            <source 
                                media="(max-width: 1259px)" 
                                srcSet={generarImagenTablet(image.imagen)} 
                            />
                            
                            {/* 3. PC Grandes y Monitores Anchos (1260px en adelante) */}
                            <img 
                                src={image.imagen} 
                                className="d-block w-100" 
                                style={{ objectFit: 'cover' }}
                                alt={image.alt_text || `Slide de carrusel ${index + 1}`} 
                            />
                        </picture>

                    </div>
                ))}
            </div>

            <button className="carousel-control-prev" type="button" data-bs-target="#carouselHomePage" data-bs-slide="prev">
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Previous</span>
            </button>

            <button className="carousel-control-next" type="button" data-bs-target="#carouselHomePage" data-bs-slide="next">
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Next</span>
            </button>
        </div>
    );
};