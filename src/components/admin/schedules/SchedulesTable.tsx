'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { scheduleService } from '@/services/scheduleService';
import { Column } from '@/components/ui/data-table';
import { AdminDataTable } from '@/components/admin/shared/AdminDataTable';
import { DiscountSchedule } from '@/types';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import { useTranslation } from '@/hooks/useTranslation';
import { useCurrency } from '@/hooks/useCurrency';

export default function SchedulesTable() {
    const queryClient = useQueryClient();
    const { t } = useTranslation();
    const { symbol } = useCurrency();
    const [page, setPage] = useState(1);
    const limit = 10;

    const { data: schedules, isLoading } = useQuery({
        queryKey: ['schedules'],
        queryFn: scheduleService.getSchedules,
    });

    const cancelMutation = useMutation({
        mutationFn: scheduleService.cancelSchedule,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['schedules'] });
            toast.success(t('admin.schedules.table.cancelled_success'));
        },
        onError: (error: Error & { response?: { data?: { message?: string } } }) => {
            toast.error(error.response?.data?.message || t('admin.schedules.table.cancel_error'));
        }
    });

    const columns: Column<DiscountSchedule>[] = [
        {
            header: t('admin.schedules.table.product'),
            cell: (row) => (
                <div>
                     <span className="font-medium">{row.product?.name || 'Unknown'}</span>
                </div>
            )
        },
        {
            header: t('admin.schedules.table.discount'),
            cell: (row) => (
                <span className="font-medium text-emerald-500">
                    {row.type === 'percentage' ? `${row.value}% OFF` : `-${symbol}${row.value}`}
                </span>
            )
        },
        {
            header: t('admin.schedules.table.duration'),
            cell: (row) => (
                <div className="flex flex-col text-xs text-muted-foreground">
                    <span>{t('admin.schedules.table.from')}: {format(new Date(row.startTime), 'MMM d, HH:mm')}</span>
                    <span>{t('admin.schedules.table.to')}: {format(new Date(row.endTime), 'MMM d, HH:mm')}</span>
                </div>
            )
        },
        {
            header: t('admin.schedules.table.status'),
            cell: (row) => {
                const colors = {
                    pending: 'bg-yellow-500/10 text-yellow-500',
                    active: 'bg-green-500/10 text-green-500',
                    completed: 'bg-blue-500/10 text-blue-500',
                    cancelled: 'bg-red-500/10 text-red-500',
                };
                return (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${colors[row.status]}`}>
                        {row.status}
                    </span>
                );
            }
        },
        {
            header: t('admin.schedules.table.actions'),
            className: 'text-right',
            cell: (row) => (
                (row.status === 'pending' || row.status === 'active') ? (
                    <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={() => {
                            if(confirm(t('admin.schedules.table.confirm_cancel'))) {
                                cancelMutation.mutate(row._id);
                            }
                        }}
                        disabled={cancelMutation.isPending}
                    >
                        {t('admin.schedules.table.cancel')}
                    </Button>
                ) : null
            )
        }
    ];

    const totalItems = schedules?.length || 0;
    const paginatedData = (schedules || []).slice((page - 1) * limit, page * limit);

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
