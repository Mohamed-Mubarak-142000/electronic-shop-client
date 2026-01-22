"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

interface DialogProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    title?: string;
    className?: string;
}

import { cn } from "@/lib/utils";

export default function Dialog({ isOpen, onClose, children, title, className }: DialogProps) {
    const overlayRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };

        if (isOpen) {
            document.body.style.overflow = "hidden";
            window.addEventListener("keydown", handleEscape);
        }

        return () => {
            document.body.style.overflow = "unset";
            window.removeEventListener("keydown", handleEscape);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                ref={overlayRef}
                onClick={(e) => e.target === overlayRef.current && onClose()}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            />

            {/* Content */}
            <div className={cn(
                "relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200 bg-white dark:bg-slate-900",
                className
            )}>
                <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-3 border-b border-slate-200/50 dark:border-slate-800/50 bg-inherit/95 backdrop-blur-xl">
                    <h2 className="text-lg font-bold tracking-tight opacity-90">{title}</h2>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-full text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
                    >
                        <span className="material-symbols-outlined text-xl">close</span>
                    </button>
                </div>
                <div className="p-0">
                    {children}
                </div>
            </div>
        </div>,
        document.body
    );
}
