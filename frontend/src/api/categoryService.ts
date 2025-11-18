import apiClient from "./apiClient";

export interface Category {
  id: number;
  nombre: string;
  descripcion?: string;
  activo: boolean;
}

interface CategoryFilters {
  active?: boolean;
  genero?: string | string[];
  con_descuento?: boolean;
}

export const categoryService = {
  // GET /api/category
  getCategories: async (filters: CategoryFilters = { active: true }): Promise<Category[]> => {
        const params = {
        active: filters.active !== false, 
        ...filters
    };
    
    if (filters.active === false) {
        delete params.active;
    }

    const response = await apiClient.get("/category", { 
      params,
      paramsSerializer: {
        indexes: null 
      }
    });
    return response.data.data;
  },
};