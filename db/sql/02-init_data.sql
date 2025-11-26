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
('REM-BAS-BLANCO', 'Remera Basica Algodon Blanca', 'Unisex', 'Remera 100% algodon, corte clasico, color blanco', 4999.00, 0.00, 0.2, 1, '/images/remera-basica-blanco.jpg', TRUE, FALSE, 'Remera Basica Blanca - Algodon Premium', 'Remera 100% algodon blanca, comoda y versatil. Perfecta para uso diario.'),
('REM-BAS-NEGRO', 'Remera Basica Algodon Negra', 'Unisex', 'Remera 100% algodon, corte clasico, color negro', 4999.00, 0.00, 0.2, 1, '/images/remera-basica-negro.jpg', TRUE, TRUE, 'Remera Basica Negra - Algodon Premium', 'Remera 100% algodon negra, comoda y versatil. Perfecta para uso diario.'),
('REM-OVR-NEGRO', 'Remera Oversized Estampada Negra', 'Unisex', 'Remera oversized con estampado urbano, 80% algodon 20% poliester, color negro', 6999.00, 15.00, 0.3, 1, '/images/remera-oversized-negro.jpg', TRUE, TRUE, 'Remera Oversized Negra - Moda Urbana', 'Remera oversized con estampados modernos. Ideal para looks casuales.'),
('REM-OVR-GRIS', 'Remera Oversized Estampada Gris', 'Unisex', 'Remera oversized con estampado urbano, 80% algodon 20% poliester, color gris', 6999.00, 15.00, 0.3, 1, '/images/remera-oversized-gris.jpg', TRUE, FALSE, 'Remera Oversized Gris - Moda Urbana', 'Remera oversized con estampados modernos. Ideal para looks casuales.'),

-- Remeras Mujer
('REM-MUJ-ROSA', 'Remera Basica Mujer Rosa', 'Mujer', 'Remera 100% algodon con calce entallado, color rosa pastel', 5499.00, 0.00, 0.2, 1, '/images/remera-mujer-rosa.jpg', TRUE, TRUE, 'Remera Mujer Rosa - Estilo Femenino', 'Remera de mujer en algodon suave, corte entallado y comodo.'),
('REM-MUJ-BLANCO', 'Remera Crop Top Blanca', 'Mujer', 'Remera crop top elastizada, ideal para verano, color blanco', 4999.00, 10.00, 0.15, 1, '/images/remera-crop-blanco.jpg', TRUE, FALSE, 'Crop Top Blanco - Verano', 'Crop top fresco y moderno, perfecto para dias calurosos.'),

-- Pantalones Unisex
('JEA-SLM-AZUL', 'Jeans Slim Fit Azul Oscuro', 'Unisex', 'Jeans slim fit elastizados, corte moderno, color azul oscuro', 12999.00, 10.00, 0.6, 2, '/images/jeans-slim-azul.jpg', FALSE, TRUE, 'Jeans Slim Fit Azul - Corte Moderno', 'Jeans slim fit con elastano para mayor comodidad. Varios talles disponibles.'),
('JEA-SLM-NEGRO', 'Jeans Slim Fit Negro', 'Unisex', 'Jeans slim fit elastizados, corte moderno, color negro', 12999.00, 10.00, 0.6, 2, '/images/jeans-slim-negro.jpg', FALSE, FALSE, 'Jeans Slim Fit Negro - Corte Moderno', 'Jeans slim fit con elastano para mayor comodidad. Varios talles disponibles.'),
('JOG-CAR-VERDE', 'Jogger Cargo Verde Militar', 'Hombre', 'Jogger cargo con bolsillos laterales, ajuste en tobillo, tejido tecnico, color verde militar', 8999.00, 0.00, 0.4, 2, '/images/jogger-cargo-verde.jpg', TRUE, FALSE, 'Jogger Cargo Verde - Estilo Urbano', 'Jogger cargo con multiples bolsillos. Perfecto para looks casuales.'),
('JOG-CAR-NEGRO', 'Jogger Cargo Negro', 'Hombre', 'Jogger cargo con bolsillos laterales, ajuste en tobillo, tejido tecnico, color negro', 8999.00, 0.00, 0.4, 2, '/images/jogger-cargo-negro.jpg', TRUE, TRUE, 'Jogger Cargo Negro - Estilo Urbano', 'Jogger cargo con multiples bolsillos. Perfecto para looks casuales.'),

-- Pantalones Mujer
('LEG-MUJ-NEGRO', 'Leggings Deportivos Negro', 'Mujer', 'Leggings elastizados de alto rendimiento, control de abdomen, color negro', 7999.00, 15.00, 0.3, 2, '/images/leggings-negro.jpg', TRUE, TRUE, 'Leggings Deportivos - Alto Rendimiento', 'Leggings con tecnologia de compresion, ideales para entrenamiento.'),
('JEA-MUJ-CELESTE', 'Jeans Mom Fit Celeste', 'Mujer', 'Jeans mom fit tiro alto, estilo vintage, color celeste', 11999.00, 0.00, 0.5, 2, '/images/jeans-mom-celeste.jpg', FALSE, TRUE, 'Jeans Mom Fit - Estilo Retro', 'Jeans con corte vintage y tiro alto, comodos y modernos.'),

-- Buzos y Sweaters
('BUZ-CAP-GRIS', 'Buzo con Capucha Gris', 'Unisex', 'Buzo con capucha, bolsillo canguro, 80% algodon 20% poliester, color gris', 14999.00, 20.00, 0.8, 3, '/images/buzo-capucha-gris.jpg', FALSE, TRUE, 'Buzo con Capucha Gris - Abrigo Casual', 'Buzo con capucha y bolsillo canguro. Ideal para dias frescos.'),
('BUZ-CAP-NEGRO', 'Buzo con Capucha Negro', 'Unisex', 'Buzo con capucha, bolsillo canguro, 80% algodon 20% poliester, color negro', 14999.00, 20.00, 0.8, 3, '/images/buzo-capucha-negro.jpg', FALSE, TRUE, 'Buzo con Capucha Negro - Abrigo Casual', 'Buzo con capucha y bolsillo canguro. Ideal para dias frescos.'),
('SWE-LAN-AZUL', 'Sweater de Lana Merino Azul', 'Unisex', 'Sweater 100% lana merino, cuello alto, abrigo natural, color azul marino', 18999.00, 0.00, 0.5, 3, '/images/sweater-lana-azul.jpg', TRUE, FALSE, 'Sweater de Lana Merino Azul - Calidad Premium', 'Sweater de lana merino, calido y suave. Perfecto para invierno.'),
('SWE-LAN-GRIS', 'Sweater de Lana Merino Gris', 'Unisex', 'Sweater 100% lana merino, cuello alto, abrigo natural, color gris', 18999.00, 0.00, 0.5, 3, '/images/sweater-lana-gris.jpg', TRUE, TRUE, 'Sweater de Lana Merino Gris - Calidad Premium', 'Sweater de lana merino, calido y suave. Perfecto para invierno.'),

-- Buzos Mujer
('BUZ-MUJ-ROSA', 'Buzo Oversize Mujer Rosa', 'Mujer', 'Buzo oversize sin capucha, tejido suave, color rosa empolvado', 13999.00, 10.00, 0.7, 3, '/images/buzo-mujer-rosa.jpg', TRUE, TRUE, 'Buzo Oversize Rosa - Comodidad y Estilo', 'Buzo amplio y comodo, perfecto para un look relajado.'),

-- Camisas
('CAM-OXF-BLANCO', 'Camisa Oxford Blanca', 'Hombre', 'Camisa de oxford 100% algodon, corte regular, color blanco', 9999.00, 5.00, 0.4, 4, '/images/camisa-oxford-blanco.jpg', FALSE, FALSE, 'Camisa Oxford Blanca - Estilo Clasico', 'Camisa de oxford 100% algodon. Formal y casual a la vez.'),
('CAM-OXF-CELESTE', 'Camisa Oxford Celeste', 'Hombre', 'Camisa de oxford 100% algodon, corte regular, color celeste', 9999.00, 5.00, 0.4, 4, '/images/camisa-oxford-celeste.jpg', FALSE, TRUE, 'Camisa Oxford Celeste - Estilo Clasico', 'Camisa de oxford 100% algodon. Formal y casual a la vez.'),
('CAM-LIN-BEIGE', 'Camisa Lino Beige', 'Unisex', 'Camisa de lino, tejido natural, ideal para verano, color beige', 11999.00, 0.00, 0.3, 4, '/images/camisa-lino-beige.jpg', TRUE, FALSE, 'Camisa de Lino Beige - Fresca y Elegante', 'Camisa de lino natural, perfecta para climas calidos. Transpirable y comoda.'),
('CAM-LIN-BLANCO', 'Camisa Lino Blanca', 'Unisex', 'Camisa de lino, tejido natural, ideal para verano, color blanco', 11999.00, 0.00, 0.3, 4, '/images/camisa-lino-blanco.jpg', TRUE, TRUE, 'Camisa de Lino Blanca - Fresca y Elegante', 'Camisa de lino natural, perfecta para climas calidos. Transpirable y comoda.'),

-- Camisas Mujer
('CAM-MUJ-RAYAS', 'Camisa Mujer Rayas Azul', 'Mujer', 'Camisa entallada con rayas verticales, color azul y blanco', 10999.00, 0.00, 0.3, 4, '/images/camisa-mujer-rayas.jpg', TRUE, FALSE, 'Camisa Rayas Mujer - Elegancia', 'Camisa de mujer con patron de rayas, corte entallado.'),

-- Abrigos
('CAM-DEN-AZUL', 'Campera Denim Azul', 'Unisex', 'Campera de jean clasica, corte regular, resistente y versatil, color azul', 19999.00, 15.00, 1.0, 5, '/images/campera-denim-azul.jpg', FALSE, TRUE, 'Campera Denim Azul - Atemporal', 'Campera de jean clasica, nunca pasa de moda. Duradera y versatil.'),
('CAM-DEN-NEGRO', 'Campera Denim Negra', 'Unisex', 'Campera de jean clasica, corte regular, resistente y versatil, color negro', 19999.00, 15.00, 1.0, 5, '/images/campera-denim-negro.jpg', FALSE, FALSE, 'Campera Denim Negra - Atemporal', 'Campera de jean clasica, nunca pasa de moda. Duradera y versatil.'),
('PAR-IMP-VERDE', 'Parka Impermeable Verde', 'Unisex', 'Parka impermeable con capucha desmontable, forro polar extraible, color verde oliva', 29999.00, 10.00, 1.2, 5, '/images/parka-impermeable-verde.jpg', TRUE, TRUE, 'Parka Impermeable Verde - Proteccion Total', 'Parka impermeable con tecnologia dry-fit. Ideal para lluvia y frio.'),
('PAR-IMP-NEGRO', 'Parka Impermeable Negra', 'Unisex', 'Parka impermeable con capucha desmontable, forro polar extraible, color negro', 29999.00, 10.00, 1.2, 5, '/images/parka-impermeable-negro.jpg', TRUE, FALSE, 'Parka Impermeable Negra - Proteccion Total', 'Parka impermeable con tecnologia dry-fit. Ideal para lluvia y frio.'),

-- Abrigos Mujer
('CAM-MUJ-CUERO', 'Campera Cuero Sintetico Marron', 'Mujer', 'Campera de cuero sintetico, corte entallado, color marron', 24999.00, 20.00, 0.9, 5, '/images/campera-cuero-marron.jpg', TRUE, TRUE, 'Campera Cuero Mujer - Elegancia', 'Campera de cuero sintetico, estilo biker, perfecta para todo el ano.'),

-- Calzado Unisex
('ZAP-URB-BLANCO', 'Zapatillas Urbanas Blancas', 'Unisex', 'Zapatillas deportivas urbanas, suela de goma, color blanco', 16999.00, 0.00, 0.8, 8, '/images/zapatillas-urbanas-blanco.jpg', TRUE, TRUE, 'Zapatillas Urbanas Blancas - Confort', 'Zapatillas comodos para uso diario, estilo deportivo.'),
('ZAP-URB-NEGRO', 'Zapatillas Urbanas Negras', 'Unisex', 'Zapatillas deportivas urbanas, suela de goma, color negro', 16999.00, 0.00, 0.8, 8, '/images/zapatillas-urbanas-negro.jpg', TRUE, TRUE, 'Zapatillas Urbanas Negras - Confort', 'Zapatillas comodos para uso diario, estilo deportivo.'),

-- Calzado Mujer
('ZAP-MUJ-ROSA', 'Zapatillas Running Mujer Rosa', 'Mujer', 'Zapatillas de running con amortiguacion, color rosa y blanco', 18999.00, 15.00, 0.7, 8, '/images/zapatillas-running-rosa.jpg', TRUE, TRUE, 'Zapatillas Running Rosa - Alto Rendimiento', 'Zapatillas de running con tecnologia de amortiguacion superior.'),
('BOT-MUJ-NEGRO', 'Botinetas Chelsea Negras', 'Mujer', 'Botinetas elasticas estilo chelsea, taco medio, color negro', 22999.00, 0.00, 0.9, 8, '/images/botinetas-chelsea-negro.jpg', FALSE, TRUE, 'Botinetas Chelsea - Elegancia', 'Botinetas versátiles, perfectas para cualquier ocasion.');

-- ======================================
-- 3. VARIANTES DE PRODUCTOS (TALLES)
-- Nota: Algunos talles tienen stock 0
-- ======================================

-- Remera Basica Blanca (ID: 1)
INSERT INTO variantes_producto (producto_id, talle, sku_variante, stock) VALUES
(1, 'XS', 'REM-BAS-BLANCO-XS', 15),
(1, 'S', 'REM-BAS-BLANCO-S', 25),
(1, 'M', 'REM-BAS-BLANCO-M', 30),
(1, 'L', 'REM-BAS-BLANCO-L', 20),
(1, 'XL', 'REM-BAS-BLANCO-XL', 0),
(1, 'XXL', 'REM-BAS-BLANCO-XXL', 5);

-- Remera Basica Negra (ID: 2)
INSERT INTO variantes_producto (producto_id, talle, sku_variante, stock) VALUES
(2, 'XS', 'REM-BAS-NEGRO-XS', 20),
(2, 'S', 'REM-BAS-NEGRO-S', 30),
(2, 'M', 'REM-BAS-NEGRO-M', 0),
(2, 'L', 'REM-BAS-NEGRO-L', 25),
(2, 'XL', 'REM-BAS-NEGRO-XL', 15),
(2, 'XXL', 'REM-BAS-NEGRO-XXL', 8);

-- Remera Oversized Negra (ID: 3)
INSERT INTO variantes_producto (producto_id, talle, sku_variante, stock) VALUES
(3, 'XS', 'REM-OVR-NEGRO-XS', 10),
(3, 'S', 'REM-OVR-NEGRO-S', 18),
(3, 'M', 'REM-OVR-NEGRO-M', 22),
(3, 'L', 'REM-OVR-NEGRO-L', 0),
(3, 'XL', 'REM-OVR-NEGRO-XL', 12),
(3, 'XXL', 'REM-OVR-NEGRO-XXL', 5);

-- Remera Oversized Gris (ID: 4)
INSERT INTO variantes_producto (producto_id, talle, sku_variante, stock) VALUES
(4, 'XS', 'REM-OVR-GRIS-XS', 8),
(4, 'S', 'REM-OVR-GRIS-S', 0),
(4, 'M', 'REM-OVR-GRIS-M', 20),
(4, 'L', 'REM-OVR-GRIS-L', 12),
(4, 'XL', 'REM-OVR-GRIS-XL', 10),
(4, 'XXL', 'REM-OVR-GRIS-XXL', 3);

-- Remera Mujer Rosa (ID: 5)
INSERT INTO variantes_producto (producto_id, talle, sku_variante, stock) VALUES
(5, 'XS', 'REM-MUJ-ROSA-XS', 15),
(5, 'S', 'REM-MUJ-ROSA-S', 20),
(5, 'M', 'REM-MUJ-ROSA-M', 18),
(5, 'L', 'REM-MUJ-ROSA-L', 0),
(5, 'XL', 'REM-MUJ-ROSA-XL', 8);

-- Crop Top Blanco (ID: 6)
INSERT INTO variantes_producto (producto_id, talle, sku_variante, stock) VALUES
(6, 'XS', 'REM-MUJ-BLANCO-XS', 12),
(6, 'S', 'REM-MUJ-BLANCO-S', 15),
(6, 'M', 'REM-MUJ-BLANCO-M', 0),
(6, 'L', 'REM-MUJ-BLANCO-L', 10),
(6, 'XL', 'REM-MUJ-BLANCO-XL', 5);

-- Jeans Slim Azul (ID: 7) - Talles numericos
INSERT INTO variantes_producto (producto_id, talle, sku_variante, stock) VALUES
(7, '36', 'JEA-SLM-AZUL-36', 8),
(7, '38', 'JEA-SLM-AZUL-38', 12),
(7, '40', 'JEA-SLM-AZUL-40', 15),
(7, '42', 'JEA-SLM-AZUL-42', 0),
(7, '44', 'JEA-SLM-AZUL-44', 10),
(7, '46', 'JEA-SLM-AZUL-46', 5),
(7, '48', 'JEA-SLM-AZUL-48', 3);

-- Jeans Slim Negro (ID: 8)
INSERT INTO variantes_producto (producto_id, talle, sku_variante, stock) VALUES
(8, '36', 'JEA-SLM-NEGRO-36', 0),
(8, '38', 'JEA-SLM-NEGRO-38', 15),
(8, '40', 'JEA-SLM-NEGRO-40', 20),
(8, '42', 'JEA-SLM-NEGRO-42', 22),
(8, '44', 'JEA-SLM-NEGRO-44', 12),
(8, '46', 'JEA-SLM-NEGRO-46', 0),
(8, '48', 'JEA-SLM-NEGRO-48', 4);

-- Jogger Cargo Verde (ID: 9)
INSERT INTO variantes_producto (producto_id, talle, sku_variante, stock) VALUES
(9, 'S', 'JOG-CAR-VERDE-S', 12),
(9, 'M', 'JOG-CAR-VERDE-M', 18),
(9, 'L', 'JOG-CAR-VERDE-L', 0),
(9, 'XL', 'JOG-CAR-VERDE-XL', 10),
(9, 'XXL', 'JOG-CAR-VERDE-XXL', 5);

-- Jogger Cargo Negro (ID: 10)
INSERT INTO variantes_producto (producto_id, talle, sku_variante, stock) VALUES
(10, 'S', 'JOG-CAR-NEGRO-S', 15),
(10, 'M', 'JOG-CAR-NEGRO-M', 20),
(10, 'L', 'JOG-CAR-NEGRO-L', 18),
(10, 'XL', 'JOG-CAR-NEGRO-XL', 0),
(10, 'XXL', 'JOG-CAR-NEGRO-XXL', 8);

-- Leggings Negro (ID: 11)
INSERT INTO variantes_producto (producto_id, talle, sku_variante, stock) VALUES
(11, '36', 'LEG-MUJ-NEGRO-36', 20),
(11, '38', 'LEG-MUJ-NEGRO-38', 25),
(11, '40', 'LEG-MUJ-NEGRO-40', 0),
(11, '42', 'LEG-MUJ-NEGRO-42', 18),
(11, '44', 'LEG-MUJ-NEGRO-44', 12),
(11, '46', 'LEG-MUJ-NEGRO-46', 8),
(11, '48', 'LEG-MUJ-NEGRO-48', 0);

-- Jeans Mom Celeste (ID: 12)
INSERT INTO variantes_producto (producto_id, talle, sku_variante, stock) VALUES
(12, '36', 'JEA-MUJ-CELESTE-36', 10),
(12, '38', 'JEA-MUJ-CELESTE-38', 15),
(12, '40', 'JEA-MUJ-CELESTE-40', 18),
(12, '42', 'JEA-MUJ-CELESTE-42', 0),
(12, '44', 'JEA-MUJ-CELESTE-44', 10),
(12, '46', 'JEA-MUJ-CELESTE-46', 5),
(12, '48', 'JEA-MUJ-CELESTE-48', 0);

-- Buzo Gris (ID: 13)
INSERT INTO variantes_producto (producto_id, talle, sku_variante, stock) VALUES
(13, 'S', 'BUZ-CAP-GRIS-S', 15),
(13, 'M', 'BUZ-CAP-GRIS-M', 22),
(13, 'L', 'BUZ-CAP-GRIS-L', 0),
(13, 'XL', 'BUZ-CAP-GRIS-XL', 10),
(13, 'XXL', 'BUZ-CAP-GRIS-XXL', 5);

-- Buzo Negro (ID: 14)
INSERT INTO variantes_producto (producto_id, talle, sku_variante, stock) VALUES
(14, 'S', 'BUZ-CAP-NEGRO-S', 18),
(14, 'M', 'BUZ-CAP-NEGRO-M', 25),
(14, 'L', 'BUZ-CAP-NEGRO-L', 22),
(14, 'XL', 'BUZ-CAP-NEGRO-XL', 0),
(14, 'XXL', 'BUZ-CAP-NEGRO-XXL', 6);

-- Sweater Azul (ID: 15)
INSERT INTO variantes_producto (producto_id, talle, sku_variante, stock) VALUES
(15, 'S', 'SWE-LAN-AZUL-S', 8),
(15, 'M', 'SWE-LAN-AZUL-M', 0),
(15, 'L', 'SWE-LAN-AZUL-L', 10),
(15, 'XL', 'SWE-LAN-AZUL-XL', 5);

-- Sweater Gris (ID: 16)
INSERT INTO variantes_producto (producto_id, talle, sku_variante, stock) VALUES
(16, 'S', 'SWE-LAN-GRIS-S', 10),
(16, 'M', 'SWE-LAN-GRIS-M', 15),
(16, 'L', 'SWE-LAN-GRIS-L', 0),
(16, 'XL', 'SWE-LAN-GRIS-XL', 6);

-- Buzo Oversize Rosa (ID: 17)
INSERT INTO variantes_producto (producto_id, talle, sku_variante, stock) VALUES
(17, 'S', 'BUZ-MUJ-ROSA-S', 12),
(17, 'M', 'BUZ-MUJ-ROSA-M', 18),
(17, 'L', 'BUZ-MUJ-ROSA-L', 15),
(17, 'XL', 'BUZ-MUJ-ROSA-XL', 0);

-- Camisa Oxford Blanca (ID: 18)
INSERT INTO variantes_producto (producto_id, talle, sku_variante, stock) VALUES
(18, 'S', 'CAM-OXF-BLANCO-S', 12),
(18, 'M', 'CAM-OXF-BLANCO-M', 0),
(18, 'L', 'CAM-OXF-BLANCO-L', 15),
(18, 'XL', 'CAM-OXF-BLANCO-XL', 8);

-- Camisa Oxford Celeste (ID: 19)
INSERT INTO variantes_producto (producto_id, talle, sku_variante, stock) VALUES
(19, 'S', 'CAM-OXF-CELESTE-S', 15),
(19, 'M', 'CAM-OXF-CELESTE-M', 20),
(19, 'L', 'CAM-OXF-CELESTE-L', 18),
(19, 'XL', 'CAM-OXF-CELESTE-XL', 0);

-- Camisa Lino Beige (ID: 20)
INSERT INTO variantes_producto (producto_id, talle, sku_variante, stock) VALUES
(20, 'S', 'CAM-LIN-BEIGE-S', 10),
(20, 'M', 'CAM-LIN-BEIGE-M', 15),
(20, 'L', 'CAM-LIN-BEIGE-L', 0),
(20, 'XL', 'CAM-LIN-BEIGE-XL', 6);

-- Camisa Lino Blanca (ID: 21)
INSERT INTO variantes_producto (producto_id, talle, sku_variante, stock) VALUES
(21, 'S', 'CAM-LIN-BLANCO-S', 12),
(21, 'M', 'CAM-LIN-BLANCO-M', 18),
(21, 'L', 'CAM-LIN-BLANCO-L', 15),
(21, 'XL', 'CAM-LIN-BLANCO-XL', 0);

-- Camisa Mujer Rayas (ID: 22)
INSERT INTO variantes_producto (producto_id, talle, sku_variante, stock) VALUES
(22, 'XS', 'CAM-MUJ-RAYAS-XS', 8),
(22, 'S', 'CAM-MUJ-RAYAS-S', 12),
(22, 'M', 'CAM-MUJ-RAYAS-M', 0),
(22, 'L', 'CAM-MUJ-RAYAS-L', 10),
(22, 'XL', 'CAM-MUJ-RAYAS-XL', 5);

-- Campera Denim Azul (ID: 23)
INSERT INTO variantes_producto (producto_id, talle, sku_variante, stock) VALUES
(23, 'S', 'CAM-DEN-AZUL-S', 8),
(23, 'M', 'CAM-DEN-AZUL-M', 12),
(23, 'L', 'CAM-DEN-AZUL-L', 0),
(23, 'XL', 'CAM-DEN-AZUL-XL', 5),
(23, 'XXL', 'CAM-DEN-AZUL-XXL', 3);

-- Campera Denim Negra (ID: 24)
INSERT INTO variantes_producto (producto_id, talle, sku_variante, stock) VALUES
(24, 'S', 'CAM-DEN-NEGRO-S', 10),
(24, 'M', 'CAM-DEN-NEGRO-M', 0),
(24, 'L', 'CAM-DEN-NEGRO-L', 12),
(24, 'XL', 'CAM-DEN-NEGRO-XL', 6),
(24, 'XXL', 'CAM-DEN-NEGRO-XXL', 4);

-- Parka Verde (ID: 25)
INSERT INTO variantes_producto (producto_id, talle, sku_variante, stock) VALUES
(25, 'S', 'PAR-IMP-VERDE-S', 5),
(25, 'M', 'PAR-IMP-VERDE-M', 8),
(25, 'L', 'PAR-IMP-VERDE-L', 10),
(25, 'XL', 'PAR-IMP-VERDE-XL', 0),
(25, 'XXL', 'PAR-IMP-VERDE-XXL', 3);

-- Parka Negra (ID: 26)
INSERT INTO variantes_producto (producto_id, talle, sku_variante, stock) VALUES
(26, 'S', 'PAR-IMP-NEGRO-S', 6),
(26, 'M', 'PAR-IMP-NEGRO-M', 10),
(26, 'L', 'PAR-IMP-NEGRO-L', 0),
(26, 'XL', 'PAR-IMP-NEGRO-XL', 8),
(26, 'XXL', 'PAR-IMP-NEGRO-XXL', 4);

-- Campera Cuero Marron (ID: 27)
INSERT INTO variantes_producto (producto_id, talle, sku_variante, stock) VALUES
(27, 'S', 'CAM-MUJ-CUERO-S', 8),
(27, 'M', 'CAM-MUJ-CUERO-M', 12),
(27, 'L', 'CAM-MUJ-CUERO-L', 10),
(27, 'XL', 'CAM-MUJ-CUERO-XL', 0);

-- Zapatillas Urbanas Blancas (ID: 28) - Talles de calzado
INSERT INTO variantes_producto (producto_id, talle, sku_variante, stock) VALUES
(28, '37', 'ZAP-URB-BLANCO-37', 5),
(28, '38', 'ZAP-URB-BLANCO-38', 8),
(28, '39', 'ZAP-URB-BLANCO-39', 12),
(28, '40', 'ZAP-URB-BLANCO-40', 15),
(28, '41', 'ZAP-URB-BLANCO-41', 18),
(28, '42', 'ZAP-URB-BLANCO-42', 0),
(28, '43', 'ZAP-URB-BLANCO-43', 10),
(28, '44', 'ZAP-URB-BLANCO-44', 8),
(28, '45', 'ZAP-URB-BLANCO-45', 0),
(28, '46', 'ZAP-URB-BLANCO-46', 3);

-- Zapatillas Urbanas Negras (ID: 29)
INSERT INTO variantes_producto (producto_id, talle, sku_variante, stock) VALUES
(29, '37', 'ZAP-URB-NEGRO-37', 6),
(29, '38', 'ZAP-URB-NEGRO-38', 10),
(29, '39', 'ZAP-URB-NEGRO-39', 15),
(29, '40', 'ZAP-URB-NEGRO-40', 18),
(29, '41', 'ZAP-URB-NEGRO-41', 20),
(29, '42', 'ZAP-URB-NEGRO-42', 22),
(29, '43', 'ZAP-URB-NEGRO-43', 0),
(29, '44', 'ZAP-URB-NEGRO-44', 10),
(29, '45', 'ZAP-URB-NEGRO-45', 5),
(29, '46', 'ZAP-URB-NEGRO-46', 0);

-- Zapatillas Running Rosa (ID: 30)
INSERT INTO variantes_producto (producto_id, talle, sku_variante, stock) VALUES
(30, '37', 'ZAP-MUJ-ROSA-37', 12),
(30, '38', 'ZAP-MUJ-ROSA-38', 15),
(30, '39', 'ZAP-MUJ-ROSA-39', 18),
(30, '40', 'ZAP-MUJ-ROSA-40', 0),
(30, '41', 'ZAP-MUJ-ROSA-41', 10),
(30, '42', 'ZAP-MUJ-ROSA-42', 8),
(30, '43', 'ZAP-MUJ-ROSA-43', 0),
(30, '44', 'ZAP-MUJ-ROSA-44', 3),
(30, '45', 'ZAP-MUJ-ROSA-45', 0),
(30, '46', 'ZAP-MUJ-ROSA-46', 0);

-- Botinetas Chelsea Negras (ID: 31)
INSERT INTO variantes_producto (producto_id, talle, sku_variante, stock) VALUES
(31, '37', 'BOT-MUJ-NEGRO-37', 8),
(31, '38', 'BOT-MUJ-NEGRO-38', 12),
(31, '39', 'BOT-MUJ-NEGRO-39', 15),
(31, '40', 'BOT-MUJ-NEGRO-40', 18),
(31, '41', 'BOT-MUJ-NEGRO-41', 0),
(31, '42', 'BOT-MUJ-NEGRO-42', 10),
(31, '43', 'BOT-MUJ-NEGRO-43', 0),
(31, '44', 'BOT-MUJ-NEGRO-44', 5),
(31, '45', 'BOT-MUJ-NEGRO-45', 0),
(31, '46', 'BOT-MUJ-NEGRO-46', 0);

-- ======================================
-- 4. IMAGENES ADICIONALES PARA PRODUCTOS
-- ======================================
INSERT INTO producto_imagenes (producto_id, imagen, alt_text, orden) VALUES
-- Remera Basica Negra
(2, '/images/remera-basica-negro-2.jpg', 'Remera basica negra vista lateral', 1),
(2, '/images/remera-basica-negro-3.jpg', 'Remera basica negra detalle tejido', 2),

-- Jeans Slim Azul
(7, '/images/jeans-slim-azul-2.jpg', 'Jeans slim fit azul vista trasera', 1),
(7, '/images/jeans-slim-azul-3.jpg', 'Jeans slim fit azul detalle bolsillos', 2),

-- Buzo Negro
(14, '/images/buzo-capucha-negro-2.jpg', 'Buzo con capucha negro vista trasera', 1),
(14, '/images/buzo-capucha-negro-3.jpg', 'Buzo con capucha negro detalle bolsillo', 2),

-- Camisa Oxford Celeste
(19, '/images/camisa-oxford-celeste-2.jpg', 'Camisa oxford celeste vista trasera', 1),
(19, '/images/camisa-oxford-celeste-3.jpg', 'Camisa oxford celeste detalle botones', 2),

-- Campera Denim Azul
(23, '/images/campera-denim-azul-2.jpg', 'Campera denim azul vista interior', 1),
(23, '/images/campera-denim-azul-3.jpg', 'Campera denim azul detalle cierre', 2),

-- Zapatillas Running Rosa
(30, '/images/zapatillas-running-rosa-2.jpg', 'Zapatillas running rosa vista lateral', 1),
(30, '/images/zapatillas-running-rosa-3.jpg', 'Zapatillas running rosa detalle suela', 2);

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

-- Detalles del pedido (USA VARIANTE_ID)
INSERT INTO detalles_pedido (pedido_id, variante_id, sku_variante, nombre_producto, talle, cantidad, precio_unitario, descuento_aplicado) VALUES
(1, 66, 'BUZ-CAP-GRIS-M', 'Buzo con Capucha Gris', 'M', 1, 14999.00, 20.00),
(1, 30, 'JEA-SLM-AZUL-40', 'Jeans Slim Fit Azul Oscuro', '40', 1, 12999.00, 10.00),
(1, 10, 'REM-BAS-NEGRO-L', 'Remera Basica Algodon Negra', 'L', 2, 4999.00, 0.00);

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
(3, 15, 2),   -- Carlos tiene 2 Remeras Oversized Negras Talle S
(3, 76, 1),   -- Carlos tiene 1 Sweater Azul Talle S
(4, 120, 1),  -- Sofia tiene 1 Campera Denim Azul Talle S
(4, 10, 1),   -- Sofia tiene 1 Remera Basica Negra Talle L
(5, 25, 1),   -- Ana tiene 1 Remera Mujer Rosa Talle S
(5, 155, 1);  -- Ana tiene 1 Zapatillas Running Rosa Talle 39

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