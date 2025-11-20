export const ORDER_STATUS = {
  PENDIENTE: 'pendiente',
  CONFIRMADO: 'confirmado',
  ARMANDO: 'armando',
  ENVIADO: 'enviado',
  ENTREGADO: 'entregado',
  CANCELADO: 'cancelado',
} as const;

export const SHIPPING_PROVIDERS = {
  ANDREANI: 'andreani',
  CORREO_ARGENTINO: 'correo_argentino',
} as const;

export const ORDER_STATUS_VALUES = Object.values(ORDER_STATUS) as [string, ...string[]];
export const SHIPPING_PROVIDER_VALUES = Object.values(SHIPPING_PROVIDERS) as [string, ...string[]];

export const ERROR_MESSAGES = {
    CREATE_ORDER_ERROR: 'Error al crear el pedido.',
    CART_EMPTY: 'El carrito está vacío. No se puede crear el pedido.',
    ADDRESS_NOT_FOUND: 'La dirección de envío no es válida o no pertenece al usuario.',
    ITEM_INVALID: 'Un item en el carrito es inválido.',
    INSUFFICIENT_STOCK: 'Stock insuficiente para realizar el pedido.',
    ORDER_NOT_FOUND: 'Pedido no encontrado o no pertenece al usuario.',
    GET_ORDERS_ERROR: 'Error al obtener los pedidos del usuario.',
};