"use client";

import { use, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { portfolioService } from "@/services/portfolioService";
import { useTranslation } from "@/hooks/useTranslation";
import { Portfolio } from "@/types";
import { ChevronLeft, ChevronRight, Calendar, User, Tag } from "lucide-react";

interface ArrowProps {
    className?: string;
    style?: React.CSSProperties;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

function NextArrow(props: ArrowProps) {
    const { onClick } = props;
    return (
        <button
            onClick={onClick}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full backdrop-blur-sm transition-all shadow-lg hover:scale-110"
        >
            <ChevronRight size={24} />
        </button>
    );
}

function PrevArrow(props: ArrowProps) {
    const { onClick } = props;
    return (
        <button
            onClick={onClick}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full backdrop-blur-sm transition-all shadow-lg hover:scale-110"
        >
            <ChevronLeft size={24} />
        </button>
    );
}

export default function PortfolioDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { t, language } = useTranslation();

    const { data: project, isLoading, error } = useQuery({
        queryKey: ['portfolio', id],
        queryFn: () => portfolioService.getPortfolioById(id),
    });

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        autoplay: true,
        autoplaySpeed: 5000,
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error || !project) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-gray-200">
                    {language === 'ar' ? 'المشروع غير موجود' : 'Project Not Found'}
                </h2>
                <Link
                    href="/portfolio"
                    className="px-6 py-2 bg-primary text-secondary rounded-lg font-bold hover:opacity-90 transition-opacity"
                >
                    {language === 'ar' ? 'العودة للمعرض' : 'Back to Portfolio'}
                </Link>
            </div>
        );
    }

    const title = language === 'ar' ? project.titleAr || project.title : project.title;
    const description = language === 'ar' ? project.descriptionAr || project.description : project.description;
    const client = language === 'ar' ? project.clientAr || project.client : project.client;

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark py-12 px-4 md:px-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <Link
                            href="/portfolio"
                            className="inline-flex items-center gap-2 text-gray-500 hover:text-primary transition-colors mb-4"
                        >
                            <ChevronLeft size={20} className={language === 'ar' ? 'rotate-180' : ''} />
                            {language === 'ar' ? 'العودة للمعرض' : 'Back to Portfolio'}
                        </Link>
                        <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mt-2">
                            {title}
                        </h1>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
                    {/* Left Column: Slider (Takes 2 columns) */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Image Slider */}
                        <div className="rounded-3xl overflow-hidden shadow-2xl border border-white/5 bg-surface-dark/50">
                            {project.images && project.images.length > 0 ? (
                                <Slider {...settings} className="portfolio-slider">
                                    {project.images.map((img, index) => (
                                        <div key={index} className="relative aspect-video focus:outline-none">
                                            <Image
                                                src={img}
                                                alt={`${title} - image ${index + 1}`}
                                                fill
                                                className="object-cover"
                                                priority={index === 0}
                                            />
                                        </div>
                                    ))}
                                </Slider>
                            ) : (
                                <div className="aspect-video bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                                    <p className="text-gray-500">{language === 'ar' ? 'لا توجد صور' : 'No images available'}</p>
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        <div className="bg-white/50 dark:bg-surface-dark/30 rounded-3xl p-8 backdrop-blur-sm border border-white/10">
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                                {language === 'ar' ? 'عن المشروع' : 'About Project'}
                            </h3>
                            <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 leading-relaxed font-light text-lg whitespace-pre-line">
                                {description}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Project Details (Takes 1 column) */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white/80 dark:bg-surface-dark rounded-3xl p-8 border border-white/10 sticky top-24 shadow-xl">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                                {language === 'ar' ? 'معلومات المشروع' : 'Project Info'}
                            </h3>

                            <div className="space-y-6">
                                {/* Client */}
                                {client && (
                                    <div className="flex items-start gap-4 group">
                                        <div className="p-3 bg-primary/10 rounded-xl text-primary group-hover:bg-primary group-hover:text-black transition-colors">
                                            <User size={24} />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 uppercase font-bold tracking-wider mb-1">
                                                {language === 'ar' ? 'العميل' : 'Client'}
                                            </p>
                                            <p className="text-lg font-medium text-slate-900 dark:text-white">{client}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Date */}
                                {project.completedAt && (
                                    <div className="flex items-start gap-4 group">
                                        <div className="p-3 bg-primary/10 rounded-xl text-primary group-hover:bg-primary group-hover:text-black transition-colors">
                                            <Calendar size={24} />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 uppercase font-bold tracking-wider mb-1">
                                                {language === 'ar' ? 'تاريخ الإنجاز' : 'Completion Date'}
                                            </p>
                                            <p className="text-lg font-medium text-slate-900 dark:text-white">
                                                {new Date(project.completedAt).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Category */}
                                {project.category && (
                                    <div className="flex items-start gap-4 group">
                                        <div className="p-3 bg-primary/10 rounded-xl text-primary group-hover:bg-primary group-hover:text-black transition-colors">
                                            <Tag size={24} />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 uppercase font-bold tracking-wider mb-1">
                                                {language === 'ar' ? 'التصنيف' : 'Category'}
                                            </p>
                                            <p className="text-lg font-medium text-slate-900 dark:text-white">{project.category}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <button className="w-full mt-10 py-4 bg-primary text-secondary font-bold text-lg rounded-xl hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/20 hover:-translate-y-1">
                                {language === 'ar' ? 'اطلب مشروع مشابه' : 'Start a Similar Project'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
