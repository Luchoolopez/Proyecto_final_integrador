
-- ======================================
-- INIT SCRIPT - ECOMMERCE DATABASE
-- ======================================

-- ======================================
-- 1. DATOS INICIALES - CATEGORÍAS
-- ======================================
INSERT INTO categorias (nombre, descripcion) VALUES
('Electrónicos', 'Smartphones, tablets, laptops y accesorios tecnológicos'),
('Hogar y Jardín', 'Muebles, decoración, electrodomésticos y herramientas'),
('Ropa y Accesorios', 'Indumentaria masculina, femenina e infantil'),
('Deportes', 'Equipamiento deportivo, fitness y actividades al aire libre'),
('Libros y Entretenimiento', 'Libros, películas, música y videojuegos'),
('Salud y Belleza', 'Cuidado personal, cosméticos y productos de salud'),
('Automotriz', 'Repuestos, accesorios y herramientas para vehículos'),
('Juguetes', 'Juguetes para niños de todas las edades');

-- ======================================
-- 2. PRODUCTOS DE EJEMPLO
-- ======================================
INSERT INTO productos (sku, nombre, descripcion, precio, descuento, stock, peso, categoria_id, imagen_principal, meta_title, meta_description) VALUES
-- Electrónicos
('ELEC-001', 'Samsung Galaxy A54', 'Smartphone Samsung Galaxy A54 128GB, cámara triple 50MP, pantalla Super AMOLED 6.4"', 299999.00, 10.00, 50, 0.202, 1, '/images/samsung-a54.jpg', 'Samsung Galaxy A54 - Mejor precio en Argentina', 'Comprá el Samsung Galaxy A54 con envío gratis. 128GB, cámara 50MP, pantalla Super AMOLED.'),
('ELEC-002', 'iPhone 15', 'Apple iPhone 15 256GB, chip A16 Bionic, cámara 48MP con zoom óptico 2x', 899999.00, 5.00, 25, 0.171, 1, '/images/iphone-15.jpg', 'iPhone 15 256GB - Apple Oficial', 'iPhone 15 con chip A16 Bionic y cámara profesional. Comprá con garantía oficial Apple.'),
('ELEC-003', 'MacBook Air M2', 'Laptop Apple MacBook Air 13" con chip M2, 8GB RAM, 256GB SSD', 1299999.00, 0.00, 15, 1.24, 1, '/images/macbook-air-m2.jpg', 'MacBook Air M2 - La laptop más liviana', 'MacBook Air con chip M2, batería de todo el día, pantalla Liquid Retina.'),
('ELEC-004', 'Sony WH-1000XM5', 'Auriculares inalámbricos con cancelación de ruido, batería 30hs', 89999.00, 15.00, 80, 0.250, 1, '/images/sony-wh1000xm5.jpg', 'Sony WH-1000XM5 - Auriculares premium', 'Auriculares Sony con la mejor cancelación de ruido del mercado.'),

-- Hogar y Jardín  
('HOGAR-001', 'Smart TV LG 55"', 'Smart TV LG UltraHD 4K 55", WebOS, HDR10, AI ThinQ', 179999.00, 20.00, 30, 15.5, 2, '/images/lg-tv-55.jpg', 'Smart TV LG 55" 4K - Mejor precio', 'Smart TV LG con inteligencia artificial, 4K Ultra HD, WebOS y HDR10.'),
('HOGAR-002', 'Sofá 3 Cuerpos', 'Sofá de 3 cuerpos en tela gris, patas de madera, diseño moderno', 89999.00, 0.00, 12, 45.0, 2, '/images/sofa-3-cuerpos.jpg', 'Sofá 3 Cuerpos Moderno - Confort y Estilo', 'Sofá cómodo y elegante para tu living. Tela premium, envío e instalación gratis.'),
('HOGAR-003', 'Heladera Samsung No Frost', 'Heladera Samsung No Frost 364 litros, eficiencia energética A+', 249999.00, 12.00, 8, 65.0, 2, '/images/heladera-samsung.jpg', 'Heladera Samsung No Frost 364L', 'Heladera Samsung con tecnología No Frost, gran capacidad y bajo consumo.'),

-- Ropa y Accesorios
('ROPA-001', 'Zapatillas Nike Air Max', 'Zapatillas Nike Air Max 270, suela Air visible, diseño deportivo', 45999.00, 25.00, 100, 0.8, 3, '/images/nike-air-max.jpg', 'Nike Air Max 270 - Zapatillas deportivas', 'Zapatillas Nike Air Max con tecnología Air visible. Comodidad y estilo únicos.'),
('ROPA-002', 'Jean Levis 501', 'Jean clásico Levis 501, corte recto, 100% algodón, varios talles', 25999.00, 0.00, 75, 0.6, 3, '/images/levis-501.jpg', 'Jean Levis 501 Original - Clásico atemporal', 'El jean más icónico del mundo. Levis 501 original, calidad premium.'),
('ROPA-003', 'Campera Adidas Originals', 'Campera Adidas Originals con capucha, algodón premium, logo bordado', 18999.00, 15.00, 60, 0.4, 3, '/images/campera-adidas.jpg', 'Campera Adidas Originals con capucha', 'Campera Adidas cómoda y urbana. Perfecta para el día a día.'),

-- Deportes
('DEP-001', 'Bicicleta Mountain Bike', 'Bicicleta Mountain Bike rodado 29, cambios Shimano 21V, frenos a disco', 149999.00, 18.00, 20, 18.5, 4, '/images/bici-mountain.jpg', 'Mountain Bike R29 - Shimano 21V', 'Bicicleta mountain bike profesional con componentes Shimano de calidad.'),
('DEP-002', 'Pelota Fútbol Adidas', 'Pelota de fútbol Adidas oficial, costura térmica, certificada FIFA', 8999.00, 0.00, 150, 0.42, 4, '/images/pelota-adidas.jpg', 'Pelota Fútbol Adidas Oficial FIFA', 'Pelota oficial Adidas con certificación FIFA. Calidad profesional.'),

-- Libros
('LIB-001', 'Cien Años de Soledad', 'Novela de Gabriel García Márquez, edición especial tapa dura', 4999.00, 20.00, 200, 0.5, 5, '/images/cien-anos-soledad.jpg', 'Cien Años de Soledad - García Márquez', 'La obra maestra del realismo mágico en edición especial.'),

-- Salud y Belleza
('SALUD-001', 'Perfume Hugo Boss', 'Perfume Hugo Boss Bottled 100ml, fragancia masculina elegante', 15999.00, 10.00, 45, 0.3, 6, '/images/hugo-boss-perfume.jpg', 'Perfume Hugo Boss Bottled 100ml', 'Fragancia masculina Hugo Boss, elegante y sofisticada.'),

-- Automotriz
('AUTO-001', 'Filtro de Aire Bosch', 'Filtro de aire Bosch para Toyota Corolla 2018-2023, original', 3999.00, 0.00, 85, 0.2, 7, '/images/filtro-aire-bosch.jpg', 'Filtro Aire Bosch Toyota Corolla', 'Filtro de aire original Bosch, calidad OEM para tu Toyota.'),

-- Juguetes
('JUG-001', 'LEGO Creator Expert', 'Set LEGO Creator Expert Volkswagen Beetle, 1167 piezas, coleccionable', 35999.00, 8.00, 30, 1.2, 8, '/images/lego-beetle.jpg', 'LEGO Creator Volkswagen Beetle', 'Set LEGO coleccionable del icónico Volkswagen Beetle. 1167 piezas.');

-- ======================================
-- 3. IMÁGENES ADICIONALES PARA PRODUCTOS
-- ======================================
INSERT INTO producto_imagenes (producto_id, imagen, alt_text, orden) VALUES
-- Samsung Galaxy A54
(1, '/images/samsung-a54-2.jpg', 'Samsung Galaxy A54 vista trasera', 1),
(1, '/images/samsung-a54-3.jpg', 'Samsung Galaxy A54 cámara detalle', 2),
(1, '/images/samsung-a54-4.jpg', 'Samsung Galaxy A54 pantalla', 3),

-- iPhone 15
(2, '/images/iphone-15-2.jpg', 'iPhone 15 cámara sistema', 1),
(2, '/images/iphone-15-3.jpg', 'iPhone 15 colores disponibles', 2),

-- MacBook Air
(3, '/images/macbook-air-2.jpg', 'MacBook Air M2 abierta', 1),
(3, '/images/macbook-air-3.jpg', 'MacBook Air M2 lateral', 2),

-- Smart TV LG
(4, '/images/lg-tv-2.jpg', 'Smart TV LG interfaz WebOS', 1),
(4, '/images/lg-tv-3.jpg', 'Smart TV LG control remoto', 2),

-- Nike Air Max
(8, '/images/nike-air-max-2.jpg', 'Nike Air Max 270 lateral', 1),
(8, '/images/nike-air-max-3.jpg', 'Nike Air Max 270 suela', 2);

-- ======================================
-- 4. USUARIOS DE EJEMPLO
-- ======================================
INSERT INTO usuarios (nombre, email, password, telefono) VALUES
('Administrador', 'admin@ecommerce.com', '$2b$10$K7L/8Y1t40zH2G.B3/4iFOJTKfz.1J2M8X5W6Y0Z1A2B3C4D5E6F7G', '+54 11 1234-5678'),
('Juan Pérez', 'juan.perez@email.com', '$2b$10$K7L/8Y1t40zH2G.B3/4iFOJTKfz.1J2M8X5W6Y0Z1A2B3C4D5E6F7G', '+54 11 9876-5432'),
('María González', 'maria.gonzalez@email.com', '$2b$10$K7L/8Y1t40zH2G.B3/4iFOJTKfz.1J2M8X5W6Y0Z1A2B3C4D5E6F7G', '+54 11 5555-1234'),
('Carlos Rodriguez', 'carlos.rodriguez@email.com', '$2b$10$K7L/8Y1t40zH2G.B3/4iFOJTKfz.1J2M8X5W6Y0Z1A2B3C4D5E6F7G', '+54 9 11 7777-8888');

-- ======================================
-- 5. DIRECCIONES DE EJEMPLO
-- ======================================
INSERT INTO direcciones (usuario_id, calle, numero, piso, dpto, ciudad, provincia, codigo_postal, es_principal) VALUES
(2, 'Av. Corrientes', '1234', '5', 'B', 'Buenos Aires', 'Buenos Aires', '1043', TRUE),
(2, 'Av. Santa Fe', '5678', NULL, NULL, 'Buenos Aires', 'Buenos Aires', '1425', FALSE),
(3, 'Calle San Martín', '890', '2', 'A', 'Rosario', 'Santa Fe', '2000', TRUE),
(4, 'Av. Independencia', '456', '10', '15', 'Córdoba', 'Córdoba', '5000', TRUE);

-- ======================================
-- 6. CUPONES DE DESCUENTO
-- ======================================
INSERT INTO cupones (codigo, descripcion, tipo, valor, monto_minimo, usos_maximos, fecha_inicio, fecha_fin) VALUES
('BIENVENIDO10', 'Descuento de bienvenida para nuevos usuarios', 'porcentaje', 10.00, 5000.00, 100, '2024-01-01', '2024-12-31'),
('VERANO2024', 'Descuento especial de verano', 'porcentaje', 15.00, 10000.00, 500, '2024-12-01', '2024-03-31'),
('ENVIOGRATIS', 'Envío gratis en compras mayores a $15000', 'monto_fijo', 2500.00, 15000.00, NULL, '2024-01-01', '2024-12-31'),
('TECH20', 'Descuento especial en electrónicos', 'porcentaje', 20.00, 20000.00, 200, '2024-01-01', '2024-06-30'),
('BLACKFRIDAY', 'Black Friday - Descuento máximo', 'porcentaje', 30.00, 25000.00, 1000, '2024-11-25', '2024-11-30');

-- ======================================
-- 7. PEDIDO DE EJEMPLO
-- ======================================
INSERT INTO pedidos (numero_pedido, usuario_id, direccion_id, total, estado, notas, shipping_cost) VALUES
('PED-20241210-000001', 2, 1, 352999.00, 'entregado', 'Entregar en horario de mañana, portero 24hs', 2500.00);

-- Detalles del pedido
INSERT INTO detalles_pedido (pedido_id, producto_id, sku_producto, nombre_producto, cantidad, precio_unitario, descuento_aplicado) VALUES
(1, 1, 'ELEC-001', 'Samsung Galaxy A54', 1, 299999.00, 10.00),
(1, 8, 'ROPA-001', 'Zapatillas Nike Air Max', 1, 45999.00, 25.00),
(1, 12, 'JUG-001', 'LEGO Creator Expert', 1, 35999.00, 8.00);

-- Pago del pedido
INSERT INTO pagos (pedido_id, metodo, estado, transaccion_id, monto, detalle_metodo, cuotas, fecha_aprobacion) VALUES
(1, 'mercadopago', 'aprobado', 'MP-1234567890', 352999.00, 'Visa Banco Galicia - 6 cuotas sin interés', 6, '2024-12-10 14:30:00');

-- ======================================
-- 8. SUSCRIPCIONES AL NEWSLETTER
-- ======================================
INSERT INTO suscripciones (email) VALUES
('newsletter1@email.com'),
('newsletter2@email.com'),
('newsletter3@email.com'),
('juan.perez@email.com'),
('maria.gonzalez@email.com');

-- ======================================
-- 9. ELEMENTOS EN CARRITO
-- ======================================
INSERT INTO carritos (usuario_id, producto_id, cantidad) VALUES
(3, 2, 1), -- María tiene iPhone 15 en carrito
(3, 4, 2), -- María tiene 2 Sony WH-1000XM5 en carrito
(4, 6, 1), -- Carlos tiene Sofá en carrito
(4, 7, 1); -- Carlos tiene Heladera en carrito

-- ======================================
-- 10. LOGS DE EJEMPLO
-- ======================================
INSERT INTO shipping_logs (pedido_id, proveedor, accion, request, response, estado, mensaje) VALUES
(1, 'andreani', 'cotizar', '{"origen":"1043","destino":"1043","peso":2.1,"volumen":0.05}', '{"costo":2500,"tiempo_entrega":"24-48hs","servicio":"Standard"}', 'success', 'Cotización exitosa'),
(1, 'andreani', 'crear_envio', '{"pedido":"PED-20241210-000001","destinatario":"Juan Pérez"}', '{"tracking":"AND123456789","label_url":"https://..."}', 'success', 'Envío creado correctamente');

-- ======================================
-- 11. MENSAJE DE CONFIRMACIÓN
-- ======================================
SELECT 
    'Base de datos inicializada correctamente' as mensaje,
    (SELECT COUNT(*) FROM categorias) as categorias_creadas,
    (SELECT COUNT(*) FROM productos) as productos_creados,
    (SELECT COUNT(*) FROM usuarios) as usuarios_creados,
    (SELECT COUNT(*) FROM cupones) as cupones_creados;

    