import { Product, ProductVariant, Category, Coupon, Promotion, UsedCoupon } from "../models"; 
import { Cart } from "../models/cart.model";
import { ERROR_MESSAGES } from "../utils/cart/cart.constants";
import { Op } from "sequelize";

export class CartService {
    async getCart(usuario_id: number): Promise<Cart[]> {
        try {
            const cartItemsRaw = await Cart.findAll({
                where: { usuario_id },
                include: [
                    {
                        model: ProductVariant,
                        as: 'variante',
                        include: [ 
                            {
                                model: Product,
                                as: 'producto'
                            }
                        ]
                    }
                ]
            });

            const cartItems = cartItemsRaw.map(item => {
                const itemJSON = item.toJSON() as any; 
                
                if (itemJSON.variante && itemJSON.variante.producto) {
                    const prod = itemJSON.variante.producto;
                    const precio_base = Number(prod.precio_base);
                    const descuento = Number(prod.descuento || 0);

                    itemJSON.variante.producto.precio_final = precio_base * (1 - descuento / 100);
                }
                return itemJSON;
            });

            return cartItems;

        } catch (error) {
            throw new Error(ERROR_MESSAGES.GET_CART_ERROR);
        }
    }

    async getCartItem(cart_item_id: number, usuario_id: number): Promise<Cart | null> {
        try {
            const itemRaw = await Cart.findOne({
                where: { id: cart_item_id, usuario_id },
                include: [
                    {
                        model: ProductVariant,
                        as: 'variante',
                        include: [
                            { model: Product, as: 'producto' }
                        ]
                    }
                ]
            });

            if (!itemRaw) return null;

            const itemJSON = itemRaw.toJSON() as any;
            if (itemJSON.variante && itemJSON.variante.producto) {
                const prod = itemJSON.variante.producto;
                const precio_base = Number(prod.precio_base);
                const descuento = Number(prod.descuento || 0);
                itemJSON.variante.producto.precio_final = precio_base * (1 - descuento / 100);
            }
            
            return itemJSON;

        } catch (error) {
            throw new Error(ERROR_MESSAGES.GET_CART_ITEM_ERROR);
        }
    }

    async addItem(usuario_id: number, variante_id: number, cantidad: number = 1): Promise<Cart | undefined> {
        try {
            const variant = await ProductVariant.findByPk(variante_id);
            if (!variant || variant.stock < 1) {
                throw new Error(ERROR_MESSAGES.VARIANT_NOT_FOUND);
            }

            const existingItem = await Cart.findOne({
                where: { usuario_id, variante_id }
            });

            if (existingItem) {
                //si existe, lo va a actualizar
                const newQuantity = existingItem.cantidad + cantidad;
                if (newQuantity > variant.stock) {
                    throw new Error(ERROR_MESSAGES.INSUFFICIENT_STOCK);
                }
                existingItem.cantidad = newQuantity;
                await existingItem.save();
                return existingItem;
            } else {
                //si no existe, crea el item
                if (cantidad > variant.stock) {
                    throw new Error(ERROR_MESSAGES.INSUFFICIENT_STOCK);
                }
                const newItem = await Cart.create({
                    usuario_id,
                    variante_id,
                    cantidad
                });
                return newItem;
            }
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message || ERROR_MESSAGES.ADD_ITEM_ERROR);
            }
        }
    }

    async updateItemQuantity(cart_item_id: number, nueva_cantidad: number, usuario_id: number): Promise<Cart | undefined> {
        try {
            const item = await Cart.findOne({
                where: { id: cart_item_id, usuario_id }
            });

            if (!item) {
                throw new Error(ERROR_MESSAGES.CART_ITEM_NOT_FOUND);
            }

            const variant = await ProductVariant.findByPk(item.variante_id);
            if (!variant) {
                throw new Error(ERROR_MESSAGES.VARIANT_NOT_FOUND)
            }

            if (nueva_cantidad > variant.stock) {
                throw new Error(ERROR_MESSAGES.INSUFFICIENT_STOCK);
            }

            if (nueva_cantidad < 1) {
                await item.destroy();
                return item;
            }

            item.cantidad = nueva_cantidad;
            await item.save();
            return item;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message || ERROR_MESSAGES.UPDATE_ITEM_ERROR);
            }
        }
    }

    async clearCart(usuario_id: number): Promise<void>{
        try{
            await Cart.destroy({where: {usuario_id}});
        }catch(error){
            throw new Error(ERROR_MESSAGES.CLEAR_CART_ERROR)
        }
    }

    async removeItem(cart_item_id: number, usuario_id: number): Promise<Cart | undefined> {
        try {
            const item = await Cart.findOne({ where: { id: cart_item_id, usuario_id } });
            if (!item) {
                throw new Error(ERROR_MESSAGES.CART_ITEM_NOT_FOUND);
            }
            await item.destroy();
            return item;
        } catch (error) {
            throw new Error(ERROR_MESSAGES.REMOVE_ITEM_ERROR);
        }
    }

    async calculateTotals(usuario_id: number, codigoCuponIngresado?: string) {
        let subtotal = 0;
        let descuentoPromociones = 0;
        let descuentoCupon = 0;

        // 1. Obtener items del carrito
        const cartItemsRaw = await Cart.findAll({
            where: { usuario_id },
            include: [
                {
                    model: ProductVariant,
                    as: 'variante',
                    include: [ 
                        {
                            model: Product,
                            as: 'producto',
                            include: [{ model: Category, as: 'categoria' }]
                        }
                    ]
                }
            ]
        });

        if (!cartItemsRaw || cartItemsRaw.length === 0) {
            return { subtotal, descuentoPromociones, descuentoCupon, totalFinal: 0 };
        }

        // 1. Calcular Subtotal Base
        const cartItemsProcessed = cartItemsRaw.map(item => {
            const variante = (item as any).variante;
            const producto = variante?.producto;
            const precio_base = Number(producto?.precio_base || 0);
            const desc_producto = Number(producto?.descuento || 0);
            const precio_unitario = precio_base * (1 - desc_producto / 100);
            subtotal += precio_unitario * item.cantidad;
            return { item, variante, producto, precio_unitario };
        });

        // 2. Aplicar Promociones Automáticas
        const promosActivas = await Promotion.findAll({ 
            where: { 
                activa: true,
                fecha_inicio: { [Op.lte]: new Date() },
                fecha_fin: { [Op.gte]: new Date() }
            },
            include: [
                { model: Category, as: 'categorias' },
                { model: Product, as: 'productos' }
            ]
        });

        let acumulableConCupones = true;

        for (const promo of promosActivas) {
            if (!promo.acumulable_con_cupones) {
                acumulableConCupones = false; 
            }
            
            if (promo.tipo === 'descuento_porcentaje') {
                for (const { item, producto, precio_unitario } of cartItemsProcessed) {
                    if (!producto) continue;
                    
                    const catId = producto.categoria_id;
                    const prodId = producto.id;

                    const aplicaCategoria = (promo as any).categorias?.some((c: any) => c.id === catId);
                    const aplicaProducto = (promo as any).productos?.some((p: any) => p.id === prodId);

                    if (aplicaCategoria || aplicaProducto) {
                        descuentoPromociones += (precio_unitario * item.cantidad) * (Number(promo.valor_descuento) / 100);
                    }
                }
            } else if (promo.tipo === 'descuento_fijo') {
                for (const { item, producto } of cartItemsProcessed) {
                    if (!producto) continue;
                    
                    const catId = producto.categoria_id;
                    const prodId = producto.id;

                    const aplicaCategoria = (promo as any).categorias?.some((c: any) => c.id === catId);
                    const aplicaProducto = (promo as any).productos?.some((p: any) => p.id === prodId);

                    if (aplicaCategoria || aplicaProducto) {
                        descuentoPromociones += Number(promo.valor_descuento) * item.cantidad;
                    }
                }
            } else if (promo.tipo === 'n_x_m') {
                // Implementación simplificada para 3x2, etc. (lleva_n, paga_m)
                const lleva = Number(promo.lleva_n);
                const paga = Number(promo.paga_m);
                
                if (lleva && paga) {
                    for (const { item, producto, precio_unitario } of cartItemsProcessed) {
                        if (!producto) continue;
                        const catId = producto.categoria_id;
                        const prodId = producto.id;
    
                        const aplicaCategoria = (promo as any).categorias?.some((c: any) => c.id === catId);
                        const aplicaProducto = (promo as any).productos?.some((p: any) => p.id === prodId);
    
                        if (aplicaCategoria || aplicaProducto) {
                            const cantidad = item.cantidad;
                            const multiplicador = Math.floor(cantidad / lleva);
                            if (multiplicador > 0) {
                                // Descontar la diferencia de items que no paga (lleva - paga) por cada grupo
                                const articulosGratis = multiplicador * (lleva - paga);
                                descuentoPromociones += articulosGratis * precio_unitario;
                            }
                        }
                    }
                }
            }
        }

        // 3. Aplicar Cupón Manual
        if (codigoCuponIngresado) {
            if (!acumulableConCupones && descuentoPromociones > 0) {
                throw new Error("No podés aplicar cupones junto con las ofertas actuales de Hot Sale.");
            }

            const cupon = await Coupon.findOne({ 
                where: { 
                    codigo: codigoCuponIngresado, 
                    activo: true,
                    fecha_inicio: { [Op.lte]: new Date() },
                    fecha_fin: { [Op.gte]: new Date() }
                } 
            });

            if (!cupon) {
                throw new Error("El cupón no existe o no se encuentra vigente.");
            }

            if (cupon.monto_minimo && subtotal < cupon.monto_minimo) {
                throw new Error(`El monto mínimo para usar este cupón es de $${cupon.monto_minimo}`);
            }

            if (cupon.usos_maximos && cupon.usos_actuales >= cupon.usos_maximos) {
                throw new Error("Este cupón ya alcanzó su límite máximo de usos.");
            }
            
            const usosDelUsuario = await UsedCoupon.count({ where: { cupon_id: cupon.id, usuario_id } });
            if (usosDelUsuario >= cupon.limite_uso_por_usuario) {
                throw new Error("Ya utilizaste este cupón el máximo de veces permitido.");
            }

            const subtotalConPromos = subtotal - descuentoPromociones;
            if (cupon.tipo === 'porcentaje') {
                descuentoCupon = subtotalConPromos * (Number(cupon.valor) / 100);
            } else {
                descuentoCupon = Number(cupon.valor);
                if (descuentoCupon > subtotalConPromos) descuentoCupon = subtotalConPromos;
            }
        }

        const totalFinal = subtotal - descuentoPromociones - descuentoCupon;

        return {
            subtotal,
            descuentoPromociones,
            descuentoCupon,
            totalFinal: totalFinal > 0 ? totalFinal : 0
        };
    }
}