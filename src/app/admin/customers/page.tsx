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
                placeholder={t('admin.customers.search_placeholder')}
            >
                <select
                    className="form-select block w-full sm:w-auto pl-3 pr-10 py-2 text-sm border-none rounded-lg bg-surface-dark text-foreground focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                >
                    <option value="">{t('admin.customers.all_roles')}</option>
                    <option value="user">{t('admin.customers.role.user')}</option>
                    <option value="admin">{t('admin.customers.role.admin')}</option>
                    <option value="business">{t('admin.customers.role.business')}</option>
                </select>
                
                <div className="h-9 w-px bg-border mx-1 hidden sm:block"></div>
                <select
                    className="form-select block w-full sm:w-auto pl-3 pr-10 py-2 text-sm border-none rounded-lg bg-surface-dark text-foreground focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                >
                    <option value="-createdAt">{t('admin.customers.sort.newest')}</option>
                    <option value="createdAt">{t('admin.customers.sort.oldest')}</option>
                    <option value="name">{t('admin.customers.sort.name_asc')}</option>
                    <option value="-name">{t('admin.customers.sort.name_desc')}</option>
                </select>
            </AdminSearchToolbar>

            <CustomersTable filters={{ search: searchTerm, role, sort }} />
            
            <div className="h-10"></div>
        </div>
    );
}
