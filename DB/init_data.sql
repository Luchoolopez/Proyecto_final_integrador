-- ======================================
-- INIT SCRIPT - ECOMMERCE DE ROPA
-- ======================================

-- ======================================
-- 1. DATOS INICIALES - CATEGORÍAS DE ROPA
-- ======================================
INSERT INTO categorias (nombre, descripcion) VALUES
('Remeras', 'Remeras, camisetas y tops de todo tipo'),
('Pantalones', 'Jeans, joggers, leggings y pantalones formales'),
('Buzos y Sweaters', 'Buzos con capucha, sweaters y cardigans'),
('Camisas', 'Camisas formales e informales para hombre y mujer'),
('Abrigos', 'Camperas, abrigos y chaquetas para todas las estaciones'),
('Ropa Interior', 'Ropa interior y medias'),
('Accesorios', 'Gorras, bufandas, guantes y otros accesorios'),
('Calzado', 'Zapatillas, zapatos y sandalias');

-- ======================================
-- 2. PRODUCTOS DE ROPA DE EJEMPLO
-- ======================================
INSERT INTO productos (sku, nombre, descripcion, precio, descuento, stock, peso, categoria_id, imagen_principal, meta_title, meta_description) VALUES
-- Remeras
('REM-001', 'Remera Básica Algodón', 'Remera 100% algodón, corte clásico, varios colores disponibles', 4999.00, 0.00, 200, 0.2, 1, '/images/remera-basica.jpg', 'Remera Básica de Algodón - Varios Colores', 'Remera 100% algodón, cómoda y versátil. Perfecta para uso diario.'),
('REM-002', 'Remera Oversized Estampada', 'Remera oversized con estampado urbano, 80% algodón 20% poliéster', 6999.00, 15.00, 150, 0.3, 1, '/images/remera-oversized.jpg', 'Remera Oversized Estampada - Moda Urbana', 'Remera oversized con estampados modernos. Ideal para looks casuales.'),

-- Pantalones
('PAN-001', 'Jeans Slim Fit', 'Jeans slim fit elastizados, corte moderno, color azul oscuro', 12999.00, 10.00, 80, 0.6, 2, '/images/jeans-slim.jpg', 'Jeans Slim Fit - Corte Moderno', 'Jeans slim fit con elastano para mayor comodidad. Varios talles disponibles.'),
('PAN-002', 'Jogger Cargo', 'Jogger cargo con bolsillos laterales, ajuste en tobillo, tejido técnico', 8999.00, 0.00, 100, 0.4, 2, '/images/jogger-cargo.jpg', 'Jogger Cargo - Estilo Urbano', 'Jogger cargo con múltiples bolsillos. Perfecto para looks casuales.'),

-- Buzos y Sweaters
('BUZ-001', 'Buzo con Capucha', 'Buzo con capucha, bolsillo canguro, 80% algodón 20% poliéster', 14999.00, 20.00, 120, 0.8, 3, '/images/buzo-capucha.jpg', 'Buzo con Capucha - Abrigo Casual', 'Buzo con capucha y bolsillo canguro. Ideal para días frescos.'),
('BUZ-002', 'Sweater de Lana Merino', 'Sweater 100% lana merino, cuello alto, abrigo natural', 18999.00, 0.00, 60, 0.5, 3, '/images/sweater-lana.jpg', 'Sweater de Lana Merino - Calidad Premium', 'Sweater de lana merino, cálido y suave. Perfecto para invierno.'),

-- Camisas
('CAM-001', 'Camisa Oxford', 'Camisa de oxford 100% algodón, corte regular, colores clásicos', 9999.00, 5.00, 90, 0.4, 4, '/images/camisa-oxford.jpg', 'Camisa Oxford - Estilo Clásico', 'Camisa de oxford 100% algodón. Formal y casual a la vez.'),
('CAM-002', 'Camisa Lino', 'Camisa de lino, tejido natural, ideal para verano, varios colores', 11999.00, 0.00, 70, 0.3, 4, '/images/camisa-lino.jpg', 'Camisa de Lino - Fresca y Elegante', 'Camisa de lino natural, perfecta para climas cálidos. Transpirable y cómoda.'),

-- Abrigos
('ABR-001', 'Campera Denim', 'Campera de jean clásica, corte regular, resistente y versátil', 19999.00, 15.00, 50, 1.0, 5, '/images/campera-denim.jpg', 'Campera Denim - Atemporal', 'Campera de jean clásica, nunca pasa de moda. Duradera y versátil.'),
('ABR-002', 'Parka Impermeable', 'Parka impermeable con capucha desmontable, forro polar extraíble', 29999.00, 10.00, 40, 1.2, 5, '/images/parka-impermeable.jpg', 'Parka Impermeable - Protección Total', 'Parka impermeable con tecnología dry-fit. Ideal para lluvia y frío.'),

-- Ropa Interior
('INT-001', 'Pack Boxers Algodón', 'Pack de 3 boxers 95% algodón 5% elastano, cómodos y transpirables', 3999.00, 0.00, 300, 0.2, 6, '/images/pack-boxers.jpg', 'Pack Boxers de Algodón - Comodidad', 'Pack de 3 boxers de algodón. Suaves y cómodos para uso diario.'),
('INT-002', 'Medias Deportivas', 'Pack de 5 pares de medias deportivas, tejido técnico, absorción de humedad', 2999.00, 0.00, 250, 0.3, 6, '/images/medias-deportivas.jpg', 'Medias Deportivas - Performance', 'Medias técnicas para deporte. Absorben la humedad y evitan rozaduras.'),

-- Accesorios
('ACC-001', 'Gorra Baseball', 'Gorra de baseball ajustable, frente curva, varios colores', 3499.00, 0.00, 150, 0.2, 7, '/images/gorra-baseball.jpg', 'Gorra Baseball - Estilo Urbano', 'Gorra de baseball clásica, ajustable. Complementa cualquier look casual.'),
('ACC-002', 'Bufanda de Lana', 'Bufanda 100% lana, tejido grueso, abrigo natural, colores invernales', 4999.00, 10.00, 100, 0.3, 7, '/images/bufanda-lana.jpg', 'Bufanda de Lana - Abrigo y Estilo', 'Bufanda de lana natural, cálida y suave. Ideal para completar tu outfit invernal.'),

-- Calzado
('CAL-001', 'Zapatillas Urbanas', 'Zapatillas urbanas, suela de goma, plantilla ergonómica, diseño moderno', 15999.00, 15.00, 80, 0.9, 8, '/images/zapatillas-urbanas.jpg', 'Zapatillas Urbanas - Estilo y Comodidad', 'Zapatillas urbanas con diseño moderno. Ideales para el día a día.'),
('CAL-002', 'Zapatos Formales', 'Zapatos de cuero genuino, suela de goma, horma cómoda, varios colores', 22999.00, 0.00, 60, 1.1, 8, '/images/zapatos-formales.jpg', 'Zapatos Formales de Cuero - Elegancia', 'Zapatos de cuero genuino, perfectos para ocasiones formales. Duraderos y cómodos.');

-- ======================================
-- 3. IMÁGENES ADICIONALES PARA PRODUCTOS
-- ======================================
INSERT INTO producto_imagenes (producto_id, imagen, alt_text, orden) VALUES
-- Remera Básica
(1, '/images/remera-basica-2.jpg', 'Remera básica vista lateral', 1),
(1, '/images/remera-basica-3.jpg', 'Remera básica detalle tejido', 2),

-- Jeans Slim Fit
(3, '/images/jeans-slim-2.jpg', 'Jeans slim fit vista trasera', 1),
(3, '/images/jeans-slim-3.jpg', 'Jeans slim fit detalle bolsillos', 2),

-- Buzo con Capucha
(5, '/images/buzo-capucha-2.jpg', 'Buzo con capucha vista trasera', 1),
(5, '/images/buzo-capucha-3.jpg', 'Buzo con capucha detalle bolsillo', 2),

-- Camisa Oxford
(7, '/images/camisa-oxford-2.jpg', 'Camisa oxford vista trasera', 1),
(7, '/images/camisa-oxford-3.jpg', 'Camisa oxford detalle botones', 2),

-- Campera Denim
(9, '/images/campera-denim-2.jpg', 'Campera denim vista interior', 1),
(9, '/images/campera-denim-3.jpg', 'Campera denim detalle cierre', 2),

-- Zapatillas Urbanas
(15, '/images/zapatillas-urbanas-2.jpg', 'Zapatillas urbanas vista lateral', 1),
(15, '/images/zapatillas-urbanas-3.jpg', 'Zapatillas urbanas vista superior', 2);

-- ======================================
-- 4. USUARIOS DE EJEMPLO
-- ======================================
INSERT INTO usuarios (nombre, email, password, telefono) VALUES
('Administrador', 'admin@tiendaropa.com', '$2b$10$K7L/8Y1t40zH2G.B3/4iFOJTKfz.1J2M8X5W6Y0Z1A2B3C4D5E6F7G', '+54 11 1234-5678'),
('Laura Martínez', 'laura.martinez@email.com', '$2b$10$K7L/8Y1t40zH2G.B3/4iFOJTKfz.1J2M8X5W6Y0Z1A2B3C4D5E6F7G', '+54 11 9876-5432'),
('Carlos Gómez', 'carlos.gomez@email.com', '$2b$10$K7L/8Y1t40zH2G.B3/4iFOJTKfz.1J2M8X5W6Y0Z1A2B3C4D5E6F7G', '+54 11 5555-1234'),
('Sofía Rodríguez', 'sofia.rodriguez@email.com', '$2b$10$K7L/8Y1t40zH2G.B3/4iFOJTKfz.1J2M8X5W6Y0Z1A2B3C4D5E6F7G', '+54 9 11 7777-8888');

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
('BIENVENIDA15', 'Descuento de bienvenida para nuevos usuarios', 'porcentaje', 15.00, 7000.00, 100, '2024-01-01', '2024-12-31'),
('VERANO24', 'Descuento especial de verano', 'porcentaje', 20.00, 12000.00, 500, '2024-12-01', '2024-03-31'),
('ENVIOGRATIS', 'Envío gratis en compras mayores a $15000', 'monto_fijo', 2500.00, 15000.00, NULL, '2024-01-01', '2024-12-31'),
('ROPA25', 'Descuento especial en ropa', 'porcentaje', 25.00, 20000.00, 200, '2024-01-01', '2024-06-30'),
('PRIMAVERA', 'Descuento de primavera', 'porcentaje', 30.00, 25000.00, 1000, '2024-09-01', '2024-11-30');

-- ======================================
-- 7. PEDIDO DE EJEMPLO
-- ======================================
INSERT INTO pedidos (numero_pedido, usuario_id, direccion_id, total, estado, notas, shipping_cost) VALUES
('PED-20241210-000001', 2, 1, 37997.00, 'entregado', 'Entregar en horario de tarde, timbre "Martínez"', 0.00);

-- Detalles del pedido
INSERT INTO detalles_pedido (pedido_id, producto_id, sku_producto, nombre_producto, cantidad, precio_unitario, descuento_aplicado) VALUES
(1, 5, 'BUZ-001', 'Buzo con Capucha', 1, 14999.00, 20.00),
(1, 3, 'PAN-001', 'Jeans Slim Fit', 1, 12999.00, 10.00),
(1, 1, 'REM-001', 'Remera Básica Algodón', 2, 4999.00, 0.00);

-- Pago del pedido
INSERT INTO pagos (pedido_id, metodo, estado, transaccion_id, monto, detalle_metodo, cuotas, fecha_aprobacion) VALUES
(1, 'mercadopago', 'aprobado', 'MP-1234567890', 37997.00, 'Visa Banco Nación - 3 cuotas sin interés', 3, '2024-12-10 14:30:00');

-- ======================================
-- 8. SUSCRIPCIONES AL NEWSLETTER
-- ======================================
INSERT INTO suscripciones (email) VALUES
('cliente1@email.com'),
('cliente2@email.com'),
('cliente3@email.com'),
('laura.martinez@email.com'),
('carlos.gomez@email.com');

-- ======================================
-- 9. ELEMENTOS EN CARRITO
-- ======================================
INSERT INTO carritos (usuario_id, producto_id, cantidad) VALUES
(3, 2, 1), -- Carlos tiene Remera Oversized en carrito
(3, 6, 1), -- Carlos tiene Sweater de Lana en carrito
(4, 9, 1), -- Sofía tiene Campera Denim en carrito
(4, 15, 1); -- Sofía tiene Zapatillas Urbanas en carrito

-- ======================================
-- 10. LOGS DE EJEMPLO
-- ======================================
INSERT INTO shipping_logs (pedido_id, proveedor, accion, request, response, estado, mensaje) VALUES
(1, 'correo_argentino', 'cotizar', '{"origen":"1043","destino":"1043","peso":1.6,"volumen":0.02}', '{"costo":0,"tiempo_entrega":"24-48hs","servicio":"Express Gratis"}', 'success', 'Cotización exitosa - Envío gratis por compra mayor a $15000'),
(1, 'correo_argentino', 'crear_envio', '{"pedido":"PED-20241210-000001","destinatario":"Laura Martínez"}', '{"tracking":"CA123456789AR","label_url":"https://..."}', 'success', 'Envío creado correctamente');

-- ======================================
-- 11. MENSAJE DE CONFIRMACIÓN
-- ======================================
SELECT 
    'Base de datos de ropa inicializada correctamente' as mensaje,
    (SELECT COUNT(*) FROM categorias) as categorias_creadas,
    (SELECT COUNT(*) FROM productos) as productos_creados,
    (SELECT COUNT(*) FROM usuarios) as usuarios_creados,
    (SELECT COUNT(*) FROM cupones) as cupones_creados;