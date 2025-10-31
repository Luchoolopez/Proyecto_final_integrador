// src/data/mockProducts.ts

import { type Product } from "../types/Product";

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    nombre: "Buzo Torn",
    imagen_principal: "/cards/card_1.jpeg", 
    precio_original: 129990,
    precio_final: 109990,
    descuento_porcentaje: 15,
    stock: 10,
    imagenes: [], 
    info_cuotas: "6 cuotas sin interés de $18.331,67",
    sku: "FLOYD-BUZ-TRN-BLK"
  },
  {
    id: 2,
    nombre: "Remera Floyd Style Classic",
    imagen_principal: "/cards/card_2.jpeg", 
    precio_original: 60000,
    precio_final: 60000,
    descuento_porcentaje: 0, // Producto sin descuento
    stock: 25,
    imagenes: [],
    info_cuotas: "3 cuotas sin interés de $20.000,00",
    sku: "FLOYD-REM-CLS-WHT"
  },
  {
    id: 3,
    nombre: "Jean Classic Blue",
    imagen_principal: "/cards/card_3.jpeg", 
    precio_original: 95000,
    precio_final: 80750,
    descuento_porcentaje: 15,
    stock: 15,
    imagenes: [],
    info_cuotas: "6 cuotas sin interés de $13.458,33",
    sku: "FLOYD-JEA-CLS-BLU"
  }
];