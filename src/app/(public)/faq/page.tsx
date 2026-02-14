"use client";

import { useTranslation } from '@/hooks/useTranslation';

export default function FAQPage() {
    const { t } = useTranslation();

    const faqs = [
        {
            q: t('faq.question1'),
            a: t('faq.answer1')
        },
        {
            q: t('faq.question2'),
            a: t('faq.answer2')
        },
        {
            q: t('faq.question3'),
            a: t('faq.answer3')
        },
        {
            q: t('faq.question4'),
            a: t('faq.answer4')
        },
        {
            q: t('faq.question5'),
            a: t('faq.answer5')
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
