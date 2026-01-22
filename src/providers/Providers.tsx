'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { useLanguageStore } from '../store/useLanguageStore';
import { useConfigStore } from '../store/useConfigStore';
import { useEffect } from 'react';
import NewProductDrawer from '../components/admin/NewProductDrawer';
import SocketListener from '../components/shared/SocketListener';

const LanguageWrapper = ({ children }: { children: React.ReactNode }) => {
    const { language, dir } = useLanguageStore();
    const { fetchConfigs } = useConfigStore();

    useEffect(() => {
        document.documentElement.dir = dir;
        document.documentElement.lang = language;
    }, [language, dir]);

    useEffect(() => {
        fetchConfigs();
    }, [fetchConfigs]);

    return <>{children}</>;
};

export default function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient());

    return (
        <QueryClientProvider client={queryClient}>
            <LanguageWrapper>
                <SocketListener />
                {children}
                <NewProductDrawer />
            </LanguageWrapper>
            <Toaster position="top-center" reverseOrder={false} />
        </QueryClientProvider>
    );
}
