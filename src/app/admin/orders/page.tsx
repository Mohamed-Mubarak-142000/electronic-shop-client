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
                placeholder="Search by Order ID..."
            >
                <select
                    className="form-select block w-full sm:w-auto pl-3 pr-10 py-2 text-sm border-none rounded-lg bg-background-dark text-white focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                >
                    <option value="">All Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                </select>
                
                <div className="h-9 w-px bg-white/10 mx-1 hidden sm:block"></div>
                <select
                    className="form-select block w-full sm:w-auto pl-3 pr-10 py-2 text-sm border-none rounded-lg bg-background-dark text-white focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                >
                    <option value="-createdAt">Newest First</option>
                    <option value="createdAt">Oldest First</option>
                    <option value="-total">Highest Value</option>
                    <option value="total">Lowest Value</option>
                </select>
            </AdminSearchToolbar>

            <OrdersTable filters={{ search: searchTerm, status, sort }} />
            
            <div className="h-10"></div>
        </div>
    );
}
