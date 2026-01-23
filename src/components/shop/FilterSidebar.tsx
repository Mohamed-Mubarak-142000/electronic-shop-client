import React from 'react';
import { Category, Brand } from "@/types";

interface FilterSidebarProps {
    categories: Category[];
    brands: Brand[];
    selectedCategory: string;
    selectedBrand: string;
    minPrice: string;
    maxPrice: string;
    onCategoryToggle: (id: string) => void;
    onBrandToggle: (id: string) => void;
    onMinPriceChange: (value: string) => void;
    onMaxPriceChange: (value: string) => void;
    onClearFilters: () => void;
    isOpen?: boolean;
    onClose?: () => void;
}

export default function FilterSidebar({
    categories,
    brands,
    selectedCategory,
    selectedBrand,
    minPrice,
    maxPrice,
    onCategoryToggle,
    onBrandToggle,
    onMinPriceChange,
    onMaxPriceChange,
    onClearFilters,
    isOpen,
    onClose
}: FilterSidebarProps) {
    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden"
                    onClick={onClose}
                />
            )}

            <aside className={`
                fixed inset-y-0 left-0 z-[70] w-full max-w-xs bg-surface-dark p-6 border-r border-surface-highlight transition-transform duration-300 transform
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                lg:translate-x-0 lg:static lg:w-72 lg:flex-shrink-0 lg:rounded-2xl lg:border lg:z-0
                flex flex-col gap-6 overflow-y-auto
            `}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <h3 className="text-white font-bold text-lg">Filters</h3>
                        <button
                            onClick={onClearFilters}
                            className="text-[#95c6a9] text-xs hover:text-primary transition-colors ml-2"
                        >
                            Clear All
                        </button>
                    </div>
                    {/* Mobile Close Button */}
                    <button
                        onClick={onClose}
                        className="lg:hidden size-8 flex items-center justify-center rounded-full bg-surface-highlight text-white"
                    >
                        <span className="material-symbols-outlined text-xl">close</span>
                    </button>
                </div>

                {/* Category Filter */}
                <div className="flex flex-col gap-3">
                    <h4 className="text-white font-semibold text-sm uppercase tracking-wider opacity-80">Category</h4>
                    <div className="flex flex-col gap-2 max-h-48 overflow-y-auto custom-scrollbar pr-2">
                        {categories.map((cat) => (
                            <label key={cat._id} className="flex items-center gap-3 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={selectedCategory === cat._id}
                                    onChange={() => onCategoryToggle(cat._id)}
                                    className="rounded border-2 border-surface-highlight bg-transparent text-primary focus:ring-0 focus:ring-offset-0 size-5"
                                />
                                <span className={`transition-colors ${selectedCategory === cat._id ? "text-white font-medium" : "text-[#95c6a9] group-hover:text-white"}`}>
                                    {cat.name}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>
                <div className="h-px bg-surface-highlight w-full"></div>

                {/* Price Filter */}
                <div className="flex flex-col gap-4">
                    <h4 className="text-white font-semibold text-sm uppercase tracking-wider opacity-80">Price Range</h4>
                    <div className="flex gap-2 mt-1">
                        <div className="flex-1 bg-surface-highlight rounded-lg px-3 py-2">
                            <span className="text-xs text-[#95c6a9] block">Min</span>
                            <input
                                className="w-full bg-transparent border-none p-0 text-white text-sm focus:ring-0 font-bold"
                                type="number"
                                value={minPrice}
                                onChange={(e) => onMinPriceChange(e.target.value)}
                                placeholder="0"
                            />
                        </div>
                        <div className="flex-1 bg-surface-highlight rounded-lg px-3 py-2">
                            <span className="text-xs text-[#95c6a9] block">Max</span>
                            <input
                                className="w-full bg-transparent border-none p-0 text-white text-sm focus:ring-0 font-bold"
                                type="number"
                                value={maxPrice}
                                onChange={(e) => onMaxPriceChange(e.target.value)}
                                placeholder="Any"
                            />
                        </div>
                    </div>
                </div>
                <div className="h-px bg-surface-highlight w-full"></div>

                {/* Brand Filter */}
                <div className="flex flex-col gap-3">
                    <h4 className="text-white font-semibold text-sm uppercase tracking-wider opacity-80">Brand</h4>
                    <div className="flex flex-col gap-2 max-h-48 overflow-y-auto custom-scrollbar pr-2">
                        {brands.map((brand) => (
                            <label key={brand._id} className="flex items-center gap-3 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={selectedBrand === brand._id}
                                    onChange={() => onBrandToggle(brand._id)}
                                    className="rounded border-2 border-surface-highlight bg-transparent text-primary focus:ring-0 focus:ring-offset-0 size-5"
                                />
                                <span className={`transition-colors ${selectedBrand === brand._id ? "text-white font-medium" : "text-[#95c6a9] group-hover:text-white"}`}>
                                    {brand.name}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>
            </aside>
        </>
    );
}
