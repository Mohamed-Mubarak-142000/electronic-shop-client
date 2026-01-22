'use client';

import { useState, useEffect, useCallback, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import ProductCard from "@/components/shared/ProductCard";
import Pagination from "@/components/shared/Pagination";
import FilterSidebar from "@/components/shop/FilterSidebar";
import ShopToolbar from "@/components/shop/ShopToolbar";
import { productService } from "@/services/productService";
import { categoryService, brandService } from "@/services/metadataService";
import { Product, Category, Brand } from "@/types";

function ShopContent() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
    const [pages, setPages] = useState(1);
    const [total, setTotal] = useState(0);

    // Filter states
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
    const [selectedBrand, setSelectedBrand] = useState(searchParams.get('brand') || '');
    const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
    const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
    const [sortBy, setSortBy] = useState(searchParams.get('sort') || '-createdAt');

    const fetchMetadata = async () => {
        try {
            const [cats, brs] = await Promise.all([
                categoryService.getCategories(),
                brandService.getBrands()
            ]);
            setCategories(cats);
            setBrands(brs);
        } catch (error) {
            console.error("Error fetching metadata:", error);
        }
    };

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const params: Record<string, string | number> = {
                page,
                limit: 9,
                sort: sortBy
            };
            if (selectedCategory) params.category = selectedCategory;
            if (selectedBrand) params.brand = selectedBrand;
            if (minPrice) params.minPrice = minPrice;
            if (maxPrice) params.maxPrice = maxPrice;

            const data = await productService.getProducts(params);
            setProducts(data.products);
            setPages(data.pages);
            setTotal(data.total);
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    }, [page, selectedCategory, selectedBrand, minPrice, maxPrice, sortBy]);

    useEffect(() => {
        fetchMetadata();
    }, []);

    useEffect(() => {
        fetchProducts();

        // Update URL
        const params = new URLSearchParams(searchParams.toString());
        if (page > 1) params.set('page', page.toString()); else params.delete('page');
        if (selectedCategory) params.set('category', selectedCategory); else params.delete('category');
        if (selectedBrand) params.set('brand', selectedBrand); else params.delete('brand');
        if (minPrice) params.set('minPrice', minPrice); else params.delete('minPrice');
        if (maxPrice) params.set('maxPrice', maxPrice); else params.delete('maxPrice');
        if (sortBy !== '-createdAt') params.set('sort', sortBy); else params.delete('sort');

        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    }, [fetchProducts, page, selectedCategory, selectedBrand, minPrice, maxPrice, sortBy, pathname, router]);

    const handleCategoryToggle = (id: string) => {
        setSelectedCategory(prev => prev === id ? '' : id);
        setPage(1);
    };

    const handleBrandToggle = (id: string) => {
        setSelectedBrand(prev => prev === id ? '' : id);
        setPage(1);
    };

    const clearFilters = () => {
        setSelectedCategory('');
        setSelectedBrand('');
        setMinPrice('');
        setMaxPrice('');
        setPage(1);
    };

    return (
        <div className="flex-1 flex flex-col items-center py-8 px-4 md:px-10 lg:px-20 bg-background-dark font-display min-h-screen">
            <div className="w-full max-w-[1440px] flex flex-col gap-8">
                {/* Page Heading & Breadcrumbs */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-surface-highlight pb-6">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-sm text-[#95c6a9] mb-1">
                            <Link href="/" className="hover:text-primary transition-colors">
                                Home
                            </Link>
                            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                            <span className="text-white">All Products</span>
                        </div>
                        <h1 className="text-white text-4xl md:text-5xl font-black leading-tight tracking-[-0.033em]">
                            All Products
                        </h1>
                        <p className="text-[#95c6a9] text-base max-w-2xl mt-2">
                            Browse our wide selection of professional-grade electrical components, smart home devices, and tools for every project.
                        </p>
                    </div>
                </div>


                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    {/* Sidebar Filters */}
                    <FilterSidebar
                        categories={categories}
                        brands={brands}
                        selectedCategory={selectedCategory}
                        selectedBrand={selectedBrand}
                        minPrice={minPrice}
                        maxPrice={maxPrice}
                        onCategoryToggle={handleCategoryToggle}
                        onBrandToggle={handleBrandToggle}
                        onMinPriceChange={(val) => { setMinPrice(val); setPage(1); }}
                        onMaxPriceChange={(val) => { setMaxPrice(val); setPage(1); }}
                        onClearFilters={clearFilters}
                    />

                    {/* Product Grid Area */}
                    <div className="flex-1 w-full">
                        {/* Toolbar */}
                        <ShopToolbar
                            total={total}
                            sortBy={sortBy}
                            onSortChange={(val) => { setSortBy(val); setPage(1); }}
                        />

                        {/* Grid */}
                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="bg-surface-dark rounded-[2rem] p-4 h-96 animate-pulse border border-surface-highlight"></div>
                                ))}
                            </div>
                        ) : products.length > 0 ? (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {products.map((product) => (
                                        <ProductCard key={product._id} product={product} />
                                    ))}
                                </div>
                                
                                {/* Pagination */}
                                {pages > 1 && (
                                    <div className="mt-12">
                                        <Pagination
                                           currentPage={page}
                                           totalPages={pages}
                                           onPageChange={setPage}
                                           showResultsInfo={false}
                                           className="!p-0 !bg-transparent border-none justify-center"
                                        />
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                <span className="material-symbols-outlined text-6xl text-[#95c6a9] mb-4 opacity-20">inventory_2</span>
                                <h3 className="text-white text-xl font-bold mb-2">No products found</h3>
                                <p className="text-[#95c6a9]">Try adjusting your filters or search criteria.</p>
                                <button
                                    onClick={clearFilters}
                                    className="mt-6 px-6 py-2 bg-primary text-background-dark font-bold rounded-full hover:bg-green-400 transition-colors"
                                >
                                    Clear All Filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ShopPage() {
    return (
        <Suspense fallback={<div className="flex justify-center items-center h-screen bg-background-dark text-white">Loading Shop...</div>}>
            <ShopContent />
        </Suspense>
    );
}
