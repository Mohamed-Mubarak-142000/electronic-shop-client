'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Column } from '@/components/ui/data-table';
import { useQuery } from '@tanstack/react-query';
import { brandService } from '@/services/metadataService';
import { useTranslation } from '@/hooks/useTranslation';
import { Brand } from '@/types';
import Image from 'next/image';
import { AdminDataTable } from './shared/AdminDataTable';
import { useResourceDelete } from '@/hooks/useResourceDelete';

interface BrandsTableProps {
    filters: {
        searchTerm: string;
    };
}

export default function BrandsTable({ filters }: BrandsTableProps) {
    const { t } = useTranslation();
    const [page, setPage] = useState(1);
    const [prevSearchTerm, setPrevSearchTerm] = useState(filters.searchTerm);
    const limit = 10;

    if (filters.searchTerm !== prevSearchTerm) {
        setPage(1);
        setPrevSearchTerm(filters.searchTerm);
    }

    const { data, isLoading } = useQuery({
        queryKey: ['brands'],
        queryFn: brandService.getBrands,
    });

    const { handleDelete } = useResourceDelete({
        fn: brandService.deleteBrand,
        resourceName: 'Brand',
        queryKey: ['brands']
    });

    // Client-side filtering
    const filteredBrands = useMemo(() => {
        const brands: Brand[] = Array.isArray(data) ? data : [];
        return brands.filter(brand =>
            brand.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
            (brand.description && brand.description.toLowerCase().includes(filters.searchTerm.toLowerCase()))
        );
    }, [data, filters.searchTerm]);



    const paginatedBrands = filteredBrands.slice((page - 1) * limit, page * limit);

    const columns: Column<Brand>[] = [
        {
            header: <span className="text-gray-400">{t('admin.table.brand')}</span>,
            cell: (row) => (
                <div className="flex items-center gap-4">
                    <div className="size-12 rounded-full bg-white p-2 shrink-0 overflow-hidden flex items-center justify-center border-2 border-[#254632] group-hover:border-primary transition-colors">
                        <Image 
                            className="object-contain w-auto h-auto" 
                            src={row.logoUrl || '/placeholder.png'} 
                            alt={row.name} 
                            width={32} 
                            height={32}
                        />
                    </div>
                    <div>
                        <p className="text-white font-medium">{row.name}</p>
                    </div>
                </div>
            )
        },
        {
            header: <span className="hidden md:table-cell text-gray-400">{t('admin.table.slug')}</span>,
            cell: (row) => <span className="text-gray-400">{row.slug}</span>,
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
                    <Link href={`/admin/brands/edit/${row._id}`}>
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
            data={paginatedBrands}
            columns={columns}
            totalItems={filteredBrands.length}
            currentPage={page}
            onPageChange={setPage}
            limit={limit}
            isLoading={isLoading}
            className="flex flex-col rounded-3xl shadow-xl bg-surface-dark border-[#254632]"
        />
    );
}
