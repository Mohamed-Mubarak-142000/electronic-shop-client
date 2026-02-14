"use client";

import { useTranslation } from '@/hooks/useTranslation';

export default function TermsPage() {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen bg-surface-dark font-display border-t border-surface-highlight">
            <div className="max-w-[800px] mx-auto px-4 py-16">
                <h1 className="text-4xl font-bold text-white mb-4 uppercase tracking-tight">{t('terms.title')}</h1>
                <p className="text-primary text-sm font-bold mb-12 italic">{t('terms.lastUpdated')}</p>

                <div className="prose prose-invert max-w-none space-y-8 text-gray-400">
                    <p className="text-lg leading-relaxed text-white/80">
                        {t('terms.intro')}
                    </p>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-wider italic">{t('terms.section1.title')}</h2>
                        <p className="leading-relaxed">
                            {t('terms.section1.desc')}
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-wider italic">{t('terms.section2.title')}</h2>
                        <p className="leading-relaxed">
                            {t('terms.section2.desc')}
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-wider italic">{t('terms.section3.title')}</h2>
                        <p className="leading-relaxed">
                            {t('terms.section3.desc')}
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-wider italic">{t('terms.section4.title')}</h2>
                        <p className="leading-relaxed">
                            {t('terms.section4.desc')}
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
