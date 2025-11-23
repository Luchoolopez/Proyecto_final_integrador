import apiClient from "./apiClient";
import type { Address } from "../types/Address";
import type { ApiResponse } from "../types/user";

export const addressService = {
    async getAddresses(): Promise<Address[]> {
        const response = await apiClient.get<ApiResponse<Address[]>>('/address');
        return response.data.data;
    },

    async getAddressById(id: string): Promise<Address> {
        const response = await apiClient.get<ApiResponse<Address>>(`/address/${id}`);
        return response.data.data; 
    },

    async createAddress(data: Partial<Address>): Promise<Address> {
        const response = await apiClient.post<ApiResponse<Address>>('/address', data);
        return response.data.data;
    },

    async updateAddress(id: number, data: Partial<Address>): Promise<Address> {
        const response = await apiClient.put<ApiResponse<Address>>(`/address/${id}`, data);
        return response.data.data;
    }
};