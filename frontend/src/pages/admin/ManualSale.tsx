import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Form, Button, InputGroup, ListGroup, Table, Alert } from 'react-bootstrap';
import { productService } from '../../api/productService';
import { userService } from '../../api/userService';
import { authService } from '../../api/authService';
import { useManualSale } from '../../hooks/useManualSale';

export const ManualSale = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [isNewCustomer, setIsNewCustomer] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ nombre: '', email: '', password: '', telefono: '' });

  const [productQuery, setProductQuery] = useState('');
  const [productResults, setProductResults] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [variants, setVariants] = useState<any[]>([]);

  const [items, setItems] = useState<{ variante_id: number; cantidad: number; sku?: string; nombre?: string; talle?: string; stock?: number }[]>([]);
  const [notas, setNotas] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { createManualSale, loading } = useManualSale();

  useEffect(() => {
    (async () => {
      try {
        const data = await userService.getUsers({ limit: 100 });
        setUsers(data.users || data);
      } catch (err) {
        // ignore
      }
    })();
  }, []);

  useEffect(() => {
    const t = setTimeout(async () => {
      if (!productQuery) return setProductResults([]);
      try {
        const res = await productService.getProducts({ busqueda: productQuery, limit: 10 });
        setProductResults(res.productos || []);
      } catch (err) {
        setProductResults([]);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [productQuery]);

  const selectProduct = async (prod: any) => {
    setSelectedProduct(prod);
    try {
      const full = await productService.getProductById(prod.id);
      setVariants(full.variantes || []);
    } catch (err) {
      setVariants([]);
    }
  };

  const addItem = (variant: any) => {
    setItems(prev => [...prev, { variante_id: variant.id, cantidad: 1, sku: variant.sku_variante, nombre: selectedProduct?.nombre, talle: variant.talle, stock: variant.stock }]);
  };

  const updateItemQty = (index: number, qty: number) => {
    setItems(prev => prev.map((it, i) => i === index ? { ...it, cantidad: qty } : it));
  };

  const removeItem = (index: number) => setItems(prev => prev.filter((_, i) => i !== index));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!selectedUser && !isNewCustomer) return setError('Seleccioná un usuario comprador o marque "Cliente nuevo"');
    if (items.length === 0) return setError('Agregá al menos un item');

    // validate stock
    for (const it of items) {
      if (it.cantidad <= 0) return setError('Cantidad inválida');
      if (it.stock !== undefined && it.cantidad > it.stock) return setError(`Stock insuficiente para SKU ${it.sku}`);
    }

    try {
      let usuarioId = selectedUser?.id;

      if (isNewCustomer) {
        if (!newCustomer.nombre || !newCustomer.email || !newCustomer.password) {
          setError('Completá nombre, email y contraseña para el nuevo cliente');
          return;
        }
        const resp = await authService.register({ nombre: newCustomer.nombre, email: newCustomer.email, password: newCustomer.password, telefono: newCustomer.telefono });
        usuarioId = resp.data.user.id;
      }

      await createManualSale({ usuario_id: usuarioId!, items: items.map(i => ({ variante_id: i.variante_id, cantidad: i.cantidad })), notas });

      // success: reset
      setSelectedUser(null);
      setIsNewCustomer(false);
      setNewCustomer({ nombre: '', email: '', password: '', telefono: '' });
      setItems([]);
      setNotas('');
      setSelectedProduct(null);
      setProductQuery('');
      setProductResults([]);
      alert('Venta registrada correctamente');
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Error registrando venta');
    }
  };

  return (
    <Container className="py-4">
      <h2>Registrar Venta Manual</h2>
      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Label>Seleccionar comprador</Form.Label>
            <Form.Check type="checkbox" label="Cliente nuevo" checked={isNewCustomer} onChange={(e) => { setIsNewCustomer(e.target.checked); if (e.target.checked) setSelectedUser(null); }} />
            {!isNewCustomer ? (
              <Form.Select value={selectedUser?.id || ''} onChange={(e) => setSelectedUser(users.find(u => u.id === Number(e.target.value)) || null)}>
                <option value="">-- Seleccioná usuario --</option>
                {users.map(u => <option key={u.id} value={u.id}>{u.nombre} ({u.email})</option>)}
              </Form.Select>
            ) : (
              <div className="mt-2">
                <Form.Group className="mb-2">
                  <Form.Control placeholder="Nombre" value={newCustomer.nombre} onChange={e => setNewCustomer({ ...newCustomer, nombre: e.target.value })} />
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Control type="email" placeholder="Email" value={newCustomer.email} onChange={e => setNewCustomer({ ...newCustomer, email: e.target.value })} />
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Control type="password" placeholder="Contraseña" value={newCustomer.password} onChange={e => setNewCustomer({ ...newCustomer, password: e.target.value })} />
                </Form.Group>
                <Form.Group>
                  <Form.Control placeholder="Teléfono (opcional)" value={newCustomer.telefono} onChange={e => setNewCustomer({ ...newCustomer, telefono: e.target.value })} />
                </Form.Group>
              </div>
            )}
          </Col>
          <Col md={6}>
            <Form.Label>Notas (opcional)</Form.Label>
            <Form.Control value={notas} onChange={e => setNotas(e.target.value)} placeholder="Ej: Venta en local - efectivo" />
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6}>
            <Form.Label>Buscar Producto</Form.Label>
            <InputGroup>
              <Form.Control placeholder="Buscar por nombre, SKU..." value={productQuery} onChange={e => setProductQuery(e.target.value)} />
            </InputGroup>
            {productResults.length > 0 && (
              <ListGroup className="mt-2">
                {productResults.map(p => (
                  <ListGroup.Item key={p.id} action onClick={() => selectProduct(p)}>
                    {p.nombre} (SKU: {p.sku})
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </Col>

          <Col md={6}>
            <Form.Label>Variantes</Form.Label>
            <div style={{ maxHeight: 220, overflowY: 'auto' }}>
              <ListGroup>
                {variants.map(v => (
                  <ListGroup.Item key={v.id} className="d-flex justify-content-between align-items-center">
                    <div>
                      <div className="fw-bold">{v.sku_variante}</div>
                      <div className="small text-muted">Talle: {v.talle} — Stock: {v.stock}</div>
                    </div>
                    <div>
                      <Button size="sm" onClick={() => addItem(v)}>Agregar</Button>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </div>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col>
            <h5>Items</h5>
            <Table size="sm">
              <thead>
                <tr>
                  <th>SKU</th>
                  <th>Producto</th>
                  <th>Talle</th>
                  <th>Qty</th>
                  <th>Stock</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {items.map((it, idx) => (
                  <tr key={idx}>
                    <td>{it.sku}</td>
                    <td>{it.nombre}</td>
                    <td>{it.talle}</td>
                    <td>
                      <Form.Control type="number" value={it.cantidad} min={1} max={it.stock || undefined} onChange={e => updateItemQty(idx, Number(e.target.value))} style={{ width: 80 }} />
                    </td>
                    <td>{it.stock}</td>
                    <td><Button variant="outline-danger" size="sm" onClick={() => removeItem(idx)}>Quitar</Button></td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr><td colSpan={6} className="text-muted">No hay items agregados</td></tr>
                )}
              </tbody>
            </Table>
          </Col>
        </Row>

        <div className="d-flex gap-2">
          <Button type="submit" disabled={loading}>{loading ? 'Registrando...' : 'Registrar Venta'}</Button>
          <Button variant="secondary" onClick={() => { setItems([]); setSelectedProduct(null); setProductQuery(''); setProductResults([]); }}>Limpiar</Button>
        </div>
      </Form>
    </Container>
  );
};

export default ManualSale;
