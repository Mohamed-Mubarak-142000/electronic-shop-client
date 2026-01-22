'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import OptimizedImage from '@/components/shared/OptimizedImage';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function HeroCarousel() {
    const slides = [
        {
            id: 1,
            image: 'https://images.unsplash.com/photo-1558611848-73f7eb4001a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
            title: 'Modern Lighting Solutions',
            subtitle: 'Brighten your home with our premium LED collection'
        },
        {
            id: 2,
            image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
            title: 'Professional Tools',
            subtitle: 'High quality tools for industrial and home use'
        },
        {
            id: 3,
            image: 'https://images.unsplash.com/photo-1517420879524-86d65292fe8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
            title: 'Smart Home Devices',
            subtitle: 'Upgrade your lifestyle with our smart switches & sockets'
        }
    ];

    return (
        <div className="w-full h-[400px] md:h-[500px] lg:h-[600px]">
            <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                navigation
                pagination={{ clickable: true }}
                autoplay={{ delay: 5000 }}
                loop={true}
                className="w-full h-full"
            >
                {slides.map((slide) => (
                    <SwiperSlide key={slide.id} className="relative w-full h-full">
                        <div className="absolute inset-0 bg-black/40 z-10" />
                        <OptimizedImage
                            src={slide.image}
                            alt={slide.title}
                            fill
                            className="object-cover"
                            priority={slide.id === 1}
                            sizes="100vw"
                        />
                        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white text-center px-4">
                            <h1 className="text-4xl md:text-6xl font-bold mb-4">{slide.title}</h1>
                            <p className="text-lg md:text-xl max-w-2xl">{slide.subtitle}</p>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}
