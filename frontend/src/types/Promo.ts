export interface Coupon {
  id: number;
  codigo: string;
  descripcion?: string;
  tipo: 'porcentaje' | 'monto_fijo';
  valor: number;
  monto_minimo: number;
  usos_maximos: number | null;
  usos_actuales: number;
  limite_uso_por_usuario: number;
  fecha_inicio: string;
  fecha_fin: string;
  activo: boolean;
}

export interface CartTotals {
  subtotal: number;
  descuentoPromociones: number;
  descuentoCupon: number;
  totalFinal: number;
}
