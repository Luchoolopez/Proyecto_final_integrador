import apiClient from './apiClient';

export const promotionService = {
    getAll: async () => await apiClient.get('/promotions'),
    create: async (data: any) => await apiClient.post('/promotions', data),
    toggleStatus: async (id: number) => await apiClient.patch(`/promotions/${id}/status`),
    delete: async (id: number) => await apiClient.delete(`/promotions/${id}`),
};
