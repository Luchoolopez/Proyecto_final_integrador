import apiClient from "./apiClient";

export interface Category {
  id: number;
  nombre: string;
  descripcion?: string;
  activo: boolean;
}

export const categoryService = {
  // GET /api/category
  getCategories: async (): Promise<Category[]> => {
    // le pedimos solo las categorias activas
    const response = await apiClient.get("/category", { params: { active: 'true' } });
    return response.data.data;
  },
};