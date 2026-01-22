"use client";

import Link from "next/link";
import OptimizedImage from "@/components/shared/OptimizedImage";
import ProductCard from "@/components/shared/ProductCard";
import { productService } from "@/services/productService";
import { categoryService, brandService } from "@/services/metadataService";
import { useTranslation } from "@/hooks/useTranslation";
import { userService } from "@/services/userService";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import dynamic from 'next/dynamic';
import { useQuery } from "@tanstack/react-query";
import { Product } from "@/types";
import Testimonials from "@/components/home/Testimonials";
import LazySection from "@/components/shared/LazySection";
import { useEffect } from 'react';

// Performance: Import slick carousel CSS
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Performance: Lazy load react-slick to reduce initial bundle size
const Slider = dynamic(() => import("react-slick"), {
  ssr: false,
  loading: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-96 bg-surface-dark/30 rounded-2xl animate-pulse"></div>
      ))}
    </div>
  ),
});

// Performance: Lazy load MapSelector to reduce initial bundle
const MapSelector = dynamic<{ value: { lat: number; lng: number }; onChange: (v: { lat: number, lng: number }) => void; readOnly?: boolean }>(
  () => import('../../components/shared/MapSelector'),
  { 
    ssr: false,
    loading: () => (
      <div className="h-full min-h-[600px] w-full bg-surface-dark/30 animate-pulse rounded-lg flex items-center justify-center">
        <span className="material-symbols-outlined text-4xl text-gray-600 animate-spin">map</span>
      </div>
    ),
  }
);

interface ArrowProps {
  className?: string;
  style?: React.CSSProperties;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

function SampleNextArrow(props: ArrowProps) {
  const { onClick } = props;
  return (
    <button
      aria-label="Next slide"
      className="absolute right-0 top-1/2 -translate-y-1/2 z-10 size-12 rounded-full bg-[#112117]/80 backdrop-blur-sm border border-[#254632] flex items-center justify-center text-white hover:bg-primary hover:text-[#112117] transition-all shadow-xl -mr-6"
      onClick={onClick}
    >
      <span className="material-symbols-outlined" aria-hidden="true">chevron_right</span>
    </button>
  );
}

function SamplePrevArrow(props: ArrowProps) {
  const { onClick } = props;
  return (
    <button
      aria-label="Previous slide"
      className="absolute left-0 top-1/2 -translate-y-1/2 z-10 size-12 rounded-full bg-[#112117]/80 backdrop-blur-sm border border-[#254632] flex items-center justify-center text-white hover:bg-primary hover:text-[#112117] transition-all shadow-xl -ml-6"
      onClick={onClick}
    >
      <span className="material-symbols-outlined" aria-hidden="true">chevron_left</span>
    </button>
  );
}

export default function Home() {
  const { t, language } = useTranslation();
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  const { data: bestSellersData, isLoading: loadingBestSellers } = useQuery({
    queryKey: ['products', 'best-sellers'],
    queryFn: () => productService.getProducts({ limit: 40 }),
  });

  const { data: homeCategories, isLoading: loadingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: categoryService.getCategories,
  });

  const { data: newArrivalsData, isLoading: loadingNewArrivals } = useQuery({
    queryKey: ['products', 'new-arrivals'],
    queryFn: () => productService.getProducts({ limit: 5, sort: "-createdAt" }),
  });

  const { data: brands, isLoading: loadingBrands } = useQuery({
    queryKey: ['brands'],
    queryFn: brandService.getBrands,
  });

  const { data: showroomInfo, isLoading: loadingShowroom } = useQuery({
    queryKey: ['showroom'],
    queryFn: () => userService.getShowroomInfo().catch(() => null),
  });

  const loading = loadingBestSellers || loadingCategories || loadingNewArrivals || loadingBrands || loadingShowroom;

  const bestSellers = bestSellersData?.products || [];
  const newArrivals = newArrivalsData?.products || [];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background-light dark:bg-background-dark">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display">
      <div className="w-full max-w-[1440px] px-4 md:px-10 pb-10">

        {/* Hero Section */}
        <div className="py-6">
          <div className="relative overflow-hidden rounded-[2rem] min-h-[520px] flex items-center group">
            {/* Performance: Hero image with high priority for LCP optimization */}
            <OptimizedImage
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDADEqPsOmKi_XwT6AvVte0yDQygWKaXYZ2lasqr0jLA8v6hyUh66MVDYjpNFU2O-7zz3D72k5QkRVp3KOi-6o1nxnw_63XoyWOIxgMPa1GdeCpvrrQzN7J5iGAyJProQ_TjdnkXTwzicepoLZ2xTTorXP5pj0ehkLNZeXjB9HXxcVg1WHQdS6TNptMGr6odEC-0zSdIqIksRC6UuEzr0jlBxHubRXGtva1bUJHDOmUihlEXDu6s5dQPFSYlNCgAZK6wZq4Tfchwog"
              alt="Electro Shop Hero - Modern Electronics and Professional Tools"
              fill
              priority
              fetchPriority="high"
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1440px) 90vw, 1440px"
              quality={85}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#112117]/90 via-[#112117]/40 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#112117] via-transparent to-transparent opacity-60"></div>
            
            <div className="relative z-10 p-8 md:p-16 max-w-3xl flex flex-col gap-6 items-start">
              <span className="inline-flex items-center gap-2 rounded-full bg-primary/20 px-3 py-1 text-xs font-bold text-primary backdrop-blur-sm border border-primary/20">
                <span className="material-symbols-outlined text-sm">eco</span>
                {t('home.hero.eco')}
              </span>
              <h1 className="text-white text-5xl md:text-7xl font-black leading-[0.95] tracking-tight">
                {t('home.hero.title1')} <br /> <span className="text-primary">{t('home.hero.title2')}</span>
              </h1>
              <p className="text-gray-300 text-lg md:text-xl font-normal leading-relaxed max-w-lg">
                {t('home.hero.subtitle')}
              </p>
              <div className="flex flex-wrap gap-4 mt-4">
                <Link href="/shop">
                  <button className="h-12 px-8 rounded-full bg-primary text-[#122118] text-base font-bold tracking-wide hover:scale-105 transition-transform flex items-center gap-2">
                    {t('home.hero.shopHome')}
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                </Link>
                <button 
                    onClick={() => {
                        logout();
                        router.push('/register');
                    }}
                    className="h-12 px-8 rounded-full bg-surface-highlight/80 backdrop-blur-md text-white border border-[#3e6b50] text-base font-bold tracking-wide hover:bg-surface-highlight hover:scale-105 transition-all"
                >
                    {t('home.hero.forPros')}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Brand Marquee */}
        <div className="w-full py-8 overflow-hidden">
          <p className="text-center text-sm font-medium text-gray-500 mb-6 uppercase tracking-widest">
            Trusted by top brands
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            {brands && brands.length > 0 ? (
              brands.map((brand) => (
                <div key={brand._id} className="text-2xl font-black text-white tracking-tighter uppercase">
                  {brand.name}
                </div>
              ))
            ) : (
              <>
                <div className="text-2xl font-black text-white tracking-tighter">PHILIPS</div>
                <div className="text-2xl font-bold text-white italic">Schneider</div>
                <div className="text-xl font-bold text-white border-2 border-white px-2 py-0.5">SIEMENS</div>
                <div className="text-2xl font-bold text-white tracking-widest">LUTRON</div>
                <div className="flex items-center gap-1 text-xl font-bold text-white">
                  <span className="material-symbols-outlined">bolt</span>ABB
                </div>
              </>
            )}
          </div>
        </div>

        {/* Categories */}
        <div className="py-10">
          <div className="flex items-end justify-between px-2 mb-8">
            <div>
              <h2 className="text-3xl font-bold text-white tracking-tight">
                {t('home.categories')}
              </h2>
              <p className="text-gray-400 mt-1">
                {t('home.categoriesSubtitle')}
              </p>
            </div>
            <Link
              href="/shop"
              className="hidden md:flex items-center gap-1 text-primary text-sm font-bold hover:underline"
            >
              {t('home.viewAll')}{" "}
              <span className="material-symbols-outlined text-sm">
                arrow_forward
              </span>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {homeCategories && homeCategories.length > 0 ? (
              homeCategories.map((cat) => (
                <Link key={cat._id} href={`/shop?category=${cat._id}`} className="group flex flex-col items-center gap-4">
                  <div className="relative w-full aspect-square rounded-full overflow-hidden border-2 border-transparent group-hover:border-primary transition-all duration-300">
                    <OptimizedImage
                        src={cat.imageUrl || `https://placehold.co/400x400?text=${cat.name}`}
                        alt={cat.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 16vw"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors z-10"></div>
                  </div>
                  <span className="text-white font-medium text-center group-hover:text-primary transition-colors">
                    {cat.name}
                  </span>
                </Link>
              ))
            ) : (
              <div className="col-span-full py-10 flex flex-col items-center justify-center bg-surface-dark/30 rounded-3xl border border-surface-highlight/10">
                <span className="material-symbols-outlined text-4xl text-gray-600 mb-2">category</span>
                <p className="text-gray-500 font-medium">{t('home.noCategories')}</p>
              </div>
            )}
          </div>
        </div>

        {/* Best Sellers Slider */}
        <div className="py-12 best-sellers-slider">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-3xl font-bold text-white tracking-tight">
              {t('home.bestSellers')}
            </h2>
            <div className="h-px flex-1 bg-[#254632]"></div>
          </div>

          {bestSellers.length > 0 ? (
            <Slider
              dots={false}
              infinite={bestSellers.length > 4}
              speed={500}
              slidesToShow={4}
              slidesToScroll={1}
              autoplay={true}
              autoplaySpeed={3000}
              pauseOnHover={true}
              rtl={language === 'ar'}
              nextArrow={<SampleNextArrow />}
              prevArrow={<SamplePrevArrow />}
              responsive={[
                {
                  breakpoint: 1280,
                  settings: {
                    slidesToShow: 3,
                  }
                },
                {
                  breakpoint: 1024,
                  settings: {
                    slidesToShow: 2,
                  }
                },
                {
                  breakpoint: 768,
                  settings: {
                    slidesToShow: 2,
                  }
                },
                {
                  breakpoint: 480,
                  settings: {
                    slidesToShow: 1,
                  }
                }
              ]}
            >
              {bestSellers.map((product: Product) => (
                <div key={product._id} className="px-3">
                  <ProductCard product={product} />
                </div>
              ))}
              {/* More Card as a slide */}
              <div className="px-3">
                <Link
                  href="/shop"
                  className="flex flex-col items-center justify-center bg-surface-dark/50 p-6 rounded-[2rem] border-2 border-dashed border-[#254632] hover:border-primary hover:bg-primary/5 transition-all group aspect-[3/4] h-full"
                >
                  <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-4xl">add</span>
                  </div>
                  <span className="text-white font-bold text-lg">{t('home.more')}</span>
                  <p className="text-gray-500 text-sm text-center mt-2 group-hover:text-gray-300">
                    {t('home.viewAllProducts')}
                  </p>
                </Link>
              </div>
            </Slider>
          ) : (
            <div className="py-20 flex flex-col items-center justify-center bg-surface-dark/30 rounded-[3rem] border border-surface-highlight/10">
              <span className="material-symbols-outlined text-5xl text-gray-600 mb-4 animate-pulse">shopping_cart_off</span>
              <p className="text-gray-400 text-lg font-medium">{t('home.noBestSellers')}</p>
              <p className="text-gray-600 text-sm mt-2">{t('home.checkBack')}</p>
            </div>
          )}
        </div>

        {/* CTA Section */}
        <div className="py-12">
          <LazySection>
          <div className="relative overflow-hidden rounded-[3rem] bg-[#254632] bg-opacity-40">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/10 to-transparent"></div>
            <div className="absolute bottom-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between p-10 md:p-20 gap-10">
              <div className="flex flex-col gap-6 max-w-2xl text-center md:text-left">
                <div className="inline-flex items-center gap-2 self-center md:self-start bg-yellow-400/20 text-yellow-400 px-4 py-1.5 rounded-full text-sm font-bold border border-yellow-400/20">
                  <span className="material-symbols-outlined text-sm">
                    engineering
                  </span>
                  {t('home.b2b.badge')}
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-white leading-tight tracking-tight">
                  {t('home.b2b.title1')}
                  <br />
                  <span className="text-primary">{t('home.b2b.title2')}</span>
                </h2>
                <p className="text-gray-300 text-lg md:text-xl">
                  {t('home.b2b.description')}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-2">
                  <Link href="/portfolio">
                    <button className="h-14 px-8 rounded-full bg-transparent border-2 border-white/20 text-white text-lg font-bold hover:bg-white/10 transition-all">
                      {t('nav.portfolio')} 
                    </button>
                  </Link>
                </div>
              </div>
              {/* Visual Element */}
              <div className="relative size-64 md:size-80 flex-shrink-0">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl"></div>
                {/* Performance: Add proper sizes and loading strategy for B2B section image */}
                <OptimizedImage
                  alt="Professional electrician with safety equipment and project blueprints"
                  width={320}
                  height={320}
                  containerClassName="w-full h-full rounded-full border-4 border-[#254632] shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500"
                  className="relative z-10 w-full h-full object-cover rounded-full"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuA-AG2JpXiB2fT-3UQMvwbIsx9b-DzSLP8aG97UO710bW-wLjvufVzVglC4C3PuMCj9cIdNI-1kP9INrZraiWBOiuME2_9LXdrAwvqA0BdLCwAolHdbg6BwM0QDl6x2cF08AnJQGhu4fgIKUJPVsb-JYi3_YP20SlZrJmXcNQKYbyoOCLoowZlO4MEA0BRFoXxdbWCHjOko3iQJFK5207UCuOuof0n3TfwBpq8y2XofH1_FEEIgg2A7OJy5h48-xWaW-UdTY10xWPI"
                  sizes="(max-width: 768px) 256px, 320px"
                  loading="lazy"
                />
                <div className="absolute -bottom-4 -right-4 bg-[#122118] p-4 rounded-2xl border border-[#254632] shadow-xl z-20">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-500/20 p-2 rounded-full text-green-500">
                      <span className="material-symbols-outlined">verified</span>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400">{t('home.b2b.verified')}</div>
                      <div className="text-white font-bold">{t('home.b2b.priority')}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </LazySection>
        </div>

        {/* Latest Arrivals Section */}
        <div className="py-12">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-white">{t('home.newArrivals')}</h2>
            <Link href="/shop" className="text-primary font-bold text-sm hover:underline">{t('home.viewAll')}</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {newArrivals.length > 0 ? (
              newArrivals.map((item: Product) => (
                <div key={item._id} className="h-full">
                    <ProductCard product={item} />
                </div>
              ))
            ) : (
              <div className="col-span-full py-12 flex flex-col items-center justify-center bg-surface-dark/30 rounded-2xl border border-surface-highlight/10">
                <span className="material-symbols-outlined text-4xl text-gray-600 mb-2">new_releases</span>
                <p className="text-gray-500 font-medium">{t('home.noBestSellers')}</p>
              </div>
            )}
          </div>
        </div>

        {/* Testimonials Section */}
        <Testimonials />

        {/* Store Locator Section */}
        <LazySection className="py-12 border-t border-[#254632] mt-8" placeholderHeight="min-h-[500px]">
          <div className="grid md:grid-cols-2 gap-8 items-center rounded-3xl bg-surface-dark overflow-hidden min-h-[500px]">
             <div className="p-8 md:p-12">
              <h2 className="text-3xl font-bold text-white mb-4">
                {t('home.visitShowroom')}
              </h2>
              <p className="text-gray-400 mb-8">
                {t('home.showroomSubtitle')}
              </p>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="size-12 rounded-full bg-[#254632] flex items-center justify-center text-primary shrink-0">
                    <span className="material-symbols-outlined">location_on</span>
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-lg">{t('home.headquarters')}</h4>
                    <p className="text-gray-400">
                      {showroomInfo?.address ?
                        `${showroomInfo.address.street}, ${showroomInfo.address.city}, ${showroomInfo.address.country}` :
                        '1234 Voltage Ave, Circuit City, CA 90210'}
                    </p>
                  </div>
                </div>
                {showroomInfo?.phone && (
                  <div className="flex gap-4">
                    <div className="size-12 rounded-full bg-[#254632] flex items-center justify-center text-primary shrink-0">
                      <span className="material-symbols-outlined">phone</span>
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-lg">{t('home.callUs')}</h4>
                      <p className="text-gray-400">{showroomInfo.phone}</p>
                    </div>
                  </div>
                )}
                <div className="flex gap-4">
                  <div className="size-12 rounded-full bg-[#254632] flex items-center justify-center text-primary shrink-0">
                    <span className="material-symbols-outlined">schedule</span>
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-lg">{t('home.openingHours')}</h4>
                    <p className="text-gray-400">
                      {t('home.hoursWeekday')}
                      <br />
                      {t('home.hoursFriday')}
                    </p>
                  </div>
                </div>
              </div>
              <button className="mt-8 px-6 py-3 rounded-full border border-gray-600 text-white hover:bg-white hover:text-black transition-colors font-bold text-sm">
                {t('home.getDirections')}
              </button>
            </div>
            <div className="h-full min-h-[600px] w-full relative">
              <MapSelector 
                value={showroomInfo?.location || { lat: 30.0444, lng: 31.2357 }} 
                onChange={() => {}}
                readOnly={true}
              />
            </div>
          </div>
        </LazySection>

      </div>
    </div>
  );
}
