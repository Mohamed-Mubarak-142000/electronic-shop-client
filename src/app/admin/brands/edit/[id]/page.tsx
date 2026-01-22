'use client';

import { use } from 'react';
import { useQuery } from '@tanstack/react-query';
import { brandService } from '@/services/metadataService';
import BrandForm from '@/components/admin/BrandForm';

export default function EditBrandPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { data: brand, isLoading } = useQuery({
        queryKey: ['brand', id],
        queryFn: () => brandService.getBrand(id),
    });

    if (isLoading) return <div className="text-white">Loading...</div>;

    return (
        <div className="flex flex-col gap-8">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                        <span>Dashboard</span>
                        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                        <span>Brands</span>
                        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                        <span className="text-white">Edit Brand</span>
                    </div>
                    <h1 className="text-2xl font-bold text-white">Edit Brand</h1>
                </div>
            </div>

            <BrandForm initialData={brand} />
        </div>
    );
}
