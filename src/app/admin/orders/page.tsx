'use client';

import { useState } from 'react';
import OrdersTable from '@/components/admin/OrdersTable';
import { useTranslation } from '@/hooks/useTranslation';
import { AdminPageHeader } from '@/components/admin/shared/AdminPageHeader';
import { AdminSearchToolbar } from '@/components/admin/shared/AdminSearchToolbar';

export default function OrdersPage() {
    const { t } = useTranslation();
    const [searchTerm, setSearchTerm] = useState('');
    const [status, setStatus] = useState('');
    const [sort, setSort] = useState('-createdAt');

    return (
        <div className="flex flex-col gap-6">
            <AdminPageHeader
                title={t('admin.orders.title')}
                subtitle={t('admin.orders.subtitle')}
                breadcrumb={[
                    { label: t('admin.sidebar.dashboard'), href: '/admin' },
                    { label: t('admin.sidebar.orders') }
                ]}
            />

            <AdminSearchToolbar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                placeholder={t('admin.orders.search_placeholder')}
            >
                <select
                    className="form-select block w-full sm:w-auto pl-3 pr-10 py-2 text-sm border-none rounded-lg bg-surface-dark text-foreground focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                >
                    <option value="">{t('admin.orders.all_statuses')}</option>
                    <option value="Pending">{t('admin.status.pending')}</option>
                    <option value="Processing">{t('admin.status.processing')}</option>
                    <option value="Shipped">{t('admin.status.shipped')}</option>
                    <option value="Delivered">{t('admin.status.delivered')}</option>
                    <option value="Cancelled">{t('admin.status.cancelled')}</option>
                </select>
                
                <div className="h-9 w-px bg-border mx-1 hidden sm:block"></div>
                <select
                    className="form-select block w-full sm:w-auto pl-3 pr-10 py-2 text-sm border-none rounded-lg bg-surface-dark text-foreground focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                >
                    <option value="-createdAt">{t('admin.orders.sort.newest')}</option>
                    <option value="createdAt">{t('admin.orders.sort.oldest')}</option>
                    <option value="-total">{t('admin.orders.sort.highest_value')}</option>
                    <option value="total">{t('admin.orders.sort.lowest_value')}</option>
                </select>
            </AdminSearchToolbar>

            <OrdersTable filters={{ search: searchTerm, status, sort }} />
            
            <div className="h-10"></div>
        </div>
    );
}
