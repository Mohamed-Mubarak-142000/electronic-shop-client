"use client";

import { useTranslation } from '@/hooks/useTranslation';

export default function ReturnsPage() {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen bg-surface-dark font-display border-t border-surface-highlight">
            <div className="max-w-[800px] mx-auto px-4 py-16">
                <h1 className="text-4xl font-bold text-white mb-8 uppercase tracking-tight">{t('returns.title')}</h1>
                <div className="space-y-12">
                    <section className="bg-surface-light/5 p-8 rounded-3xl border border-surface-highlight">
                        <h2 className="text-xl font-bold text-white mb-4 italic flex items-center gap-3">
                            <span className="material-symbols-outlined text-primary">published_with_changes</span>
                            {t('returns.policy.title')}
                        </h2>
                        <p className="text-gray-400 leading-relaxed">
                            {t('returns.policy.desc')}
                        </p>
                    </section>
                    <section className="bg-surface-light/5 p-8 rounded-3xl border border-surface-highlight">
                        <h2 className="text-xl font-bold text-white mb-4 italic flex items-center gap-3">
                            <span className="material-symbols-outlined text-primary">local_shipping</span>
                            {t('returns.shipping.title')}
                        </h2>
                        <p className="text-gray-400 leading-relaxed">
                            {t('returns.shipping.desc')}
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
