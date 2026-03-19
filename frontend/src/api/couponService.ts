import apiClient from './apiClient';
import type { Coupon } from '../types/Promo';

export const couponService = {
    getAll: async () => await apiClient.get('/coupons'),
    create: async (data: Partial<Coupon>) => await apiClient.post('/coupons', data),
    update: async (id: number, data: Partial<Coupon>) => await apiClient.put(`/coupons/${id}`, data),
    delete: async (id: number) => await apiClient.delete(`/coupons/${id}`),
};
