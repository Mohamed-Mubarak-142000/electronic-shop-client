import React from 'react';
import { DataTable, Column } from '@/components/ui/data-table';
import Pagination from '@/components/shared/Pagination';

interface AdminDataTableProps<T> {
    data: T[];
    columns: Column<T>[];
    totalItems: number;
    currentPage: number;
    onPageChange: (page: number) => void;
    limit?: number;
    isLoading?: boolean;
    className?: string; // wrapper className
    onRowClick?: (row: T) => void;
}

export function AdminDataTable<T>({
    data,
    columns,
    totalItems,
    currentPage,
    onPageChange,
    limit = 10,
    isLoading,
    className,
    onRowClick
}: AdminDataTableProps<T>) {
    const totalPages = Math.ceil(totalItems / limit);

    return (
        <div className={className}>
             {/* We can encapsulate Loading state here if we want */}
             {isLoading ? (
                 <div className="flex items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                 </div>
             ) : (
                <>
                <DataTable
                    data={data}
                    columns={columns}
                    onRowClick={onRowClick}
                />
                
                {/* Always show pagination if items exist, or only if pages > 1? 
                    Usually consistent UI is better, but hidden if pages <= 1 is common.
                */}
                {totalPages > 1 && (
                    <div className="mt-6">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            totalItems={totalItems}
                            itemsPerPage={limit}
                            onPageChange={onPageChange}
                        />
                    </div>
                )}
                </>
             )}
        </div>
    );
}
