import React from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const PagoExitoso: React.FC = () => {
  return (
    <div className="container py-5">
      <h1 className="mb-4">¡Pago exitoso!</h1>
      <p className="lead">Tu pago ha sido procesado correctamente. Gracias por tu compra.</p>
      <p>En breve recibirás la confirmación de tu pedido en tu cuenta.</p>
      <Button as={Link} to="/" variant="primary">
        Volver al inicio
      </Button>
    </div>
  );
};

export default PagoExitoso;
