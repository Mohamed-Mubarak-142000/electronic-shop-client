"use client";

import { useTranslation } from '@/hooks/useTranslation';

export default function InstallationPage() {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen bg-surface-dark font-display border-t border-surface-highlight">
            <div className="max-w-[800px] mx-auto px-4 py-16 text-center">
                <span className="material-symbols-outlined text-primary text-6xl mb-8">engineering</span>
                <h1 className="text-4xl font-bold text-white mb-6 uppercase tracking-tight">{t('footer.guide')}</h1>
                <p className="text-gray-400 text-lg mb-12">
                    Professional guides for safe and efficient installation of your electrical components.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                    <div className="bg-surface-light/5 p-8 rounded-3xl border border-surface-highlight">
                        <h3 className="text-white font-bold mb-4 italic">Safety First</h3>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6">
                            Always turn off the main power supply before starting any electrical installation. If you're unsure, consult a licensed electrician.
                        </p>
                        <button className="text-primary text-xs font-bold uppercase tracking-widest border-b border-primary/30 pb-1">Read Manifesto</button>
                    </div>
                    <div className="bg-surface-light/5 p-8 rounded-3xl border border-surface-highlight">
                        <h3 className="text-white font-bold mb-4 italic">Video Tutorials</h3>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6">
                            Access our library of step-by-step videos for common products like smart switches and lighting fixtures.
                        </p>
                        <button className="text-primary text-xs font-bold uppercase tracking-widest border-b border-primary/30 pb-1">Watch Now</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
