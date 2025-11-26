import { Offcanvas, Form, ListGroup } from 'react-bootstrap';
import { useSearch } from '../../context/SearchContext'; 

export const SearchOverlay = () => {
  const { isSearchOpen, closeSearch } = useSearch();

  return (
    <Offcanvas
      show={isSearchOpen} 
      onHide={closeSearch} 
      placement="end"   
      className="w-100"   
      style={{ maxWidth: '500px' }} 
    >
      <Offcanvas.Header closeButton>

      </Offcanvas.Header>

      <Offcanvas.Body>
        <Form onSubmit={(e) => e.preventDefault()}> 
          <Form.Control
            type="search"
            placeholder="Buscar..."
            className="fs-3 border-0 border-bottom" 
            autoFocus 
          />
        </Form>

        <div className="search-suggestions mt-4">
          <h5 className="text-muted">Lo más buscado</h5>
          
          <ListGroup variant="flush"> 
            <ListGroup.Item action>Buzo</ListGroup.Item>
            <ListGroup.Item action>Pantalon</ListGroup.Item>
            <ListGroup.Item action>Remeron</ListGroup.Item>
            <ListGroup.Item action>Bermuda</ListGroup.Item>
          </ListGroup>
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  );
};