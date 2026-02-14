"use client";

import { useTranslation } from '@/hooks/useTranslation';

export default function ContactPage() {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen bg-surface-dark font-display border-t border-surface-highlight">
            <div className="bg-[#0b1610] py-20 border-b border-surface-highlight">
                <div className="max-w-[1440px] mx-auto px-4 md:px-10 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 uppercase tracking-tight">
                        {t('contact.title')}
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        {t('contact.subtitle')}
                    </p>
                </div>
            </div>

            <div className="max-w-[1440px] mx-auto px-4 md:px-10 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    {/* Contact Form */}
                    <div className="bg-surface-light/5 rounded-3xl p-8 md:p-12 border border-surface-highlight">
                        <form className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-400 uppercase tracking-widest">{t('contact.form.name')}</label>
                                    <input
                                        type="text"
                                        className="w-full bg-surface-dark border border-surface-highlight rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-all"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-400 uppercase tracking-widest">{t('contact.form.email')}</label>
                                    <input
                                        type="email"
                                        className="w-full bg-surface-dark border border-surface-highlight rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-all"
                                        placeholder="john@example.com"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-400 uppercase tracking-widest">{t('contact.form.subject')}</label>
                                <input
                                    type="text"
                                    className="w-full bg-surface-dark border border-surface-highlight rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-all"
                                    placeholder="Order Inquiry"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-400 uppercase tracking-widest">{t('contact.form.message')}</label>
                                <textarea
                                    rows={5}
                                    className="w-full bg-surface-dark border border-surface-highlight rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-all resize-none"
                                    placeholder="How can we help?"
                                />
                            </div>
                            <button className="w-full bg-primary text-[#0b1610] font-black py-4 rounded-xl hover:brightness-110 transition-all uppercase tracking-widest">
                                {t('contact.form.send')}
                            </button>
                        </form>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-12">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="p-8 bg-surface-light/5 rounded-3xl border border-surface-highlight group hover:border-primary/30 transition-all">
                                <span className="material-symbols-outlined text-primary text-4xl mb-4 group-hover:scale-110 transition-transform">location_on</span>
                                <h3 className="text-white font-bold text-lg mb-2 italic">Visit Us</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    123 Circuit Avenue<br />
                                    Power Plaza, Level 4<br />
                                    New York, NY 10001
                                </p>
                            </div>
                            <div className="p-8 bg-surface-light/5 rounded-3xl border border-surface-highlight group hover:border-primary/30 transition-all">
                                <span className="material-symbols-outlined text-primary text-4xl mb-4 group-hover:scale-110 transition-transform">call</span>
                                <h3 className="text-white font-bold text-lg mb-2 italic">Call Us</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    Support: +1 (800) ELECTRO<br />
                                    Sales: +1 (888) VOLTAGE
                                </p>
                            </div>
                        </div>

                        <div className="relative aspect-video rounded-3xl overflow-hidden border border-surface-highlight grayscale hover:grayscale-0 transition-all cursor-crosshair">
                            <img
                                src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=1200"
                                alt="Modern Office"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                                <div className="bg-[#0b1610] p-4 rounded-full border border-primary/50 animate-pulse">
                                    <span className="material-symbols-outlined text-primary">location_on</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
