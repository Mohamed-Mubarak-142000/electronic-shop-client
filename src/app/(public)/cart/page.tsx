"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import CheckoutDialog from '@/components/checkout/CheckoutDialog';
import { useTranslation } from "@/hooks/useTranslation";
import CartItem from "@/components/cart/CartItem";
import OrderSummary from "@/components/cart/OrderSummary";

export default function CartPage() {
    const router = useRouter();
    const { cartItems, updateQuantity, removeItem } = useCartStore();
    const { user } = useAuthStore();
    const { t, dir } = useTranslation();
    const [activeTab, setActiveTab] = useState("cart");
    const [isLoaded, setIsLoaded] = useState(false);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsLoaded(true);
    }, []);

    const handleUpdateQuantity = (id: string, delta: number) => {
        updateQuantity(id, delta);
    };

    const handleRemoveItem = (id: string) => {
        removeItem(id);
    };

    const handleCheckout = () => {
        if (!user) {
            toast.error(t('login_req'));
            router.push('/login');
            return;
        }
        setIsCheckoutOpen(true);
    };

    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = subtotal * 0.08;
    const total = subtotal + tax;

    if (!isLoaded) {
        return (
            <div className="flex flex-col items-center w-full bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display min-h-screen">
                <div className="w-full max-w-[1440px] px-4 md:px-10 py-10 flex items-center justify-center min-h-[60vh]">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div className="flex flex-col items-center w-full bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display min-h-screen" dir={dir}>
                <div className="w-full max-w-[1440px] px-4 md:px-10 py-10">
                    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                        <div className="size-24 rounded-full bg-slate-100 dark:bg-surface-dark flex items-center justify-center text-slate-400 mb-6">
                            <span className="material-symbols-outlined text-5xl">shopping_cart</span>
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-4">{t('cart_empty')}</h1>
                        <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto">
                            {t('cart_empty_desc')}
                        </p>
                        <Link href="/shop">
                            <button className="bg-primary hover:bg-green-400 text-surface-dark font-black px-8 py-4 rounded-full shadow-lg transition-all transform hover:-translate-y-1">
                                {t('go_shopping')}
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center w-full bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display min-h-screen" dir={dir}>
            <div className="w-full max-w-[1440px] px-4 md:px-10 py-8 lg:py-12">
                {/* Page Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white mb-2">{t('your_cart')}</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base">
                            {t('items_in_cart', { count: cartItems.length })}
                        </p>
                    </div>
                    {/* Tabs */}
                    <div className="inline-flex bg-slate-200 dark:bg-surface-dark p-1 rounded-full">
                        <button
                            onClick={() => setActiveTab("cart")}
                            className={`px-6 py-2 rounded-full shadow-sm font-bold text-sm transition-all ${activeTab === "cart"
                                ? "bg-white dark:bg-primary text-slate-900 dark:text-surface-dark"
                                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                                }`}
                        >
                            {t('cart')} ({cartItems.length})
                        </button>
                        <button
                            onClick={() => setActiveTab("wishlist")}
                            className={`px-6 py-2 rounded-full font-medium text-sm transition-all ${activeTab === "wishlist"
                                ? "bg-white dark:bg-primary text-slate-900 dark:text-surface-dark shadow-sm font-bold"
                                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                                }`}
                        >
                            {t('wishlist')} (0)
                        </button>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
                    {/* Cart Items Section */}
                    <div className="flex-1 w-full space-y-4">
                        {/* Table Header (Hidden on Mobile) */}
                        <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-gray-200 dark:border-surface-highlight">
                            <div className="col-span-6">{t('product')}</div>
                            <div className="col-span-2 text-center">{t('price')}</div>
                            <div className="col-span-2 text-center">{t('quantity')}</div>
                            <div className="col-span-2 text-right">{t('total')}</div>
                        </div>

                        {cartItems.map((item) => (
                            <CartItem 
                                key={item.id} 
                                item={item} 
                                onUpdateQuantity={handleUpdateQuantity} 
                                onRemove={handleRemoveItem} 
                            />
                        ))}
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="w-full lg:w-[380px] shrink-0 sticky top-24">
                        <OrderSummary 
                            subtotal={subtotal} 
                            tax={tax} 
                            total={total} 
                            onCheckout={handleCheckout} 
                        />
                    </div>
                </div>
            </div>

            <CheckoutDialog isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} />
        </div>
    );
}
