'use client';

import { useState, useEffect } from 'react';
import { Column } from '@/components/ui/data-table';
import { AdminDataTable } from '@/components/admin/shared/AdminDataTable';
import { useQuery } from '@tanstack/react-query';
import { userService } from '@/services/userService';
import { useTranslation } from '@/hooks/useTranslation';
import { User } from '@/types';
import { useResourceDelete } from '@/hooks/useResourceDelete';

interface CustomersTableProps {
    filters?: {
        search?: string;
        role?: string;
        sort?: string;
    };
}

export default function CustomersTable({ filters }: CustomersTableProps) {
    const { t } = useTranslation();
    const [page, setPage] = useState(1);
    const limit = 10;

    // Reset page on filter change
    useEffect(() => {
        setPage(1);
    }, [filters]);

    const { data, isLoading } = useQuery({
        queryKey: ['users', page, filters],
        queryFn: () => userService.getUsers({
            page,
            limit,
            search: filters?.search,
            role: filters?.role,
            sort: filters?.sort || '-createdAt'
        }),
    });

    const { handleDelete } = useResourceDelete({
        fn: userService.deleteUser,
        resourceName: 'User',
        queryKey: ['users'],
        successMessage: t('admin.messages.user_deleted'),
    });

    const usersData = data?.users || [];
    const totalPages = data?.pages || 1;
    const totalItems = data?.total || 0; // Assuming API support

    const columns: Column<User>[] = [
        {
            header: t('admin.table.id'),
            cell: (row) => <span className="text-gray-400 text-xs">{row._id.substring(0, 8)}...</span>,
            className: 'w-24'
        },
        {
            header: t('admin.table.name'),
            accessorKey: 'name',
            className: 'font-medium text-white'
        },
        {
            header: t('admin.table.email'),
            accessorKey: 'email',
            className: 'text-gray-400'
        },
        {
            header: t('admin.table.role'),
            cell: (row) => (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${row.role === 'admin' ? 'bg-primary/20 text-primary' : 'bg-gray-700/50 text-gray-300'
                    }`}>
                    {row.role === 'admin' ? t('admin.role.admin') : t('admin.role.customer')}
                </span>
            )
        },
        {
            header: t('admin.table.joined'),
            cell: (row) => <span className="text-gray-400">{new Date(row.createdAt).toLocaleDateString()}</span>,
        },
        {
            header: t('admin.table.actions'),
            className: 'text-right',
            cell: (row) => (
                <div className="flex justify-end gap-2">
                    <button
                        onClick={() => handleDelete(row._id)}
                        className="p-1 hover:bg-white/10 rounded-lg text-gray-400 hover:text-red-400 transition-colors"
                        title={t('admin.tooltips.delete_user')}
                    >
                        <span className="material-symbols-outlined text-[20px]">delete</span>
                    </button>
                </div>
            )
        }
    ];

    return (
        <AdminDataTable
            data={usersData}
            columns={columns}
            totalItems={totalItems}
            currentPage={page}
            onPageChange={setPage}
            limit={limit}
            isLoading={isLoading}
            className="w-full transition-all flex flex-col bg-surface-dark border-white/5 rounded-2xl"
        />
    );
}
