import apiClient from './apiClient';

export interface CarouselImage {
    id: number;
    imagen: string; // Una sola imagen
    alt_text?: string;
    orden: number;
    activo: boolean;
}

export const carouselService = {
    getAllAdmin: async (): Promise<CarouselImage[]> => {
        const response = await apiClient.get<CarouselImage[]>('/carousel/admin');
        return response.data;
    },

    getActive: async (): Promise<CarouselImage[]> => {
        const response = await apiClient.get<CarouselImage[]>('/carousel');
        return response.data;
    },

    // Enviamos solo 1 archivo (file)
    upload: async (file: File, altText: string = '', orden: number = 0): Promise<CarouselImage> => {
        const formData = new FormData();
        formData.append('imagen', file);
        formData.append('alt_text', altText);
        formData.append('orden', orden.toString());

        const response = await apiClient.post<CarouselImage>('/carousel', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },

    delete: async (id: number): Promise<{ success: boolean; message: string }> => {
        const response = await apiClient.delete(`/carousel/${id}`);
        return response.data;
    }
};
