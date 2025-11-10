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

interface ProductApiParams {
  orderBy?: string;
  orderDir?: 'ASC' | 'DESC';
  talles?: string[];  
  precio_min?: number;
  precio_max?: number;
}

export interface ProductFilters {
  sort: string;
  talles: string[];
  precio: {
    min: number | undefined;
    max: number | undefined;
  }
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
    };

    const response = await axios.get(API_URL, { params });
    return response.data;
  },

  async getProductById(id: string): Promise<Product> {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  }
};