import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useCartStore } from './useCartStore';
import { useWishlistStore } from './useWishlistStore';
import { User } from '@/types';

interface AuthState {
    user: User | null;
    login: (user: User) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            login: (user) => set({ user }),
            logout: () => {
                set({ user: null });
                // Clear other stores
                useCartStore.getState().clearCart();
                useWishlistStore.getState().clearWishlist();
            },
        }),
        {
            name: 'userInfo',
        }
    )
);
