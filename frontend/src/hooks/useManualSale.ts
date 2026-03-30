import { useState } from 'react';
import { orderService } from '../api/orderService';

export function useManualSale() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createManualSale = async (payload: { usuario_id: number; items: { variante_id: number; cantidad: number }[]; notas?: string }) => {
    setLoading(true);
    setError(null);
    try {
      const res = await orderService.createManualSale(payload);
      setLoading(false);
      return res;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Error creando venta manual');
      setLoading(false);
      throw err;
    }
  };

  return { createManualSale, loading, error };
}
