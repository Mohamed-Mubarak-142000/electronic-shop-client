'use client';

import { useState } from 'react';
import BrandsTable from '@/components/admin/BrandsTable';
import { brandService } from '@/services/metadataService';
import { AdminPageHeader } from '@/components/admin/shared/AdminPageHeader';
import { AdminStatsCards, StatCardItem } from '@/components/admin/shared/AdminStatsCards';
import { AdminSearchToolbar } from '@/components/admin/shared/AdminSearchToolbar';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from '@/hooks/useTranslation';

export default function BrandsPage() {
    const { t } = useTranslation();
    const [searchTerm, setSearchTerm] = useState('');

    const { data: stats, isLoading: statsLoading } = useQuery({
        queryKey: ['brand-stats'],
        queryFn: brandService.getBrandStats,
    });

    const statItems: StatCardItem[] = [
        {
            label: t('admin.stats.total_brands'),
            value: stats?.totalBrands || 0,
            icon: 'verified',
            loading: statsLoading
        },
        {
            label: t('admin.stats.active_partners'),
            value: stats?.activeBrands || 0,
            icon: 'handshake',
            loading: statsLoading,
            pillText: t('admin.stats.live')
        },
        {
            label: t('admin.stats.inactive_brands'),
            value: stats?.inactiveBrands || 0,
            icon: 'block',
            iconColor: 'text-orange-400',
            loading: statsLoading,
            pillText: stats?.inactiveBrands > 0 ? t('admin.stats.archived') : undefined,
            pillColor: 'bg-orange-400/10 text-orange-400'
        }
    ];

    return (
        <div className="flex flex-col gap-8">
            <AdminPageHeader
                title={t('admin.brands.title')}
                subtitle={t('admin.brands.subtitle')}
                breadcrumb={[
                    { label: t('admin.sidebar.dashboard'), href: '/admin' },
                    { label: t('admin.sidebar.brands') }
                ]}
                addLink="/admin/brands/create"
                addText={t('admin.brands.add')}
            />

            <AdminStatsCards stats={statItems} />

            <AdminSearchToolbar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                placeholder={t('admin.brands.search_placeholder')}
            />

            <BrandsTable filters={{ searchTerm }} />

            <div className="h-10"></div>
        </div>
    );
}
