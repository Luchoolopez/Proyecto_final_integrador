import axios from "axios";
import type { LoginData, RegisterData, AuthResponse } from "../types/user";

const API_URL = "http://localhost:3000/api";

export const authService = {
    async login(credentials: LoginData): Promise<AuthResponse> {
        const response = await axios.post(`${API_URL}/auth/login`, credentials);
        return response.data;
    },

    async register(credentials: RegisterData): Promise<void> {
        const response = await axios.post(`${API_URL}/auth/register`, credentials);
        return response.data;
    }
}
