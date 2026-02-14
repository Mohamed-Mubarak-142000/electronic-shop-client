"use client";

import { useTranslation } from "@/hooks/useTranslation";
import { useConfigStore } from "@/store/useConfigStore";
import { useEffect, useRef, useState, useCallback } from "react";
import { Quote, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  image: string;
  text: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "John Doe",
    role: "Architect",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    text: "ElectroShop provided us with the best electrical components for our smart home project. Their service is top-notch!",
  },
  {
    id: 2,
    name: "Sarah Smith",
    role: "Interior Designer",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    text: "The selection of lighting fixtures is amazing. I always find what I need for my clients at ElectroShop.",
  },
  {
    id: 3,
    name: "Ahmed Hassan",
    role: "Contractor",
    image: "https://randomuser.me/api/portraits/men/68.jpg",
    text: "Reliable, fast delivery, and high-quality products. I highly recommend ElectroShop for any construction project.",
  },
  {
    id: 4,
    name: "Emily Davis",
    role: "Homeowner",
    image: "https://randomuser.me/api/portraits/women/65.jpg",
    text: "Great customer support! They helped me choose the right smart switches for my apartment.",
  },
];

export default function Testimonials() {
  const { t, language } = useTranslation();
  const { configs, fetchConfigs } = useConfigStore();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    fetchConfigs();
  }, []);

  const checkScroll = useCallback(() => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 20);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 20);

      // Update active index based on scroll position
      const index = Math.round(scrollLeft / clientWidth);
      setActiveIndex(index);
    }
  }, []);

  useEffect(() => {
    const scrollNode = scrollRef.current;
    if (scrollNode) {
      scrollNode.addEventListener("scroll", checkScroll);
      // Run once to set initial state
      setTimeout(checkScroll, 100);
    }
    return () => {
      if (scrollNode) scrollNode.removeEventListener("scroll", checkScroll);
    };
  }, [checkScroll]);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      const scrollAmount = direction === "left" ? -clientWidth : clientWidth;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="py-20 bg-background-light dark:bg-background-dark overflow-hidden">
      <div className="container mx-auto px-4 max-w-[1440px]">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">
            {configs?.testimonialsTitle || (language === 'ar' ? 'آراء العملاء' : 'What Our Clients Say')}
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            {configs?.testimonialsSubtitle || (language === 'ar'
              ? 'نحن فخورون بخدمة عملائنا وتقديم أفضل الحلول الكهربائية لهم.'
              : 'We take pride in serving our clients and providing them with the best electrical solutions.')}
          </p>
        </div>

        <div className="relative group px-4">
          {/* Custom Navigation Buttons */}
          <button
            onClick={() => scroll(language === "ar" ? "right" : "left")}
            disabled={!canScrollLeft}
            className={`absolute left-0 top-1/2 -translate-y-1/2 z-20 p-4 rounded-full bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/10 shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 group-hover:opacity-100 sm:opacity-0 ${!canScrollLeft ? 'opacity-0 scale-90 pointer-events-none' : 'opacity-100'}`}
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-6 h-6 text-primary" />
          </button>

          <button
            onClick={() => scroll(language === "ar" ? "left" : "right")}
            disabled={!canScrollRight}
            className={`absolute right-0 top-1/2 -translate-y-1/2 z-20 p-4 rounded-full bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/10 shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 group-hover:opacity-100 sm:opacity-0 ${!canScrollRight ? 'opacity-0 scale-90 pointer-events-none' : 'opacity-100'}`}
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-6 h-6 text-primary" />
          </button>

          {/* Native Scroll Container */}
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide scroll-smooth pb-12 pt-4"
          >
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="min-w-full sm:min-w-[calc(50%-12px)] lg:min-w-[calc(33.333%-16px)] snap-start px-2"
              >
                <div className="bg-white dark:bg-surface-dark/50 p-8 rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-xl hover:-translate-y-2 transition-transform duration-300 h-full min-h-[340px] flex flex-col relative group/card">
                  <div className="absolute top-8 right-8 text-primary/20 group-hover/card:text-primary/40 transition-colors">
                    <Quote size={40} className="rotate-180" />
                  </div>

                  <div className="flex items-center gap-4 mb-6">
                    <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-primary shadow-lg shadow-primary/20">
                      <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-slate-900 dark:text-white">
                        {testimonial.name}
                      </h4>
                      <p className="text-sm text-primary font-medium">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>

                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed flex-grow italic">
                    &quot;{testimonial.text}&quot;
                  </p>

                  <div className="flex gap-1 mt-6">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star} className="text-yellow-400 text-lg">★</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Indicators (Dots) */}
          <div className="flex justify-center gap-2 mt-4">
            {Array.from({ length: Math.ceil(testimonials.length / (typeof window !== 'undefined' && window.innerWidth < 640 ? 1 : window.innerWidth < 1024 ? 2 : 3)) }).map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  if (scrollRef.current) {
                    const itemWidth = scrollRef.current.clientWidth;
                    scrollRef.current.scrollTo({ left: i * itemWidth, behavior: 'smooth' });
                  }
                }}
                className={`h-2 transition-all duration-300 rounded-full ${activeIndex === i ? 'w-8 bg-primary' : 'w-2 bg-gray-300 dark:bg-gray-700'}`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Scrollbar-hide utility style if needed (or use tailwind if available) */}
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
