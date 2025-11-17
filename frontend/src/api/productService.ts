import axios from "axios";
import { type Product } from "../types/Product";

const API_URL = "http://localhost:3000/api/product";

interface GetProductsResponse {
  productos: Product[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

type GeneroFilter = 'Hombre' | 'Mujer' | 'Unisex';

interface ProductApiParams {
  orderBy?: string;
  orderDir?: 'ASC' | 'DESC';
  talles?: string[];  
  precio_min?: number;
  precio_max?: number;
  categoria_id?: number;
  con_descuento?: boolean;
  genero?: GeneroFilter | GeneroFilter[];
}

export interface ProductFilters {
  sort: string;
  talles: string[];
  precio: {
    min: number | undefined;
    max: number | undefined;
  };
  categoria_id: number | undefined;
  con_descuento?: boolean | undefined;
  genero?: GeneroFilter | GeneroFilter[] | undefined;

}

export const productService = {
  
  async getProducts(filters: ProductFilters): Promise<GetProductsResponse> {
    
    const [orderBy, orderDir] = filters.sort.split(',');
    
    const params: ProductApiParams = {
      orderBy,
      orderDir: orderDir as 'ASC' | 'DESC',
      ...(filters.talles.length > 0 && { talles: filters.talles }),
      ...(filters.precio.min !== undefined && { precio_min: filters.precio.min }),
      ...(filters.precio.max !== undefined && { precio_max: filters.precio.max }),
      ...(filters.categoria_id !== undefined && { categoria_id: filters.categoria_id }),
      ...(filters.con_descuento === true && { con_descuento: true }),
      ...(filters.genero && { genero: filters.genero }),
    };

    const response = await axios.get(API_URL, { params });
    return response.data;
  },

  async getProductById(id: string): Promise<Product> {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  }
};