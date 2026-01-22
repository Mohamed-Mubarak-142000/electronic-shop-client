import React from 'react';
import { useCurrency } from "@/hooks/useCurrency";
import Image from 'next/image';

interface CartItemProps {
    item: {
        id: string;
        name: string;
        subtitle?: string;
        price: number;
        quantity: number;
        imageUrl: string;
        sku?: string;
        lowStock?: boolean;
    };
    onUpdateQuantity: (id: string, delta: number) => void;
    onRemove: (id: string) => void;
}

export default function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
    const { formatPrice } = useCurrency();

    return (
        <div className="group relative bg-white dark:bg-surface-dark rounded-xl p-4 md:p-6 shadow-sm border border-transparent dark:border-surface-highlight hover:border-primary/30 transition-all duration-300">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                {/* Product Info */}
                <div className="md:col-span-6 flex gap-4">
                    <div className="shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-lg bg-gray-100 dark:bg-black/20 overflow-hidden relative">
                        <Image
                            src={item.imageUrl}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 80px, 96px"
                        />
                    </div>
                    <div className="flex flex-col justify-center">
                        {item.lowStock ? (
                            <div className="text-xs text-orange-400 font-bold tracking-wide uppercase mb-1">Low Stock</div>
                        ) : (
                            <div className="text-xs text-primary font-bold tracking-wide uppercase mb-1">In Stock</div>
                        )}
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight mb-1">{item.name}</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{item.subtitle}</p>
                        <p className="text-xs text-slate-400 mt-1">{item.sku && `SKU: ${item.sku}`}</p>
                    </div>
                </div>

                {/* Price (Mobile: hidden, Desktop: visible) */}
                <div className="hidden md:block md:col-span-2 text-center">
                    <p className="text-slate-900 dark:text-white font-medium">{formatPrice(item.price)}</p>
                </div>

                {/* Quantity Control */}
                <div className="flex justify-between items-center md:justify-center md:col-span-2">
                    <div className="md:hidden text-slate-900 dark:text-white font-bold">{formatPrice(item.price)}</div>
                    <div className="flex items-center bg-gray-100 dark:bg-black/20 rounded-full">
                        <button
                            onClick={() => onUpdateQuantity(item.id, -1)}
                            className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-primary transition-colors"
                        >
                            <span className="material-symbols-outlined text-[18px]">remove</span>
                        </button>
                        <input
                            className="w-10 bg-transparent border-0 text-center text-sm font-bold text-slate-900 dark:text-white focus:ring-0 p-0 appearance-none"
                            type="number"
                            value={item.quantity}
                            readOnly
                        />
                        <button
                            onClick={() => onUpdateQuantity(item.id, 1)}
                            className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-primary transition-colors"
                        >
                            <span className="material-symbols-outlined text-[18px]">add</span>
                        </button>
                    </div>
                </div>

                {/* Total & Actions */}
                <div className="flex justify-between items-center md:justify-end md:col-span-2 gap-4">
                    <div className="text-right">
                        <p className="text-lg font-bold text-primary">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                    <div className="flex gap-1 md:absolute md:top-4 md:right-4 md:opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                            onClick={() => onRemove(item.id)}
                            aria-label="Remove item"
                            className="p-1.5 text-slate-400 hover:text-red-500 rounded-full hover:bg-red-500/10 transition-colors"
                        >
                            <span className="material-symbols-outlined text-[20px]">delete</span>
                        </button>
                        <button
                            aria-label="Save for later"
                            className="p-1.5 text-slate-400 hover:text-primary rounded-full hover:bg-primary/10 transition-colors"
                        >
                            <span className="material-symbols-outlined text-[20px]">favorite</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
