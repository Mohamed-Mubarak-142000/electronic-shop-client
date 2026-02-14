"use client";

import { useTranslation } from '@/hooks/useTranslation';
import Link from 'next/link';

export default function SitemapPage() {
    const { t } = useTranslation();

    const sections = [
        {
            title: t('footer.shop'),
            links: [
                { label: t('footer.allProducts'), href: '/shop' },
                { label: t('footer.lighting'), href: '/shop?category=lighting' },
                { label: t('footer.fans'), href: '/shop?category=fans' },
                { label: t('footer.tools'), href: '/shop?category=tools' },
                { label: t('footer.clearance'), href: '/shop?category=clearance' },
            ]
        },
        {
            title: t('footer.support'),
            links: [
                { label: t('support.title'), href: '/support' },
                { label: t('footer.trackOrder'), href: '/track-order' },
                { label: t('footer.returns'), href: '/returns' },
                { label: t('footer.guide'), href: '/installation' },
                { label: t('footer.faq'), href: '/faq' },
                { label: t('footer.contact'), href: '/contact' },
            ]
        },
        {
            title: t('common.account' as any),
            links: [
                { label: t('nav.profile'), href: '/profile' },
                { label: t('cart'), href: '/cart' },
                { label: t('wishlist'), href: '/wishlist' },
            ]
        },
        {
            title: t('common.legal' as any),
            links: [
                { label: t('footer.aboutUs'), href: '/about' },
                { label: t('footer.privacy'), href: '/privacy' },
                { label: t('footer.terms'), href: '/terms' },
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-surface-dark font-display border-t border-surface-highlight">
            <div className="max-w-[1440px] mx-auto px-4 md:px-10 py-16">
                <h1 className="text-4xl font-bold text-white mb-12 uppercase tracking-tight italic">{t('footer.sitemap')}</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {sections.map((section, idx) => (
                        <div key={idx} className="space-y-6">
                            <h2 className="text-primary font-bold uppercase tracking-widest text-sm">{section.title}</h2>
                            <ul className="space-y-4">
                                {section.links.map((link, lIdx) => (
                                    <li key={lIdx}>
                                        <Link href={link.href} className="text-gray-400 hover:text-white transition-colors text-lg font-medium">
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
