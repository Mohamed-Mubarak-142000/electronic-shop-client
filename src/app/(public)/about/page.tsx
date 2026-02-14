"use client";

import { useTranslation } from '@/hooks/useTranslation';

export default function AboutPage() {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen bg-surface-dark font-display border-t border-surface-highlight">
            <div className="bg-background-darker py-20 border-b border-surface-highlight">
                <div className="max-w-[1440px] mx-auto px-4 md:px-10 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 uppercase tracking-tight">
                        {t('about.title')}
                    </h1>
                </div>
            </div>

            <div className="max-w-[1440px] mx-auto px-4 md:px-10 py-16 space-y-16">
                <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-6 uppercase tracking-tight">
                            {t('about.story')}
                        </h2>
                        <p className="text-gray-400 leading-relaxed text-lg">
                            {t('about.story.desc')}
                        </p>
                    </div>
                    <div className="relative aspect-video rounded-3xl overflow-hidden border border-surface-highlight">
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0b1610] to-transparent opacity-60 z-10" />
                        <img
                            src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=1200"
                            alt="Electrical Warehouse"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </section>

                <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className="order-2 md:order-1 relative aspect-video rounded-3xl overflow-hidden border border-surface-highlight">
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0b1610] to-transparent opacity-60 z-10" />
                        <img
                            src="https://images.unsplash.com/photo-1558444479-c748d5d1230e?auto=format&fit=crop&q=80&w=1200"
                            alt="Electrical Engineering"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="order-1 md:order-2">
                        <h2 className="text-3xl font-bold text-white mb-6 uppercase tracking-tight italic">
                            {t('about.mission')}
                        </h2>
                        <p className="text-gray-400 leading-relaxed text-lg">
                            {t('about.mission.desc')}
                        </p>
                    </div>
                </section>

                <section className="bg-surface-light/5 rounded-3xl p-8 md:p-12 border border-surface-highlight text-center">
                    <h2 className="text-2xl font-bold text-white mb-8 uppercase tracking-widest">{t('home.trustedBrands')}</h2>
                    <div className="flex flex-wrap justify-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all">
                        {/* Placeholder for brand logos */}
                        <span className="text-white font-bold text-2xl italic tracking-tighter">VOLT</span>
                        <span className="text-white font-bold text-2xl italic tracking-tighter">AMP</span>
                        <span className="text-white font-bold text-2xl italic tracking-tighter">CIRCUIT</span>
                        <span className="text-white font-bold text-2xl italic tracking-tighter">GRID</span>
                        <span className="text-white font-bold text-2xl italic tracking-tighter">POWER</span>
                    </div>
                </section>
            </div>
        </div>
    );
}
