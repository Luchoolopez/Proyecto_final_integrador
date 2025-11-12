import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Breadcrumb, Spinner, Alert, Button, Offcanvas } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';

import { productService, type ProductFilters as ProductFiltersType } from '../api/productService';
import { type Product } from '../types/Product';
import { ProductGrid } from '../components/Products/ProductGrid';
import { ProductSortDropdown } from '../components/Products/ProductSortDropdown';
import { ProductFilters } from '../components/Products/ProductFilters';
import { useCategoryContext } from '../context/CategoryContext';

const ProductListPage = () => {
  const { categoriaNombre } = useParams<{ categoriaNombre?: string }>();
  const { categories } = useCategoryContext();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<ProductFiltersType>({
    sort: 'fecha_creacion,DESC',
    talles: [],
    precio: { min: undefined, max: undefined },
    categoria_id: undefined,
    con_descuento: undefined,
  });
 
  const [showFilters, setShowFilters] = useState(false);
  const handleCloseFilters = () => setShowFilters(false);
  const handleShowFilters = () => setShowFilters(true);

  useEffect(() => {    
    if (categoriaNombre === 'descuentos') {
      // Si la URL es /productos/descuentos
      setFilters(currentFilters => ({
        ...currentFilters,
        categoria_id: undefined,
        con_descuento: true
      }));
    } else if (categoriaNombre) {
      // Si la URL tiene una categoría (ej: /productos/remeras)
      if (categories.length > 0) {
        const nombreBuscado = categoriaNombre.replace(/-/g, ' ');
        const category = categories.find(c => c.nombre.toLowerCase() === nombreBuscado.toLowerCase());
        
        setFilters(currentFilters => ({
          ...currentFilters,
          categoria_id: category ? category.id : undefined,
          con_descuento: undefined
        }));
      }
    } else {
      // Si la URL es solo /productos (sin parámetros)
      setFilters(currentFilters => ({
        ...currentFilters,
        categoria_id: undefined,
        con_descuento: undefined
      }));
    }
  }, [categoriaNombre, categories]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await productService.getProducts(filters);
        setProducts(data.productos);
      } catch (err) {
        setError('Error al cargar los productos. Inténtalo de nuevo más tarde.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [filters]);

  const handleSortChange = (sortValue: string) => {
    setFilters(currentFilters => ({ ...currentFilters, sort: sortValue }));
  };
  
  const handleTalleChange = (talle: string) => {
    setFilters(currentFilters => {
      const isSelected = currentFilters.talles.includes(talle);
      const newTalles = isSelected
        ? currentFilters.talles.filter(t => t !== talle)
        : [...currentFilters.talles, talle];
      return { ...currentFilters, talles: newTalles };
    });
  };
  
  const handlePriceChange = (min: number | undefined, max: number | undefined) => {
    setFilters(currentFilters => ({ ...currentFilters, precio: { min, max } }));
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="text-center my-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </Spinner>
        </div>
      );
    }
    if (error) {
      return <Alert variant="danger">{error}</Alert>;
    }
    if (!loading && products.length === 0) {
      return <Alert variant="info">No se encontraron productos con esos filtros.</Alert>;
    }
    return <ProductGrid products={products} />;
  };

  const filterComponent = (
    <ProductFilters
      selectedTalles={filters.talles}
      onTalleChange={handleTalleChange}
      onPriceChange={handlePriceChange}
    />
  );

  return (
    <Container fluid className="my-4">
      <Row>
        <Col>
          <Breadcrumb>
            <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>Inicio</Breadcrumb.Item>
            <Breadcrumb.Item active>Productos</Breadcrumb.Item>
          </Breadcrumb>
        </Col>
      </Row>

      <Row className="mb-3 align-items-center">
        <Col xs={6} md={6}>
          <h2 className="fw-bold">
            {categoriaNombre === 'descuentos' ? 'DESCUENTOS' : 'PRODUCTOS'}
          </h2>
        </Col>
       
        <Col xs={6} md={6} className="d-flex justify-content-end">
          <Button
            variant="outline-dark"
            className="d-md-none me-2"
            onClick={handleShowFilters}
          >
            Filtrar
          </Button>
         
          <div style={{width: '200px'}}>
            <ProductSortDropdown
              sortOrder={filters.sort}
              setSortOrder={handleSortChange}
            />
          </div>
        </Col>
      </Row>

      <Row>
        <Col md={3} lg={2} className="d-none d-md-block">
          {filterComponent}
        </Col>

        <Col md={9} lg={10}>
          {renderContent()}
        </Col>
      </Row>

      <Offcanvas show={showFilters} onHide={handleCloseFilters} placement="start">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Filtros</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {filterComponent}
        </Offcanvas.Body>
      </Offcanvas>
    </Container>
  );
};

export default ProductListPage;