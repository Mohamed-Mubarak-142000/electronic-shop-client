'use client';

import DashboardStats from '@/components/admin/DashboardStats';
import RevenueChart from '@/components/admin/RevenueChart';
import OrdersStatusChart from '@/components/admin/OrdersStatusChart';
import RecentOrders from '@/components/admin/RecentOrders';
import LowStockAlert from '@/components/admin/LowStockAlert';
import { useState, useEffect } from 'react';
import dashboardService, { DashboardStats as DashboardStatsType } from '@/services/dashboardService';
import { useTranslation } from '@/hooks/useTranslation';

export default function AdminDashboardPage() {
    const { t } = useTranslation();
    const [stats, setStats] = useState<DashboardStatsType | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await dashboardService.getDashboardStats();
                setStats(data);
            } catch (error) {
                console.error('Failed to fetch dashboard stats', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return <div className="text-foreground">{t('common.loading')}</div>;
    }

    return (
        <>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-foreground tracking-tight">{t('admin.dashboard')}</h2>
                    <p className="text-text-secondary mt-1">{t('admin.dashboard_subtitle')}</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-card-dark border border-border hover:bg-surface-highlight text-foreground rounded-lg text-sm font-medium transition-colors">
                        <span className="material-symbols-outlined text-lg">cloud_download</span>
                        {t('admin.export')}
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-text-on-primary rounded-lg text-sm font-bold transition-colors shadow-[0_0_15px_rgba(54,226,123,0.3)]">
                        <span className="material-symbols-outlined text-lg">add</span>
                        {t('admin.add_product')}
                    </button>
                </div>
            </div>

            <DashboardStats stats={stats} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <RevenueChart data={stats?.revenueGraphData} />
                <OrdersStatusChart />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
                <RecentOrders orders={stats?.recentOrders} />
                <LowStockAlert products={stats?.lowStockProducts} />
            </div>
        </>
    );
}
