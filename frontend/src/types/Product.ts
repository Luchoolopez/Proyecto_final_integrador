import { type Variant } from './Variant'; 

export interface ProductImage {
  id: number;
  imagen: string;
  alt_text?: string;
}

export interface Product {
  id: number;
  sku?: string;
  nombre: string;
  descripcion?: string;
  precio_base: number; 
  descuento: number;
  precio_final: number;
  stock_total: number;
  imagen_principal: string;
  
  variantes: Variant[];
  imagenes: ProductImage[];
  
  categoria?: {
    nombre: string;
  };
}