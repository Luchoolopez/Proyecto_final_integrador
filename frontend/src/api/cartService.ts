// frontend/src/api/cartService.ts
import apiClient from './apiClient';

// (Opcional pero recomendado) Define los tipos que esperas del backend
export interface CartItem {
    id: number; // Este es el ID de la fila en la tabla 'carritos'
    cantidad: number;
    variante_id: number;
    usuario_id: number;
    // Estos vendrán de la consulta del backend (include)
    variante: {
        id: number;
        talle: string;
        producto: {
            id: number;
            nombre: string;
            imagen_principal: string;
            precio_base: number;
            descuento: number;
            // ...y la función getPrecioFinal() que definiste en el modelo
            precio_final: number; 
        }
    }
}

interface AddToCartPayload {
    variante_id: number;
    cantidad: number;
}

interface UpdateCartPayload {
    nueva_cantidad: number;
}

export const cartService = {
    // GET /api/cart
    getCart: async (): Promise<CartItem[]> => {
        const response = await apiClient.get('/cart');
        return response.data.data; // Tu backend lo devuelve en { success: true, data: [...] }
    },

    // POST /api/cart/add
    addToCart: async (payload: AddToCartPayload): Promise<CartItem> => {
        const response = await apiClient.post('/cart/add', payload);
        return response.data.data;
    },

    // PUT /api/cart/:id
    updateQuantity: async (cartItemId: number, newQuantity: number): Promise<CartItem> => {
        const payload: UpdateCartPayload = { nueva_cantidad: newQuantity };
        const response = await apiClient.put(`/cart/${cartItemId}`, payload);
        return response.data.data;
    },

    // DELETE /api/cart/:id
    removeFromCart: async (cartItemId: number): Promise<void> => {
        await apiClient.delete(`/cart/${cartItemId}`);
    },

    // DELETE /api/cart
    clearCart: async (): Promise<void> => {
        await apiClient.delete('/cart');
    }
};