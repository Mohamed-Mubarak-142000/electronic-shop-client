'use client';

import { useState } from 'react';
import CategoriesTable from '@/components/admin/CategoriesTable';
import { categoryService } from '@/services/metadataService';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from '@/hooks/useTranslation';
import { AdminPageHeader } from '@/components/admin/shared/AdminPageHeader';
import { AdminStatsCards, StatCardItem } from '@/components/admin/shared/AdminStatsCards';
import { AdminSearchToolbar } from '@/components/admin/shared/AdminSearchToolbar';

export default function CategoriesPage() {
    const { t } = useTranslation();
    const [searchTerm, setSearchTerm] = useState('');

    const { data: stats, isLoading: statsLoading } = useQuery({
        queryKey: ['category-stats'],
        queryFn: categoryService.getCategoryStats,
    });

    const statItems: StatCardItem[] = [
        {
            label: t('admin.stats.total_categories'),
            value: stats?.totalCategories || 0,
            icon: 'grid_view',
            loading: statsLoading
        },
        {
            label: t('admin.stats.active_categories'),
            value: stats?.activeCategories || 0,
            icon: 'visibility',
            loading: statsLoading,
            pillText: t('admin.stats.live')
        },
        {
            label: t('admin.stats.hidden_categories'),
            value: stats?.hiddenCategories || 0,
            icon: 'visibility_off',
            iconColor: 'text-orange-400',
            loading: statsLoading,
            pillText: stats?.hiddenCategories > 0 ? t('admin.stats.draft') : undefined,
            pillColor: 'bg-orange-400/10 text-orange-400'
        }
    ];

    return (
        <div className="flex flex-col gap-8">
            <AdminPageHeader
                title={t('admin.categories.title')}
                subtitle={t('admin.categories.subtitle')}
                breadcrumb={[
                    { label: t('admin.sidebar.dashboard'), href: '/admin' },
                    { label: t('admin.sidebar.categories') }
                ]}
                addLink="/admin/categories/create"
                addText={t('admin.categories.add')}
            />

            <AdminStatsCards stats={statItems} />

            <AdminSearchToolbar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                placeholder={t('admin.categories.search_placeholder')}
            >
                {/* Extra filters if needed */}
                 <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-background-dark hover:bg-white/5 text-white text-sm font-medium transition-colors">
                    <span className="material-symbols-outlined text-[18px]">sort</span>
                    <span>Name (A-Z)</span>
                </button>
            </AdminSearchToolbar>

            <CategoriesTable filters={{ searchTerm }} />

            <div className="h-10"></div>
        </div>
    );
}

