'use client';

import { useEffect } from 'react';
import { useLanguageStore } from '@/store/useLanguageStore';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const { language, dir } = useLanguageStore();

    useEffect(() => {
        // Update html attributes when language changes
        document.documentElement.lang = language;
        document.documentElement.dir = dir;
    }, [language, dir]);

    return <>{children}</>;
}
