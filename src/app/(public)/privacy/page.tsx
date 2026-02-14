"use client";

import { useTranslation } from '@/hooks/useTranslation';

export default function PrivacyPage() {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen bg-surface-dark font-display border-t border-surface-highlight">
            <div className="max-w-[800px] mx-auto px-4 py-16">
                <h1 className="text-4xl font-bold text-white mb-4 uppercase tracking-tight">{t('privacy.title')}</h1>
                <p className="text-primary text-sm font-bold mb-12 italic">{t('privacy.lastUpdated')}</p>

                <div className="prose prose-invert max-w-none space-y-8 text-gray-400">
                    <p className="text-lg leading-relaxed text-white/80">
                        {t('privacy.intro')}
                    </p>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-wider">1. Information We Collect</h2>
                        <p className="leading-relaxed">
                            We collect information that you provide directly to us when you create an account, make a purchase, or communicate with us. This may include your name, email address, phone number, and shipping address.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-wider">2. How We Use Your Information</h2>
                        <p className="leading-relaxed">
                            We use the information we collect to process your orders, provide customer support, and improve our services. We may also send you administrative messages and promotional communications.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-wider">3. Information Sharing</h2>
                        <p className="leading-relaxed">
                            We do not sell your personal information to third parties. We may share your information with service providers who perform services on our behalf, such as payment processing and shipping.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-wider">4. Security</h2>
                        <p className="leading-relaxed">
                            We take reasonable measures to protect your personal information from loss, theft, and unauthorized access. However, no security system is impenetrable, and we cannot guarantee the security of our systems 100%.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
