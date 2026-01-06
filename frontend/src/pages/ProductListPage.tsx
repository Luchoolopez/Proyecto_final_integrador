import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Breadcrumb, Spinner, Alert, Button, Offcanvas } from 'react-bootstrap';
import { Link, useParams, useLocation } from 'react-router-dom';

import { productService, type ProductFilters as ProductFiltersType } from '../api/productService';
import { categoryService, type Category } from '../api/categoryService';
import { type Product } from '../types/Product';
import { ProductGrid } from '../components/Products/ProductGrid';
import { ProductSortDropdown } from '../components/Products/ProductSortDropdown';
import { ProductFilters } from '../components/Products/ProductFilters';

type TalleSet = 'default' | 'pantalones' | 'calzado';
type FilterMode = 'navigate' | 'filter';

const slugToName = (slug: string) => slug ? slug.replace(/-/g, ' ') : '';
const nameToSlug = (name: string) => name ? name.toLowerCase().replace(/\s+/g, '-') : '';

const ProductListPage = () => {
  const { slug1, slug2 } = useParams<{ slug1?: string; slug2?: string }>();

  // 📌 LEER BUSQUEDA DE LA URL
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const busqueda = queryParams.get("busqueda")?.toLowerCase() ?? "";

  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [userFilters, setUserFilters] = useState<Partial<ProductFiltersType>>({
    sort: 'fecha_creacion,DESC',
    talles: [],
    precio: { min: undefined, max: undefined },
    categoria_id: undefined,
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const [pageConfig, setPageConfig] = useState({
    baseApiFilters: {} as Partial<ProductFiltersType>,
    talleSet: 'default' as TalleSet,
    filterMode: 'navigate' as FilterMode,
    categoryLinkPrefix: '/productos',
    pageTitle: 'Productos',
    activeCategorySlug: undefined as string | undefined,
  });

  useEffect(() => {
    const setupPage = async () => {
      setLoadingCategories(true);

      const newConfig = {
        baseApiFilters: {} as Partial<ProductFiltersType>,
        talleSet: 'default' as TalleSet,
        filterMode: 'navigate' as FilterMode,
        categoryLinkPrefix: '/productos',
        pageTitle: 'Productos',
        activeCategorySlug: slug2,
      };

      const categoryApiFilters: any = { active: true };

      if (slug1) {
        if (slug1 === 'hombre') {
          newConfig.baseApiFilters.genero = ['Hombre', 'Unisex'];
          categoryApiFilters.genero = ['Hombre', 'Unisex'];
          newConfig.pageTitle = 'Hombre';
          newConfig.categoryLinkPrefix = '/productos/hombre';

        } else if (slug1 === 'mujer') {
          newConfig.baseApiFilters.genero = 'Mujer';
          categoryApiFilters.genero = 'Mujer';
          newConfig.pageTitle = 'Mujer';
          newConfig.categoryLinkPrefix = '/productos/mujer';

        } else if (slug1 === 'descuentos') {
          newConfig.baseApiFilters.con_descuento = true;
          categoryApiFilters.con_descuento = true;
          newConfig.pageTitle = 'Descuentos';
          newConfig.filterMode = 'filter';

        } else {
          newConfig.activeCategorySlug = slug1;
          newConfig.pageTitle = slugToName(slug1);
        }
      }

      try {
        const fetchedCategories = await categoryService.getCategories(categoryApiFilters);
        setCategories(fetchedCategories);

        const categorySlugToCheck = slug2 || (newConfig.filterMode === 'navigate' && slug1);
        if (categorySlugToCheck) {
          const category = fetchedCategories.find(c => nameToSlug(c.nombre) === categorySlugToCheck);
          if (category) {
            newConfig.baseApiFilters.categoria_id = category.id;
            newConfig.pageTitle = category.nombre;

            if (category.nombre.toLowerCase() === 'pantalones') newConfig.talleSet = 'pantalones';
            else if (category.nombre.toLowerCase() === 'calzado') newConfig.talleSet = 'calzado';
          } else if (slug1 !== 'hombre' && slug1 !== 'mujer' && slug1 !== 'descuentos') {
            setError("Categoría no encontrada");
          }
        }
      } catch (e) {
        setError('Error al cargar categorías');
      } finally {
        setLoadingCategories(false);
      }

      setPageConfig(newConfig);
      setUserFilters({
        sort: 'fecha_creacion,DESC',
        talles: [],
        precio: { min: undefined, max: undefined },
        categoria_id: undefined,
      });
    };

    setupPage();
  }, [slug1, slug2]);

  // 🔥 TRAER PRODUCTOS + FILTRAR POR BUSQUEDA
  useEffect(() => {
    if (loadingCategories) return;

    const fetchProducts = async () => {
      setLoadingProducts(true);
      setError(null);

      const finalFilters: ProductFiltersType = {
        ...pageConfig.baseApiFilters,
        sort: userFilters.sort || 'fecha_creacion,DESC',
        talles: userFilters.talles || [],
        precio: userFilters.precio || { min: undefined, max: undefined },
        categoria_id: userFilters.categoria_id || pageConfig.baseApiFilters.categoria_id,
      };

      try {
        const data = await productService.getProducts(finalFilters);

        // 🔥 FILTRO DE BUSQUEDA
        const filtered = busqueda
          ? data.productos.filter(p =>
              p.nombre.toLowerCase().includes(busqueda) ||
              p.descripcion?.toLowerCase().includes(busqueda) ||
              p.categoria?.nombre.toLowerCase().includes(busqueda)
            )
          : data.productos;

        setProducts(filtered);

      } catch (err) {
        setError('Error al cargar los productos.');
        console.error(err);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, [userFilters, pageConfig, loadingCategories, busqueda]);

  const handleSortChange = (sortValue: string) => {
    setUserFilters(current => ({ ...current, sort: sortValue }));
  };

  const handleTalleChange = (talle: string) => {
    setUserFilters(current => {
      const newTalles = current.talles?.includes(talle)
        ? current.talles.filter(t => t !== talle)
        : [...(current.talles || []), talle];
      return { ...current, talles: newTalles };
    });
  };

  const handlePriceChange = (min: number | undefined, max: number | undefined) => {
    setUserFilters(current => ({ ...current, precio: { min, max } }));
  };

  const handleCategoryFilterChange = (id: number | undefined) => {
    setUserFilters(current => ({ ...current, categoria_id: id }));
  };

  const [showFilters, setShowFilters] = useState(false);
  const handleCloseFilters = () => setShowFilters(false);
  const handleShowFilters = () => setShowFilters(true);

  const renderBreadcrumbs = () => {
    let slug1Title = slug1 ? slugToName(slug1) : '';
    slug1Title = slug1Title.charAt(0).toUpperCase() + slug1Title.slice(1);

    return (
      <Breadcrumb>
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>Inicio</Breadcrumb.Item>
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/productos" }}>Productos</Breadcrumb.Item>

        {slug1 && !slug2 && (
          <Breadcrumb.Item active>{pageConfig.pageTitle}</Breadcrumb.Item>
        )}

        {slug1 && slug2 && (
          <>
            <Breadcrumb.Item linkAs={Link} linkProps={{ to: `/productos/${slug1}` }}>
              {slug1Title}
            </Breadcrumb.Item>
            <Breadcrumb.Item active>
              {pageConfig.pageTitle}
            </Breadcrumb.Item>
          </>
        )}
      </Breadcrumb>
    );
  };

  const renderContent = () => {
    if (loadingProducts) {
      return (
        <div className="text-center my-5">
          <Spinner animation="border" />
        </div>
      );
    }
    if (error) return <Alert variant="danger">{error}</Alert>;
    if (products.length === 0) return <Alert variant="info">No se encontraron productos.</Alert>;
    return <ProductGrid products={products} />;
  };

  const filterComponent = (
    <ProductFilters
      categories={categories}
      loadingCategories={loadingCategories}
      selectedTalles={userFilters.talles || []}
      onTalleChange={handleTalleChange}
      onPriceChange={handlePriceChange}
      talleSet={pageConfig.talleSet}
      mode={pageConfig.filterMode}
      onCategoryChange={handleCategoryFilterChange}
      activeCategoryId={userFilters.categoria_id}
      categoryLinkPrefix={pageConfig.categoryLinkPrefix}
      activeCategorySlug={pageConfig.activeCategorySlug}
    />
  );

  return (
    <Container fluid className="my-4">
      <Row>
        <Col>{renderBreadcrumbs()}</Col>
      </Row>

      <Row className="mb-3 align-items-center">
        <Col xs={6}>
          <h2 className="fw-bold text-uppercase">{pageConfig.pageTitle}</h2>
        </Col>

        <Col xs={6} className="d-flex justify-content-end">
          <Button
            variant="outline-dark"
            className="d-md-none me-2"
            onClick={handleShowFilters}
          >
            Filtrar
          </Button>

          <div style={{ width: '200px' }}>
            <ProductSortDropdown
              sortOrder={userFilters.sort || 'fecha_creacion,DESC'}
              setSortOrder={handleSortChange}
            />
          </div>
        </Col>
      </Row>

      <Row>
        <Col md={3} lg={2} className="d-none d-md-block">
          {filterComponent}
        </Col>
        <Col md={9} lg={10}>{renderContent()}</Col>
      </Row>

      <Offcanvas show={showFilters} onHide={handleCloseFilters} placement="start">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Filtros</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>{filterComponent}</Offcanvas.Body>
      </Offcanvas>
    </Container>
  );
};

export default ProductListPage;
