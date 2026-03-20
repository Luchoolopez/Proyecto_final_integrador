import MercadoPagoConfig from "mercadopago";

const accessToken = process.env.MP_ACCESS_TOKEN;

// Exportamos un cliente global opcional (por si lo necesitas usar a nivel plataforma/sandbox).
// Para las compras, los tokens se instancian on-the-fly desde la BD.
export const client = accessToken ? new MercadoPagoConfig({ accessToken }) : null;