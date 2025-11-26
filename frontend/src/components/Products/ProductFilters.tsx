import React, { useState } from 'react';
import { Form, Button, Row, Col, ListGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { type Category } from '../../api/categoryService';
import './ProductFilters.css';

const TALL_SETS = {
  default: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  pantalones: ['36', '38', '40', '42', '44', '46', '48'],
  calzado: ['37', '38', '39', '40', '41', '42', '43', '44', '45', '46']
};

type TalleSet = keyof typeof TALL_SETS;
type FilterMode = 'navigate' | 'filter';

interface ProductFiltersProps {
  categories: Category[];
  loadingCategories: boolean;

  selectedTalles: string[];
  onTalleChange: (talle: string) => void;

  onPriceChange: (min: number | undefined, max: number | undefined) => void;

  talleSet: TalleSet;
  mode: FilterMode;

  onCategoryChange: (id: number | undefined) => void;
  activeCategoryId?: number;

  categoryLinkPrefix: string;
  activeCategorySlug?: string;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  categories,
  loadingCategories,
  selectedTalles,
  onTalleChange,
  onPriceChange,
  talleSet,
  mode,
  onCategoryChange,
  activeCategoryId,
  categoryLinkPrefix,
  activeCategorySlug
}) => {
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

  const tallesToShow = TALL_SETS[talleSet] || TALL_SETS.default;

  const allCategoriesLink = mode === 'navigate' ? categoryLinkPrefix : undefined;
  const allCategoriesClick = mode === 'filter' ? () => onCategoryChange(undefined) : undefined;

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
            {/* Botón "Todas las categorías" */}
            <ListGroup.Item
              as={mode === 'navigate' ? Link : 'button'}
              to={allCategoriesLink}
              onClick={allCategoriesClick}
              action
              className={`border-0 px-0 py-2 ${!activeCategoryId && !activeCategorySlug ? 'text-primary fw-bold' : ''}`}
              style={{ textDecoration: 'none', background: 'none', border: 'none', textAlign: 'left', width: '100%', padding: '0.5rem 0' }}
            >
              Todas las categorías
            </ListGroup.Item>

            {/* Lista de categorías */}
            {categories.map((category) => {
              const categorySlug = categoryToUrl(category.nombre);
              const isActive = (mode === 'navigate' && activeCategorySlug === categorySlug) ||
                (mode === 'filter' && activeCategoryId === category.id);

              if (mode === 'navigate') {
                return (
                  <ListGroup.Item
                    key={category.id}
                    as={Link}
                    to={`${categoryLinkPrefix}/${categorySlug}`}
                    action
                    className={`border-0 px-0 py-2 ${isActive ? 'text-primary fw-bold' : ''}`}
                    style={{ textDecoration: 'none' }}
                  >
                    {category.nombre}
                  </ListGroup.Item>
                );
              } else {
                return (
                  <ListGroup.Item
                    key={category.id}
                    as="button"
                    action
                    onClick={() => onCategoryChange(category.id)}
                    className={`border-0 px-0 py-2 ${isActive ? 'text-primary fw-bold' : ''}`}
                    style={{ background: 'none', border: 'none', textAlign: 'left', width: '100%', padding: '0.5rem 0' }}
                  >
                    {category.nombre}
                  </ListGroup.Item>
                );
              }
            })}
          </ListGroup>
        )}
      </div>

      <hr className="my-4" />

      {/* Filtro de Talle */}
      <div className="mb-4">
        <h5 className="text-uppercase mb-3" style={{ fontSize: '0.9rem' }}>Talle</h5>
        <Form>
          {tallesToShow.map((talle) => (
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