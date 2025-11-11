import apiClient from "./apiClient";
import { type Product } from '../types/Product';
import { type Variant } from '../types/Variant';

// 1. Creamos una interfaz 'base' para el item del carrito
export interface CartItemBase {
  product: Pick<Product, 'id' | 'nombre' | 'imagen_principal' | 'precio_final' | 'descuento' | 'precio_base'>;
  variant: Pick<Variant, 'id' | 'talle' | 'stock'>;
  quantity: number;
}

// 2. El 'CartItem' de la API (backend) tiene un ID de carrito
export interface ApiCartItem {
  id: number; // ID del item en la tabla 'carritos'
  cantidad: number;
  variante_id: number;
  usuario_id: number;
  variante: {
    id: number;
    talle: string;
    stock: number; // Asumimos que el backend lo incluye
    producto: {
      id: number;
      nombre: string;
      imagen_principal: string;
      precio_base: number;
      descuento: number;
      precio_final: number; 
    }
  }
}

// 3. El 'CartItem' del Frontend (local) será nuestra interfaz base
export type CartItem = CartItemBase;


interface AddToCartPayload {
  variante_id: number;
  cantidad: number;
}


interface UpdateCartPayload {
  cantidad: number; 
}

export const cartService = {
  // GET /api/cart - Devuelve el tipo de la API
  getCart: async (): Promise<ApiCartItem[]> => {
    const response = await apiClient.get("/cart");
    return response.data.data;
  }, 

  // POST /api/cart/add - Devuelve el tipo de la API
  addToCart: async (payload: AddToCartPayload): Promise<ApiCartItem> => {
    const response = await apiClient.post("/cart/add", payload);
    return response.data.data;
  }, 
  
  // PUT /api/cart/:id - Devuelve el tipo de la API
  updateQuantity: async (
    cartItemId: number,
    newQuantity: number
  ): Promise<ApiCartItem> => {
    const payload: UpdateCartPayload = { cantidad: newQuantity }; // Corregido a 'cantidad'
    const response = await apiClient.put(`/cart/${cartItemId}`, payload);
    return response.data.data;
  }, 
  
  // DELETE /api/cart/:id
  removeFromCart: async (cartItemId: number): Promise<void> => {
    await apiClient.delete(`/cart/${cartItemId}`);
  }, 

  // DELETE /api/cart
  clearCart: async (): Promise<void> => {
    await apiClient.delete("/cart");
  },
};