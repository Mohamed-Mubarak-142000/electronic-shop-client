'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Column } from '@/components/ui/data-table';
import { AdminDataTable } from '@/components/admin/shared/AdminDataTable';
import { useQuery } from '@tanstack/react-query';
import { orderService } from '@/services/orderService';
import { useTranslation } from '@/hooks/useTranslation';
import { useCurrency } from '@/hooks/useCurrency';
import { Order } from '@/types';

interface OrdersTableProps {
    filters?: {
        search?: string;
        status?: string;
        sort?: string;
    };
}

export default function OrdersTable({ filters }: OrdersTableProps) {
    const { t } = useTranslation();
    const { formatPrice } = useCurrency();
    const router = useRouter();
    const [page, setPage] = useState(1);
    const limit = 10;

    const { data, isLoading } = useQuery({
        queryKey: ['orders', page, filters],
        queryFn: () => orderService.getOrders({
            page,
            limit,
            search: filters?.search,
            status: filters?.status,
            sort: filters?.sort || '-createdAt'
        }),
    });

    const ordersData = data?.orders || [];
    const totalPages = data?.pages || 1;
    const totalItems = data?.total || 0;

    // Transform API data to Table format if needed
    const orders: Order[] = ordersData;

    const columns: Column<Order>[] = [
        {
            header: t('admin.table.order_id'),
            className: 'font-bold text-white',
            cell: (row) => (
                <span className="text-white">{row._id.substring(0, 8)}...</span>
            )
        },
        {
            header: t('admin.table.customer'),
            cell: (row) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-900/50 border border-indigo-700 text-indigo-300 flex items-center justify-center text-xs font-bold uppercase">
                        {row.user?.name?.substring(0, 2) || 'NA'}
                    </div>
                    <div>
                        <p className="text-white font-medium">{row.user?.name || 'Unknown'}</p>
                        <p className="text-gray-500 text-xs">{row.user?.email}</p>
                    </div>
                </div>
            )
        },
        {
            header: t('admin.table.order_date'),
            cell: (row) => <span className="text-gray-400">{new Date(row.createdAt).toLocaleDateString()}</span>,
            className: 'text-gray-400'
        },
        {
            header: t('admin.table.total'),
            cell: (row) => <span className="font-mono font-medium text-white">{formatPrice(row.totalPrice)}</span>,
            className: 'font-mono font-medium text-white'
        },
        {
            header: t('admin.table.status'),
            cell: (row) => {
                let statusStyles = '';
                let dotColor = '';

                // Use the actual status field, fallback to derived status
                const status = row.status || (row.isDelivered ? 'Delivered' : (row.isPaid ? 'Processing' : 'Pending'));

                if (status === 'Pending') {
                    statusStyles = 'bg-yellow-500/20 text-yellow-400 border-yellow-500/20';
                    dotColor = 'bg-yellow-400';
                } else if (status === 'Processing') {
                    statusStyles = 'bg-purple-500/20 text-purple-400 border-purple-500/20';
                    dotColor = 'bg-purple-400';
                } else if (status === 'Shipped') {
                    statusStyles = 'bg-blue-500/20 text-blue-400 border-blue-500/20';
                    dotColor = 'bg-blue-400';
                } else if (status === 'Delivered') {
                    statusStyles = 'bg-green-500/20 text-green-400 border-green-500/20';
                    dotColor = 'bg-green-400';
                } else if (status === 'Cancelled') {
                    statusStyles = 'bg-red-500/20 text-red-400 border-red-500/20';
                    dotColor = 'bg-red-400';
                } else {
                    statusStyles = 'bg-gray-500/20 text-gray-400 border-gray-500/20';
                    dotColor = 'bg-gray-400';
                }

                return (
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${statusStyles}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`}></span>
                        {status}
                    </span>
                );
            }
        },
        {
            header: t('admin.table.actions'),
            className: 'text-right',
            cell: (row) => (
                <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/admin/orders/${row._id}`);
                    }}
                    className="text-gray-400 hover:text-primary p-2 rounded-lg hover:bg-primary/10 transition-colors"
                >
                    <span className="material-symbols-outlined">visibility</span>
                </button>
            )
        }
    ];

    return (
        <AdminDataTable
            data={orders}
            columns={columns}
            totalItems={totalItems}
            currentPage={page}
            onPageChange={setPage}
            limit={limit}
            isLoading={isLoading}
            className="w-full transition-all flex flex-col bg-surface-dark border-white/5 rounded-2xl"
            onRowClick={(order) => router.push(`/admin/orders/${order._id}`)}
        />
    );
}
