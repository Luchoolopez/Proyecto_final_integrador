import apiClient from "./apiClient";

interface UploadResponse {
    success: boolean;
    message: string;
    imageUrl: string;
    public_id: string;
}

export const uploadService = {
    uploadImage: async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append('image', file);

        const response = await apiClient.post<UploadResponse>('/upload', formData, {
            headers: {
                // IMPORTANTE: Seteamos undefined para que el navegador 
                // detecte automáticamente el boundary del multipart/form-data
                'Content-Type': undefined 
            },
        });

        return response.data.imageUrl;
    }
};