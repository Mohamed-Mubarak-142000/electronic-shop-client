"use client";

import { useTranslation } from '@/hooks/useTranslation';

export default function InstallationPage() {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen bg-surface-dark font-display border-t border-surface-highlight">
            <div className="max-w-[800px] mx-auto px-4 py-16 text-center">
                <span className="material-symbols-outlined text-primary text-6xl mb-8">engineering</span>
                <h1 className="text-4xl font-bold text-white mb-6 uppercase tracking-tight">{t('installation.title')}</h1>
                <p className="text-gray-400 text-lg mb-12">
                    {t('installation.subtitle')}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                    <div className="bg-surface-light/5 p-8 rounded-3xl border border-surface-highlight">
                        <h3 className="text-white font-bold mb-4 italic">{t('installation.safety.title')}</h3>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6">
                            {t('installation.safety.desc')}
                        </p>
                        <button className="text-primary text-xs font-bold uppercase tracking-widest border-b border-primary/30 pb-1">{t('installation.safety.button')}</button>
                    </div>
                    <div className="bg-surface-light/5 p-8 rounded-3xl border border-surface-highlight">
                        <h3 className="text-white font-bold mb-4 italic">{t('installation.videos.title')}</h3>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6">
                            {t('installation.videos.desc')}
                        </p>
                        <button className="text-primary text-xs font-bold uppercase tracking-widest border-b border-primary/30 pb-1">{t('installation.videos.button')}</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
