import React from 'react';
import Link from 'next/link';

interface AdminPageHeaderProps {
    title: string;
    subtitle?: string;
    breadcrumb?: { label: string; href?: string }[];
    addLink?: string;
    addText?: string;
    action?: React.ReactNode;
}

export function AdminPageHeader({
    title,
    subtitle,
    breadcrumb,
    addLink,
    addText,
    action
}: AdminPageHeaderProps) {
    return (
        <div className="flex flex-col gap-4">
            {/* Breadcrumbs */}
            {breadcrumb && (
            <div className="flex items-center gap-2 text-sm">
                {breadcrumb.map((item, index) => (
                    <React.Fragment key={index}>
                        {index > 0 && <span className="text-gray-400">/</span>}
                        {item.href ? (
                            <Link href={item.href} className="text-gray-400 hover:text-primary transition-colors font-medium">
                                {item.label}
                            </Link>
                        ) : (
                            <span className="text-white font-medium">{item.label}</span>
                        )}
                    </React.Fragment>
                ))}
            </div>
            )}

            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-white text-3xl font-bold tracking-tight">{title}</h2>
                    {subtitle && <p className="text-gray-400 mt-1">{subtitle}</p>}
                </div>
                {action || (addLink && addText && (
                    <Link href={addLink}>
                        <button className="flex items-center justify-center gap-2 rounded-lg h-10 px-6 bg-primary hover:bg-green-400 text-background-dark text-sm font-bold transition-all shadow-lg shadow-primary/20">
                            <span className="material-symbols-outlined text-[20px]">add</span>
                            <span>{addText}</span>
                        </button>
                    </Link>
                ))}
            </div>
        </div>
    );
}
