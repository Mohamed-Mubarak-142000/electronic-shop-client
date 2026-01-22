import React from 'react';

interface ShopToolbarProps {
    total: number;
    sortBy: string;
    onSortChange: (value: string) => void;
    viewMode?: 'grid' | 'list'; // Future proofing
    onViewModeChange?: (mode: 'grid' | 'list') => void;
}

export default function ShopToolbar({
    total,
    sortBy,
    onSortChange,
    viewMode = 'grid',
    onViewModeChange
}: ShopToolbarProps) {
    return (
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-surface-dark p-4 rounded-2xl border border-surface-highlight">
            <p className="text-[#95c6a9] text-sm font-medium">
                <span className="text-white font-bold">{total}</span> results found
            </p>
            <div className="flex items-center gap-3">
                <div className="relative group">
                    <select
                        value={sortBy}
                        onChange={(e) => onSortChange(e.target.value)}
                        className="appearance-none bg-surface-highlight text-white text-sm font-medium h-10 pl-4 pr-10 rounded-full border-none focus:ring-1 focus:ring-primary cursor-pointer outline-none"
                    >
                        <option value="-createdAt">Newest Arrivals</option>
                        <option value="price">Price: Low to High</option>
                        <option value="-price">Price: High to Low</option>
                        <option value="-rating">Top Rated</option>
                    </select>
                </div>
                <div className="flex bg-surface-highlight rounded-full p-1 gap-1">
                    <button className="size-8 flex items-center justify-center rounded-full bg-primary text-surface-dark">
                        <span className="material-symbols-outlined text-[20px]">grid_view</span>
                    </button>
                    <button className="size-8 flex items-center justify-center rounded-full text-[#95c6a9] hover:text-white hover:bg-[#2f553d] transition-colors">
                        <span className="material-symbols-outlined text-[20px]">view_list</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
