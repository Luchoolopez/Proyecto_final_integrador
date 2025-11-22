// frontend/src/context/CartContext.tsx
import React, { createContext, useContext, useState, useEffect, useMemo, type ReactNode } from 'react';
import { useAuthContext } from './AuthContext';
import { cartService, type CartItem, type ApiCartItem } from '../api/cartService';
import { type Product } from '../types/Product';
import { type Variant } from '../types/Variant';

const GUEST_CART_KEY = 'guest_cart';

interface CartContextType {
    cartItems: CartItem[];
    loading: boolean;
    error: string | null;
    addItem: (product: Product, variant: Variant, quantity: number) => Promise<void>;
    updateItem: (variante_id: number, nueva_cantidad: number) => Promise<void>;
    removeItem: (variante_id: number) => Promise<void>;
    clearCart: () => Promise<void>;
    itemCount: number;
    total: number; // 👈 Agregado
    isCartOpen: boolean;
    openCart: () => void;
    closeCart: () => void;
    fetchCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const { isAuthenticated, loading: authLoading } = useAuthContext();
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isCartOpen, setIsCartOpen] = useState(false);
    
    const apiItemToLocal = (apiItem: ApiCartItem): CartItem => {
        return {
            product: {
                id: apiItem.variante.producto.id,
                nombre: apiItem.variante.producto.nombre,
                imagen_principal: apiItem.variante.producto.imagen_principal,
                precio_final: apiItem.variante.producto.precio_final,
                precio_base: apiItem.variante.producto.precio_base,
                descuento: apiItem.variante.producto.descuento,
            },
            variant: {
                id: apiItem.variante.id,
                talle: apiItem.variante.talle,
                stock: apiItem.variante.stock,
            },
            quantity: apiItem.cantidad
        };
    };

    const fetchDbCart = async () => {
        if (!isAuthenticated) return;
        setLoading(true);
        setError(null);
        try {
            const apiItems = await cartService.getCart();
            const localItems = apiItems.map(apiItemToLocal);
            setCartItems(localItems);
        } catch (err) {
            setError('Error al cargar el carrito');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const loadGuestCart = () => {
        const guestCartJson = localStorage.getItem(GUEST_CART_KEY);
        if (guestCartJson) {
            setCartItems(JSON.parse(guestCartJson));
        } else {
            setCartItems([]);
        }
    };

    const syncCartOnLogin = async () => {
        const guestCartJson = localStorage.getItem(GUEST_CART_KEY);
        if (!guestCartJson) {
            await fetchDbCart(); 
            return;
        }

        setLoading(true);
        const guestItems: CartItem[] = JSON.parse(guestCartJson);
        
        try {
            await Promise.all(
                guestItems.map(item => 
                    cartService.addToCart({
                        variante_id: item.variant.id,
                        cantidad: item.quantity
                    })
                )
            );
            localStorage.removeItem(GUEST_CART_KEY);
        } catch (err) {
            setError("Error al sincronizar el carrito");
            console.error(err);
        } finally {
            await fetchDbCart();
            setLoading(false);
        }
    };

    useEffect(() => {
        if (authLoading) return; 

        if (isAuthenticated) {
            syncCartOnLogin();
        } else {
            loadGuestCart();
        }
    }, [isAuthenticated, authLoading]);

    const addItem = async (product: Product, variant: Variant, quantity: number) => {
        if (isAuthenticated) {
            try {
                await cartService.addToCart({ variante_id: variant.id, cantidad: quantity });
                await fetchDbCart();
                openCart();
            } catch (err) {
                setError('Error al añadir item');
            }
        } else {
            const newCartItem: CartItem = {
                product: {
                    id: product.id,
                    nombre: product.nombre,
                    imagen_principal: product.imagen_principal,
                    precio_final: product.precio_final,
                    precio_base: product.precio_base,
                    descuento: product.descuento,
                },
                variant: {
                    id: variant.id,
                    talle: variant.talle,
                    stock: variant.stock,
                },
                quantity,
            };

            let updatedItems: CartItem[] = [];
            const existingItemIndex = cartItems.findIndex(i => i.variant.id === variant.id);

            if (existingItemIndex > -1) {
                updatedItems = [...cartItems];
                const newQuantity = updatedItems[existingItemIndex].quantity + quantity;
                updatedItems[existingItemIndex].quantity = Math.min(newQuantity, variant.stock);
            } else {
                updatedItems = [...cartItems, newCartItem];
            }
            
            setCartItems(updatedItems);
            localStorage.setItem(GUEST_CART_KEY, JSON.stringify(updatedItems));
            openCart();
        }
    };

    const updateItem = async (variante_id: number, nueva_cantidad: number) => {
        if (isAuthenticated) {
            const apiItem = (await cartService.getCart()).find(i => i.variante_id === variante_id);
            if (apiItem) {
                try {
                    await cartService.updateQuantity(apiItem.id, nueva_cantidad);
                    await fetchDbCart();
                } catch (err) { setError('Error al actualizar item'); }
            }
        } else {
            const updatedItems = cartItems.map(item => 
                item.variant.id === variante_id ? { ...item, quantity: nueva_cantidad } : item
            ).filter(item => item.quantity > 0);

            setCartItems(updatedItems);
            localStorage.setItem(GUEST_CART_KEY, JSON.stringify(updatedItems));
        }
    };

    const removeItem = async (variante_id: number) => {
        if (isAuthenticated) {
            const apiItem = (await cartService.getCart()).find(i => i.variante_id === variante_id);
            if (apiItem) {
                try {
                    await cartService.removeFromCart(apiItem.id);
                    await fetchDbCart();
                } catch (err) { setError('Error al eliminar item'); }
            }
        } else {
            const updatedItems = cartItems.filter(item => item.variant.id !== variante_id);
            setCartItems(updatedItems);
            localStorage.setItem(GUEST_CART_KEY, JSON.stringify(updatedItems));
        }
    };
    
    const clearCart = async () => {
        if (isAuthenticated) {
            try {
                await cartService.clearCart();
                await fetchDbCart();
            } catch (err) { setError('Error al vaciar el carrito'); }
        } else {
            setCartItems([]);
            localStorage.removeItem(GUEST_CART_KEY);
        }
    };

    const openCart = () => setIsCartOpen(true);
    const closeCart = () => setIsCartOpen(false);

    const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

    // 👇 Calcular total con useMemo para optimizar
    const total = useMemo(() => {
        return cartItems.reduce((acc, item) => {
            const itemPrice = typeof item.product.precio_final === 'string' 
                ? parseFloat(item.product.precio_final) 
                : item.product.precio_final;
            return acc + (itemPrice * item.quantity);
        }, 0);
    }, [cartItems]);

    const value = {
        cartItems,
        loading,
        error,
        addItem,
        updateItem,
        removeItem,
        clearCart,
        itemCount,
        total, // 👈 Agregado
        isCartOpen,
        openCart,
        closeCart,
        fetchCart: fetchDbCart,
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCartContext = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCartContext debe ser usado dentro de un CartProvider');
    }
    return context;
};