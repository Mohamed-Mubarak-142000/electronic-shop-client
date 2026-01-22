import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface WishlistItem {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
    description?: string;
}

interface WishlistState {
    wishlistItems: WishlistItem[];
    addItem: (item: WishlistItem) => void;
    removeItem: (id: string) => void;
    clearWishlist: () => void;
    isInWishlist: (id: string) => boolean;
}

export const useWishlistStore = create<WishlistState>()(
    persist(
        (set, get) => ({
            wishlistItems: [],
            addItem: (newItem) => set((state) => {
                const exists = state.wishlistItems.find((item) => item.id === newItem.id);
                if (exists) return state;
                return { wishlistItems: [...state.wishlistItems, newItem] };
            }),
            removeItem: (id) => set((state) => ({
                wishlistItems: state.wishlistItems.filter((item) => item.id !== id),
            })),
            clearWishlist: () => set({ wishlistItems: [] }),
            isInWishlist: (id) => {
                return get().wishlistItems.some((item) => item.id === id);
            },
        }),
        {
            name: 'wishlist-storage',
        }
    )
);
