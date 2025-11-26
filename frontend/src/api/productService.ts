import apiClient from "./apiClient";
import { type Product } from "../types/Product";

interface GetProductsResponse {
  productos: Product[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ProductFilters {
  sort?: string;
  talles?: string[];
  precio?: {
    min: number | undefined;
    max: number | undefined;
  };
  categoria_id?: number;
  con_descuento?: boolean;
  genero?: string | string[];
  active?: boolean;
  busqueda?: string;
  limit?: number;
  es_nuevo?: boolean;     // <--- Agregado
  es_destacado?: boolean; // <--- Agregado
}

export interface ProductFormData {
  producto: {
    nombre: string;
    descripcion?: string;
    precio_base: number;
    descuento?: number;
    categoria_id?: number;
    genero?: 'Hombre' | 'Mujer' | 'Unisex';
    es_nuevo?: boolean;
    es_destacado?: boolean;
    activo?: boolean;
    imagen_principal?: string;
  };
  variantes: Array<{
    id?: number;
    talle: string;
    stock: number;
    sku_variante?: string;
    activo?: boolean;
  }>;
  imagenes: string[];
}

export const productService = {
  
  async getProducts(filters: ProductFilters): Promise<GetProductsResponse> {
    const [orderBy, orderDir] = filters.sort ? filters.sort.split(',') : ['fecha_creacion', 'DESC'];
    
    const params: any = {
      orderBy,
      orderDir,
      limit: filters.limit || 20,
      ...(filters.talles?.length && { talles: filters.talles }),
      ...(filters.precio?.min !== undefined && { precio_min: filters.precio.min }),
      ...(filters.precio?.max !== undefined && { precio_max: filters.precio.max }),
      ...(filters.categoria_id !== undefined && { categoria_id: filters.categoria_id }),
      ...(filters.con_descuento === true && { con_descuento: true }),
      ...(filters.genero && { genero: filters.genero }),
      ...(filters.busqueda && { busqueda: filters.busqueda }),
      ...(filters.active !== undefined ? { activo: filters.active } : {}),
      // Mapeamos los nuevos filtros para que se envíen a la API
      ...(filters.es_nuevo !== undefined ? { es_nuevo: filters.es_nuevo } : {}),
      ...(filters.es_destacado !== undefined ? { es_destacado: filters.es_destacado } : {})
    };

    if (filters.active === false) {
        params.activo = 'false';
    }

    const response = await apiClient.get("/product", { 
      params,
      paramsSerializer: { indexes: null }
    });
    
    return response.data;
  },

  async getProductById(id: string | number): Promise<Product> {
    const response = await apiClient.get(`/product/${id}`);
    return response.data;
  },

  async createProduct(data: ProductFormData): Promise<Product> {
    const response = await apiClient.post("/product", data);
    return response.data;
  },

  async updateProduct(id: number, data: Partial<ProductFormData['producto']>): Promise<Product> {
      const response = await apiClient.put(`/product/${id}`, data);
      return response.data;
  },

  async deleteProduct(id: number): Promise<void> {
    await apiClient.delete(`/product/${id}`);
  },
  
  async createVariant(data: { producto_id: number; talle: string; stock: number }): Promise<any> {
      const response = await apiClient.post("/product/variants", data);
      return response.data;
  },

  async updateVariant(id: number, data: { talle?: string; stock?: number; activo?: boolean }): Promise<any> {
      const response = await apiClient.put(`/product/variants/${id}`, data);
      return response.data;
  },

  async deleteVariant(id: number): Promise<void> {
      await apiClient.delete(`/product/variants/${id}`);
  }
};