// frontend/src/context/CartContext.tsx
import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useAuthContext } from './AuthContext';
import { cartService, type CartItem } from '../api/cartService';

interface CartContextType {
    cartItems: CartItem[];
    loading: boolean;
    error: string | null;
    fetchCart: () => Promise<void>;
    addItem: (variante_id: number, cantidad: number) => Promise<void>;
    updateItem: (cartItemId: number, nueva_cantidad: number) => Promise<void>;
    removeItem: (cartItemId: number) => Promise<void>;
    clearCartItems: () => Promise<void>;
    itemCount: number;
    
    // --- NUEVO ---
    isCartOpen: boolean;
    openCart: () => void;
    closeCart: () => void;
    // --- FIN NUEVO ---
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const { isAuthenticated } = useAuthContext();
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    // --- NUEVO ---
    const [isCartOpen, setIsCartOpen] = useState(false);
    const openCart = () => setIsCartOpen(true);
    const closeCart = () => setIsCartOpen(false);
    // --- FIN NUEVO ---

    const fetchCart = async () => {
        if (!isAuthenticated) return;
        
        setLoading(true);
        setError(null);
        try {
            const items = await cartService.getCart();
            setCartItems(items);
        } catch (err) {
            setError('Error al cargar el carrito');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchCart();
        } else {
            setCartItems([]);
        }
    }, [isAuthenticated]);

    const addItem = async (variante_id: number, cantidad: number) => {
        try {
            await cartService.addToCart({ variante_id, cantidad });
            await fetchCart();
            openCart(); // Abrir el carrito al añadir un item
        } catch (err) {
            setError('Error al añadir item');
        }
    };

    const updateItem = async (cartItemId: number, nueva_cantidad: number) => {
        try {
            await cartService.updateQuantity(cartItemId, nueva_cantidad);
            await fetchCart();
        } catch (err) {
            setError('Error al actualizar item');
        }
    };

    const removeItem = async (cartItemId: number) => {
        try {
            await cartService.removeFromCart(cartItemId);
            await fetchCart();
        } catch (err) {
            setError('Error al eliminar item');
        }
    };
    
    const clearCartItems = async () => {
         try {
            await cartService.clearCart();
            await fetchCart();
        } catch (err) {
            setError('Error al vaciar el carrito');
        }
    }

    const itemCount = cartItems.reduce((total, item) => total + item.cantidad, 0);

    const value = {
        cartItems,
        loading,
        error,
        fetchCart,
        addItem,
        updateItem,
        removeItem,
        clearCartItems,
        itemCount,
        // --- NUEVO ---
        isCartOpen,
        openCart,
        closeCart,
        // --- FIN NUEVO ---
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