import apiClient from "./apiClient";
import type {User, ApiResponse} from "../types/user";

type UpdateUserDto = Partial<User>;

export const userService = {
    async updateUser(id:number, data:UpdateUserDto): Promise<User> {
        const response = await apiClient.patch<ApiResponse<User>>(`/user/${id}`, data);
        return response.data.data;
    },

    async getUserById(id:number):Promise<User>{
        const response = await apiClient.get<ApiResponse<User>>(`/user/${id}`);
        return response.data.data;
    }
};