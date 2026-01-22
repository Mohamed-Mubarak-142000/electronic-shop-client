'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import Link from 'next/link';
import { Card } from '@/components/ui/card';

import 'swiper/css';
import 'swiper/css/navigation';

const categories = [
    { id: 1, name: 'Lighting', slug: 'lighting', image: '💡' },
    { id: 2, name: 'Tools', slug: 'tools', image: '🔧' },
    { id: 3, name: 'Cables', slug: 'cables', image: '🔌' },
    { id: 4, name: 'Switches', slug: 'switches', image: '🔘' },
    { id: 5, name: 'Fans', slug: 'fans', image: '💨' },
    { id: 6, name: 'Breakers', slug: 'breakers', image: '⚡' },
    { id: 7, name: 'Smart Home', slug: 'smart-home', image: '🏠' },
];

export default function CategorySlider() {
    return (
        <div className="py-8">
            <h2 className="text-2xl font-bold mb-6">Shop by Category</h2>
            <Swiper
                modules={[Navigation, Autoplay]}
                spaceBetween={20}
                slidesPerView={2}
                navigation
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                breakpoints={{
                    640: { slidesPerView: 3 },
                    768: { slidesPerView: 4 },
                    1024: { slidesPerView: 6 },
                }}
                className="w-full"
            >
                {categories.map((cat) => (
                    <SwiperSlide key={cat.id}>
                        <Link href={`/products?category=${cat.slug}`}>
                            <Card className="h-32 flex flex-col items-center justify-center hover:bg-accent transition-colors cursor-pointer border-dashed">
                                <span className="text-4xl mb-2">{cat.image}</span>
                                <span className="font-medium text-sm">{cat.name}</span>
                            </Card>
                        </Link>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}
