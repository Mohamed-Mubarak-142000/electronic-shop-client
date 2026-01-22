'use client';

import { useState } from 'react';
import { Column } from '@/components/ui/data-table';
import { AdminDataTable } from '@/components/admin/shared/AdminDataTable';
import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';
import { useTranslation } from '@/hooks/useTranslation';
import { useResourceDelete } from '@/hooks/useResourceDelete';

interface Job {
    _id: string;
    name: string;
    type: string;
    scheduledAt: string;
    status: string;
    data: Record<string, unknown>;
    imageUrl?: string;
}

export default function JobsTable() {
    const { t } = useTranslation();
    const [page, setPage] = useState(1);
    const limit = 10;

    const { data: jobs = [], isLoading } = useQuery({
        queryKey: ['jobs'],
        queryFn: async () => {
            const { data } = await api.get('/jobs');
            return data as Job[];
        }
    });

    const { handleDelete } = useResourceDelete({
        fn: async (id) => api.delete(`/jobs/${id}`),
        resourceName: 'Job',
        queryKey: ['jobs'],
        successMessage: t('admin.jobs.delete_success'),
    });

    // Frontend Pagination
    const totalItems = jobs.length;
    const paginatedData = jobs.slice((page - 1) * limit, page * limit);

    const columns: Column<Job>[] = [
         {
            header: t('admin.jobs.name'), 
            accessorKey: 'name',
            className: 'font-medium text-white'
        },
        {
            header: t('admin.jobs.type'),
            accessorKey: 'type',
        },
        {
            header: t('admin.jobs.scheduled_for'),
            cell: (row) => <span className="text-gray-400">{row.scheduledAt ? new Date(row.scheduledAt).toLocaleString() : '-'}</span>,
        },
        {
            header: t('admin.jobs.status'),
            cell: (row) => (
                <span className={`px-2 py-1 rounded-md text-xs ${row.status === 'completed' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                    {row.status}
                </span>
            )
        },
        {
            header: t('admin.jobs.actions'),
            className: 'text-right',
            cell: (row) => (
                <div className="flex justify-end gap-2">
                    <button onClick={() => handleDelete(row._id)} className="text-red-400 hover:text-white p-1">
                        <span className="material-symbols-outlined text-xl">delete</span>
                    </button>
                </div>
            )
        }
    ];

    return (
        <AdminDataTable
            data={paginatedData}
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
