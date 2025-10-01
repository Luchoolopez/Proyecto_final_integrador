-- ======================================
-- ECOMMERCE DATABASE - VERSIÓN MEJORADA
-- ======================================

-- ======================================
-- TABLA USUARIOS
-- ======================================
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    rol ENUM('usuario','admin') DEFAULT 'usuario', 
    telefono VARCHAR(20),
    activo BOOLEAN DEFAULT TRUE,
    fecha_ultimo_acceso TIMESTAMP NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ======================================
-- TABLA DIRECCIONES (un usuario puede tener varias)
-- ======================================
CREATE TABLE direcciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    calle VARCHAR(150) NOT NULL,
    numero VARCHAR(20),
    piso VARCHAR(20),
    dpto VARCHAR(20),
    ciudad VARCHAR(100) NOT NULL,
    provincia VARCHAR(100) NOT NULL,
    codigo_postal VARCHAR(10) NOT NULL,
    pais VARCHAR(100) DEFAULT 'Argentina',
    es_principal BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- ======================================
-- TABLA CATEGORIAS
-- ======================================
CREATE TABLE categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion TEXT,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ======================================
-- TABLA PRODUCTOS
-- ======================================
CREATE TABLE productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sku VARCHAR(50) UNIQUE,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10,2) NOT NULL,
    descuento DECIMAL(5,2) DEFAULT 0, -- porcentaje
    stock INT DEFAULT 0,
    peso DECIMAL(6,3), -- en kilogramos
    categoria_id INT,
    imagen_principal VARCHAR(255),
    meta_title VARCHAR(200),
    meta_description VARCHAR(300),
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE SET NULL,
    CONSTRAINT chk_stock CHECK (stock >= 0),
    CONSTRAINT chk_precio CHECK (precio >= 0),
    CONSTRAINT chk_descuento CHECK (descuento >= 0 AND descuento <= 100)
);

-- ======================================
-- TABLA PRODUCTO IMÁGENES
-- ======================================
CREATE TABLE producto_imagenes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    producto_id INT NOT NULL,
    imagen VARCHAR(255) NOT NULL,
    alt_text VARCHAR(200),
    orden INT DEFAULT 0,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE
);

-- ======================================
-- TABLA PEDIDOS
-- ======================================
CREATE TABLE pedidos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    numero_pedido VARCHAR(20) UNIQUE NOT NULL,
    usuario_id INT NOT NULL,
    direccion_id INT, -- dirección de entrega
    total DECIMAL(10,2) NOT NULL,
    estado ENUM('pendiente','confirmado','armando','enviado','entregado','cancelado') DEFAULT 'pendiente',
    notas TEXT, -- comentarios del cliente
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_envio TIMESTAMP NULL,
    fecha_entrega TIMESTAMP NULL,

    -- datos de envío
    shipping_provider ENUM('andreani','correo_argentino') NULL,
    shipping_service VARCHAR(100) NULL,
    tracking_number VARCHAR(100) NULL,
    shipping_cost DECIMAL(10,2) DEFAULT 0,

    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE RESTRICT,
    FOREIGN KEY (direccion_id) REFERENCES direcciones(id) ON DELETE SET NULL,
    CONSTRAINT chk_total CHECK (total >= 0)
);

-- ======================================
-- TABLA DETALLES DE PEDIDO
-- ======================================
CREATE TABLE detalles_pedido (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pedido_id INT NOT NULL,
    producto_id INT NOT NULL,
    sku_producto VARCHAR(50), -- guardamos el SKU por si el producto se elimina
    nombre_producto VARCHAR(150), -- guardamos el nombre por si el producto se elimina
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    descuento_aplicado DECIMAL(5,2) DEFAULT 0,
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE RESTRICT,
    CONSTRAINT chk_cantidad CHECK (cantidad > 0),
    CONSTRAINT chk_precio_unitario CHECK (precio_unitario >= 0)
);

-- ======================================
-- TABLA CARRITOS
-- ======================================
CREATE TABLE carritos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    producto_id INT NOT NULL,
    cantidad INT DEFAULT 1,
    fecha_agregado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_product (usuario_id, producto_id),
    CONSTRAINT chk_cantidad_carrito CHECK (cantidad > 0)
);

-- ======================================
-- TABLA SUSCRIPCIONES (newsletter)
-- ======================================
CREATE TABLE suscripciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(150) NOT NULL UNIQUE,
    activo BOOLEAN DEFAULT TRUE,
    fecha_suscripcion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_baja TIMESTAMP NULL
);

-- ======================================
-- TABLA PAGOS
-- ======================================
CREATE TABLE pagos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pedido_id INT NOT NULL,
    metodo ENUM('mercadopago','mobbex','transferencia','efectivo') NOT NULL,
    estado ENUM('pendiente','aprobado','rechazado','cancelado') DEFAULT 'pendiente',
    transaccion_id VARCHAR(100), -- ID de la pasarela
    monto DECIMAL(10,2) NOT NULL,
    detalle_metodo VARCHAR(255), -- "Visa Banco Galicia 6 cuotas"
    cuotas INT DEFAULT 1,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_aprobacion TIMESTAMP NULL,
    datos_adicionales JSON, -- para guardar respuesta completa de la pasarela
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE RESTRICT,
    CONSTRAINT chk_monto CHECK (monto >= 0),
    CONSTRAINT chk_cuotas CHECK (cuotas >= 1)
);

-- ======================================
-- TABLA LOGS DE ENVÍOS
-- ======================================
CREATE TABLE shipping_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pedido_id INT NOT NULL,
    proveedor ENUM('andreani','correo_argentino') NOT NULL,
    accion VARCHAR(50), -- 'cotizar', 'crear_envio', 'tracking', etc.
    request TEXT,
    response TEXT,
    estado ENUM('success','error','warning') DEFAULT 'success',
    mensaje VARCHAR(500),
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE
);

-- ======================================
-- TABLA CUPONES/DESCUENTOS
-- ======================================
CREATE TABLE cupones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(50) UNIQUE NOT NULL,
    descripcion VARCHAR(200),
    tipo ENUM('porcentaje','monto_fijo') NOT NULL,
    valor DECIMAL(10,2) NOT NULL, -- 15.5 para 15.5% o $15.5
    monto_minimo DECIMAL(10,2) DEFAULT 0, -- compra mínima para aplicar
    usos_maximos INT DEFAULT NULL, -- NULL = ilimitado
    usos_actuales INT DEFAULT 0,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_valor CHECK (valor > 0),
    CONSTRAINT chk_usos CHECK (usos_actuales >= 0)
);

-- ======================================
-- TABLA HISTORIAL DE CUPONES USADOS
-- ======================================
CREATE TABLE cupones_usados (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cupon_id INT NOT NULL,
    pedido_id INT NOT NULL,
    usuario_id INT NOT NULL,
    descuento_aplicado DECIMAL(10,2) NOT NULL,
    fecha_uso TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cupon_id) REFERENCES cupones(id) ON DELETE RESTRICT,
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE RESTRICT,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE RESTRICT
);

-- ======================================
-- ÍNDICES PARA OPTIMIZAR PERFORMANCE
-- ======================================

-- Índices para búsquedas frecuentes
CREATE INDEX idx_productos_categoria ON productos(categoria_id);
CREATE INDEX idx_productos_activo ON productos(activo);
CREATE INDEX idx_productos_sku ON productos(sku);
CREATE INDEX idx_productos_nombre ON productos(nombre);

-- Índices para pedidos
CREATE INDEX idx_pedidos_usuario ON pedidos(usuario_id);
CREATE INDEX idx_pedidos_fecha ON pedidos(fecha);
CREATE INDEX idx_pedidos_estado ON pedidos(estado);
CREATE INDEX idx_pedidos_numero ON pedidos(numero_pedido);

-- Índices para detalles de pedido
CREATE INDEX idx_detalles_pedido ON detalles_pedido(pedido_id);
CREATE INDEX idx_detalles_producto ON detalles_pedido(producto_id);

-- Índices para carritos
CREATE INDEX idx_carritos_usuario ON carritos(usuario_id);
CREATE INDEX idx_carritos_producto ON carritos(producto_id);

-- Índices para direcciones
CREATE INDEX idx_direcciones_usuario ON direcciones(usuario_id);
CREATE INDEX idx_direcciones_principal ON direcciones(es_principal);

-- Índices para pagos
CREATE INDEX idx_pagos_pedido ON pagos(pedido_id);
CREATE INDEX idx_pagos_estado ON pagos(estado);
CREATE INDEX idx_pagos_transaccion ON pagos(transaccion_id);

-- Índices para imágenes
CREATE INDEX idx_producto_imagenes_producto ON producto_imagenes(producto_id);
CREATE INDEX idx_producto_imagenes_orden ON producto_imagenes(orden);

-- Índices para cupones
CREATE INDEX idx_cupones_codigo ON cupones(codigo);
CREATE INDEX idx_cupones_activo ON cupones(activo);
CREATE INDEX idx_cupones_fechas ON cupones(fecha_inicio, fecha_fin);

-- ======================================
-- TRIGGERS ÚTILES
-- ======================================

-- Generar número de pedido automáticamente
DELIMITER //
CREATE TRIGGER before_pedido_insert 
BEFORE INSERT ON pedidos 
FOR EACH ROW 
BEGIN 
    IF NEW.numero_pedido IS NULL OR NEW.numero_pedido = '' THEN
        SET NEW.numero_pedido = CONCAT('PED-', DATE_FORMAT(NOW(), '%Y%m%d'), '-', LPAD(NEW.id, 6, '0'));
    END IF;
END//
DELIMITER ;

-- Actualizar stock cuando se confirma un pedido
DELIMITER //
CREATE TRIGGER after_detalle_pedido_insert
AFTER INSERT ON detalles_pedido
FOR EACH ROW
BEGIN
    UPDATE productos 
    SET stock = stock - NEW.cantidad 
    WHERE id = NEW.producto_id;
END//
DELIMITER ;

-- ======================================
-- VISTAS ÚTILES
-- ======================================

-- Vista de productos con información completa
CREATE VIEW vista_productos_completa AS
SELECT 
    p.id,
    p.sku,
    p.nombre,
    p.descripcion,
    p.precio,
    p.descuento,
    ROUND(p.precio * (1 - p.descuento/100), 2) as precio_final,
    p.stock,
    p.peso,
    p.imagen_principal,
    c.nombre as categoria_nombre,
    p.activo,
    p.fecha_creacion
FROM productos p
LEFT JOIN categorias c ON p.categoria_id = c.id;

-- Vista de pedidos con información del usuario
CREATE VIEW vista_pedidos_completa AS
SELECT 
    ped.id,
    ped.numero_pedido,
    ped.total,
    ped.estado,
    ped.fecha,
    u.nombre as usuario_nombre,
    u.email as usuario_email,
    COUNT(dp.id) as total_items
FROM pedidos ped
JOIN usuarios u ON ped.usuario_id = u.id
LEFT JOIN detalles_pedido dp ON ped.id = dp.pedido_id
GROUP BY ped.id, ped.numero_pedido, ped.total, ped.estado, ped.fecha, u.nombre, u.email;