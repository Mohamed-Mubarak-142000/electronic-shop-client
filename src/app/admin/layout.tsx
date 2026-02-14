'use client';

import { Inter } from 'next/font/google';
import Sidebar from '@/components/admin/Sidebar';
import TopBar from '@/components/admin/TopBar';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const inter = Inter({ subsets: ['latin'] });

export default function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { user } = useAuthStore();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted) {
            if (!user) {
                router.push('/login?redirect=/admin');
            } else if (user.role !== 'admin') {
                router.push('/');
            }
        }
    }, [user, router, mounted]);

    useEffect(() => {
        setIsSidebarOpen(false);
    }, [router]);

    if (!mounted) {
        return null;
    }

    if (!user || user.role !== 'admin') {
        return null;
    }

    return (
        <div className={`flex h-screen w-full flex-row overflow-hidden ${inter.className} bg-background-dark relative`}>
            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <div className="flex-1 flex flex-col h-full overflow-hidden bg-background-dark relative">
                <TopBar onMenuClick={() => setIsSidebarOpen(true)} />
                <main className="flex-1 overflow-y-auto scroll-smooth">
                    <div className="px-4 md:mx-10 my-4 flex flex-col gap-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
