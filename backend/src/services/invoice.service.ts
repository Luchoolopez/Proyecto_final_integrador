import PDFDocument from 'pdfkit-table';
import { Order } from '../models/order.model';

export class InvoiceService {
    
    async generateInvoice(order: any, res: any): Promise<void> {
        const doc = new PDFDocument({ margin: 30, size: 'A4' });

        // Configurar headers para descarga
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=factura-${order.numero_pedido}.pdf`);

        doc.pipe(res);

        // --- DATOS DE LA TIENDA (Hardcodeados) ---
        const storeName = 'Forme Sneakers';
        // Reemplaza estos valores con los datos reales de la tienda
        const storeAddress = 'Calle San Martín 384, Bahía Blanca, Provincia de Buenos Aires'; 
        const storePhone = '+54 291 5091352';


        // --- ENCABEZADO ---
        doc.fontSize(20).text(storeName, { align: 'center' });
        doc.moveDown();

        // Datos de la Empresa
        doc.fontSize(10).text(`Dirección: ${storeAddress}`);
        doc.text(`Teléfono: ${storePhone}`);
        doc.moveDown();

        // Datos del Cliente y Orden
        doc.text(`Cliente: ${order.usuario.nombre}`);
        doc.text(`Email: ${order.usuario.email}`);
        if(order.direccion) {
            doc.text(`Dirección de Envío: ${order.direccion.calle} ${order.direccion.numero}, ${order.direccion.ciudad}`);
        }
        doc.moveDown();
        doc.text(`Orden N°: ${order.numero_pedido}`);
        doc.text(`Fecha: ${new Date(order.fecha).toLocaleDateString()}`);
        doc.text(`Estado: ${order.estado.toUpperCase()}`);
        doc.moveDown();

        // --- TABLA DE PRODUCTOS ---
        const table = {
            title: "Detalle de Compra",
            headers: [
                { label: "Producto", property: 'producto', width: 200 },
                { label: "Talle", property: 'talle', width: 50 },
                { label: "Cant.", property: 'cantidad', width: 50 },
                { label: "Precio Unit.", property: 'precio', width: 100 },
                { label: "Subtotal", property: 'subtotal', width: 100 }
            ],
            datas: order.detalles.map((item: any) => ({
                producto: item.nombre_producto,
                talle: item.talle,
                cantidad: String(item.cantidad),
                precio: `$${item.precio_unitario}`,
                subtotal: `$${(item.precio_unitario * item.cantidad).toFixed(2)}`
            }))
        };

        // Dibujar tabla
        await doc.table(table, {
            prepareHeader: () => doc.font("Helvetica-Bold").fontSize(10),
            prepareRow: () => doc.font("Helvetica").fontSize(10)
        });

        // --- TOTALES ---
        doc.moveDown();
        const total = Number(order.total);
        doc.fontSize(12).font('Helvetica-Bold').text(`TOTAL A PAGAR: $${total.toFixed(2)}`, { align: 'right' });

        doc.end();
    }
}