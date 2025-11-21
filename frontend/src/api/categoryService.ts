import apiClient from "./apiClient";

export interface Category {
  id: number;
  nombre: string;
  descripcion?: string;
  activo: boolean;
}

// DTO para crear/editar (sin ID)
export interface CategoryFormData {
  nombre: string;
  descripcion?: string;
  activo?: boolean;
}

interface CategoryFilters {
  active?: boolean;
  genero?: string | string[];
  con_descuento?: boolean;
}

export const categoryService = {
  // GET /api/category (Listar)
  getCategories: async (filters: CategoryFilters = { active: true }): Promise<Category[]> => {
    const params: any = { ...filters };
    
    // Si active es false o undefined en el filtro admin, queremos ver TODAS (incluso inactivas)
    // Tu backend filtra por activo=true si no se especifica lo contrario, 
    // así que para el admin quizás quieras enviar active='false' o manejarlo diferente.
    if (filters.active === undefined) {
         delete params.active; // Para que el backend decida o traiga todo
    }

    const response = await apiClient.get("/category", { 
      params,
      paramsSerializer: { indexes: null }
    });
    return response.data.data;
  },

  // GET /api/category/:id (Obtener una por ID)
  getCategoryById: async (id: number): Promise<Category> => {
    const response = await apiClient.get(`/category/${id}`);
    return response.data.data;
  },

  // POST /api/category (Crear)
  createCategory: async (data: CategoryFormData): Promise<Category> => {
    const response = await apiClient.post("/category", data);
    return response.data.data;
  },

  // PUT /api/category/:id (Actualizar)
  updateCategory: async (id: number, data: Partial<CategoryFormData>): Promise<Category> => {
    const response = await apiClient.put(`/category/${id}`, data);
    return response.data.data;
  },

  // DELETE /api/category/:id (Eliminar)
  deleteCategory: async (id: number): Promise<void> => {
    await apiClient.delete(`/category/${id}`);
  }
};