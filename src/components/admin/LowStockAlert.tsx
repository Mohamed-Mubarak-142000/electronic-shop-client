'use client';

import { useTranslation } from '@/hooks/useTranslation';
import { Product } from '@/types';
import Image from 'next/image';

export default function LowStockAlert({ products }: { products?: Product[] }) {
    const { t } = useTranslation();

    return (
        <div className="bg-card-dark rounded-xl border border-white/5 flex flex-col">
            <div className="p-6 border-b border-white/5">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-red-500">warning</span>
                    {t('admin.low_stock')}
                </h3>
            </div>
            <div className="p-4 flex flex-col gap-3">
                {products && products.length > 0 ? (
                    products.map((product) => (
                        <div key={product._id} className="flex items-center gap-4 p-3 rounded-lg bg-background-dark border border-white/5">
                            <div className="relative size-12 rounded-lg overflow-hidden border border-white/10 shrink-0">
                                <Image
                                    src={product.images?.[0] || 'https://via.placeholder.com/50'}
                                    alt={product.name}
                                    className="object-cover"
                                    fill
                                    sizes="48px"
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-white text-sm font-medium truncate">{product.name}</p>
                                <p className="text-gray-500 text-xs">ID: #{product._id.slice(-6).toUpperCase()}</p>
                            </div>
                            <div className="text-right shrink-0">
                                <p className="text-red-500 font-bold text-sm">{product.stock} {t('admin.left')}</p>
                                <button className="text-primary text-xs hover:underline mt-1">{t('admin.restock')}</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center text-gray-500 py-4">{t('admin.no_low_stock')}</div>
                )}
            </div>
            <div className="mt-auto p-4 border-t border-white/5">
                <button className="w-full py-2 rounded-lg border border-white/10 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors">
                    {t('admin.view_all')}
                </button>
            </div>
        </div>
    );
}
