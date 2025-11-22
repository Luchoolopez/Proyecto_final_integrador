import React, { useEffect, useState } from 'react';
import { Container, Table, Badge, Button, Form, InputGroup, Modal, Card, Row, Col, Pagination, Alert } from 'react-bootstrap';
import { FaSearch, FaTimes, FaEye, FaUserSlash, FaUserCheck, FaUserShield } from 'react-icons/fa';
import { userService } from '../../api/userService';
import { type User } from '../../types/user';
import { useTheme } from '../../context/ThemeContext';
import { ToastNotification } from '../../components/ToastNotification';
import { ConfirmModal } from '../../components/ConfirmModal';

export const UserList = () => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(1);
    const [page, setPage] = useState(1);
    
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState<'todos' | 'usuario' | 'admin'>('todos');
    const [filterActive, setFilterActive] = useState<'todos' | 'activos' | 'inactivos'>('todos');

    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [actionUser, setActionUser] = useState<User | null>(null); 
    
    const [toast, setToast] = useState({
        show: false,
        message: '',
        variant: 'success' as 'success' | 'error' | 'warning' | 'info'
    });

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const activeFilter = filterActive === 'todos' ? undefined : filterActive === 'activos';
            const roleFilter = filterRole === 'todos' ? undefined : filterRole;

            const data = await userService.getUsers({
                page,
                limit: 10,
                search: searchTerm,
                rol: roleFilter,
                active: activeFilter
            });

            setUsers(data.users);
            setTotalPages(data.totalPages);
        } catch (err) {
            console.error(err);
            setToast({ show: true, message: 'Error al cargar usuarios', variant: 'error' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchUsers();
        }, 500);
        return () => clearTimeout(timer);
    }, [page, searchTerm, filterRole, filterActive]);

    const handleStatusToggleClick = (user: User) => {
        setActionUser(user);
        setShowConfirm(true);
    };

    const executeStatusToggle = async () => {
        if (!actionUser) return;
        try {
            const newStatus = !actionUser.activo;
            await userService.updateUser(actionUser.id, { activo: newStatus });
            
            setUsers(users.map(u => u.id === actionUser.id ? { ...u, activo: newStatus } : u));
            setToast({ 
                show: true, 
                message: `Usuario ${newStatus ? 'activado' : 'desactivado'} correctamente`, 
                variant: 'success' 
            });
            
            if (selectedUser && selectedUser.id === actionUser.id) {
                setSelectedUser({ ...selectedUser, activo: newStatus });
            }

        } catch (err) {
            setToast({ show: true, message: 'Error al cambiar estado del usuario', variant: 'error' });
        }
    };

    const handleViewDetail = (user: User) => {
        setSelectedUser(user);
        setShowDetailModal(true);
    };

    return (
        <Container className="py-4">
             <style>{`
                .search-addon { background-color: #fff; border-color: #ced4da; color: #6c757d; }
                [data-bs-theme="dark"] .search-addon { background-color: #212529; border-color: #495057; color: #e9ecef; }
                [data-bs-theme="dark"] .search-clear-btn:hover { background-color: #343a40; color: #fff; }
            `}</style>

            <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
                <h2>Gestión de Usuarios</h2>
            </div>

            {/* Barra de Filtros */}
            <div className="row g-2 mb-4">
                <div className="col-md-6">
                    <InputGroup>
                        <InputGroup.Text className="search-addon border-end-0"><FaSearch /></InputGroup.Text>
                        <Form.Control
                            placeholder="Buscar por nombre o email..."
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                            className="border-start-0 border-end-0 shadow-none"
                        />
                         {searchTerm && (
                            <Button variant="outline-secondary" className="search-addon search-clear-btn border-start-0" onClick={() => setSearchTerm('')}>
                                <FaTimes />
                            </Button>
                        )}
                    </InputGroup>
                </div>
                <div className="col-md-3">
                    <Form.Select value={filterRole} onChange={(e) => setFilterRole(e.target.value as any)}>
                        <option value="todos">Todos los roles</option>
                        <option value="usuario">Clientes</option>
                        <option value="admin">Administradores</option>
                    </Form.Select>
                </div>
                <div className="col-md-3">
                    <Form.Select value={filterActive} onChange={(e) => setFilterActive(e.target.value as any)}>
                        <option value="todos">Todos los estados</option>
                        <option value="activos">Activos</option>
                        <option value="inactivos">Inactivos (Bloqueados)</option>
                    </Form.Select>
                </div>
            </div>

            {/* Tabla de Usuarios */}
            <div className="table-responsive shadow-sm rounded">
                <Table hover className="mb-0 align-middle">
                    <thead className="table-dark">
                        <tr>
                            <th>ID</th>
                            <th>Usuario</th>
                            <th>Rol</th>
                            <th>Teléfono</th>
                            <th>Estado</th>
                            <th className="text-end">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={6} className="text-center py-5">Cargando usuarios...</td></tr>
                        ) : users.length === 0 ? (
                            <tr><td colSpan={6} className="text-center py-5 text-muted">No se encontraron usuarios.</td></tr>
                        ) : (
                            users.map(user => (
                                <tr key={user.id}>
                                    <td className="fw-bold">#{user.id}</td>
                                    <td>
                                        <div className="fw-bold">{user.nombre}</div>
                                        <div className="small text-muted">{user.email}</div>
                                    </td>
                                    <td>
                                        {user.rol === 'admin' ? (
                                            <Badge bg="primary" className="d-inline-flex align-items-center gap-1">
                                                <FaUserShield /> Admin
                                            </Badge>
                                        ) : (
                                            <span className="text-muted">Cliente</span>
                                        )}
                                    </td>
                                    <td>{user.telefono || '-'}</td>
                                    <td>
                                        <Badge bg={user.activo ? 'success' : 'danger'}>
                                            {user.activo ? 'Activo' : 'Inactivo'}
                                        </Badge>
                                    </td>
                                    <td className="text-end">
                                        <Button 
                                            variant="outline-dark" 
                                            size="sm" 
                                            className="me-2"
                                            onClick={() => handleViewDetail(user)}
                                            title="Ver detalle"
                                        >
                                            <FaEye />
                                        </Button>
                                        
                                        {/* Botón de Activar/Desactivar (No te permitas desactivarte a ti mismo idealmente, pero por ahora lo dejamos simple) */}
                                        <Button 
                                            variant={user.activo ? "outline-danger" : "outline-success"} 
                                            size="sm"
                                            onClick={() => handleStatusToggleClick(user)}
                                            title={user.activo ? "Desactivar usuario" : "Activar usuario"}
                                        >
                                            {user.activo ? <FaUserSlash /> : <FaUserCheck />}
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </Table>
            </div>

            {/* Paginación */}
            {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-4">
                    <Pagination>
                        <Pagination.Prev onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} />
                        <Pagination.Item active>{page}</Pagination.Item>
                        <Pagination.Next onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} />
                    </Pagination>
                </div>
            )}

            {/* --- MODAL DE DETALLE --- */}
            <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Detalle de Usuario</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedUser && (
                        <div className="d-flex flex-column gap-3">
                            <div className="text-center mb-3">
                                <div className="bg-secondary bg-opacity-25 rounded-circle d-inline-flex align-items-center justify-content-center" style={{width: '80px', height: '80px', fontSize: '2rem'}}>
                                    {selectedUser.nombre.charAt(0).toUpperCase()}
                                </div>
                                <h4 className="mt-2">{selectedUser.nombre}</h4>
                                <p className="text-muted mb-0">{selectedUser.email}</p>
                            </div>

                            <Card className={`border ${isDark ? 'bg-dark' : 'bg-light'}`}>
                                <Card.Body>
                                    <Row>
                                        <Col xs={6}>
                                            <small className="text-muted d-block">ID Usuario</small>
                                            <strong>#{selectedUser.id}</strong>
                                        </Col>
                                        <Col xs={6}>
                                            <small className="text-muted d-block">Rol</small>
                                            <strong>{selectedUser.rol.toUpperCase()}</strong>
                                        </Col>
                                        <Col xs={6} className="mt-3">
                                            <small className="text-muted d-block">Estado</small>
                                            <Badge bg={selectedUser.activo ? 'success' : 'danger'}>
                                                {selectedUser.activo ? 'Activo' : 'Inactivo'}
                                            </Badge>
                                        </Col>
                                        <Col xs={6} className="mt-3">
                                            <small className="text-muted d-block">Teléfono</small>
                                            <span>{selectedUser.telefono || 'No registrado'}</span>
                                        </Col>
                                        <Col xs={12} className="mt-3">
                                            <small className="text-muted d-block">Fecha Registro</small>
                                            <span>{new Date(selectedUser.fecha_creacion).toLocaleDateString()}</span>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDetailModal(false)}>Cerrar</Button>
                </Modal.Footer>
            </Modal>

            {/* --- MODAL DE CONFIRMACIÓN (Activar/Desactivar) --- */}
            <ConfirmModal 
                show={showConfirm}
                onClose={() => setShowConfirm(false)}
                onConfirm={executeStatusToggle}
                title={actionUser?.activo ? "¿Desactivar usuario?" : "¿Activar usuario?"}
                message={actionUser?.activo 
                    ? `¿Estás seguro de que deseas desactivar a ${actionUser.nombre}? No podrá iniciar sesión pero su historial se conservará.`
                    : `¿Deseas reactivar el acceso a ${actionUser?.nombre}?`
                }
                confirmText={actionUser?.activo ? "Desactivar" : "Activar"}
                variant={actionUser?.activo ? "danger" : "success"}
            />

            <ToastNotification
                show={toast.show}
                onClose={() => setToast({ ...toast, show: false })}
                message={toast.message}
                variant={toast.variant}
            />
        </Container>
    );
};