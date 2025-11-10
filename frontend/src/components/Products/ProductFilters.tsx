import React, { useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';

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
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');

  const handleApplyPrice = () => {
    const min = minPrice ? Number(minPrice) : undefined;
    const max = maxPrice ? Number(maxPrice) : undefined;
    onPriceChange(min, max);
  };

  return (
    <div>
      <h4 className="mb-3 fw-bold">Filtrar por</h4>
      
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