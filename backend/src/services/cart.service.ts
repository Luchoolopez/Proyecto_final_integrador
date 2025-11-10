import { Product, ProductVariant } from "../models"; 
import { Cart } from "../models/cart.model";
import { ERROR_MESSAGES } from "../utils/cart/cart.constants";

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
}