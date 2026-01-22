'use client';

import { useState, useEffect } from 'react';
import { Column } from '@/components/ui/data-table';
import { useQuery } from '@tanstack/react-query';
import { productService } from '@/services/productService';
import Link from 'next/link';
import { useTranslation } from '@/hooks/useTranslation';
import { useCurrency } from '@/hooks/useCurrency';
import Image from 'next/image';
import { AdminDataTable } from './shared/AdminDataTable';
import { useResourceDelete } from '@/hooks/useResourceDelete';

// Define the Product type based on API response
type Product = {
    _id: string;
    images: string[];
    name: string;
    sku: string;
    category: { _id: string; name: string } | null;
    brand: { _id: string; name: string } | null;
    price: number;
    stock: number;
};

interface ProductsTableProps {
    filters: {
        searchTerm: string;
        category: string;
        brand: string;
        stockStatus: string;
        sort: string;
    };
}

export default function ProductsTable({ filters }: ProductsTableProps) {
    const { t } = useTranslation();
    const { formatPrice } = useCurrency();
    const [page, setPage] = useState(1);
    const limit = 10;

    // Reset page on filter change
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setPage(1);
    }, [filters]);

    const { data, isLoading } = useQuery({
        queryKey: ['products', page, filters],
        queryFn: () => productService.getProducts({
            page,
            limit,
            search: filters.searchTerm,
            category: filters.category,
            brand: filters.brand,
            sort: filters.sort,
            // Assuming backend handles stockStatus or we derive filters here
            ...(filters.stockStatus === 'low-stock' && { maxStock: 10, minStock: 1 }),
            ...(filters.stockStatus === 'out-of-stock' && { maxStock: 0 }),
            ...(filters.stockStatus === 'in-stock' && { minStock: 11 }),
        }),
    });

    const { handleDelete } = useResourceDelete({
        fn: productService.deleteProduct,
        resourceName: 'Product',
        queryKey: ['products']
    });

    const columns: Column<Product>[] = [
        {
            header: t('admin.table.product'),
            cell: (row) => (
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-white/5 flex-shrink-0 overflow-hidden border border-white/10">
                        <Image
                            alt={row.name}
                            className="object-cover"
                            src={row.images[0] || '/placeholder.png'}
                            width={48}
                            height={48}
                        />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-white font-medium">{row.name}</span>
                        <span className="text-gray-400 text-xs">{row.sku}</span>
                    </div>
                </div>
            )
        },
        {
            header: t('admin.table.category'),
            cell: (row) => <span className="text-gray-300">{row.category?.name || 'N/A'}</span>,
            className: 'text-gray-300'
        },
        {
            header: t('admin.table.brand'),
            cell: (row) => <span className="text-gray-300">{row.brand?.name || 'N/A'}</span>,
            className: 'text-gray-300'
        },
        {
            header: t('admin.table.price'),
            cell: (row) => <span className="text-white font-medium">{formatPrice(row.price)}</span>,
            className: 'text-white font-medium text-right'
        },
        {
            header: t('admin.table.stock'),
            accessorKey: 'stock',
            className: 'text-gray-300 text-right'
        },
        {
            header: t('admin.table.status'),
            className: 'text-center',
            cell: (row) => {
                let statusColor = '';
                let statusText = '';
                if (row.stock > 10) {
                    statusColor = 'bg-primary/10 text-primary border-primary/20';
                    statusText = t('admin.status.in_stock');
                } else if (row.stock > 0) {
                    statusColor = 'bg-orange-400/10 text-orange-400 border-orange-400/20';
                    statusText = t('admin.status.low_stock');
                } else {
                    statusColor = 'bg-red-500/10 text-red-500 border-red-500/20';
                    statusText = t('admin.status.out_of_stock');
                }

                return (
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${statusColor}`}>
                        {statusText}
                    </span>
                );
            }
        },
        {
            header: t('admin.table.actions'),
            className: 'text-right',
            cell: (row) => (
                <div className="flex items-center justify-end gap-2 text-right">
                    <Link href={`/admin/products/edit/${row._id}`}>
                        <button className="p-1 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors">
                            <span className="material-symbols-outlined text-[20px]">edit</span>
                        </button>
                    </Link>
                    <button
                        onClick={() => handleDelete(row._id)}
                        className="p-1 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded transition-colors"
                    >
                        <span className="material-symbols-outlined text-[20px]">delete</span>
                    </button>
                </div>
            )
        }
    ];

    const products = data?.products || [];
    const totalItems = data?.total || 0;

    return (
        <AdminDataTable
            data={products}
            columns={columns}
            totalItems={totalItems}
            currentPage={page}
            onPageChange={setPage}
            limit={limit}
            isLoading={isLoading}
            className="flex flex-col bg-surface-dark border-white/5"
        />
    );
}
