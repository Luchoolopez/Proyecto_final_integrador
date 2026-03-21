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
        const cartItemsRaw = await Cart.findAll({
            where: { usuario_id },
            include: [{
                model: ProductVariant,
                as: 'variante',
                include: [{ model: Product, as: 'producto' }]
            }]
        });

        if (!cartItemsRaw.length) {
            return { subtotal: 0, descuentoPromociones: 0, descuentoCupon: 0, totalFinal: 0 };
        }

        let subtotal = 0;
        let descuentoPromociones = 0;
        let descuentoCupon = 0;
        let permiteAcumularCupon = true;

        const items = cartItemsRaw.map((item: any) => {
            const prod = item.variante.producto;
            const precioBase = Number(prod.precio_base || 0);
            const descNormal = Number(prod.descuento || 0);
            return {
                cartItemId: item.id,
                producto_id: prod.id,
                categoria_id: prod.categoria_id,
                precio: precioBase * (1 - (descNormal / 100)),
                cantidad: item.cantidad
            };
        });

        items.forEach(item => {
            subtotal += (item.precio * item.cantidad);
        });

        const ahora = new Date();
        const promosActivas = await Promotion.findAll({
            where: { activa: true, fecha_inicio: { [Op.lte]: ahora }, fecha_fin: { [Op.gte]: ahora } },
            include: [{ as: 'categorias', model: Category }, { as: 'productos', model: Product }]
        });

        for (const promo of promosActivas) {
            const itemsAplicables = items.filter(item => {
                const aplicaPorCategoria = (promo as any).categorias?.some((c: any) => c.id === item.categoria_id);
                const aplicaPorProducto = (promo as any).productos?.some((p: any) => p.id === item.producto_id);
                return (!(promo as any).categorias?.length && !(promo as any).productos?.length) || aplicaPorCategoria || aplicaPorProducto;
            });

            if (itemsAplicables.length > 0) {
                if (!promo.acumulable) permiteAcumularCupon = false;

                if (promo.tipo === 'porcentaje') {
                    const subtotalAplicable = itemsAplicables.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
                    descuentoPromociones += subtotalAplicable * (Number(promo.valor || 0) / 100);
                } 
                
                if (promo.tipo === 'monto_fijo') {
                    const cantidadAplicable = itemsAplicables.reduce((acc, item) => acc + item.cantidad, 0);
                    descuentoPromociones += Number(promo.valor || 0) * cantidadAplicable;
                }
                
                if (promo.tipo === 'nxm' && promo.lleva_n && promo.paga_m) {
                    const llevaN = promo.lleva_n;
                    const pagaM = promo.paga_m;
                    let itemsIndividuales: number[] = [];
                    itemsAplicables.forEach(item => {
                        for(let i=0; i < item.cantidad; i++) itemsIndividuales.push(item.precio);
                    });
                    
                    itemsIndividuales.sort((a, b) => b - a);

                    for (let i = 0; i < itemsIndividuales.length; i += llevaN) {
                        const grupo = itemsIndividuales.slice(i, i + llevaN);
                        if (grupo.length === llevaN) {
                            const itemsDescontados = llevaN - pagaM;
                            for (let j = 1; j <= itemsDescontados; j++) {
                                descuentoPromociones += grupo[grupo.length - j] || 0;
                            }
                        }
                    }
                }
            }
        }

        if (codigoCuponIngresado) {
            if (!permiteAcumularCupon && descuentoPromociones > 0) {
                throw new Error("No podés aplicar este cupón porque ya tenés ofertas aplicadas en tu carrito que no son acumulables.");
            }

            const cupon = await Coupon.findOne({ 
                where: { codigo: codigoCuponIngresado, activo: true, fecha_inicio: { [Op.lte]: ahora }, fecha_fin: { [Op.gte]: ahora } },
                include: [{ as: 'categorias', model: Category }, { as: 'productos', model: Product }]
            });

            if (!cupon) throw new Error("Cupón inválido o expirado.");

            const itemsAplicablesCupon = items.filter(item => {
                const aplicaPorCategoria = (cupon as any).categorias?.some((c: any) => c.id === item.categoria_id);
                const aplicaPorProducto = (cupon as any).productos?.some((p: any) => p.id === item.producto_id);
                return (!(cupon as any).categorias?.length && !(cupon as any).productos?.length) || aplicaPorCategoria || aplicaPorProducto;
            });

            const subtotalParaCupon = itemsAplicablesCupon.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);

            if (subtotalParaCupon === 0) {
                throw new Error("Este cupón no aplica a los productos que tenés en el carrito.");
            }

            if (subtotalParaCupon < (cupon.monto_minimo || 0)) {
                throw new Error(`Tenés que sumar $${cupon.monto_minimo} en productos válidos para usar este cupón.`);
            }

            const usosGenerales = cupon.usos_actuales || 0;
            if (cupon.usos_maximos && usosGenerales >= cupon.usos_maximos) {
                throw new Error("Este cupón ya alcanzó su límite máximo de usos.");
            }
            
            const usosDelUsuario = await UsedCoupon.count({ where: { cupon_id: cupon.id, usuario_id } });
            if (usosDelUsuario >= cupon.limite_uso_por_usuario) {
                throw new Error("Ya utilizaste este cupón el máximo de veces permitido.");
            }

            if (cupon.tipo === 'porcentaje') {
                descuentoCupon = subtotalParaCupon * (Number(cupon.valor || 0) / 100);
            } else {
                descuentoCupon = Number(cupon.valor || 0);
                if (descuentoCupon > subtotalParaCupon) descuentoCupon = subtotalParaCupon; 
            }
        }

        let totalFinal = subtotal - descuentoPromociones - descuentoCupon;
        if (totalFinal < 0) totalFinal = 0;

        return {
            subtotal,
            descuentoPromociones,
            descuentoCupon,
            totalFinal
        };
    }
}