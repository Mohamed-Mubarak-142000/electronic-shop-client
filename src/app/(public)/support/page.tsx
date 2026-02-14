"use client";

import { useTranslation } from '@/hooks/useTranslation';

export default function SupportPage() {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen bg-surface-dark font-display border-t border-surface-highlight">
            {/* Header Section */}
            <div className="bg-background-darker py-20 border-b border-surface-highlight">
                <div className="max-w-[1440px] mx-auto px-4 md:px-10 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 uppercase tracking-tight">
                        {t('support.title')}
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        {t('support.subtitle')}
                    </p>
                </div>
            </div>

            <div className="max-w-[1440px] mx-auto px-4 md:px-10 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-12">
                        {/* What is Project */}
                        <section className="bg-surface-light/5 rounded-3xl p-8 md:p-12 border border-surface-highlight hover:border-primary/30 transition-all">
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                <span className="material-symbols-outlined text-primary">bolt</span>
                                {t('support.whatis.title')}
                            </h2>
                            <p className="text-gray-400 leading-relaxed mb-8">
                                {t('support.whatis.description')}
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <h3 className="text-lg font-bold text-white mb-4">{t('support.purpose.title')}</h3>
                                    <p className="text-gray-400 text-sm leading-relaxed">
                                        {t('support.purpose.description')}
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white mb-4">{t('support.services.title')}</h3>
                                    <ul className="space-y-3">
                                        {[1, 2, 3, 4].map((i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
                                                <span className="material-symbols-outlined text-primary text-xs mt-1">check_circle</span>
                                                {t(`support.services.item${i}` as any)}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </section>

                        {/* Immediate Assistance */}
                        <section className="bg-surface-light/5 rounded-3xl p-8 md:p-12 border border-surface-highlight">
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                <span className="material-symbols-outlined text-primary">help_center</span>
                                {t('support.help.title')}
                            </h2>
                            <p className="text-gray-400 leading-relaxed mb-8">
                                {t('support.help.description')}
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-surface-dark border border-surface-highlight p-6 rounded-2xl hover:bg-surface-highlight transition-all group">
                                    <span className="material-symbols-outlined text-primary text-3xl mb-4">mail</span>
                                    <h3 className="text-white font-bold mb-2">{t('support.channels.email')}</h3>
                                    <p className="text-gray-500 text-xs mb-4">support@electroshop.com</p>
                                    <a href="mailto:support@electroshop.com" className="text-primary text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all italic">
                                        Send Mail <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                    </a>
                                </div>
                                <div className="bg-surface-dark border border-surface-highlight p-6 rounded-2xl hover:bg-surface-highlight transition-all group">
                                    <span className="material-symbols-outlined text-primary text-3xl mb-4">call</span>
                                    <h3 className="text-white font-bold mb-2">{t('support.channels.phone')}</h3>
                                    <p className="text-gray-500 text-xs mb-4">+1 (800) ELECTRO</p>
                                    <a href="tel:+18003532876" className="text-primary text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all italic">
                                        Call Now <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                    </a>
                                </div>
                                <div className="bg-surface-dark border border-surface-highlight p-6 rounded-2xl hover:bg-surface-highlight transition-all group">
                                    <span className="material-symbols-outlined text-primary text-3xl mb-4">forum</span>
                                    <h3 className="text-white font-bold mb-2">{t('support.channels.chat')}</h3>
                                    <p className="text-gray-500 text-xs mb-4">Available 24/7</p>
                                    <button className="text-primary text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all italic">
                                        Start Chat <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                    </button>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Sidebar / Help Guidance */}
                    <div className="space-y-8">
                        <section className="bg-primary/10 border border-primary/20 rounded-3xl p-8 sticky top-24">
                            <span className="material-symbols-outlined text-primary text-4xl mb-6">tips_and_updates</span>
                            <h2 className="text-xl font-bold text-white mb-4">{t('support.guidance.title')}</h2>
                            <p className="text-gray-300 text-sm leading-relaxed mb-6 italic">
                                "{t('support.guidance.text')}"
                            </p>
                            <div className="pt-6 border-t border-primary/20">
                                <h3 className="text-white font-bold text-sm mb-4 italic">Quick Links</h3>
                                <ul className="space-y-4">
                                    {['faq', 'returns', 'guide', 'trackOrder'].map((link) => (
                                        <li key={link}>
                                            <a href={`/${link.toLowerCase().replace('order', '-order')}`} className="text-gray-400 hover:text-primary transition-colors text-sm flex items-center justify-between group">
                                                {t(`footer.${link}` as any)}
                                                <span className="material-symbols-outlined text-xs opacity-0 group-hover:opacity-100 transition-all">north_east</span>
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
