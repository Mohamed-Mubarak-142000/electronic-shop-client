import React from 'react';
import { useTranslation } from "@/hooks/useTranslation";
import { useCurrency } from "@/hooks/useCurrency";

interface OrderSummaryProps {
    subtotal: number;
    tax: number;
    total: number;
    onCheckout: () => void;
}

export default function OrderSummary({ subtotal, tax, total, onCheckout }: OrderSummaryProps) {
    const { t } = useTranslation();
    const { formatPrice } = useCurrency();

    return (
        <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-lg border border-gray-100 dark:border-surface-highlight p-6 md:p-8 flex flex-col gap-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{t('order_summary')}</h2>
            <div className="space-y-4">
                <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                    <span className="text-sm">{t('subtotal')}</span>
                    <span className="font-bold text-slate-900 dark:text-white">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                    <span className="text-sm">{t('tax')}</span>
                    <span className="font-bold text-slate-900 dark:text-white">{formatPrice(tax)}</span>
                </div>
                <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                    <span className="text-sm">{t('shipping')}</span>
                    <span className="font-bold text-primary">{t('free')}</span>
                </div>
            </div>
            <div className="border-t border-dashed border-slate-200 dark:border-surface-highlight my-2"></div>
            <div className="flex justify-between items-end">
                <span className="text-base font-bold text-slate-900 dark:text-white">{t('total')}</span>
                <div className="text-right">
                    
                    <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                        {formatPrice(total)}
                    </span>
                </div>
            </div>

            <button
                onClick={onCheckout}
                className="w-full bg-primary hover:bg-green-400 text-surface-dark font-black text-lg py-4 rounded-full shadow-[0_0_20px_rgba(54,226,123,0.3)] hover:shadow-[0_0_30px_rgba(54,226,123,0.5)] transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 mt-4"
            >
                <span>{t('checkout')}</span>
                <span className="material-symbols-outlined rtl:rotate-180">arrow_forward</span>
            </button>

            {/* Trust Signals */}
            <div className="flex justify-center gap-6 mt-2 pt-4 border-t border-slate-100 dark:border-surface-highlight">
                <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400" title="Secure Payment">
                    <span className="material-symbols-outlined text-[16px]">lock</span>
                    <span>Secure</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400" title="Fast Shipping">
                    <span className="material-symbols-outlined text-[16px]">local_shipping</span>
                    <span>Express</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400" title="Warranty">
                    <span className="material-symbols-outlined text-[16px]">verified_user</span>
                    <span>Warranty</span>
                </div>
            </div>
        </div>
    );
}
