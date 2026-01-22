"use client";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useTranslation } from "@/hooks/useTranslation";
import { Quote } from "lucide-react";
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

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    rtl: language === 'ar',
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="py-20 bg-background-light dark:bg-background-dark overflow-hidden">
      <div className="container mx-auto px-4 max-w-[1440px]">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">
            {language === 'ar' ? 'آراء العملاء' : 'What Our Clients Say'}
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            {language === 'ar' 
              ? 'نحن فخورون بخدمة عملائنا وتقديم أفضل الحلول الكهربائية لهم.' 
              : 'We take pride in serving our clients and providing them with the best electrical solutions.'}
          </p>
        </div>

        <div className="testimonials-slider px-4">
          <Slider {...settings}>
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="px-3 py-6">
                <div className="bg-white dark:bg-surface-dark/50 p-8 rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-xl hover:-translate-y-2 transition-transform duration-300 h-full min-h-[300px] flex flex-col relative group">
                  <div className="absolute top-8 right-8 text-primary/20 group-hover:text-primary/40 transition-colors">
                    <Quote size={40} className="rotate-180" />
                  </div>
                  
                  <div className="flex items-center gap-4 mb-6">
                    <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-primary">
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
                  
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed flex-grow">
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
          </Slider>
        </div>
      </div>
    </div>
  );
}
