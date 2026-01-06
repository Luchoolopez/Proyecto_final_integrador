import { useState } from 'react';
import { Offcanvas, Form, ListGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useSearch } from '../../context/SearchContext'; 
import { IoSearchOutline } from "react-icons/io5";

export const SearchDrawer = () => {
    const { isSearchOpen, closeSearch } = useSearch();
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const topSearches = ['Buzo', 'Pantalon', 'Remeron', 'Bermuda'];

    const ejecutarBusqueda = (term: string) => {

        if (!term.trim()) {
            return;
        }
        
        closeSearch();
        
        const url = `/productos?busqueda=${encodeURIComponent(term)}`;
        navigate(url); 
        
        setSearchTerm('');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault(); 
        console.log("0. Submit detectado (Enter presionado)"); 
        ejecutarBusqueda(searchTerm);
    };

    return (
        <Offcanvas 
            show={isSearchOpen} 
            onHide={closeSearch} 
            placement="end" 
            className="bg-dark text-white" 
            data-bs-theme="dark" 
        >
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>Buscar</Offcanvas.Title>
            </Offcanvas.Header>
            
            <Offcanvas.Body>
                <Form onSubmit={handleSubmit}>
                    <div className="position-relative mb-4">
                        <Form.Control
                            type="text"
                            placeholder="Buscar..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            autoFocus
                            className="bg-transparent text-white border-secondary"
                            style={{ paddingRight: '40px' }}
                        />
                        
                        <IoSearchOutline 
                            className="position-absolute top-50 end-0 translate-middle-y me-3 text-muted" 
                            size={20}
                            onClick={() => ejecutarBusqueda(searchTerm)}
                            style={{ cursor: 'pointer' }}
                        />
                    </div>

                    <button type="submit" className="d-none"></button> 
                </Form>

                <h6 className="text-muted mb-3">Lo más buscado</h6>
                <ListGroup variant="flush">
                    {topSearches.map((item, index) => (
                        <ListGroup.Item 
                            key={index} 
                            action 
                            onClick={() => ejecutarBusqueda(item)}
                            className="bg-transparent text-white border-secondary ps-0 py-3"
                            style={{ cursor: 'pointer' }}
                        >
                            {item}
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            </Offcanvas.Body>
        </Offcanvas>
    );
};