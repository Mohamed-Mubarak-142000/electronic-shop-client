'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import OptimizedImage from '@/components/shared/OptimizedImage';
import { Product } from '@/types';
import { useTranslation } from '@/hooks/useTranslation';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface HeroSliderProps {
    products: Product[];
}

const HeroSlider: React.FC<HeroSliderProps> = ({ products }) => {
    const { t, language } = useTranslation();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);

    const nextSlide = useCallback(() => {
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % products.length);
    }, [products.length]);

    const prevSlide = useCallback(() => {
        setDirection(-1);
        setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
    }, [products.length]);

    useEffect(() => {
        const timer = setInterval(nextSlide, 5000);
        return () => clearInterval(timer);
    }, [nextSlide]);

    if (!products || products.length === 0) return null;

    const currentProduct = products[currentIndex];

    // Animation variants
    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 100 : -100,
            opacity: 0
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 100 : -100,
            opacity: 0
        })
    };

    return (
        <div className="relative w-full overflow-hidden bg-surface-dark min-h-[700px] shadow-2xl rounded-b-[3rem] group flex flex-col md:flex-row">
            <AnimatePresence initial={false} custom={direction}>
                <motion.div
                    key={currentIndex}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                        x: { type: "spring", stiffness: 300, damping: 30 },
                        opacity: { duration: 0.5 }
                    }}
                    className="absolute inset-0 w-full h-full flex flex-col md:flex-row"
                >
                    {/* Left Side - Image (50%) */}
                    <div className="w-full md:w-1/2 relative h-[350px] md:h-auto overflow-hidden">
                        <OptimizedImage
                            src={currentProduct.imageUrl || currentProduct.images[0] || 'https://placehold.co/800x800'}
                            alt={language === 'ar' ? currentProduct.nameAr : currentProduct.name}
                            fill
                            priority
                            className="object-cover transition-transform duration-1000 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-background-dark/60 via-transparent to-transparent"></div>
                    </div>

                    {/* Right Side - Info (50%) */}
                    <div className="w-full md:w-1/2 p-6 md:p-20 flex flex-col justify-center gap-4 md:gap-8 relative z-10 bg-surface-dark/95 backdrop-blur-sm">
                        <div className="flex flex-col gap-2 md:gap-3">
                            <span className="text-primary font-bold text-sm md:text-base tracking-[0.2em] uppercase">
                                {language === 'ar'
                                    ? (typeof currentProduct.category === 'object' ? currentProduct.category?.nameAr : 'مميز')
                                    : (typeof currentProduct.category === 'object' ? currentProduct.category?.name : 'FEATURED')}
                            </span>
                            <h2 className="text-white text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black leading-[1.1] tracking-tight">
                                {language === 'ar' ? currentProduct.nameAr : currentProduct.name}
                            </h2>
                        </div>

                        <p className="text-gray-300 text-base sm:text-lg md:text-2xl leading-relaxed md:leading-normal line-clamp-3 md:line-clamp-4 max-w-2xl">
                            {language === 'ar' ? currentProduct.descriptionAr : currentProduct.description}
                        </p>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mt-2 md:mt-6">
                            <div className="flex flex-col">
                                <span className="text-gray-500 text-xs md:text-sm uppercase tracking-wider font-bold mb-1">{t('product.price')}</span>
                                <span className="text-white text-4xl md:text-5xl font-black text-nowrap">
                                    {currentProduct.price} <small className="text-sm md:text-lg font-bold text-gray-400">{t('common.currency_egp')}</small>
                                </span>
                            </div>

                            <Link href={`/product/${currentProduct._id}`} className="w-full sm:w-auto sm:flex-1 max-w-[240px]">
                                <Button className="w-full h-12 md:h-16 text-lg font-bold rounded-full transition-all flex items-center justify-center gap-2 group/btn">
                                    {t('product.viewDetails')}
                                    <ArrowRight size={24} className="group-hover/btn:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none">
                <button
                    onClick={prevSlide}
                    className="p-3 rounded-full bg-black/40 backdrop-blur-lg text-white border border-white/10 hover:bg-primary hover:text-[#122118] transition-all pointer-events-auto shadow-2xl"
                >
                    <ArrowLeft size={24} />
                </button>
                <button
                    onClick={nextSlide}
                    className="p-3 rounded-full bg-black/40 backdrop-blur-lg text-white border border-white/10 hover:bg-primary hover:text-[#122118] transition-all pointer-events-auto shadow-2xl"
                >
                    <ArrowRight size={24} />
                </button>
            </div>

            {/* Progress Indicators */}
            <div className="absolute bottom-8 left-8 md:left-auto md:right-16 flex gap-3 z-20">
                {products.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => {
                            setDirection(idx > currentIndex ? 1 : -1);
                            setCurrentIndex(idx);
                        }}
                        className={`h-2 transition-all duration-300 rounded-full ${currentIndex === idx ? 'w-12 bg-primary' : 'w-2 bg-white/20 hover:bg-white/40'}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default HeroSlider;
