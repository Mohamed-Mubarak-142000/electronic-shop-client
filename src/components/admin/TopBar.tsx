'use client';

import { useTranslation } from '@/hooks/useTranslation';

export default function TopBar() {
    const { t } = useTranslation();

    return (
        <header className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-background-dark/95 backdrop-blur z-10 shrink-0">
            {/* Mobile Menu Toggle */}
            <button className="md:hidden text-white mr-4">
                <span className="material-symbols-outlined">menu</span>
            </button>

            {/* Search */}
            <div className="flex-1 max-w-xl">
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="material-symbols-outlined text-gray-400">search</span>
                    </div>
                    <input
                        className="block w-full pl-10 pr-3 py-2.5 rounded-lg border-none bg-card-dark text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm transition-all"
                        placeholder={t('admin.search_placeholder')}
                        type="text"
                    />
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4 ml-6">
                <button
                    className="relative p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                    title={t('admin.notifications')}
                >
                    <span className="material-symbols-outlined">notifications</span>
                    <span className="absolute top-2 right-2 size-2 bg-primary rounded-full border-2 border-background-dark"></span>
                </button>
                <button
                    className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                    title={t('admin.mail')}
                >
                    <span className="material-symbols-outlined">mail</span>
                </button>
            </div>
        </header>
    );
}
