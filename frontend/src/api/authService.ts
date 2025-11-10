import axios from "axios";
import type { LoginData, RegisterData, AuthResponse } from "../types/user";

const API_URL = "http://localhost:3000/api";

axios.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if(token){
        config.headers.Authorization = `Bearer ${token}`
    }
    return config;
});

export const authService = {
    async login(credentials: LoginData): Promise<AuthResponse> {
        const response = await axios.post(`${API_URL}/auth/login`, credentials);
        return response.data.data;
    },

    async register(credentials: RegisterData): Promise<void> {
        const response = await axios.post(`${API_URL}/auth/register`, credentials);
        return response.data;
    }
}
