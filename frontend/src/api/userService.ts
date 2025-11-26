import apiClient from "./apiClient";
import type { User, ApiResponse } from "../types/user";

type UpdateUserDto = Partial<User>;
export interface UserFilters {
    page?: number;
    limit?: number;
    search?: string;
    rol?: 'usuario' | 'admin';
    active?: boolean; 
}

interface GetUsersResponse {
    users: User[];
    total: number;
    totalPages: number;
    currentPage: number;
}

export const userService = {
    async getUsers(params: UserFilters = {}): Promise<GetUsersResponse> {
        const queryParams: any = { ...params };
        if (params.active !== undefined) {
            queryParams.active = params.active.toString();
        }
        
        const response = await apiClient.get<ApiResponse<GetUsersResponse>>('/user', { params: queryParams });
        return response.data.data;
    },

    async updateUser(id: number, data: UpdateUserDto): Promise<User> {
        const response = await apiClient.patch<ApiResponse<User>>(`/user/${id}`, data);
        return response.data.data;
    },

    async getUserById(id: number): Promise<User> {
        const response = await apiClient.get<ApiResponse<User>>(`/user/${id}`);
        return response.data.data;
    }
};