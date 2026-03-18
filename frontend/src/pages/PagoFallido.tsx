import React from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const PagoFallido: React.FC = () => {
  return (
    <div className="container py-5">
      <h1 className="mb-4 text-danger">Pago fallido</h1>
      <p className="lead">Hubo un problema al procesar tu pago. Por favor, intenta nuevamente.</p>
      <Button as={Link} to="/cart" variant="secondary">
        Volver al carrito
      </Button>
    </div>
  );
};

export default PagoFallido;
