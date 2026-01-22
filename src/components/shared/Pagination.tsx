import React from 'react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    totalItems?: number;
    itemsPerPage?: number;
    onPageChange: (page: number) => void;
    className?: string;
    showResultsInfo?: boolean;
}

export default function Pagination({
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage = 10,
    onPageChange,
    className = '',
    showResultsInfo = true
}: PaginationProps) {
    const startItem = totalItems ? (currentPage - 1) * itemsPerPage + 1 : 0;
    const endItem = totalItems ? Math.min(currentPage * itemsPerPage, totalItems) : 0;

    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const maxVisible = 5;
        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            if (currentPage <= 3) {
                pages.push(1, 2, 3, 4, '...', totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
            } else {
                pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
            }
        }
        return pages;
    };
    const pages = getPageNumbers();
    if (totalPages <= 1) return null;

    return (
        <div className={`flex items-center justify-between px-4 py-3 sm:px-6 ${className}`}>
            <div className="hidden sm:flex flex-1 items-center justify-between">
                <div>
                   {showResultsInfo && totalItems !== undefined && (
                        <p className="text-sm text-gray-400">
                            Showing <span className="font-medium text-white">{startItem}</span> to <span className="font-medium text-white">{endItem}</span> of <span className="font-medium text-white">{totalItems}</span> results
                        </p>
                    )}
                </div>
                <div>
                    <nav aria-label="Pagination" className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                        <button
                            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                            className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-white/10 hover:bg-white/5 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span className="sr-only">Previous</span>
                            <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                        </button>
                        
                        {pages.map((page, idx) => (
                            <React.Fragment key={idx}>
                                {page === '...' ? (
                                    <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-400 ring-1 ring-inset ring-white/10 focus:outline-offset-0">
                                        ...
                                    </span>
                                ) : (
                                    <button
                                        onClick={() => onPageChange(page as number)}
                                        aria-current={currentPage === page ? 'page' : undefined}
                                        className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-white/10 focus:z-20 focus:outline-offset-0 ${
                                            currentPage === page
                                                ? 'z-10 bg-primary text-background-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
                                                : 'text-white hover:bg-white/5'
                                        }`}
                                    >
                                        {page}
                                    </button>
                                )}
                            </React.Fragment>
                        ))}

                        <button
                            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                            className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-white/10 hover:bg-white/5 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span className="sr-only">Next</span>
                            <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                        </button>
                    </nav>
                </div>
            </div>
            {/* Mobile Pagination */}
            <div className="flex flex-1 justify-between sm:hidden">
                <button
                    onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center rounded-md border border-white/10 bg-background-dark px-4 py-2 text-sm font-medium text-white hover:bg-white/5 disabled:opacity-50"
                >
                    Previous
                </button>
                <div className="text-sm text-gray-400 flex items-center">
                    Page {currentPage} of {totalPages}
                </div>
                <button
                    onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="relative ml-3 inline-flex items-center rounded-md border border-white/10 bg-background-dark px-4 py-2 text-sm font-medium text-white hover:bg-white/5 disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
}
