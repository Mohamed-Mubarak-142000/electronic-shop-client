'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSocket } from '@/hooks/useSocket';
import { useAuthStore } from '@/store/useAuthStore';
import { X } from 'lucide-react';
import { productService } from '@/services/productService';
import { useTranslation } from '@/hooks/useTranslation';
import { useCurrency } from '@/hooks/useCurrency';
import Image from 'next/image';

interface Product {
    _id: string;
    name: string;
    nameAr: string;
    description: string;
    descriptionAr: string;
    price: number;
    images: string[];
}

export default function NewProductDrawer() {
    const [queue, setQueue] = useState<Product[]>([]);
    const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
    const socket = useSocket();
    const { user } = useAuthStore();
    const { language, t } = useTranslation();
    const { formatPrice } = useCurrency();

    // Only show for regular users, NOT admins
    const shouldShow = user && user.role !== 'admin';

    useEffect(() => {
        if (!socket || !shouldShow) return;

        socket.on('new_product', (product: Product) => {
            const shownProducts = JSON.parse(localStorage.getItem('shownProducts') || '[]');
            if (!shownProducts.includes(product._id)) {
                setQueue(prev => [...prev, product]);
            }
        });

        return () => {
            socket.off('new_product');
        };
    }, [socket, shouldShow]);

    // Handle offline cases: Fetch latest 5 on mount
    useEffect(() => {
        if (!shouldShow) return;
        
        const fetchLatest = async () => {
            try {
                const response = await productService.getProducts({ limit: 5, sort: '-createdAt' });
                const latestProducts = response.products;
                const shownProducts = JSON.parse(localStorage.getItem('shownProducts') || '[]');

                const newProducts = latestProducts.filter((p: Product) => !shownProducts.includes(p._id));
                if (newProducts.length > 0) {
                    setQueue(prev => [...prev, ...newProducts]);
                }
            } catch (error) {
                console.error('Failed to fetch latest products:', error);
            }
        };

        fetchLatest();
    }, [shouldShow]);

    useEffect(() => {
        if (!shouldShow) return;
        
        if (!currentProduct && queue.length > 0) {
            const next = queue[0];
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setCurrentProduct(next);
            setQueue(prev => prev.slice(1));

            // Mark as shown
            const shownProducts = JSON.parse(localStorage.getItem('shownProducts') || '[]');
            localStorage.setItem('shownProducts', JSON.stringify([...shownProducts, next._id]));
        }
    }, [queue, currentProduct, shouldShow]);

    useEffect(() => {
        if (!shouldShow) return;
        
        if (currentProduct) {
            const timer = setTimeout(() => {
                setCurrentProduct(null);
            }, 30000); // 30 seconds

            return () => clearTimeout(timer);
        }
    }, [currentProduct, shouldShow]);

    // Don't render anything for admins
    if (!shouldShow) {
        return null;
    }

    return (
        <AnimatePresence>
            {currentProduct && (
                <motion.div
                    // Performance: Use transform instead of y for better animation performance
                    initial={{ opacity: 0, transform: "translateY(100%)" }}
                    animate={{ opacity: 1, transform: "translateY(0)" }}
                    exit={{ opacity: 0, transform: "translateY(100%)" }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] p-6 rounded-t-3xl"
                >
                    <div className="max-w-2xl mx-auto flex gap-6">
                        <div className="w-32 h-32 flex-shrink-0 bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-hidden">
                            {currentProduct.images?.[0] ? (
                                <Image
                                    src={currentProduct.images[0]}
                                    alt={currentProduct.name}
                                    className="object-cover"
                                    width={128}
                                    height={128}
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-400">
                                    <span className="material-symbols-outlined text-4xl">image</span>
                                </div>
                            )}
                        </div>

                        <div className="flex-grow">
                            <div className="flex justify-between items-start">
                                <div>
                                    <span className="inline-block px-2 py-1 mb-2 text-xs font-semibold bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 rounded-full">
                                        {language === 'ar' ? 'منتج جديد!' : 'New Product!'}
                                    </span>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                        {language === 'ar' ? currentProduct.nameAr : currentProduct.name}
                                    </h3>
                                </div>
                                <button
                                    aria-label="Dismiss notification"
                                    onClick={() => setCurrentProduct(null)}
                                    className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                                >
                                    <X size={20} aria-hidden="true" />
                                </button>
                            </div>

                            <p className="mt-2 text-slate-600 dark:text-slate-400 line-clamp-2">
                                {language === 'ar' ? currentProduct.descriptionAr : currentProduct.description}
                            </p>

                            <div className="mt-4 flex items-center justify-between">
                                <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                                    {formatPrice(currentProduct.price)}
                                </span>
                                <button className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl transition-all hover:scale-105 active:scale-95 font-medium">
                                    {t('product.addToCart')}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Auto-close progress bar - Performance: use scaleX instead of width */}
                    <motion.div
                        initial={{ scaleX: 1 }}
                        animate={{ scaleX: 0 }}
                        transition={{ duration: 30, ease: 'linear' }}
                        style={{ transformOrigin: 'left' }}
                        className="absolute bottom-0 left-0 w-full h-1 bg-primary-500/30"
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
}
