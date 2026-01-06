-- ======================================
-- INIT SCRIPT - ECOMMERCE DE ROPA
-- ======================================

-- ======================================
-- 1. DATOS INICIALES - CATEGORIAS DE ROPA
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
INSERT INTO productos (sku, nombre, genero, descripcion, precio_base, descuento, peso, categoria_id, imagen_principal, es_nuevo, es_destacado, meta_title, meta_description) VALUES
-- Remeras Unisex
('REM-BAS-BLANCO', 'Remera Skullrem "Serpent Verses" - Crudo', 'Hombre', 'Remera de algodón premium en color crudo (off-white). Presenta un diseño de doble impacto: logo Skullrem en tipografía script color vino en el frente y una impactante estampa en espalda con gráfica de serpiente y texto estilo grunge/latín. Un item con personalidad propia, de corte relajado y tacto suave.', 20000.00, 15.00, 0.2, 1, 'https://res.cloudinary.com/dplnmknty/image/upload/v1764199252/mi_ecommerce_productos/az3vyyty3qgwd8b9shdb.jpg', TRUE, TRUE, 'Remera Basica Blanca - Algodon Premium', 'Remera 100% algodon blanca, comoda y versatil. Perfecta para uso diario.'),

-- Pantalones Unisex
('JEA-SLM-AZUL', 'Jeans Wide Leg "Desert Camo"', 'Unisex', 'Llevá la tendencia "Real Tree" a otro nivel con esta versión en tonos claros. Estos pantalones destacan por su estampado de camuflaje de hojas sobre una base beige y hueso, ideal para quienes buscan una estética Gorpcore más luminosa y versátil. Mantienen el corte wide leg (pierna ancha) para un fit relajado y con movimiento. Confeccionados en tela de alta resistencia, son el complemento perfecto para un outfit urbano fresco.', 35000.00, 0.00, 0.6, 2, 'https://res.cloudinary.com/dplnmknty/image/upload/v1764200784/mi_ecommerce_productos/r8vns0xvo9u2dwenk7z0.jpg', TRUE, TRUE, 'Jeans Slim Fit Azul - Corte Moderno', 'Jeans slim fit con elastano para mayor comodidad. Varios talles disponibles.'),
('JOG-CAR-VERDE', 'Jeans Wide Leg "Forest Camo"', 'Unisex', 'La pieza statement que le falta a tu colección. Estos pantalones capturan la tendencia "Real Tree" con un estampado de camuflaje de bosque hiperrealista en tonos verdes y tierra. Su corte wide leg (pierna ancha) ofrece una caída relajada y una silueta con volumen, perfecta para combinar con remeras oversize o buzos cortos. Confeccionados en tela resistente tipo gabardina/denim, destacan sus costuras blancas en contraste que estructuran el diseño.', 35000.00, 0.00, 0.4, 2, 'https://res.cloudinary.com/dplnmknty/image/upload/v1764200669/mi_ecommerce_productos/c0e0wb3fth5lmgczzy9d.jpg', TRUE, TRUE, 'Jogger Cargo Verde - Estilo Urbano', 'Jogger cargo con multiples bolsillos. Perfecto para looks casuales.'),

-- Calzado Unisex
('ZAP-URB-BLANCO', 'Puma 180 Skate - Black & Grey', 'Unisex', 'Reviví la estética skate de los 90 con un toque contemporáneo. Estas Puma destacan por su silueta chunky y sus característicos cordones anchos (fat laces) que dominan la tendencia actual. El diseño combina una base de malla respirable con superposiciones de gamuza gris y detalles en negro, creando un juego de texturas premium. La suela color crema aporta un acabado vintage, y el dije metálico del Puma le da ese detalle de exclusividad final.', 65000.00, 0.00, 0.8, 8, 'https://res.cloudinary.com/dplnmknty/image/upload/v1764200585/mi_ecommerce_productos/klg1o5bbnk6fhvrphpt5.jpg', TRUE, TRUE, 'Zapatillas Urbanas Blancas - Confort', 'Zapatillas comodos para uso diario, estilo deportivo.'),
('ZAP-URB-NEGRO', 'AJ1 Low TS "Black Phantom"', 'Unisex', 'La definición de sofisticación urbana. Estas zapatillas presentan un diseño "All-Black" confeccionado en gamuza de alta calidad y nubuck, acentuado por costuras blancas en contraste que resaltan cada línea de la silueta. El icónico Swoosh invertido y los detalles bordados en el talón le dan ese toque exclusivo de la colaboración Cactus Jack. Un par versátil y cargado de hype, perfecto para elevar cualquier outfit streetwear.', 60000.00, 0.00, 0.8, 8, 'https://res.cloudinary.com/dplnmknty/image/upload/v1764200213/mi_ecommerce_productos/rm0obuxhqntzzrfwpfmq.jpg', TRUE, TRUE, 'Zapatillas Urbanas Negras - Confort', 'Zapatillas comodos para uso diario, estilo deportivo.'),

-- Buzos y Sweaters
('BUZ-CAP-GRIS', 'Hoodie Skullrem Signature - Sand', 'Unisex', 'Un esencial de temporada. Este hoodie en color arena (sand) redefine el básico urbano con su tono neutro y estética limpia. Destaca por el logo "Skullrem" en tipografía handwritten (manuscrita) en el pecho, acompañado de un pequeño isotipo gráfico que le da identidad. Su moldería oversized, capucha amplia y bolsillo canguro aseguran ese look relajado y cómodo que buscás para el día a día.', 75000.00, 20.00, 0.8, 3, 'https://res.cloudinary.com/dplnmknty/image/upload/v1764200414/mi_ecommerce_productos/y2y4o2aqavr9txohk1mq.jpg', TRUE, TRUE, 'Buzo con Capucha Gris - Abrigo Casual', 'Buzo con capucha y bolsillo canguro. Ideal para dias frescos.'),
('BUZ-CAP-NEGRO', 'Hoodie Negro Oversize Skullrem', 'Mujer', 'Un esencial de temporada.  Destaca por el logo "Skullrem" en tipografía handwritten (manuscrita) en el pecho, acompañado de un pequeño isotipo gráfico que le da identidad. Su moldería oversized, capucha amplia y bolsillo canguro aseguran ese look relajado y cómodo que buscás para el día a día.', 75000.00, 20.00, 0.8, 3, 'https://res.cloudinary.com/dplnmknty/image/upload/v1764445176/mi_ecommerce_productos/uh0nvd97dcrvc7sd64ej.jpg', TRUE, TRUE, 'Buzo con Capucha Negro - Abrigo Casual', 'Buzo con capucha y bolsillo canguro. Ideal para dias frescos.');


-- ======================================
-- 3. VARIANTES DE PRODUCTOS (TALLES)
-- ======================================

-- Remera Skullrem "Serpent Verses" - Crudo (ID: 1)
INSERT INTO variantes_producto (producto_id, talle, sku_variante, stock) VALUES
(1, 'XS', 'REM-BAS-BLANCO-XS', 15),
(1, 'S', 'REM-BAS-BLANCO-S', 25),
(1, 'M', 'REM-BAS-BLANCO-M', 30),
(1, 'L', 'REM-BAS-BLANCO-L', 20),
(1, 'XL', 'REM-BAS-BLANCO-XL', 15),
(1, 'XXL', 'REM-BAS-BLANCO-XXL', 25);

-- Jeans Wide Leg "Desert Camo" (ID: 2)
INSERT INTO variantes_producto (producto_id, talle, sku_variante, stock) VALUES
(2, '38', 'JEA-WLD-CELESTE-38', 20),
(2, '40', 'JEA-WLD-CELESTE-40', 30),
(2, '42', 'JEA-WLD-CELESTE-42', 0),
(2, '44', 'JEA-WLD-CELESTE-44', 25),
(2, '46', 'JEA-WLD-CELESTE-46', 15),
(2, '48', 'JEA-WLD-CELESTE-48', 8);

-- Jeans Wide Leg "Forest Camo" (ID: 3)
INSERT INTO variantes_producto (producto_id, talle, sku_variante, stock) VALUES
(3, '36', 'JEA-WLD-FOREST-36', 10),
(3, '38', 'JEA-WLD-FOREST-38', 18),
(3, '40', 'JEA-WLD-FOREST-40', 22),
(3, '42', 'JEA-WLD-FOREST-42', 0),
(3, '44', 'JEA-WLD-FOREST-44', 12),
(3, '46', 'JEA-WLD-FOREST-46', 5);

-- Puma 180 Skate - Black & Grey (ID: 4)
INSERT INTO variantes_producto (producto_id, talle, sku_variante, stock) VALUES
(4, '37', 'PUM-180-BLACK-37', 8),
(4, '38', 'PUM-180-BLACK-38', 0),
(4, '39', 'PUM-180-BLACK-39', 20),
(4, '40', 'PUM-180-BLACK-40', 12),
(4, '41', 'PUM-180-BLACK-41', 10),
(4, '42', 'PUM-180-BLACK-42', 0),
(4, '43', 'PUM-180-BLACK-43', 3);

-- AJ1 Low TS "Black Phantom" (ID: 5)
INSERT INTO variantes_producto (producto_id, talle, sku_variante, stock) VALUES
(5, '37', 'AJ1-LOW-TS-BLACK-37', 15),
(5, '38', 'AJ1-LOW-TS-BLACK-38', 12),
(5, '39', 'AJ1-LOW-TS-BLACK-39', 0),
(5, '40', 'AJ1-LOW-TS-BLACK-40', 12),
(5, '41', 'AJ1-LOW-TS-BLACK-41', 10),
(5, '42', 'AJ1-LOW-TS-BLACK-42', 15),
(5, '43', 'AJ1-LOW-TS-BLACK-43', 0);

-- Hoodie Skullrem Signature - Sand (ID: 6)
INSERT INTO variantes_producto (producto_id, talle, sku_variante, stock) VALUES
(6, 'XS', 'BUZ-UNI-GRIS-XS', 12),
(6, 'S', 'BUZ-UNI-GRIS-S', 15),
(6, 'M', 'BUZ-UNI-GRIS-M', 0),
(6, 'L', 'BUZ-UNI-GRIS-L', 10),
(6, 'XL', 'BUZ-UNI-GRIS-XL', 5);

-- Hoodie Negro Oversize Skullrem (ID: 7)
INSERT INTO variantes_producto (producto_id, talle, sku_variante, stock) VALUES
(7, 'XS', 'BUZ-UNI-NEGRO-XS', 21),
(7, 'S', 'BUZ-UNI-NEGRO-S', 0),
(7, 'M', 'BUZ-UNI-NEGRO-M', 15),
(7, 'L', 'BUZ-UNI-NEGRO-L', 3),
(7, 'XL', 'BUZ-UNI-NEGRO-XL', 1);


-- ======================================
-- 4. IMAGENES ADICIONALES PARA PRODUCTOS
-- ======================================
INSERT INTO producto_imagenes (producto_id, imagen, alt_text, orden) VALUES

-- Remera
(1, 'https://res.cloudinary.com/dplnmknty/image/upload/v1764199257/mi_ecommerce_productos/skek7hkwwyt20gquo3yq.jpg', 'Remera basica negra vista lateral', 1),

-- Buzo
(2, 'https://res.cloudinary.com/dplnmknty/image/upload/v1764200414/mi_ecommerce_productos/y2y4o2aqavr9txohk1mq.jpg', 'Buzo basica negra vista lateral', 1),

-- Zapatillas Puma
(4, 'https://res.cloudinary.com/dplnmknty/image/upload/v1764200589/mi_ecommerce_productos/my0jex84vf8jhgfigptr.jpg', 'Zapatillas Puma', 1),

-- AJ1 Low TS "Black Phantom"
(5, 'https://res.cloudinary.com/dplnmknty/image/upload/v1764200268/mi_ecommerce_productos/mtfszeebsl7f8gehmvhp.jpg', 'AJ1 Low TS "Black Phantom" costado', 1),
(5, 'https://res.cloudinary.com/dplnmknty/image/upload/v1764200275/mi_ecommerce_productos/bvu8y1eydh7mxjape6sx.jpg', 'AJ1 Low TS "Black Phantom" atras', 2),

-- Hoodie Skullrem Signature - Sand
(6, 'https://res.cloudinary.com/dplnmknty/image/upload/v1764200419/mi_ecommerce_productos/hbc4fdbujprqmit4q8k9.jpg', 'Hoodie Skullrem Signature - Sand lateral', 1),

-- Hoodie Negro Oversize Skullrem
(7, 'https://res.cloudinary.com/dplnmknty/image/upload/v1764445336/mi_ecommerce_productos/sho9k751pgpvzbtlynxb.jpg', 'Hoodie Negro Oversize Skullrem lateral', 1);


-- ======================================
-- 5. USUARIOS DE EJEMPLO
-- ======================================
INSERT INTO usuarios (nombre, email, password, rol, telefono) VALUES
('Administrador', 'admin@tiendaropa.com', '$2a$12$M6tl8zr7rih5HJPj.9lMjedKweScAWTYgWhOHKacIvlxEFT7CjBYC', 'admin', '+54 11 1234-5678'),
('Laura Martinez', 'laura.martinez@email.com', '$2b$10$K7L/8Y1t40zH2G.B3/4iFOJTKfz.1J2M8X5W6Y0Z1A2B3C4D5E6F7G', 'usuario', '+54 11 9876-5432'),
('Carlos Gomez', 'carlos.gomez@email.com', '$2b$10$K7L/8Y1t40zH2G.B3/4iFOJTKfz.1J2M8X5W6Y0Z1A2B3C4D5E6F7G', 'usuario', '+54 11 5555-1234'),
('Sofia Rodriguez', 'sofia.rodriguez@email.com', '$2b$10$K7L/8Y1t40zH2G.B3/4iFOJTKfz.1J2M8X5W6Y0Z1A2B3C4D5E6F7G', 'usuario', '+54 9 11 7777-8888'),
('Ana Fernandez', 'ana.fernandez@email.com', '$2b$10$K7L/8Y1t40zH2G.B3/4iFOJTKfz.1J2M8X5W6Y0Z1A2B3C4D5E6F7G', 'usuario', '+54 11 4444-9999');

-- ======================================
-- 6. DIRECCIONES DE EJEMPLO
-- ======================================
INSERT INTO direcciones (usuario_id, calle, numero, piso, dpto, ciudad, provincia, codigo_postal, es_principal) VALUES
(2, 'Av. Corrientes', '1234', '5', 'B', 'Buenos Aires', 'Buenos Aires', '1043', TRUE),
(2, 'Av. Santa Fe', '5678', NULL, NULL, 'Buenos Aires', 'Buenos Aires', '1425', FALSE),
(3, 'Calle San Martin', '890', '2', 'A', 'Rosario', 'Santa Fe', '2000', TRUE),
(4, 'Av. Independencia', '456', '10', '15', 'Cordoba', 'Cordoba', '5000', TRUE),
(5, 'Calle Rivadavia', '2345', '3', 'C', 'Buenos Aires', 'Buenos Aires', '1033', TRUE);

-- ======================================
-- 7. CUPONES DE DESCUENTO
-- ======================================
INSERT INTO cupones (codigo, descripcion, tipo, valor, monto_minimo, usos_maximos, fecha_inicio, fecha_fin) VALUES
('BIENVENIDA15', 'Descuento de bienvenida para nuevos usuarios', 'porcentaje', 15.00, 7000.00, 100, '2024-01-01', '2025-12-31'),
('VERANO25', 'Descuento especial de verano', 'porcentaje', 20.00, 12000.00, 500, '2024-12-01', '2025-03-31'),
('ENVIOGRATIS', 'Envio gratis en compras mayores a $15000', 'monto_fijo', 2500.00, 15000.00, NULL, '2024-01-01', '2025-12-31'),
('ROPA25', 'Descuento especial en ropa', 'porcentaje', 25.00, 20000.00, 200, '2024-01-01', '2025-06-30'),
('INVIERNO30', 'Descuento de invierno', 'porcentaje', 30.00, 25000.00, 1000, '2025-06-01', '2025-08-31');

-- ======================================
-- 8. PEDIDO DE EJEMPLO
-- ======================================
INSERT INTO pedidos (numero_pedido, usuario_id, direccion_id, total, estado, notas, shipping_cost) VALUES
('PED-20241210-000001', 2, 1, 37997.00, 'entregado', 'Entregar en horario de tarde, timbre "Martinez"', 0.00);

-- Detalles del pedido (Ids actualizados a tu nuevo catalogo: 1, 7 y 35 aprox)
INSERT INTO detalles_pedido (pedido_id, variante_id, sku_variante, nombre_producto, talle, cantidad, precio_unitario, descuento_aplicado) VALUES
(1, 1, 'REM-BAS-BLANCO-XS', 'Remera Skullrem Serpent', 'XS', 1, 20000.00, 15.00),
(1, 7, 'JEA-WLD-CELESTE-38', 'Jeans Wide Leg Desert', '38', 1, 35000.00, 0.00);

-- Pago del pedido
INSERT INTO pagos (pedido_id, metodo, estado, transaccion_id, monto, detalle_metodo, cuotas, fecha_aprobacion) VALUES
(1, 'mercadopago', 'aprobado', 'MP-1234567890', 37997.00, 'Visa Banco Nacion - 3 cuotas sin interes', 3, '2024-12-10 14:30:00');

-- ======================================
-- 9. SUSCRIPCIONES AL NEWSLETTER
-- ======================================
INSERT INTO suscripciones (email) VALUES
('cliente1@email.com'),
('cliente2@email.com'),
('cliente3@email.com'),
('laura.martinez@email.com'),
('carlos.gomez@email.com'),
('ana.fernandez@email.com');

-- ======================================
-- 10. ELEMENTOS EN CARRITO (USA VARIANTE_ID)
-- ======================================
INSERT INTO carritos (usuario_id, variante_id, cantidad) VALUES
(3, 2, 2),   -- Carlos tiene 2 Remeras Oversized Negras Talle S
(3, 3, 1),   -- Carlos tiene 1 Sweater Azul Talle S
(4, 1, 1),  -- Sofia tiene 1 Campera Denim Azul Talle S
(4, 4, 1),   -- Sofia tiene 1 Remera Basica Negra Talle L
(5, 5, 1),   -- Ana tiene 1 Remera Mujer Rosa Talle S
(5, 6, 1);  -- Ana tiene 1 Zapatillas Running Rosa Talle 39

-- ======================================
-- 11. LOGS DE EJEMPLO
-- ======================================
INSERT INTO shipping_logs (pedido_id, proveedor, accion, request, response, estado, mensaje) VALUES
(1, 'correo_argentino', 'cotizar', '{"origen":"1043","destino":"1043","peso":1.6,"volumen":0.02}', '{"costo":0,"tiempo_entrega":"24-48hs","servicio":"Express Gratis"}', 'success', 'Cotizacion exitosa - Envio gratis por compra mayor a $15000'),
(1, 'correo_argentino', 'crear_envio', '{"pedido":"PED-20241210-000001","destinatario":"Laura Martinez"}', '{"tracking":"CA123456789AR","label_url":"https://..."}', 'success', 'Envio creado correctamente');

-- ======================================
-- 12. MENSAJE DE CONFIRMACION
-- ======================================
SELECT 
    'Base de datos de ropa inicializada correctamente' as mensaje,
    (SELECT COUNT(*) FROM categorias) as categorias_creadas,
    (SELECT COUNT(*) FROM productos) as productos_creados,
    (SELECT COUNT(*) FROM variantes_producto) as variantes_creadas,
    (SELECT COUNT(*) FROM usuarios) as usuarios_creados,
    (SELECT COUNT(*) FROM cupones) as cupones_creados,
    (SELECT SUM(stock) FROM variantes_producto) as stock_total;