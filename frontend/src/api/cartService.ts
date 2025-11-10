import apiClient from "./apiClient";

export interface CartItem {
  id: number; 
  cantidad: number;
  variante_id: number;
  usuario_id: number; 
  variante: {
    id: number;
    talle: string;
    producto: {
      id: number;
      nombre: string;
      imagen_principal: string;
      precio_base: number;
      descuento: number;
      precio_final: number; 
    };
  };
}

interface AddToCartPayload {
  variante_id: number;
  cantidad: number;
}

interface UpdateCartPayload {
  cantidad: number; 
}

export const cartService = {
  // GET /api/cart
  getCart: async (): Promise<CartItem[]> => {
    const response = await apiClient.get("/cart");
    return response.data.data;
  }, 

  // POST /api/cart/add
  addToCart: async (payload: AddToCartPayload): Promise<CartItem> => {
    const response = await apiClient.post("/cart/add", payload);
    return response.data.data;
  }, 
  
  // PUT /api/cart/:id
  updateQuantity: async (
    cartItemId: number,
    newQuantity: number
  ): Promise<CartItem> => {
    const payload: UpdateCartPayload = { cantidad: newQuantity };
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