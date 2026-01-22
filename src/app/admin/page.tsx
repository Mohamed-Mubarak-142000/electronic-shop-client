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
        return <div className="text-white">Loading dashboard...</div>;
    }

    return (
        <>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-white tracking-tight">{t('admin.dashboard')}</h2>
                    <p className="text-gray-400 mt-1">{t('admin.dashboard_subtitle')}</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-card-dark border border-white/10 hover:bg-white/5 text-white rounded-lg text-sm font-medium transition-colors">
                        <span className="material-symbols-outlined text-lg">cloud_download</span>
                        {t('admin.export')}
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-green-400 text-background-dark rounded-lg text-sm font-bold transition-colors shadow-[0_0_15px_rgba(54,226,123,0.3)]">
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
