"use client";

import { useTranslation } from '@/hooks/useTranslation';

export default function TrackOrderPage() {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen bg-surface-dark font-display border-t border-surface-highlight">
            <div className="max-w-[800px] mx-auto px-4 py-32 text-center">
                <h1 className="text-4xl font-bold text-white mb-8 uppercase tracking-tight">{t('trackOrder.title')}</h1>
                <p className="text-gray-400 text-lg mb-12">
                    {t('trackOrder.subtitle')}
                </p>
                <div className="bg-surface-light/5 p-8 md:p-12 rounded-3xl border border-surface-highlight max-w-md mx-auto">
                    <form className="space-y-6">
                        <div className="space-y-2 text-left">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest italic">{t('trackOrder.orderId')}</label>
                            <input
                                type="text"
                                className="w-full bg-surface-dark border border-surface-highlight rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-all"
                                placeholder={t('trackOrder.orderIdPlaceholder')}
                            />
                        </div>
                        <div className="space-y-2 text-left">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest italic">{t('trackOrder.email')}</label>
                            <input
                                type="email"
                                className="w-full bg-surface-dark border border-surface-highlight rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-all"
                                placeholder={t('trackOrder.emailPlaceholder')}
                            />
                        </div>
                        <button className="w-full bg-primary text-text-on-primary-darker font-black py-4 rounded-xl hover:brightness-110 transition-all uppercase tracking-widest">
                            {t('trackOrder.trackButton')}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
