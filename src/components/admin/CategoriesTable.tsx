'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Column } from '@/components/ui/data-table';
import { useQuery } from '@tanstack/react-query';
import { categoryService } from '@/services/metadataService';
import { useTranslation } from '@/hooks/useTranslation';
import { Category } from '@/types';
import Image from 'next/image';
import { AdminDataTable } from './shared/AdminDataTable';
import { useResourceDelete } from '@/hooks/useResourceDelete';

interface CategoriesTableProps {
    filters: {
        searchTerm: string;
    };
}

export default function CategoriesTable({ filters }: CategoriesTableProps) {
    const { t } = useTranslation();
    const [page, setPage] = useState(1);
    const [prevSearchTerm, setPrevSearchTerm] = useState(filters.searchTerm);
    const limit = 10;

    if (filters.searchTerm !== prevSearchTerm) {
        setPage(1);
        setPrevSearchTerm(filters.searchTerm);
    }

    const { data, isLoading } = useQuery({
        queryKey: ['categories'],
        queryFn: categoryService.getCategories,
    });

    const { handleDelete } = useResourceDelete({
        fn: categoryService.deleteCategory,
        resourceName: 'Category',
        queryKey: ['categories']
    });

    // Client-side filtering
    const filteredCategories = useMemo(() => {
        const categories: Category[] = Array.isArray(data) ? data : [];
        return categories.filter(cat =>
            cat.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
            (cat.description && cat.description.toLowerCase().includes(filters.searchTerm.toLowerCase()))
        );
    }, [data, filters.searchTerm]);



    const paginatedCategories = filteredCategories.slice((page - 1) * limit, page * limit);

    const columns: Column<Category>[] = [
        {
            header: <span className="text-gray-400">{t('admin.table.category')}</span>,
            cell: (row) => (
                <div className={`flex items-center gap-4`}>
                    <Image 
                        className="size-12 rounded-full object-cover border-2 border-[#254632] group-hover:border-primary transition-colors" 
                        src={row.imageUrl || '/placeholder.png'} 
                        alt={row.name} 
                        width={48} 
                        height={48}
                    />
                    <div>
                        <p className="text-white font-medium">{row.name}</p>
                    </div>
                </div>
            )
        },
        {
            header: <span className="hidden md:table-cell text-gray-400">{t('admin.table.slug')}</span>,
            cell: (row) => <span className="text-custom-gray text-gray-400">{row.slug}</span>,
            className: "hidden md:table-cell font-mono"
        },
        {
            header: <span className="text-gray-400">{t('admin.table.description')}</span>,
            cell: (row) => <span className="text-gray-400 truncate max-w-xs block">{row.description}</span>,
        },
        {
            header: <span className="text-gray-400">{t('admin.table.actions')}</span>,
            className: "text-right pr-6",
            cell: (row) => (
                <div className="flex items-center justify-end gap-2 text-right">
                    <Link href={`/admin/categories/edit/${row._id}`}>
                        <button className="size-8 flex items-center justify-center rounded-full bg-[#254632] text-white hover:bg-primary hover:text-background-dark transition-colors" title={t('admin.tooltips.edit')}>
                            <span className="material-symbols-outlined text-lg">edit</span>
                        </button>
                    </Link>
                    <button
                        onClick={() => handleDelete(row._id)}
                        className="size-8 flex items-center justify-center rounded-full bg-[#254632] text-white hover:bg-red-500 hover:text-white transition-colors" title={t('admin.tooltips.delete')}
                    >
                        <span className="material-symbols-outlined text-lg">delete</span>
                    </button>
                </div>
            )
        }
    ];

    return (
        <AdminDataTable
            data={paginatedCategories}
            columns={columns}
            totalItems={filteredCategories.length}
            currentPage={page}
            onPageChange={setPage}
            limit={limit}
            isLoading={isLoading}
            className="flex flex-col rounded-3xl shadow-xl bg-surface-dark border-[#254632]"
        />
    );
}
