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
                        <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-wider italic">1. Acceptance of Terms</h2>
                        <p className="leading-relaxed">
                            By accessing or using ElectroShop, you agree to be bound by these Terms of Service and all applicable laws and regulations.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-wider italic">2. User Accounts</h2>
                        <p className="leading-relaxed">
                            You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-wider italic">3. Product Information</h2>
                        <p className="leading-relaxed">
                            We attempt to be as accurate as possible with our product descriptions. However, we do not warrant that product descriptions or other content are accurate, complete, reliable, current, or error-free.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-wider italic">4. Limitation of Liability</h2>
                        <p className="leading-relaxed">
                            In no event shall ElectroShop be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or in connection with your use of the site.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
