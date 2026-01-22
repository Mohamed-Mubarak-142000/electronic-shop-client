'use client';

import { use } from 'react';
import { useQuery } from '@tanstack/react-query';
import { productService } from '@/services/productService';
import ProductForm from '@/components/admin/ProductForm';

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { data: product, isLoading } = useQuery({
        queryKey: ['product', id],
        queryFn: () => productService.getProduct(id),
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
                        <span>Products</span>
                        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                        <span className="text-white">Edit Product</span>
                    </div>
                    <h1 className="text-2xl font-bold text-white">Edit Product</h1>
                </div>
            </div>

            <ProductForm initialData={product} />
        </div>
    );
}
