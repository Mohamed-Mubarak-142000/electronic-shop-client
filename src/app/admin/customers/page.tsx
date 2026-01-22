'use client';

import { useState } from 'react';
import CustomersTable from '@/components/admin/CustomersTable';
import { useTranslation } from '@/hooks/useTranslation';
import { AdminPageHeader } from '@/components/admin/shared/AdminPageHeader';
import { AdminSearchToolbar } from '@/components/admin/shared/AdminSearchToolbar';

export default function CustomersPage() {
    const { t } = useTranslation();
    const [searchTerm, setSearchTerm] = useState('');
    const [role, setRole] = useState('');
    const [sort, setSort] = useState('-createdAt');

    return (
        <div className="flex flex-col gap-6">
            <AdminPageHeader
                title={t('admin.customers.title')}
                subtitle={t('admin.customers.subtitle')}
                breadcrumb={[
                    { label: t('admin.sidebar.dashboard'), href: '/admin' },
                    { label: t('admin.sidebar.customers') }
                ]}
            />

            <AdminSearchToolbar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                placeholder="Search by name or email..."
            >
                <select
                    className="form-select block w-full sm:w-auto pl-3 pr-10 py-2 text-sm border-none rounded-lg bg-background-dark text-white focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                >
                    <option value="">All Roles</option>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    <option value="business">Business</option>
                </select>
                
                <div className="h-9 w-px bg-white/10 mx-1 hidden sm:block"></div>
                <select
                    className="form-select block w-full sm:w-auto pl-3 pr-10 py-2 text-sm border-none rounded-lg bg-background-dark text-white focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                >
                    <option value="-createdAt">Newest First</option>
                    <option value="createdAt">Oldest First</option>
                    <option value="name">Name (A-Z)</option>
                    <option value="-name">Name (Z-A)</option>
                </select>
            </AdminSearchToolbar>

            <CustomersTable filters={{ search: searchTerm, role, sort }} />
            
            <div className="h-10"></div>
        </div>
    );
}
