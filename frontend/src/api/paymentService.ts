import apiClient from './apiClient';

export interface CheckoutPayload {
  direccion_id: number;
  notas?: string;
  shipping_provider?: string;
  shipping_service?: string;
}

export interface CheckoutResponse {
  order: any;
  checkoutUrl: string;
  preferenceId: string;
}

export const paymentService = {
  createCheckout: async (payload: CheckoutPayload): Promise<CheckoutResponse> => {
    const response = await apiClient.post('/payment/checkout', payload);
    return response.data.data;
  }
};
