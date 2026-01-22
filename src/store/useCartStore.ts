import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
    id: string;
    name: string;
    subtitle?: string;
    sku?: string;
    price: number;
    quantity: number;
    imageUrl: string;
    inStock?: boolean;
    lowStock?: boolean;
}

interface CartState {
    cartItems: CartItem[];
    addItem: (item: CartItem) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, delta: number) => void;
    clearCart: () => void;
}

export const useCartStore = create<CartState>()(
    persist(
        (set) => ({
            cartItems: [],
            addItem: (newItem) => set((state) => {
                const existingItem = state.cartItems.find((item) => item.id === newItem.id);
                if (existingItem) {
                    return {
                        cartItems: state.cartItems.map((item) =>
                            item.id === newItem.id
                                ? { ...item, quantity: item.quantity + newItem.quantity }
                                : item
                        ),
                    };
                }
                return { cartItems: [...state.cartItems, newItem] };
            }),
            removeItem: (id) => set((state) => ({
                cartItems: state.cartItems.filter((item) => item.id !== id),
            })),
            updateQuantity: (id, delta) => set((state) => ({
                cartItems: state.cartItems.map((item) => {
                    if (item.id === id) {
                        const newQuantity = Math.max(1, item.quantity + delta);
                        return { ...item, quantity: newQuantity };
                    }
                    return item;
                }),
            })),
            clearCart: () => set({ cartItems: [] }),
        }),
        {
            name: 'cart-storage',
        }
    )
);
