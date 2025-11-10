import React from 'react';
import { Form } from 'react-bootstrap';

interface ProductSortDropdownProps {
  sortOrder: string;
  setSortOrder: (sortOrder: string) => void;
}

export const ProductSortDropdown: React.FC<ProductSortDropdownProps> = ({ sortOrder, setSortOrder }) => {
  return (
    <Form.Group controlId="productSort">
      <Form.Label className="visually-hidden">Ordenar por</Form.Label>
      <Form.Select 
        value={sortOrder} 
        onChange={(e) => setSortOrder(e.target.value)}
        aria-label="Ordenar productos por"
      >
        <option value="fecha_creacion,DESC">Recomendados</option>
        <option value="precio_base,DESC">Precio: Mayor a Menor</option>
        <option value="precio_base,ASC">Precio: Menor a Mayor</option>
        <option value="nombre,ASC">Nombre: A-Z</option>
        <option value="nombre,DESC">Nombre: Z-A</option>
      </Form.Select>
    </Form.Group>
  );
};