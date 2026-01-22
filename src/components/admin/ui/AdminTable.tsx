import React from 'react';

export function Table({ children, className = '' }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={`rounded-xl border border-white/5 bg-surface-dark overflow-hidden ${className}`}>
            <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                    {children}
                </table>
            </div>
        </div>
    );
}

export function TableHeader({ children }: { children: React.ReactNode }) {
    return (
        <thead className="bg-[#15261d] text-gray-400 font-medium uppercase text-xs tracking-wider border-b border-white/5">
            {children}
        </thead>
    );
}

export function TableBody({ children }: { children: React.ReactNode }) {
    return (
        <tbody className="divide-y divide-white/5">
            {children}
        </tbody>
    );
}

export function TableRow({ children, className = '', onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) {
    return (
        <tr
            onClick={onClick}
            className={`hover:bg-white/5 transition-colors group ${onClick ? 'cursor-pointer' : ''} ${className}`}
        >
            {children}
        </tr>
    );
}

export function TableHead({ children, className = '', textRight = false, textCenter = false }: { children: React.ReactNode; className?: string; textRight?: boolean; textCenter?: boolean }) {
    return (
        <th
            className={`px-6 py-4 font-semibold ${textRight ? 'text-right' : ''} ${textCenter ? 'text-center' : ''} ${className}`}
            scope="col"
        >
            {children}
        </th>
    );
}

export function TableCell({ children, className = '', textRight = false, textCenter = false }: { children: React.ReactNode; className?: string; textRight?: boolean; textCenter?: boolean }) {
    return (
        <td className={`px-6 py-4 ${textRight ? 'text-right' : ''} ${textCenter ? 'text-center' : ''} ${className}`}>
            {children}
        </td>
    );
}
