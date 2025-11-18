import apiClient from "./apiClient";
import type { LoginData, RegisterData, AuthData, ApiResponse } from "../types/user";

export const authService = {
    async login(credentials: LoginData): Promise<AuthData> {
        const response = await apiClient.post('/auth/login', credentials);
        return response.data.data;
    },

    async register(credentials: RegisterData): Promise<ApiResponse<null>> {
        const response = await apiClient.post('/auth/register', credentials);
        return response.data;
    }
}
