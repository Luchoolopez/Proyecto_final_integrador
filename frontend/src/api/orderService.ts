import apiClient from "./apiClient";

export interface OrderDetail {
    id: number;
    nombre_producto: string;
    talle: string;
    cantidad: number;
    precio_unitario: number;
    sku_variante?: string;
}

export interface Order {
    id: number;
    numero_pedido: string;
    fecha: string;
    total: string;
    estado: 'pendiente' | 'confirmado' | 'armando' | 'enviado' | 'entregado' | 'cancelado';
    shipping_provider?: string;
    tracking_number?: string;
    usuario?: {
        id: number;
        nombre: string;
        email: string;
    };
    direccion?: {
        calle: string;
        numero: string;
        ciudad: string;
        codigo_postal: string;
        provincia: string;
    };
    detalles: OrderDetail[];
}

export interface CreateOrderPayload {
    direccion_id: number;
    notas?: string;
    shipping_provider?: string;
    shipping_service?: string;
}

export const orderService = {
    
    getAllOrders: async (params?: any) => {
        const response = await apiClient.get('/order/admin', { params });
        return response.data.data;
    },

    updateOrderStatus: async (id: number, data: { estado: string; tracking_number?: string; shipping_provider?: string }) => {
        const response = await apiClient.patch(`/order/admin/${id}`, data);
        return response.data.data;
    },

    
    createOrder: async (data: CreateOrderPayload) => {
        const response = await apiClient.post('/order', data);
        return response.data;
    },

    
    getMyOrders: async () => {
        const response = await apiClient.get('/order'); 
        return response.data.data; 
    }
};