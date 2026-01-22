'use client';

import { useState } from 'react';
import { Column } from '@/components/ui/data-table';
import { AdminDataTable } from '@/components/admin/shared/AdminDataTable';
import { useQuery } from '@tanstack/react-query';
import { portfolioService } from '@/services/portfolioService';
import { useTranslation } from '@/hooks/useTranslation';
import { Portfolio } from '@/types'; 
import { useResourceDelete } from '@/hooks/useResourceDelete';

interface PortfolioTableProps {
    onEdit: (project: Portfolio) => void;
}

export default function PortfolioTable({ onEdit }: PortfolioTableProps) {
    const { t } = useTranslation();
    const [page, setPage] = useState(1);
    const limit = 10;

    const { data: projects = [], isLoading } = useQuery({
        queryKey: ['portfolio'],
        queryFn: portfolioService.getPortfolios,
    });

    const { handleDelete } = useResourceDelete({
        fn: portfolioService.deletePortfolio,
        resourceName: 'Portfolio Project',
        queryKey: ['portfolio'],
        successMessage: t('admin.messages.project_deleted') || 'Project deleted',
    });

    // Frontend Pagination
    const totalItems = projects.length;
    const paginatedData = projects.slice((page - 1) * limit, page * limit);

    const columns: Column<Portfolio>[] = [
         {
            header: t('admin.portfolio.project_title'),
            cell: (row) => (
                 <div>
                    <div className="font-medium text-white">{row.title}</div>
                    <div className="text-xs text-gray-500">{row.titleAr}</div>
                 </div>
            )
        },
        {
            header: t('admin.portfolio.client'),
            accessorKey: 'client',
        },
        {
            header: t('admin.portfolio.status'),
            cell: (row) => (
                <span className={`px-2 py-1 rounded-md text-xs ${row.isPublished ? 'bg-green-500/10 text-green-500' : 'bg-gray-500/10 text-gray-500'}`}>
                    {row.isPublished ? t('admin.portfolio.published') : t('admin.portfolio.draft')}
                </span>
            )
        },
        {
            header: t('admin.portfolio.date'),
            cell: (row) => <span className="text-gray-400">{row.completedAt ? new Date(row.completedAt).toLocaleDateString() : '-'}</span>,
        },
        {
            header: t('admin.portfolio.actions'),
            className: 'text-right',
            cell: (row) => (
                <div className="flex justify-end gap-2">
                    <button onClick={() => onEdit(row)} className="text-primary hover:text-white p-1">
                        <span className="material-symbols-outlined text-xl">edit</span>
                    </button>
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
