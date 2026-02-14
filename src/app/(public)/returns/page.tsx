"use client";

import { useTranslation } from '@/hooks/useTranslation';

export default function ReturnsPage() {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen bg-surface-dark font-display border-t border-surface-highlight">
            <div className="max-w-[800px] mx-auto px-4 py-16">
                <h1 className="text-4xl font-bold text-white mb-8 uppercase tracking-tight">{t('footer.returns')}</h1>
                <div className="space-y-12">
                    <section className="bg-surface-light/5 p-8 rounded-3xl border border-surface-highlight">
                        <h2 className="text-xl font-bold text-white mb-4 italic flex items-center gap-3">
                            <span className="material-symbols-outlined text-primary">published_with_changes</span>
                            30-Day Policy
                        </h2>
                        <p className="text-gray-400 leading-relaxed">
                            We offer a 30-day return policy for all unused components in their original packaging.
                            Electrical parts that have been installed or show signs of use are not eligible for return due to safety regulations.
                        </p>
                    </section>
                    <section className="bg-surface-light/5 p-8 rounded-3xl border border-surface-highlight">
                        <h2 className="text-xl font-bold text-white mb-4 italic flex items-center gap-3">
                            <span className="material-symbols-outlined text-primary">local_shipping</span>
                            Return Shipping
                        </h2>
                        <p className="text-gray-400 leading-relaxed">
                            Customers are responsible for return shipping costs unless the item arrived damaged or incorrect.
                            We recommend using a trackable shipping service.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
