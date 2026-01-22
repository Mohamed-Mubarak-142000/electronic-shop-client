"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useLanguageStore } from "@/store/useLanguageStore";
import { useTranslation } from "@/hooks/useTranslation";
import { toast } from "react-hot-toast";
import { User as UserIcon } from "lucide-react";
import { productService } from "@/services/productService";
import { categoryService } from "@/services/metadataService";
import { Product, Category } from "@/types";
import OptimizedImage from "@/components/shared/OptimizedImage";

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const cartItems = useCartStore((state) => state.cartItems);
    const wishlistItems = useWishlistStore((state) => state.wishlistItems);
    const user = useAuthStore((state) => state.user);
    const { language, setLanguage } = useLanguageStore();
    const { t } = useTranslation();
    const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const wishlistCount = wishlistItems.length;
    const router = useRouter();

    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<{ products: Product[], categories: Category[] }>({ products: [], categories: [] });
    const [isSearching, setIsSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowResults(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const delayDebounce = setTimeout(async () => {
            if (searchQuery.trim().length > 1) {
                setIsSearching(true);
                try {
                    const [productsData, categoriesData] = await Promise.all([
                        productService.getProducts({ search: searchQuery, limit: 5 }),
                        categoryService.getCategories()
                    ]);
                    
                    const filteredCategories = categoriesData.filter(c => 
                        c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        (c.nameAr && c.nameAr.includes(searchQuery))
                    ).slice(0, 3);

                    setSearchResults({
                        products: productsData.products || [],
                        categories: filteredCategories
                    });
                    setShowResults(true);
                } catch (error) {
                    console.error("Search failed", error);
                } finally {
                    setIsSearching(false);
                }
            } else {
                setSearchResults({ products: [], categories: [] });
                setShowResults(false);
            }
        }, 500);

        return () => clearTimeout(delayDebounce);
    }, [searchQuery]);

    const handleProductClick = (productId: string) => {
        router.push(`/product/${productId}`);
        setShowResults(false);
        setSearchQuery("");
    };

    const handleCategoryClick = (categoryId: string) => {
        router.push(`/shop?category=${categoryId}`);
        setShowResults(false);
        setSearchQuery("");
    };

    useEffect(() => {
        document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = language;
    }, [language]);

    return (
        <div className="sticky top-0 z-50 bg-background-dark/95 backdrop-blur-md border-b border-surface-highlight">
            <div className="flex items-center justify-between px-4 py-3 lg:px-10 max-w-[1440px] mx-auto w-full">
                {/* Logo */}
                <div className="flex items-center gap-8">
                    <Link href="/" className="flex items-center gap-3 text-white group">
                        <div className="size-8 text-primary">
                            <span
                                className="material-symbols-outlined text-4xl"
                                style={{ fontVariationSettings: "'FILL' 1" }}
                            >
                                bolt
                            </span>
                        </div>
                        <h2 className="text-white text-xl font-bold tracking-tight">
                            ElectroShop
                        </h2>
                    </Link>

                    {/* Search Bar (Desktop) */}
                    <div className="hidden md:flex items-center relative" ref={searchRef}>
                        <label className="relative flex items-center min-w-[320px]">
                            <span className={language === 'ar' ? 'absolute right-4 text-[#95c6a9]' : 'absolute left-4 text-[#95c6a9]'}>
                                <span className="material-symbols-outlined">search</span>
                            </span>
                            <input
                                className={`w-full bg-surface-highlight text-white placeholder:text-[#95c6a9] rounded-full py-2.5 ${language === 'ar' ? 'pr-12 pl-4' : 'pl-12 pr-4'} focus:ring-2 focus:ring-primary focus:outline-none border-none text-sm transition-all hover:bg-[#2d543c]`}
                                placeholder={language === 'ar' ? 'بحث عن مصابيح، مفاتيح، أدوات...' : 'Search bulbs, switches, tools...'}
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => {
                                    if(searchQuery.length > 1) setShowResults(true);
                                }}
                            />
                            {isSearching && (
                                <span className={`absolute ${language === 'ar' ? 'left-4' : 'right-4'} animate-spin text-primary`}>
                                    <span className="material-symbols-outlined text-sm">progress_activity</span>
                                </span>
                            )}
                        </label>

                        {/* Search Results Dropdown */}
                        {showResults && (searchResults.products.length > 0 || searchResults.categories.length > 0) && (
                            <div className="absolute top-full left-0 w-[400px] mt-2 bg-background-dark border border-surface-highlight rounded-2xl shadow-2xl overflow-hidden z-50">
                                {searchResults.categories.length > 0 && (
                                    <div className="p-2">
                                        <div className="text-xs font-bold text-gray-500 px-3 py-1 uppercase tracking-wider">{t('home.categories')}</div>
                                        {searchResults.categories.map(cat => (
                                            <div 
                                                key={cat._id}
                                                onClick={() => handleCategoryClick(cat._id)}
                                                className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5 cursor-pointer transition-colors"
                                            >
                                                <div className="size-8 rounded-lg bg-surface-highlight flex items-center justify-center shrink-0">
                                                    {cat.imageUrl ? (
                                                        <OptimizedImage src={cat.imageUrl} alt={cat.name} className="object-cover rounded-lg" width={32} height={32} />
                                                    ) : (
                                                        <span className="material-symbols-outlined text-primary text-sm">category</span>
                                                    )}
                                                </div>
                                                <span className="text-white text-sm font-medium">{cat.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                
                                {searchResults.categories.length > 0 && searchResults.products.length > 0 && (
                                    <div className="h-px bg-surface-highlight mx-2"></div>
                                )}

                                {searchResults.products.length > 0 && (
                                    <div className="p-2">
                                        <div className="text-xs font-bold text-gray-500 px-3 py-1 uppercase tracking-wider">{t('nav.shop')}</div>
                                        {searchResults.products.map(prod => (
                                            <div 
                                                key={prod._id}
                                                onClick={() => handleProductClick(prod._id)}
                                                className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5 cursor-pointer transition-colors"
                                            >
                                                <div className="size-10 rounded-lg bg-surface-highlight overflow-hidden shrink-0">
                                                    <OptimizedImage 
                                                        src={prod.imageUrl || (prod.images && prod.images[0]) || "https://placehold.co/100x100"} 
                                                        alt={prod.name} 
                                                        className="object-cover"
                                                        width={40}
                                                        height={40}
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-white text-sm font-medium truncate">{prod.name}</div>
                                                    <div className="text-primary text-xs font-bold">${prod.salePrice || prod.price}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-6">
                    {/* Links (Desktop) */}
                    <div className="hidden lg:flex items-center gap-6">
                        <Link
                            href="/shop"
                            className="text-sm font-medium text-white hover:text-primary transition-colors"
                        >
                            {t('nav.shop')}
                        </Link>
                        <Link
                            href="/portfolio"
                            className="text-sm font-medium text-white hover:text-primary transition-colors"
                        >
                            {t('nav.portfolio')}
                        </Link>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <Link href="/wishlist">
                            <button 
                                aria-label="Wishlist"
                                className="relative flex items-center justify-center size-10 rounded-full bg-surface-highlight hover:bg-primary hover:text-[#122118] text-white transition-all duration-300"
                            >
                                <span className="material-symbols-outlined text-[20px]" aria-hidden="true">
                                    favorite
                                </span>
                                {wishlistCount > 0 && (
                                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                                        {wishlistCount}
                                    </span>
                                )}
                            </button>
                        </Link>
                        <Link href="/cart">
                            <button 
                                aria-label="Shopping cart"
                                className="relative flex items-center justify-center size-10 rounded-full bg-surface-highlight hover:bg-primary hover:text-[#122118] text-white transition-all duration-300"
                            >
                                <span className="material-symbols-outlined text-[20px]" aria-hidden="true">
                                    shopping_cart
                                </span>
                                {cartCount > 0 && (
                                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-[#122118]">
                                        {cartCount}
                                    </span>
                                )}
                            </button>
                        </Link>
                        {user ? (
                            <div className="relative group">
                                <button
                                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-highlight hover:bg-white/10 text-white transition-all"
                                >
                                    <UserIcon size={16} />
                                    <span className="hidden md:block text-sm font-medium">
                                        {user.name.split(' ')[0]}
                                    </span>
                                    <span className="material-symbols-outlined text-sm transition-transform group-hover:rotate-180">expand_more</span>
                                </button>

                                {/* Dropdown Menu */}
                                <div className="absolute right-0 top-full mt-2 w-48 bg-background-dark border border-surface-highlight rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right group-hover:translate-y-0 translate-y-2 z-50 overflow-hidden">
                                    <div className="p-2 space-y-1">
                                        <Link
                                            href="/profile"
                                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 text-sm text-white transition-colors"
                                        >
                                            <span className="material-symbols-outlined text-lg">person</span>
                                            {t('nav.profile')}
                                        </Link>

                                        <button
                                            aria-label={`Switch language to ${language === 'ar' ? 'English' : 'Arabic'}`}
                                            onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
                                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 text-sm text-white transition-colors"
                                        >
                                            <span className="material-symbols-outlined text-lg" aria-hidden="true">language</span>
                                            {language === 'ar' ? 'English' : 'العربية'}
                                        </button>

                                        <div className="h-px bg-surface-highlight mx-2 my-1"></div>

                                        <button
                                            onClick={() => {
                                                const { logout } = useAuthStore.getState();
                                                logout();
                                                toast.success(language === 'ar' ? 'تم تسجيل الخروج' : "Logged out successfully");
                                            }}
                                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-500/10 text-sm text-red-500 transition-colors"
                                        >
                                            <span className="material-symbols-outlined text-lg">logout</span>
                                            {t('nav.logout')}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <Link href="/login">
                                <button className="hidden sm:flex h-10 px-6 items-center justify-center rounded-full bg-primary text-[#122118] text-sm font-bold hover:brightness-110 transition-all">
                                    {t('auth.login')}
                                </button>
                            </Link>
                        )}
                        {/* Mobile Menu Button */}
                        <button
                            aria-label="Toggle menu"
                            aria-expanded={isMenuOpen}
                            className="lg:hidden text-white ml-2"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            <span className="material-symbols-outlined" aria-hidden="true">menu</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="lg:hidden bg-background-dark border-t border-surface-highlight px-4 py-4 space-y-4">
                    <Link
                        href="/shop"
                        className="block text-sm font-medium text-white hover:text-primary transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        {t('nav.shop')}
                    </Link>
                    <Link
                        href="/portfolio"
                        className="block text-sm font-medium text-white hover:text-primary transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        {t('nav.portfolio')}
                    </Link>
                    {/* Mobile Language Switcher */}
                    <button
                        onClick={() => {
                            setLanguage(language === 'en' ? 'ar' : 'en');
                            setIsMenuOpen(false);
                        }}
                        className="w-full text-left flex items-center gap-3 text-sm font-medium text-white hover:text-primary transition-colors"
                    >
                        <span className="material-symbols-outlined text-lg">language</span>
                        <span>{language === 'ar' ? 'English' : 'العربية'}</span>
                    </button>
                    {!user && (
                        <Link
                            href="/login"
                            className="block text-sm font-medium text-primary hover:text-primary transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            {t('auth.login')}
                        </Link>
                    )}
                </div>
            )}
        </div>
    );
}
