"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { toast } from "react-hot-toast";
import ProductCard from "@/components/shared/ProductCard";
import { useCurrency } from "@/hooks/useCurrency";
import { Product } from "@/types";
import OptimizedImage from "@/components/shared/OptimizedImage";

export default function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { formatPrice } = useCurrency();
    const [product, setProduct] = useState<Product | null>(null);
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState("Description");

    const user = useAuthStore((state) => state.user);
    const { addItem } = useCartStore();
    const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();

    const isWishlisted = product ? isInWishlist(product._id) : false;

    useEffect(() => {
        const fetchProduct = async () => {
            if (!id) return;
            try {
                setLoading(true);
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://electronic-shop-server-one.vercel.app/api';
                const response = await fetch(`${apiUrl}/products/${id}`);
                if (!response.ok) {
                    throw new Error("Product not found");
                }
                const data = await response.json();
                setProduct(data);

                // Fetch related products if category exists
                if (data.category) {
                    const relatedResponse = await fetch(`${apiUrl}/products?category=${data.category._id}&limit=4`);
                    if (relatedResponse.ok) {
                        const relatedData = await relatedResponse.json();
                        setRelatedProducts(relatedData.products.filter((p: Product) => p._id !== data._id));
                    }
                }
            } catch (err: unknown) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProduct();
        }
    }, [id]);

    const handleDecreaseQuantity = () => {
        if (quantity > 1) setQuantity(quantity - 1);
    };

    const handleIncreaseQuantity = () => {
        if (product && quantity < product.stock) {
            setQuantity(quantity + 1);
        }
    };

    const handleAddToCart = () => {
        if (!user) {
            toast.error("Please login to add items to cart");
            return;
        }
        if (product) {
            addItem({
                id: product._id,
                name: product.name,
                price: (product.isDiscountActive && product.salePrice) ? product.salePrice : product.price,
                quantity: quantity,
                imageUrl: product.images[0] || "",
                inStock: product.stock > 0
            });
            toast.success("Added to cart!");
        }
    };

    const handleWishlistToggle = () => {
        if (!user) {
            toast.error("Please login to manage your wishlist");
            return;
        }
        if (product) {
            if (isWishlisted) {
                removeFromWishlist(product._id);
                toast.success("Removed from wishlist");
            } else {
                addToWishlist({
                    id: product._id,
                    name: product.name,
                    price: product.price,
                    imageUrl: product.images[0] || "",
                    description: product.description
                });
                toast.success("Added to wishlist!");
            }
        }
    };

    if (loading) {
        return (
            <div className="w-full min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="w-full min-h-screen flex flex-col items-center justify-center bg-background-light dark:bg-background-dark p-4">
                <h1 className="text-2xl font-bold text-red-500 mb-4">{error || "Product not found"}</h1>
                <Link href="/shop" className="text-primary hover:underline">Back to Shop</Link>
            </div>
        );
    }

    return (
        <div className="w-full bg-background-light dark:bg-background-dark min-h-screen font-display flex flex-col items-center">
            <div className="flex-grow w-full max-w-[1440px] px-4 sm:px-6 lg:px-8 py-8">
                {/* Breadcrumbs */}
                <div className="flex flex-wrap items-center gap-2 mb-8 text-sm text-slate-500 dark:text-[#95c6a9]">
                    <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                    <span className="material-symbols-outlined text-base">chevron_right</span>
                    <Link href="/shop" className="hover:text-primary transition-colors">Shop</Link>
                    {product.category && typeof product.category === 'object' && (
                        <>
                            <span className="material-symbols-outlined text-base">chevron_right</span>
                            <Link href={`/shop?category=${product.category._id}`} className="hover:text-primary transition-colors">
                                {product.category.name}
                            </Link>
                        </>
                    )}
                    <span className="material-symbols-outlined text-base">chevron_right</span>
                    <span className="text-slate-900 dark:text-white font-medium">{product.name}</span>
                </div>

                {/* Product Main Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20 mb-16">
                    {/* Left: Image Gallery */}
                    <div className="flex flex-col gap-4">
                        <div className="relative w-full aspect-square rounded-[2rem] overflow-hidden bg-slate-100 dark:bg-surface-dark group border border-slate-200 dark:border-transparent">
                            {product.images.length > 0 ? (
                                <OptimizedImage
                                    alt={product.name}
                                    className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                                    src={product.images[activeImageIndex]}
                                    fill
                                    priority
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-400">No image available</div>
                            )}
                            {/* Image Nav Buttons (Overlay) */}
                            {product.images.length > 1 && (
                                <>
                                    <button
                                        onClick={() => setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : product.images.length - 1))}
                                        className="absolute top-1/2 left-4 -translate-y-1/2 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100"
                                    >
                                        <span className="material-symbols-outlined">chevron_left</span>
                                    </button>
                                    <button
                                        onClick={() => setActiveImageIndex((prev) => (prev < product.images.length - 1 ? prev + 1 : 0))}
                                        className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100"
                                    >
                                        <span className="material-symbols-outlined">chevron_right</span>
                                    </button>
                                </>
                            )}
                        </div>
                        {/* Thumbnail Carousel */}
                        {product.images.length > 1 && (
                            <div className="flex gap-4 overflow-x-auto hide-scrollbar py-2">
                                {product.images.map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setActiveImageIndex(index)}
                                        className={`flex-shrink-0 w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all ${activeImageIndex === index ? 'border-primary ring-2 ring-primary/20' : 'border-transparent hover:border-slate-300 dark:hover:border-slate-600 opacity-70 hover:opacity-100'}`}
                                    >
                                        <OptimizedImage
                                            alt={`Thumbnail ${index}`}
                                            className="object-cover"
                                            src={img}
                                            width={96}
                                            height={96}
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right: Product Info */}
                    <div className="flex flex-col h-full">
                        <div className="mb-2 flex items-center gap-2">
                            <div className="flex text-primary">
                                {[...Array(5)].map((_, i) => (
                                    <span key={i} className={`material-symbols-outlined text-[18px] ${i < 4 ? 'fill-current' : ''}`} style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                ))}
                            </div>
                            <span className="text-sm text-slate-500 dark:text-slate-400 font-medium hover:text-primary cursor-pointer transition-colors">(12 Reviews)</span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl lg:text-[40px] font-bold text-slate-900 dark:text-white leading-[1.1] tracking-tight mb-4">
                            {product.name}
                            {product.brand && typeof product.brand === 'object' && (
                                <span className="block text-2xl lg:text-3xl font-normal text-slate-500 dark:text-slate-400 mt-1">by {product.brand.name}</span>
                            )}
                        </h1>
                        <div className="flex items-end gap-4 mb-6">
                            {product.isDiscountActive && product.salePrice ? (
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-3">
                                        <span className="text-4xl font-bold text-red-500">{formatPrice(product.salePrice)}</span>
                                        <span className="text-xl text-slate-400 decoration-1 line-through">{formatPrice(product.price)}</span>
                                    </div>
                                    <div className="mt-2 flex items-center gap-2">
                                        <span className="bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 px-3 py-1 rounded-full text-sm font-bold animate-pulse">
                                            {Math.round(((product.price - product.salePrice) / product.price) * 100)}% OFF
                                        </span>
                                        <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">Limited Time Offer</span>
                                    </div>
                                </div>
                            ) : (
                                <span className="text-4xl font-bold text-primary">{formatPrice(product.price)}</span>
                            )}
                        </div>
                        <div className="p-4 rounded-xl bg-slate-50 dark:bg-surface-dark border border-slate-100 dark:border-transparent mb-8">
                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                                {product.description}
                            </p>
                        </div>

                        {/* Specs Grid (Simplified for dynamic content) */}
                        {product.attributes && Object.keys(product.attributes).length > 0 && (
                            <div className="grid grid-cols-2 gap-4 mb-8">
                                {Object.entries(product.attributes).slice(0, 4).map(([key, value]) => (
                                    <div key={key} className="flex items-center gap-3">
                                        <div className="size-10 rounded-full bg-slate-100 dark:bg-surface-highlight flex items-center justify-center text-slate-700 dark:text-primary">
                                            <span className="material-symbols-outlined">info</span>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 dark:text-[#95c6a9]">{key}</p>
                                            <p className="text-sm font-semibold text-slate-900 dark:text-white">{value}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Product Meta Info */}
                        <div className="flex flex-col gap-4 py-8 mt-4 border-t border-slate-200 dark:border-surface-highlight">
                            <div className="flex items-center gap-3 text-sm">
                                <span className="text-slate-500 dark:text-[#95c6a9] font-semibold min-w-[100px]">Category:</span>
                                <Link 
                                    href={`/shop?category=${typeof product.category === 'object' ? product.category._id : product.category}`} 
                                    className="text-slate-900 dark:text-white hover:text-primary transition-colors font-medium"
                                >
                                    {typeof product.category === 'object' ? product.category.name : 'N/A'}
                                </Link>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <span className="text-slate-500 dark:text-[#95c6a9] font-semibold min-w-[100px]">Brand:</span>
                                <span className="text-slate-900 dark:text-white font-medium">
                                    {typeof product.brand === 'object' ? product.brand.name : 'N/A'}
                                </span>
                            </div>
                            {product.tags && product.tags.length > 0 && (
                                <div className="flex items-center gap-3 text-sm">
                                    <span className="text-slate-500 dark:text-[#95c6a9] font-semibold min-w-[100px]">Tags:</span>
                                    <div className="flex flex-wrap gap-2">
                                        {product.tags.map(tag => (
                                            <span key={tag} className="px-3 py-1 rounded-full bg-slate-100 dark:bg-surface-highlight text-[11px] uppercase tracking-wider font-bold text-slate-600 dark:text-primary border border-slate-200 dark:border-transparent">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                        </div>

                        <div className="h-px w-full bg-slate-200 dark:bg-surface-highlight mb-8"></div>

                        {/* Actions */}
                        <div className="flex flex-col gap-6">
                            <div className="flex flex-wrap items-center justify-between gap-4">
                                <div className={`flex items-center gap-2 font-medium text-sm ${product.stock > 0 ? 'text-primary' : 'text-red-500'}`}>
                                    <span className="relative flex h-3 w-3">
                                        {product.stock > 0 && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>}
                                        <span className={`relative inline-flex rounded-full h-3 w-3 ${product.stock > 0 ? 'bg-primary' : 'bg-red-500'}`}></span>
                                    </span>
                                    {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
                                </div>
                                {product.stock > 0 && (
                                    <div className="flex items-center rounded-full bg-slate-100 dark:bg-surface-highlight p-1">
                                        <button
                                            onClick={handleDecreaseQuantity}
                                            className="size-10 rounded-full bg-white dark:bg-background-dark text-slate-600 dark:text-white hover:bg-slate-50 dark:hover:bg-surface-dark shadow-sm flex items-center justify-center transition-all"
                                        >
                                            <span className="material-symbols-outlined text-sm">remove</span>
                                        </button>
                                        <input
                                            className="w-12 bg-transparent text-center border-none p-0 text-slate-900 dark:text-white font-bold focus:ring-0"
                                            type="text"
                                            value={quantity}
                                            readOnly
                                        />
                                        <button
                                            onClick={handleIncreaseQuantity}
                                            className="size-10 rounded-full bg-white dark:bg-background-dark text-slate-600 dark:text-white hover:bg-slate-50 dark:hover:bg-surface-dark shadow-sm flex items-center justify-center transition-all"
                                        >
                                            <span className="material-symbols-outlined text-sm">add</span>
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={handleAddToCart}
                                    disabled={product.stock === 0}
                                    className={`flex-1 font-bold text-lg h-14 rounded-full flex items-center justify-center gap-2 transition-all ${product.stock > 0 ? 'bg-primary hover:bg-[#2ec56a] text-surface-dark shadow-[0_0_20px_rgba(54,226,123,0.3)] hover:shadow-[0_0_30px_rgba(54,226,123,0.5)]' : 'bg-slate-300 text-slate-500 cursor-not-allowed'}`}
                                >
                                    <span className="material-symbols-outlined">shopping_cart</span>
                                    Add to Cart
                                </button>
                                <button
                                    onClick={handleWishlistToggle}
                                    className={`size-14 rounded-full border flex items-center justify-center transition-all ${isWishlisted ? 'bg-red-500/10 border-red-500 text-red-500' : 'border-slate-300 dark:border-[#366348] text-slate-600 dark:text-[#95c6a9] hover:border-red-500 hover:text-red-500'}`}
                                >
                                    <span className={`material-symbols-outlined ${isWishlisted ? 'filled' : ''}`} style={{ fontVariationSettings: isWishlisted ? "'FILL' 1" : "" }}>favorite</span>
                                </button>
                            </div>


                        </div>
                    </div>
                </div>

                {/* Detailed Info Tabs */}
                <div className="w-full mb-16">
                    <div className="border-b border-slate-200 dark:border-surface-highlight mb-8 overflow-x-auto hide-scrollbar">
                        <div className="flex gap-8 min-w-max">
                            {["Description", "Specifications"].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`pb-4 border-b-2 font-medium text-lg px-2 transition-colors ${activeTab === tab ? 'border-primary text-primary font-bold' : 'border-transparent text-slate-500 dark:text-[#95c6a9] hover:text-slate-800 dark:hover:text-white'}`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>

                    {activeTab === "Description" && (
                        <div className="animate-in fade-in duration-300">
                            <div className="text-slate-600 dark:text-slate-300 space-y-6">
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">About this product</h3>
                                <p className="leading-relaxed">
                                    {product.description}
                                </p>
                            </div>
                        </div>
                    )}

                    {activeTab === "Specifications" && (
                        <div className="animate-in fade-in duration-300">
                            <div className="bg-slate-50 dark:bg-surface-dark rounded-2xl p-6 border border-slate-100 dark:border-surface-highlight">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Technical Specs</h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between pb-4 border-b border-slate-200 dark:border-surface-highlight">
                                        <span className="text-slate-500 dark:text-[#95c6a9]">Brand</span>
                                        <span className="font-medium text-slate-900 dark:text-white">
                                            {typeof product.brand === 'object' ? product.brand.name : 'N/A'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between pb-4 border-b border-slate-200 dark:border-surface-highlight">
                                        <span className="text-slate-500 dark:text-[#95c6a9]">Category</span>
                                        <span className="font-medium text-slate-900 dark:text-white">
                                            {typeof product.category === 'object' ? product.category.name : 'N/A'}
                                        </span>
                                    </div>
                                    {product.attributes && Object.entries(product.attributes).map(([key, value]) => (
                                        <div key={key} className="flex justify-between pb-4 border-b border-slate-200 dark:border-surface-highlight">
                                            <span className="text-slate-500 dark:text-[#95c6a9]">{key}</span>
                                            <span className="font-medium text-slate-900 dark:text-white">{value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div className="mb-16">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">Related Products</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
                            {relatedProducts.map((item: Product) => (
                                <ProductCard key={item._id} product={item} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
