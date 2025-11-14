import React, { useState } from 'react';
import { Form, Button, Row, Col, ListGroup } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import { useCategoryContext } from '../../context/CategoryContext';

const TALL_OPTIONS = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

interface ProductFiltersProps {
  selectedTalles: string[];
  onTalleChange: (talle: string) => void;
  onPriceChange: (min: number | undefined, max: number | undefined) => void;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({ 
  selectedTalles, 
  onTalleChange, 
  onPriceChange 
}) => {
  const { categoriaNombre } = useParams<{ categoriaNombre?: string }>();
  const { categories, loading: loadingCategories } = useCategoryContext();
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');

  const handleApplyPrice = () => {
    const min = minPrice ? Number(minPrice) : undefined;
    const max = maxPrice ? Number(maxPrice) : undefined;
    onPriceChange(min, max);
  };

  const categoryToUrl = (categoryName: string) => {
    return categoryName.toLowerCase().replace(/\s+/g, '-');
  };

  const isCategoryActive = (categoryName: string) => {
    if (!categoriaNombre) return false;
    const urlFriendlyName = categoryToUrl(categoryName);
    return categoriaNombre === urlFriendlyName;
  };

  return (
    <div>
      <h4 className="mb-3 fw-bold">Filtrar por</h4>
      
      {/* Filtro de Categorías */}
      <div className="mb-4">
        <h5 className="text-uppercase mb-3" style={{ fontSize: '0.9rem' }}>Categorías</h5>
        {loadingCategories ? (
          <p className="text-muted small">Cargando categorías...</p>
        ) : (
          <ListGroup variant="flush">
            {/* Opción "Todas" */}
            <ListGroup.Item 
              as={Link}
              to="/productos"
              action
              className={`border-0 px-0 py-2 ${!categoriaNombre || categoriaNombre === 'descuentos' ? 'text-grey' : ''}`}
              style={{ 
                fontWeight: !categoriaNombre || categoriaNombre === 'descuentos' ? '600' : '400',
                textDecoration: 'none'
              }}
            >
              Todas las categorías
            </ListGroup.Item>
            
            {/* Lista de categorías */}
            {categories.map((category) => (
              <ListGroup.Item
                key={category.id}
                as={Link}
                to={`/productos/${categoryToUrl(category.nombre)}`}
                action
                className={`border-0 px-0 py-2 ${isCategoryActive(category.nombre) ? 'text-grey' : ''}`}
                style={{ 
                  fontWeight: isCategoryActive(category.nombre) ? '600' : '400',
                  textDecoration: 'none'
                }}
              >
                {category.nombre}
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </div>

      <hr className="my-4" />
      
      {/* Filtro de Talle */}
      <div className="mb-4">
        <h5 className="text-uppercase mb-3" style={{ fontSize: '0.9rem' }}>Talle</h5>
        <Form>
          {TALL_OPTIONS.map((talle) => (
            <Form.Check
              key={talle}
              type="checkbox"
              id={`talle-check-${talle}`}
              label={talle}
              checked={selectedTalles.includes(talle)}
              onChange={() => onTalleChange(talle)}
              className="mb-2"
            />
          ))}
        </Form>
      </div>

      <hr className="my-4" />
      
      {/* Filtro de Precio */}
      <div className="mb-4">
        <h5 className="text-uppercase mb-3" style={{ fontSize: '0.9rem' }}>Precio</h5>
        <Form>
          <Row className="g-2 mb-3">
            <Col>
              <Form.Group controlId="filterMinPrice">
                <Form.Label className="small text-uppercase">Desde</Form.Label>
                <Form.Control 
                  type="number" 
                  placeholder="$" 
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="filterMaxPrice">
                <Form.Label className="small text-uppercase">Hasta</Form.Label>
                <Form.Control 
                  type="number" 
                  placeholder="$"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>
          <Button 
            variant="dark"
            className="w-100" 
            onClick={handleApplyPrice}
          >
            Aplicar
          </Button>
        </Form>
      </div>
    </div>
  );
};