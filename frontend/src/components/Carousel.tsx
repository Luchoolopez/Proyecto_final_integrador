import './Carousel.style.css';

// Define la información de las imágenes que estarán en el carrusel.
// IMPORTANTE: Reemplaza los nombres de archivo ('carousel-1.jpg', etc.) y los textos 'alt'
// con los de tus imágenes reales que están en la carpeta `public`.
const carouselImages = [
    {
        src: '/carousel_1.jpeg', 
        alt: 'Descripción de la primera imagen para accesibilidad',
    },
    {
        src: '/carousel_2.jpeg',
        alt: 'Descripción de la segunda imagen para accesibilidad',
    },
    {
        src: '/carousel_3.jpeg',
        alt: 'Descripción de la tercera imagen para accesibilidad',
    },
    {
        src: '/carousel_4.jpeg',
        alt: 'Descripción de la cuarta imagen para accesibilidad',
    }
];

export const Carousel = () => {
    return (
        <div id="carouselHomePage" className="carousel slide" data-bs-ride="carousel">
            <div className="carousel-indicators">
                {carouselImages.map((_, index) => (
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
                {carouselImages.map((image, index) => (
                    <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                        <img src={image.src} className="d-block w-100" alt={image.alt} />
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