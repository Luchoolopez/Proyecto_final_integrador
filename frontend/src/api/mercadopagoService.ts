import apiClient from './apiClient';

export interface MercadoPagoStatus {
  connected: boolean;
  config?: {
    user_id: string;
    connected_at: string;
    expires_at: string;
  } | null;
}

export const mercadopagoService = {
  /**
   * Solicita al backend la URL de autorización de Mercado Pago.
   * El backend verificará que el admin esté logueado.
   */
  connect: async (): Promise<{ authUrl: string }> => {
    const response = await apiClient.get('/mercadopago/connect');
    return response.data;
  },

  /**
   * Consulta si ya hay una cuenta de Mercado Pago vinculada.
   */
  getStatus: async (): Promise<MercadoPagoStatus> => {
    const response = await apiClient.get('/mercadopago/status');
    return response.data;
  }
};
