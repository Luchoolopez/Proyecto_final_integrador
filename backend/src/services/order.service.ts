import { sequelize } from '../config/database';
import { Op } from 'sequelize';
import { Order, OrderDetail, ProductVariant, User, Address, Cart, Product } from '../models';
import { CreateOrderInput } from '../validations/order.schema';
import { ERROR_MESSAGES, ORDER_STATUS } from '../utils/order/order.constants';

export class OrderService {

    async createOrder(usuario_id: number, orderData: CreateOrderInput): Promise<Order> {
        const transaction = await sequelize.transaction();

        try {
            const cartItems = await Cart.findAll({
                where: { usuario_id },
                include: [
                    {
                        model: ProductVariant,
                        as: 'variante',
                        include: [{ model: Product, as: 'producto' }]
                    }
                ],
                transaction
            });

            if (!cartItems || cartItems.length === 0) {
                throw new Error(ERROR_MESSAGES.CART_EMPTY);
            }

            const direccion = await Address.findOne({
                where: { id: orderData.direccion_id, usuario_id },
                transaction,
            });

            if (!direccion) {
                throw new Error(ERROR_MESSAGES.ADDRESS_NOT_FOUND);
            }

            let totalPedido = 0;
            const itemsParaDetalle: any[] = [];

            for (const item of cartItems) {
                const variante = (item as any).variante;
                
                if (!variante || !variante.producto) {
                    throw new Error(ERROR_MESSAGES.ITEM_INVALID);
                }

                const productVariant = await ProductVariant.findByPk(item.variante_id, {
                    transaction,
                    lock: true, 
                });

                if (!productVariant || productVariant.stock < item.cantidad) {
                    throw new Error(`${ERROR_MESSAGES.INSUFFICIENT_STOCK} Producto: ${variante.producto.nombre}`);
                }

                const precioBase = Number(variante.producto.precio_base);
                const descuento = Number(variante.producto.descuento || 0);
                const precioFinalProducto = precioBase * (1 - descuento / 100);
                
                totalPedido += precioFinalProducto * item.cantidad;

                itemsParaDetalle.push({
                    variante_id: item.variante_id,
                    sku_variante: variante.sku_variante,
                    nombre_producto: variante.producto.nombre,
                    talle: variante.talle,
                    cantidad: item.cantidad,
                    precio_unitario: precioFinalProducto,
                    descuento_aplicado: descuento,
                });
            }

            const timestamp = Math.floor(Date.now() / 1000); 
            const random = Math.floor(Math.random() * 1000);
            const numeroPedidoGenerado = `PED-${timestamp}-${random}`;

            const nuevoPedido = await Order.create(
                {
                    usuario_id,
                    numero_pedido: numeroPedidoGenerado, 
                    direccion_id: orderData.direccion_id,
                    total: totalPedido,
                    estado: ORDER_STATUS.PENDIENTE,
                    notas: orderData.notas,
                    shipping_provider: orderData.shipping_provider,
                    shipping_service: orderData.shipping_service,
                    shipping_cost: 0, 
                },
                { transaction }
            );

            const detallesData = itemsParaDetalle.map(detalle => ({
                ...detalle,
                pedido_id: nuevoPedido.id,
            }));
            
            await OrderDetail.bulkCreate(detallesData, { transaction });

            await Cart.destroy({
                where: { usuario_id },
                transaction
            });

            await transaction.commit();

            return await this.getOrderById(nuevoPedido.id, usuario_id);

        } catch (error) {
            if (!transaction.commit) {
                await transaction.rollback();
            }
            
            if (error instanceof Error) {
                throw new Error(error.message || ERROR_MESSAGES.CREATE_ORDER_ERROR);
            }
            throw error;
        }
    }

    async getOrderById(pedido_id: number, usuario_id: number): Promise<Order> {
        try {
            const order = await Order.findOne({
                where: { id: pedido_id, usuario_id },
                include: [
                    {
                        model: OrderDetail,
                        as: 'detalles', 
                    },
                    {
                        model: User,
                        as: 'usuario',  
                        attributes: ['id', 'nombre', 'email'],
                    },
                ],
            });

            if (!order) {
                throw new Error(ERROR_MESSAGES.ORDER_NOT_FOUND);
            }

            return order;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message || ERROR_MESSAGES.ORDER_NOT_FOUND);
            }
            throw error;
        }
    }

    async getOrdersByUser(usuario_id: number): Promise<Order[]> {
        try {
            const orders = await Order.findAll({
                where: { usuario_id },
                order: [['fecha', 'DESC']],
                include: [
                    {
                        model: OrderDetail,
                        as: 'detalles',
                        attributes: ['nombre_producto', 'cantidad', 'precio_unitario'],
                    },
                ],
            });

            return orders;
        } catch (error) {
            throw new Error(ERROR_MESSAGES.GET_ORDERS_ERROR);
        }
    }

    async getAllOrders(filters: any, page: number = 1, limit: number = 10) {
        const offset = (page - 1) * limit;
        const whereClause: any = {};

        if (filters.estado && filters.estado !== 'todos') {
            whereClause.estado = filters.estado;
        }

        if (filters.fechaDesde || filters.fechaHasta) {
            const fechaFilter: any = {};
            if (filters.fechaDesde) fechaFilter[Op.gte] = new Date(filters.fechaDesde);
            if (filters.fechaHasta) fechaFilter[Op.lte] = new Date(filters.fechaHasta);
            whereClause.fecha = fechaFilter;
        }

        if (filters.search) {
            whereClause.numero_pedido = { [Op.like]: `%${filters.search}%` };
        }

        const { count, rows } = await Order.findAndCountAll({
            where: whereClause,
            include: [
                { 
                    model: User, 
                    as: 'usuario', 
                    attributes: ['id', 'nombre', 'email'] 
                },
                { 
                    model: Address,
                    as: 'direccion' 
                },
                {
                    model: OrderDetail,
                    as: 'detalles'
                }
            ],
            order: [['fecha', 'DESC']],
            limit,
            offset,
            distinct: true
        });

        return {
            total: count,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            orders: rows
        };
    }


    async updateOrderStatus(id: number, data: { estado: string; tracking_number?: string; shipping_provider?: string }) {
        const t = await sequelize.transaction();

        try {
            const order = await Order.findByPk(id, { 
                include: [{ model: OrderDetail, as: 'detalles' }],
                transaction: t 
            });

            if (!order) throw new Error('Pedido no encontrado');

            const oldStatus = order.estado;
            const newStatus = data.estado;

            if (newStatus === 'cancelado' && oldStatus !== 'cancelado') {
                const detalles = (order as any).detalles;
                if (detalles && Array.isArray(detalles)) {
                    for (const item of detalles) {
                        const variant = await ProductVariant.findByPk(item.variante_id, { transaction: t });
                        if (variant) {
                            await variant.increment('stock', { by: item.cantidad, transaction: t });
                        }
                    }
                }
            }

            order.estado = newStatus as any;
            if (data.tracking_number) order.tracking_number = data.tracking_number;
            if (data.shipping_provider) order.shipping_provider = data.shipping_provider;
            if (newStatus === 'enviado' && !order.fecha_envio) order.fecha_envio = new Date();
            if (newStatus === 'entregado' && !order.fecha_entrega) order.fecha_entrega = new Date();

            await order.save({ transaction: t });
            await t.commit();

            return order;

        } catch (error) {
            await t.rollback();
            throw error;
        }
    }
}


export const orderService = new OrderService();