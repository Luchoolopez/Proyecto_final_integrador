export interface Product {
    id: number,
    sku: string,
    nombre: string,
    descripcion?: string;
    precio: number;
    descuento?: number;
    stock: number;
    peso?: number;
    categoria_id?: number;
    imagen_principal?: string;
    meta_title?: string;
    meta_description?: string;
    activo?: boolean;
    fecha_creacion?: Date;
    fecha_actualizacion?: Date;
}