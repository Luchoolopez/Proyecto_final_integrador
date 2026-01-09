import { render, screen } from '@testing-library/react';
import { ProductCard } from '../components/Products/ProductCard';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import type { Product } from '../types/Product';

const mockProduct: Product = {
    id: 1,
    nombre: 'Producto Test',
    precio_base: 1000,
    precio_final: 1000,
    descuento: 0,
    stock_total: 10,
    imagen_principal: 'http://test.com/img.jpg',
    variantes: [],
    imagenes: []
};

describe('Componente ProductCard', () => {

    it('debe renderizar la información básica del producto', () => {
        render(
            <MemoryRouter>
                <ProductCard product={mockProduct} />
            </MemoryRouter>
        );

        expect(screen.getByText('Producto Test')).toBeInTheDocument();

        expect(screen.getByText(/\$ 1\.000/)).toBeInTheDocument();

        const img = screen.getByRole('img');
        expect(img).toHaveAttribute('src', 'http://test.com/img.jpg');
        expect(img).toHaveAttribute('alt', 'Producto Test');
    });

    it('debe mostrar el descuento y precio tachado si hay descuento', () => {
        const productOnSale: Product = {
            ...mockProduct,
            descuento: 20,
            precio_base: 2000,
            precio_final: 1600
        };

        render(
            <MemoryRouter>
                <ProductCard product={productOnSale} />
            </MemoryRouter>
        );

        expect(screen.getByText('20% OFF')).toBeInTheDocument();

        // Precio original tachado
        const originalPrice = screen.getByText(/\$ 2\.000/);
        expect(originalPrice).toHaveClass('text-decoration-line-through');

        const finalPrice = screen.getByText(/\$ 1\.600/);
        expect(finalPrice).toHaveClass('text-danger');
    });

    it('NO debe mostrar el badge de descuento si descuento es 0', () => {
        render(
            <MemoryRouter>
                <ProductCard product={mockProduct} />
            </MemoryRouter>
        );

        expect(screen.queryByText(/% OFF/)).not.toBeInTheDocument();
    });

    it('debe usar la primera imagen de la galería si no hay imagen principal', () => {
        const productWithGallery: Product = {
            ...mockProduct,
            imagen_principal: '',
            imagenes: [
                { id: 1, imagen: 'http://test.com/gallery1.jpg' }
            ]
        };

        render(
            <MemoryRouter>
                <ProductCard product={productWithGallery} />
            </MemoryRouter>
        );

        const img = screen.getByRole('img');
        expect(img).toHaveAttribute('src', 'http://test.com/gallery1.jpg');
    });

    it('debe usar el placeholder si no hay ninguna imagen', () => {
        const productNoImages: Product = {
            ...mockProduct,
            imagen_principal: '',
            imagenes: []
        };

        render(
            <MemoryRouter>
                <ProductCard product={productNoImages} />
            </MemoryRouter>
        );

        const img = screen.getByRole('img');
        expect(img).toHaveAttribute('src', 'https://via.placeholder.com/400x500?text=Sin+Imagen');
    });
});
