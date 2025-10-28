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
-- Nota: precio_base y descuento están a nivel producto
-- El stock se maneja a nivel de variante (por talle)
-- ======================================
INSERT INTO productos (sku, nombre, genero, descripcion, precio_base, descuento, peso, categoria_id, imagen_principal, es_nuevo, es_destacado, meta_title, meta_description) VALUES
-- Remeras (cada color es un producto diferente)
('REM-BAS-BLANCO', 'Remera Básica Algodón Blanca', 'Unisex', 'Remera 100% algodón, corte clásico, color blanco', 4999.00, 0.00, 0.2, 1, '/images/remera-basica-blanco.jpg', TRUE, FALSE, 'Remera Básica Blanca - Algodón Premium', 'Remera 100% algodón blanca, cómoda y versátil. Perfecta para uso diario.'),
('REM-BAS-NEGRO', 'Remera Básica Algodón Negra', 'Unisex', 'Remera 100% algodón, corte clásico, color negro', 4999.00, 0.00, 0.2, 1, '/images/remera-basica-negro.jpg', TRUE, TRUE, 'Remera Básica Negra - Algodón Premium', 'Remera 100% algodón negra, cómoda y versátil. Perfecta para uso diario.'),
('REM-OVR-NEGRO', 'Remera Oversized Estampada Negra', 'Unisex', 'Remera oversized con estampado urbano, 80% algodón 20% poliéster, color negro', 6999.00, 15.00, 0.3, 1, '/images/remera-oversized-negro.jpg', TRUE, TRUE, 'Remera Oversized Negra - Moda Urbana', 'Remera oversized con estampados modernos. Ideal para looks casuales.'),
('REM-OVR-GRIS', 'Remera Oversized Estampada Gris', 'Unisex', 'Remera oversized con estampado urbano, 80% algodón 20% poliéster, color gris', 6999.00, 15.00, 0.3, 1, '/images/remera-oversized-gris.jpg', TRUE, FALSE, 'Remera Oversized Gris - Moda Urbana', 'Remera oversized con estampados modernos. Ideal para looks casuales.'),

-- Pantalones
('JEA-SLM-AZUL', 'Jeans Slim Fit Azul Oscuro', 'Unisex', 'Jeans slim fit elastizados, corte moderno, color azul oscuro', 12999.00, 10.00, 0.6, 2, '/images/jeans-slim-azul.jpg', FALSE, TRUE, 'Jeans Slim Fit Azul - Corte Moderno', 'Jeans slim fit con elastano para mayor comodidad. Varios talles disponibles.'),
('JEA-SLM-NEGRO', 'Jeans Slim Fit Negro', 'Unisex', 'Jeans slim fit elastizados, corte moderno, color negro', 12999.00, 10.00, 0.6, 2, '/images/jeans-slim-negro.jpg', FALSE, FALSE, 'Jeans Slim Fit Negro - Corte Moderno', 'Jeans slim fit con elastano para mayor comodidad. Varios talles disponibles.'),
('JOG-CAR-VERDE', 'Jogger Cargo Verde Militar', 'Hombre', 'Jogger cargo con bolsillos laterales, ajuste en tobillo, tejido técnico, color verde militar', 8999.00, 0.00, 0.4, 2, '/images/jogger-cargo-verde.jpg', TRUE, FALSE, 'Jogger Cargo Verde - Estilo Urbano', 'Jogger cargo con múltiples bolsillos. Perfecto para looks casuales.'),
('JOG-CAR-NEGRO', 'Jogger Cargo Negro', 'Hombre', 'Jogger cargo con bolsillos laterales, ajuste en tobillo, tejido técnico, color negro', 8999.00, 0.00, 0.4, 2, '/images/jogger-cargo-negro.jpg', TRUE, TRUE, 'Jogger Cargo Negro - Estilo Urbano', 'Jogger cargo con múltiples bolsillos. Perfecto para looks casuales.'),

-- Buzos y Sweaters
('BUZ-CAP-GRIS', 'Buzo con Capucha Gris', 'Unisex', 'Buzo con capucha, bolsillo canguro, 80% algodón 20% poliéster, color gris', 14999.00, 20.00, 0.8, 3, '/images/buzo-capucha-gris.jpg', FALSE, TRUE, 'Buzo con Capucha Gris - Abrigo Casual', 'Buzo con capucha y bolsillo canguro. Ideal para días frescos.'),
('BUZ-CAP-NEGRO', 'Buzo con Capucha Negro', 'Unisex', 'Buzo con capucha, bolsillo canguro, 80% algodón 20% poliéster, color negro', 14999.00, 20.00, 0.8, 3, '/images/buzo-capucha-negro.jpg', FALSE, TRUE, 'Buzo con Capucha Negro - Abrigo Casual', 'Buzo con capucha y bolsillo canguro. Ideal para días frescos.'),
('SWE-LAN-AZUL', 'Sweater de Lana Merino Azul', 'Unisex', 'Sweater 100% lana merino, cuello alto, abrigo natural, color azul marino', 18999.00, 0.00, 0.5, 3, '/images/sweater-lana-azul.jpg', TRUE, FALSE, 'Sweater de Lana Merino Azul - Calidad Premium', 'Sweater de lana merino, cálido y suave. Perfecto para invierno.'),
('SWE-LAN-GRIS', 'Sweater de Lana Merino Gris', 'Unisex', 'Sweater 100% lana merino, cuello alto, abrigo natural, color gris', 18999.00, 0.00, 0.5, 3, '/images/sweater-lana-gris.jpg', TRUE, TRUE, 'Sweater de Lana Merino Gris - Calidad Premium', 'Sweater de lana merino, cálido y suave. Perfecto para invierno.'),

-- Camisas
('CAM-OXF-BLANCO', 'Camisa Oxford Blanca', 'Hombre', 'Camisa de oxford 100% algodón, corte regular, color blanco', 9999.00, 5.00, 0.4, 4, '/images/camisa-oxford-blanco.jpg', FALSE, FALSE, 'Camisa Oxford Blanca - Estilo Clásico', 'Camisa de oxford 100% algodón. Formal y casual a la vez.'),
('CAM-OXF-CELESTE', 'Camisa Oxford Celeste', 'Hombre', 'Camisa de oxford 100% algodón, corte regular, color celeste', 9999.00, 5.00, 0.4, 4, '/images/camisa-oxford-celeste.jpg', FALSE, TRUE, 'Camisa Oxford Celeste - Estilo Clásico', 'Camisa de oxford 100% algodón. Formal y casual a la vez.'),
('CAM-LIN-BEIGE', 'Camisa Lino Beige', 'Unisex', 'Camisa de lino, tejido natural, ideal para verano, color beige', 11999.00, 0.00, 0.3, 4, '/images/camisa-lino-beige.jpg', TRUE, FALSE, 'Camisa de Lino Beige - Fresca y Elegante', 'Camisa de lino natural, perfecta para climas cálidos. Transpirable y cómoda.'),
('CAM-LIN-BLANCO', 'Camisa Lino Blanca', 'Unisex', 'Camisa de lino, tejido natural, ideal para verano, color blanco', 11999.00, 0.00, 0.3, 4, '/images/camisa-lino-blanco.jpg', TRUE, TRUE, 'Camisa de Lino Blanca - Fresca y Elegante', 'Camisa de lino natural, perfecta para climas cálidos. Transpirable y cómoda.'),

-- Abrigos
('CAM-DEN-AZUL', 'Campera Denim Azul', 'Unisex', 'Campera de jean clásica, corte regular, resistente y versátil, color azul', 19999.00, 15.00, 1.0, 5, '/images/campera-denim-azul.jpg', FALSE, TRUE, 'Campera Denim Azul - Atemporal', 'Campera de jean clásica, nunca pasa de moda. Duradera y versátil.'),
('CAM-DEN-NEGRO', 'Campera Denim Negra', 'Unisex', 'Campera de jean clásica, corte regular, resistente y versátil, color negro', 19999.00, 15.00, 1.0, 5, '/images/campera-denim-negro.jpg', FALSE, FALSE, 'Campera Denim Negra - Atemporal', 'Campera de jean clásica, nunca pasa de moda. Duradera y versátil.'),
('PAR-IMP-VERDE', 'Parka Impermeable Verde', 'Unisex', 'Parka impermeable con capucha desmontable, forro polar extraíble, color verde oliva', 29999.00, 10.00, 1.2, 5, '/images/parka-impermeable-verde.jpg', TRUE, TRUE, 'Parka Impermeable Verde - Protección Total', 'Parka impermeable con tecnología dry-fit. Ideal para lluvia y frío.'),
('PAR-IMP-NEGRO', 'Parka Impermeable Negra', 'Unisex', 'Parka impermeable con capucha desmontable, forro polar extraíble, color negro', 29999.00, 10.00, 1.2, 5, '/images/parka-impermeable-negro.jpg', TRUE, FALSE, 'Parka Impermeable Negra - Protección Total', 'Parka impermeable con tecnología dry-fit. Ideal para lluvia y frío.');

-- ======================================
-- 3. VARIANTES DE PRODUCTOS (TALLES)
-- ======================================

-- Remera Básica Blanca (ID: 1)
INSERT INTO variantes_producto (producto_id, talle, sku_variante, stock) VALUES
(1, 'XS', 'REM-BAS-BLANCO-XS', 15),
(1, 'S', 'REM-BAS-BLANCO-S', 25),
(1, 'M', 'REM-BAS-BLANCO-M', 30),
(1, 'L', 'REM-BAS-BLANCO-L', 20),
(1, 'XL', 'REM-BAS-BLANCO-XL', 10),
(1, 'XXL', 'REM-BAS-BLANCO-XXL', 5);

-- Remera Básica Negra (ID: 2)
INSERT INTO variantes_producto (producto_id, talle, sku_variante, stock) VALUES
(2, 'XS', 'REM-BAS-NEGRO-XS', 20),
(2, 'S', 'REM-BAS-NEGRO-S', 30),
(2, 'M', 'REM-BAS-NEGRO-M', 35),
(2, 'L', 'REM-BAS-NEGRO-L', 25),
(2, 'XL', 'REM-BAS-NEGRO-XL', 15),
(2, 'XXL', 'REM-BAS-NEGRO-XXL', 8);

-- Remera Oversized Negra (ID: 3)
INSERT INTO variantes_producto (producto_id, talle, sku_variante, stock) VALUES
(3, 'XS', 'REM-OVR-NEGRO-XS', 10),
(3, 'S', 'REM-OVR-NEGRO-S', 18),
(3, 'M', 'REM-OVR-NEGRO-M', 22),
(3, 'L', 'REM-OVR-NEGRO-L', 15),
(3, 'XL', 'REM-OVR-NEGRO-XL', 12),
(3, 'XXL', 'REM-OVR-NEGRO-XXL', 5);

-- Remera Oversized Gris (ID: 4)
INSERT INTO variantes_producto (producto_id, talle, sku_variante, stock) VALUES
(4, 'XS', 'REM-OVR-GRIS-XS', 8),
(4, 'S', 'REM-OVR-GRIS-S', 15),
(4, 'M', 'REM-OVR-GRIS-M', 20),
(4, 'L', 'REM-OVR-GRIS-L', 12),
(4, 'XL', 'REM-OVR-GRIS-XL', 10),
(4, 'XXL', 'REM-OVR-GRIS-XXL', 3);

-- Jeans Slim Azul (ID: 5) - Talles numéricos
INSERT INTO variantes_producto (producto_id, talle, sku_variante, stock) VALUES
(5, '36', 'JEA-SLM-AZUL-36', 8),
(5, '38', 'JEA-SLM-AZUL-38', 12),
(5, '40', 'JEA-SLM-AZUL-40', 15),
(5, '42', 'JEA-SLM-AZUL-42', 18),
(5, '44', 'JEA-SLM-AZUL-44', 10),
(5, '46', 'JEA-SLM-AZUL-46', 5);

-- Jeans Slim Negro (ID: 6)
INSERT INTO variantes_producto (producto_id, talle, sku_variante, stock) VALUES
(6, '36', 'JEA-SLM-NEGRO-36', 10),
(6, '38', 'JEA-SLM-NEGRO-38', 15),
(6, '40', 'JEA-SLM-NEGRO-40', 20),
(6, '42', 'JEA-SLM-NEGRO-42', 22),
(6, '44', 'JEA-SLM-NEGRO-44', 12),
(6, '46', 'JEA-SLM-NEGRO-46', 6);

-- Jogger Cargo Verde (ID: 7)
INSERT INTO variantes_producto (producto_id, talle, sku_variante, stock) VALUES
(7, 'S', 'JOG-CAR-VERDE-S', 12),
(7, 'M', 'JOG-CAR-VERDE-M', 18),
(7, 'L', 'JOG-CAR-VERDE-L', 15),
(7, 'XL', 'JOG-CAR-VERDE-XL', 10),
(7, 'XXL', 'JOG-CAR-VERDE-XXL', 5);

-- Jogger Cargo Negro (ID: 8)
INSERT INTO variantes_producto (producto_id, talle, sku_variante, stock) VALUES
(8, 'S', 'JOG-CAR-NEGRO-S', 15),
(8, 'M', 'JOG-CAR-NEGRO-M', 20),
(8, 'L', 'JOG-CAR-NEGRO-L', 18),
(8, 'XL', 'JOG-CAR-NEGRO-XL', 12),
(8, 'XXL', 'JOG-CAR-NEGRO-XXL', 8);

-- Buzo Gris (ID: 9)
INSERT INTO variantes_producto (producto_id, talle, sku_variante, stock) VALUES
(9, 'S', 'BUZ-CAP-GRIS-S', 15),
(9, 'M', 'BUZ-CAP-GRIS-M', 22),
(9, 'L', 'BUZ-CAP-GRIS-L', 20),
(9, 'XL', 'BUZ-CAP-GRIS-XL', 10),
(9, 'XXL', 'BUZ-CAP-GRIS-XXL', 5);

-- Buzo Negro (ID: 10)
INSERT INTO variantes_producto (producto_id, talle, sku_variante, stock) VALUES
(10, 'S', 'BUZ-CAP-NEGRO-S', 18),
(10, 'M', 'BUZ-CAP-NEGRO-M', 25),
(10, 'L', 'BUZ-CAP-NEGRO-L', 22),
(10, 'XL', 'BUZ-CAP-NEGRO-XL', 12),
(10, 'XXL', 'BUZ-CAP-NEGRO-XXL', 6);

-- Sweater Azul (ID: 11)
INSERT INTO variantes_producto (producto_id, talle, sku_variante, stock) VALUES
(11, 'S', 'SWE-LAN-AZUL-S', 8),
(11, 'M', 'SWE-LAN-AZUL-M', 12),
(11, 'L', 'SWE-LAN-AZUL-L', 10),
(11, 'XL', 'SWE-LAN-AZUL-XL', 5);

-- Sweater Gris (ID: 12)
INSERT INTO variantes_producto (producto_id, talle, sku_variante, stock) VALUES
(12, 'S', 'SWE-LAN-GRIS-S', 10),
(12, 'M', 'SWE-LAN-GRIS-M', 15),
(12, 'L', 'SWE-LAN-GRIS-L', 12),
(12, 'XL', 'SWE-LAN-GRIS-XL', 6);

-- Camisa Oxford Blanca (ID: 13)
INSERT INTO variantes_producto (producto_id, talle, sku_variante, stock) VALUES
(13, 'S', 'CAM-OXF-BLANCO-S', 12),
(13, 'M', 'CAM-OXF-BLANCO-M', 18),
(13, 'L', 'CAM-OXF-BLANCO-L', 15),
(13, 'XL', 'CAM-OXF-BLANCO-XL', 8);

-- Camisa Oxford Celeste (ID: 14)
INSERT INTO variantes_producto (producto_id, talle, sku_variante, stock) VALUES
(14, 'S', 'CAM-OXF-CELESTE-S', 15),
(14, 'M', 'CAM-OXF-CELESTE-M', 20),
(14, 'L', 'CAM-OXF-CELESTE-L', 18),
(14, 'XL', 'CAM-OXF-CELESTE-XL', 10);

-- Camisa Lino Beige (ID: 15)
INSERT INTO variantes_producto (producto_id, talle, sku_variante, stock) VALUES
(15, 'S', 'CAM-LIN-BEIGE-S', 10),
(15, 'M', 'CAM-LIN-BEIGE-M', 15),
(15, 'L', 'CAM-LIN-BEIGE-L', 12),
(15, 'XL', 'CAM-LIN-BEIGE-XL', 6);

-- Camisa Lino Blanca (ID: 16)
INSERT INTO variantes_producto (producto_id, talle, sku_variante, stock) VALUES
(16, 'S', 'CAM-LIN-BLANCO-S', 12),
(16, 'M', 'CAM-LIN-BLANCO-M', 18),
(16, 'L', 'CAM-LIN-BLANCO-L', 15),
(16, 'XL', 'CAM-LIN-BLANCO-XL', 8);

-- Campera Denim Azul (ID: 17)
INSERT INTO variantes_producto (producto_id, talle, sku_variante, stock) VALUES
(17, 'S', 'CAM-DEN-AZUL-S', 8),
(17, 'M', 'CAM-DEN-AZUL-M', 12),
(17, 'L', 'CAM-DEN-AZUL-L', 10),
(17, 'XL', 'CAM-DEN-AZUL-XL', 5),
(17, 'XXL', 'CAM-DEN-AZUL-XXL', 3);

-- Campera Denim Negra (ID: 18)
INSERT INTO variantes_producto (producto_id, talle, sku_variante, stock) VALUES
(18, 'S', 'CAM-DEN-NEGRO-S', 10),
(18, 'M', 'CAM-DEN-NEGRO-M', 15),
(18, 'L', 'CAM-DEN-NEGRO-L', 12),
(18, 'XL', 'CAM-DEN-NEGRO-XL', 6),
(18, 'XXL', 'CAM-DEN-NEGRO-XXL', 4);

-- Parka Verde (ID: 19)
INSERT INTO variantes_producto (producto_id, talle, sku_variante, stock) VALUES
(19, 'S', 'PAR-IMP-VERDE-S', 5),
(19, 'M', 'PAR-IMP-VERDE-M', 8),
(19, 'L', 'PAR-IMP-VERDE-L', 10),
(19, 'XL', 'PAR-IMP-VERDE-XL', 6),
(19, 'XXL', 'PAR-IMP-VERDE-XXL', 3);

-- Parka Negra (ID: 20)
INSERT INTO variantes_producto (producto_id, talle, sku_variante, stock) VALUES
(20, 'S', 'PAR-IMP-NEGRO-S', 6),
(20, 'M', 'PAR-IMP-NEGRO-M', 10),
(20, 'L', 'PAR-IMP-NEGRO-L', 12),
(20, 'XL', 'PAR-IMP-NEGRO-XL', 8),
(20, 'XXL', 'PAR-IMP-NEGRO-XXL', 4);

-- ======================================
-- 4. IMÁGENES ADICIONALES PARA PRODUCTOS
-- ======================================
INSERT INTO producto_imagenes (producto_id, imagen, alt_text, orden) VALUES
-- Remera Básica Negra
(2, '/images/remera-basica-negro-2.jpg', 'Remera básica negra vista lateral', 1),
(2, '/images/remera-basica-negro-3.jpg', 'Remera básica negra detalle tejido', 2),

-- Jeans Slim Azul
(5, '/images/jeans-slim-azul-2.jpg', 'Jeans slim fit azul vista trasera', 1),
(5, '/images/jeans-slim-azul-3.jpg', 'Jeans slim fit azul detalle bolsillos', 2),

-- Buzo Negro
(10, '/images/buzo-capucha-negro-2.jpg', 'Buzo con capucha negro vista trasera', 1),
(10, '/images/buzo-capucha-negro-3.jpg', 'Buzo con capucha negro detalle bolsillo', 2),

-- Camisa Oxford Celeste
(14, '/images/camisa-oxford-celeste-2.jpg', 'Camisa oxford celeste vista trasera', 1),
(14, '/images/camisa-oxford-celeste-3.jpg', 'Camisa oxford celeste detalle botones', 2),

-- Campera Denim Azul
(17, '/images/campera-denim-azul-2.jpg', 'Campera denim azul vista interior', 1),
(17, '/images/campera-denim-azul-3.jpg', 'Campera denim azul detalle cierre', 2);

-- ======================================
-- 5. USUARIOS DE EJEMPLO
-- ======================================
INSERT INTO usuarios (nombre, email, password, rol, telefono) VALUES
('Administrador', 'admin@tiendaropa.com', '$2a$12$M6tl8zr7rih5HJPj.9lMjedKweScAWTYgWhOHKacIvlxEFT7CjBYC', 'admin', '+54 11 1234-5678'),
('Laura Martínez', 'laura.martinez@email.com', '$2b$10$K7L/8Y1t40zH2G.B3/4iFOJTKfz.1J2M8X5W6Y0Z1A2B3C4D5E6F7G', 'usuario', '+54 11 9876-5432'),
('Carlos Gómez', 'carlos.gomez@email.com', '$2b$10$K7L/8Y1t40zH2G.B3/4iFOJTKfz.1J2M8X5W6Y0Z1A2B3C4D5E6F7G', 'usuario', '+54 11 5555-1234'),
('Sofía Rodríguez', 'sofia.rodriguez@email.com', '$2b$10$K7L/8Y1t40zH2G.B3/4iFOJTKfz.1J2M8X5W6Y0Z1A2B3C4D5E6F7G', 'usuario', '+54 9 11 7777-8888');

-- ======================================
-- 6. DIRECCIONES DE EJEMPLO
-- ======================================
INSERT INTO direcciones (usuario_id, calle, numero, piso, dpto, ciudad, provincia, codigo_postal, es_principal) VALUES
(2, 'Av. Corrientes', '1234', '5', 'B', 'Buenos Aires', 'Buenos Aires', '1043', TRUE),
(2, 'Av. Santa Fe', '5678', NULL, NULL, 'Buenos Aires', 'Buenos Aires', '1425', FALSE),
(3, 'Calle San Martín', '890', '2', 'A', 'Rosario', 'Santa Fe', '2000', TRUE),
(4, 'Av. Independencia', '456', '10', '15', 'Córdoba', 'Córdoba', '5000', TRUE);

-- ======================================
-- 7. CUPONES DE DESCUENTO
-- ======================================
INSERT INTO cupones (codigo, descripcion, tipo, valor, monto_minimo, usos_maximos, fecha_inicio, fecha_fin) VALUES
('BIENVENIDA15', 'Descuento de bienvenida para nuevos usuarios', 'porcentaje', 15.00, 7000.00, 100, '2024-01-01', '2025-12-31'),
('VERANO25', 'Descuento especial de verano', 'porcentaje', 20.00, 12000.00, 500, '2024-12-01', '2025-03-31'),
('ENVIOGRATIS', 'Envío gratis en compras mayores a $15000', 'monto_fijo', 2500.00, 15000.00, NULL, '2024-01-01', '2025-12-31'),
('ROPA25', 'Descuento especial en ropa', 'porcentaje', 25.00, 20000.00, 200, '2024-01-01', '2025-06-30'),
('INVIERNO30', 'Descuento de invierno', 'porcentaje', 30.00, 25000.00, 1000, '2025-06-01', '2025-08-31');

-- ======================================
-- 8. PEDIDO DE EJEMPLO
-- ======================================
INSERT INTO pedidos (numero_pedido, usuario_id, direccion_id, total, estado, notas, shipping_cost) VALUES
('PED-20241210-000001', 2, 1, 37997.00, 'entregado', 'Entregar en horario de tarde, timbre "Martínez"', 0.00);

-- Detalles del pedido (AHORA USA VARIANTE_ID)
INSERT INTO detalles_pedido (pedido_id, variante_id, sku_variante, nombre_producto, talle, cantidad, precio_unitario, descuento_aplicado) VALUES
(1, 50, 'BUZ-CAP-GRIS-M', 'Buzo con Capucha Gris', 'M', 1, 14999.00, 20.00),
(1, 23, 'JEA-SLM-AZUL-40', 'Jeans Slim Fit Azul Oscuro', '40', 1, 12999.00, 10.00),
(1, 9, 'REM-BAS-NEGRO-M', 'Remera Básica Algodón Negra', 'M', 2, 4999.00, 0.00);

-- Pago del pedido
INSERT INTO pagos (pedido_id, metodo, estado, transaccion_id, monto, detalle_metodo, cuotas, fecha_aprobacion) VALUES
(1, 'mercadopago', 'aprobado', 'MP-1234567890', 37997.00, 'Visa Banco Nación - 3 cuotas sin interés', 3, '2024-12-10 14:30:00');

-- ======================================
-- 9. SUSCRIPCIONES AL NEWSLETTER
-- ======================================
INSERT INTO suscripciones (email) VALUES
('cliente1@email.com'),
('cliente2@email.com'),
('cliente3@email.com'),
('laura.martinez@email.com'),
('carlos.gomez@email.com');

-- ======================================
-- 10. ELEMENTOS EN CARRITO (AHORA USA VARIANTE_ID)
-- ======================================
INSERT INTO carritos (usuario_id, variante_id, cantidad) VALUES
(3, 15, 2),  -- Carlos tiene 2 Remeras Oversized Negras Talle S
(3, 57, 1),  -- Carlos tiene 1 Sweater Azul Talle M
(4, 93, 1),  -- Sofía tiene 1 Campera Denim Azul Talle M
(4, 9, 1);   -- Sofía tiene 1 Remera Básica Negra Talle M

-- ======================================
-- 11. LOGS DE EJEMPLO
-- ======================================
INSERT INTO shipping_logs (pedido_id, proveedor, accion, request, response, estado, mensaje) VALUES
(1, 'correo_argentino', 'cotizar', '{"origen":"1043","destino":"1043","peso":1.6,"volumen":0.02}', '{"costo":0,"tiempo_entrega":"24-48hs","servicio":"Express Gratis"}', 'success', 'Cotización exitosa - Envío gratis por compra mayor a $15000'),
(1, 'correo_argentino', 'crear_envio', '{"pedido":"PED-20241210-000001","destinatario":"Laura Martínez"}', '{"tracking":"CA123456789AR","label_url":"https://..."}', 'success', 'Envío creado correctamente');

-- ======================================
-- 12. MENSAJE DE CONFIRMACIÓN
-- ======================================
SELECT 
    'Base de datos de ropa inicializada correctamente' as mensaje,
    (SELECT COUNT(*) FROM categorias) as categorias_creadas,
    (SELECT COUNT(*) FROM productos) as productos_creados,
    (SELECT COUNT(*) FROM variantes_producto) as variantes_creadas,
    (SELECT COUNT(*) FROM usuarios) as usuarios_creados,
    (SELECT COUNT(*) FROM cupones) as cupones_creados,
    (SELECT SUM(stock) FROM variantes_producto) as stock_total;