import React from 'react';

export interface StatCardItem {
    label: string;
    value: number | string;
    icon: string;
    iconColor?: string; // Tailwind class like 'text-primary'
    pillText?: string;
    pillColor?: string; // Tailwind class for background/text like 'bg-orange-400/10 text-orange-400'
    loading?: boolean;
}

interface AdminStatsCardsProps {
    stats: StatCardItem[];
}

export function AdminStatsCards({ stats }: AdminStatsCardsProps) {
    return (
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
                <div key={index} className="flex flex-col gap-1 rounded-xl p-4 sm:p-5 border border-white/10 bg-surface-dark shadow-sm">
                    <div className="flex items-center justify-between">
                        <p className="text-gray-400 text-xs sm:text-sm font-medium">{stat.label}</p>
                        <span className={`material-symbols-outlined text-[20px] sm:text-[24px] ${stat.iconColor || 'text-primary'}`}>{stat.icon}</span>
                    </div>
                    <div className="flex items-baseline flex-wrap gap-2 mt-2">
                        <p className="text-white text-xl sm:text-2xl font-bold">
                            {stat.loading ? '...' : stat.value}
                        </p>
                        {stat.pillText && (
                            <p className={`text-[10px] sm:text-xs font-medium px-2 py-0.5 rounded-full ${stat.pillColor || 'bg-primary/10 text-primary'}`}>
                                {stat.pillText}
                            </p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
