'use client';

import { useState, useEffect } from 'react';
import ProductsTable from '@/components/admin/ProductsTable';
import { productService } from '@/services/productService';
import { categoryService, brandService } from '@/services/metadataService';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from '@/hooks/useTranslation';
import { useCurrency } from '@/hooks/useCurrency';
import { Category, Brand } from '@/types';
import { AdminPageHeader } from '@/components/admin/shared/AdminPageHeader';
import { AdminStatsCards, StatCardItem } from '@/components/admin/shared/AdminStatsCards';
import { AdminSearchToolbar } from '@/components/admin/shared/AdminSearchToolbar';

export default function ProductsPage() {
    const { t } = useTranslation();
    const { formatPrice } = useCurrency();
    const [searchTerm, setSearchTerm] = useState('');
    const [category, setCategory] = useState('');
    const [brand, setBrand] = useState('');
    const [stockStatus, setStockStatus] = useState('');
    const [sort, setSort] = useState('-createdAt');

    const [categories, setCategories] = useState<Category[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);

    const { data: stats, isLoading: statsLoading } = useQuery({
        queryKey: ['product-stats'],
        queryFn: productService.getProductStats,
    });

    useEffect(() => {
        const fetchMetadata = async () => {
            const [cats, brs] = await Promise.all([
                categoryService.getCategories(),
                brandService.getBrands()
            ]);
            setCategories(cats);
            setBrands(brs);
        };
        fetchMetadata();
    }, []);

    const statItems: StatCardItem[] = [
        {
            label: t('admin.stats.total_products'),
            value: stats?.totalProducts || 0,
            icon: 'inventory',
            loading: statsLoading
        },
        {
            label: t('admin.stats.low_stock_alerts'),
            value: stats?.lowStockCount || 0,
            icon: 'warning',
            iconColor: 'text-orange-400',
            loading: statsLoading,
            pillText: stats?.lowStockCount > 0 ? t('admin.stats.attention') : undefined,
            pillColor: 'bg-orange-400/10 text-orange-400'
        },
        {
            label: t('admin.stats.inventory_value'),
            value: formatPrice(stats?.totalInventoryValue || 0),
            icon: 'attach_money',
            loading: statsLoading
        }
    ];

    return (
        <div className="flex flex-col gap-6">
            <AdminPageHeader
                title={t('admin.products.title')}
                subtitle={t('admin.products.subtitle')}
                breadcrumb={[
                    { label: t('admin.sidebar.dashboard'), href: '/admin' },
                    { label: t('admin.sidebar.products') }
                ]}
                addLink="/admin/products/create"
                addText={t('admin.add_product')}
            />

            <AdminStatsCards stats={statItems} />

            <AdminSearchToolbar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                placeholder={t('admin.products.search_placeholder')}
            >
                <select
                    className="form-select block w-full sm:w-auto pl-3 pr-10 py-2 text-sm border-none rounded-lg bg-background-dark text-white focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                >
                    <option value="">{t('admin.table.all_categories')}</option>
                    {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                </select>
                <select
                    className="form-select block w-full sm:w-auto pl-3 pr-10 py-2 text-sm border-none rounded-lg bg-background-dark text-white focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                >
                    <option value="">{t('admin.table.all_brands')}</option>
                    {brands.map((br) => (
                        <option key={br._id} value={br._id}>{br.name}</option>
                    ))}
                </select>
                <select
                    className="form-select block w-full sm:w-auto pl-3 pr-10 py-2 text-sm border-none rounded-lg bg-background-dark text-white focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                    value={stockStatus}
                    onChange={(e) => setStockStatus(e.target.value)}
                >
                    <option value="">{t('admin.products.filter_status')}</option>
                    <option value="in-stock">In Stock</option>
                    <option value="low-stock">Low Stock</option>
                    <option value="out-of-stock">Out of Stock</option>
                </select>
                
                <div className="h-9 w-px bg-white/10 mx-1 hidden sm:block"></div>
                <select
                    className="form-select block w-full sm:w-auto pl-3 pr-10 py-2 text-sm border-none rounded-lg bg-background-dark text-white focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                >
                    <option value="-createdAt">Newest</option>
                    <option value="createdAt">Oldest</option>
                    <option value="price">Price: Low to High</option>
                    <option value="-price">Price: High to Low</option>
                    <option value="-stock">Stock: High to Low</option>
                </select>
            </AdminSearchToolbar>


            <ProductsTable filters={{ searchTerm, category, brand, stockStatus, sort }} />

            <div className="h-10"></div>
        </div>
    );
}
