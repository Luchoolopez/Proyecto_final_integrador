import React from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const PagoPendiente: React.FC = () => {
  return (
    <div className="container py-5">
      <h1 className="mb-4">Pago pendiente</h1>
      <p className="lead">Tu pago se encuentra en estado pendiente. Te avisaremos cuando se confirme.</p>
      <Button as={Link} to="/" variant="primary">
        Volver al inicio
      </Button>
    </div>
  );
};

export default PagoPendiente;
