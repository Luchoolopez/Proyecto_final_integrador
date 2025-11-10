// Convierte un número a un string de moneda en formato ARS.

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0, // Sin decimales
  }).format(price);
};