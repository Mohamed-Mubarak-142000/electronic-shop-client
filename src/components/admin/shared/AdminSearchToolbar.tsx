import React from 'react';

interface AdminSearchToolbarProps {
    searchTerm: string;
    onSearchChange: (term: string) => void;
    placeholder?: string;
    children?: React.ReactNode; // For extra filters
}

export function AdminSearchToolbar({
    searchTerm,
    onSearchChange,
    placeholder = 'Search...',
    children
}: AdminSearchToolbarProps) {
    return (
        <div className="flex flex-col lg:flex-row gap-4 p-4 rounded-xl border border-white/10 bg-surface-dark items-start lg:items-center justify-between">
            {/* Search */}
            <div className="relative w-full lg:max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-gray-400">search</span>
                </div>
                <input
                    className="block w-full pl-10 pr-3 py-2.5 border-none rounded-lg leading-5 bg-background-dark text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary sm:text-sm"
                    placeholder={placeholder}
                    type="text"
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </div>
            {/* Filters */}
            {children && (
                 <div className="flex flex-wrap gap-3 w-full lg:w-auto">
                    <div className="h-9 w-px bg-white/10 mx-1 hidden sm:block"></div>
                    {children}
                 </div>
            )}
        </div>
    );
}
