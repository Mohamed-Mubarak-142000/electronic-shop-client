"use client";

import { useTranslation } from '@/hooks/useTranslation';

export default function FAQPage() {
    const { t } = useTranslation();

    const faqs = [
        {
            q: "Do you ship internationally?",
            a: "Currently, we focus on providing the best service within our primary regions. Please contact support for bulk international orders."
        },
        {
            q: "Are the products certified?",
            a: "Yes, all our electrical components meet standard safety certifications including UL, CE, and RoHS where applicable."
        },
        {
            q: "Can I get a trade discount?",
            a: "Absolutely. Registered professionals and businesses qualify for B2B pricing. Check our 'For Pros' section for more details."
        },
        {
            q: "How fast is delivery?",
            a: "Standard delivery typically takes 2-4 business days. Express shipping options are available at checkout."
        }
    ];

    return (
        <div className="min-h-screen bg-surface-dark font-display border-t border-surface-highlight">
            <div className="max-w-[800px] mx-auto px-4 py-16">
                <h1 className="text-4xl font-bold text-white mb-12 uppercase tracking-tight">{t('footer.faq')}</h1>
                <div className="space-y-6">
                    {faqs.map((faq, idx) => (
                        <div key={idx} className="bg-surface-light/5 p-8 rounded-2xl border border-surface-highlight hover:border-primary/30 transition-all">
                            <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-3 italic">
                                <span className="text-primary font-black">Q:</span>
                                {faq.q}
                            </h3>
                            <p className="text-gray-400 leading-relaxed pl-8">
                                {faq.a}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
