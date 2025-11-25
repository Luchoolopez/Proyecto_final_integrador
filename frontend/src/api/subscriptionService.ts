import apiClient from "./apiClient"; 
import type { Subscription, SendNewsletterDto, NewsletterResponse } from "../types/subscription";

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

export const subscriptionService = {
    
    async subscribe(email: string): Promise<Subscription> {
        const response = await apiClient.post<ApiResponse<Subscription>>('/subscription/subscribe', { email });
        return response.data.data; 
    },

    async unsubscribe(email: string): Promise<boolean> {
        const response = await apiClient.post<ApiResponse<null>>('/subscription/unsubscribe', { email });
        return response.data.success;
    },

    async sendNewsletter(data: SendNewsletterDto): Promise<NewsletterResponse> {
        const response = await apiClient.post<NewsletterResponse>('/subscription/send', data);
        return response.data; 
    }
};