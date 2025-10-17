export interface ProductImage{
    id:number;
    imagen:string;
    alt_text?:string;
}

export interface Product{
    id:number;
    sku?:string;
    nombre:string;
    descripcion?:string;
    precio_original:number;
    precio_final:number;
    descuento_porcentaje:number;
    stock:number;
    imagen_principal:string;
    imagenes: ProductImage[];
    info_cuotas?:string;
}