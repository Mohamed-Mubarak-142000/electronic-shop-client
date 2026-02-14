import Link from 'next/link';
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { toast } from "react-hot-toast";
import { useCurrency } from "@/hooks/useCurrency";
import { Product } from "@/types";
import OptimizedImage from "@/components/shared/OptimizedImage";
import { Button } from '@/components/ui/button';

export default function ProductCard({ product }: { product: Product }) {
    const user = useAuthStore((state) => state.user);
    const addItem = useCartStore((state) => state.addItem);
    const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();
    const { formatPrice } = useCurrency();

    const isWishlisted = isInWishlist(product._id);

    // Helpers
    const currentPrice = (product.isDiscountActive && product.salePrice)
        ? product.salePrice
        : product.price;

    // Helper to determine image source
    const imageSrc = product.imageUrl ||
        (product.images && product.images.length > 0 ? product.images[0] : null) ||
        "https://placehold.co/400x300?text=No+Image";

    // Brand name fallback
    const brandName = typeof product.brand === 'object' ? product.brand?.name : '';

    const handleAddToCart = () => {
        if (!user) {
            toast.error("Please login to add items to cart");
            return;
        }
        addItem({
            id: product._id,
            name: product.name,
            price: currentPrice,
            quantity: 1,
            imageUrl: imageSrc,
            subtitle: product.description,
            sku: product._id.substring(0, 8).toUpperCase(),
            inStock: true
        });
        toast.success("Added to cart!");
    };

    const handleWishlistToggle = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user) {
            toast.error("Please login to manage your wishlist");
            return;
        }

        if (isWishlisted) {
            removeFromWishlist(product._id);
            toast.success("Removed from wishlist");
        } else {
            addToWishlist({
                id: product._id,
                name: product.name,
                price: currentPrice,
                imageUrl: imageSrc,
                description: product.description
            });
            toast.success("Added to wishlist!");
        }
    };

    return (
        <div className="group relative bg-surface-dark rounded-2xl sm:rounded-[2rem] p-3 sm:p-4 hover:bg-surface-highlight transition-all duration-300 flex flex-col h-full font-display border border-surface-highlight/10 hover:border-primary/20 w-full">
            <div className="relative w-full aspect-[4/3] rounded-xl sm:rounded-[1.5rem] overflow-hidden bg-white/5 mb-3 sm:mb-4 shadow-inner flex items-center justify-center">
                <Link href={`/product/${product._id}`} className="w-full h-full relative block">
                    {/* Performance: Lazy load product images with proper sizes */}
                    <OptimizedImage
                        alt={`${product.name} - ${product.description.slice(0, 50)}`}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                        src={imageSrc}
                        fill
                        loading="lazy"
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, 400px"
                    />
                </Link>
                {product.isDiscountActive && product.salePrice && (
                    <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-red-500 text-white text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full shadow-lg">
                        -{Math.round(((product.price - product.salePrice) / product.price) * 100)}%
                    </div>
                )}
            </div>

            <div className="flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-2 gap-2">
                    <div className="flex flex-wrap text-yellow-400 text-[10px] sm:text-xs gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <span
                                key={star}
                                className={`material-symbols-outlined text-xs sm:text-sm ${(product.rating || 5) >= star ? 'filled' : ''}`}
                                style={{ fontVariationSettings: (product.rating || 5) >= star ? "'FILL' 1" : "" }}
                            >
                                star
                            </span>
                        ))}
                    </div>
                    {brandName && (
                        <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-secondary bg-secondary/10 px-1.5 sm:px-2 py-0.5 rounded-md truncate">
                            {brandName}
                        </span>
                    )}
                </div>

                <Link href={`/product/${product._id}`}>
                    <h3 className="text-white font-bold text-base sm:text-lg leading-tight mb-1 group-hover:text-primary transition-colors cursor-pointer line-clamp-2 h-10 overflow-hidden">
                        {product.name}
                    </h3>
                </Link>
                <p className="text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4 leading-relaxed line-clamp-2 h-10 overflow-hidden">
                    {product.description}
                </p>

                <div className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-white/5 pt-3">
                    <div className="flex flex-col min-h-[2.5rem] sm:min-h-[3.5rem] justify-center">
                        {product.isDiscountActive && product.salePrice ? (
                            <>
                                <span className="text-gray-500 text-[10px] sm:text-xs line-through">{formatPrice(product.price)}</span>
                                <span className="text-primary text-base sm:text-xl font-bold">{formatPrice(product.salePrice)}</span>
                            </>
                        ) : (
                            <span className="text-primary text-base sm:text-xl font-bold">{formatPrice(product.price)}</span>
                        )}
                    </div>
                    <div className="flex gap-1.5 sm:gap-2 shrink-0">
                        <Button
                            variant="outline"
                            size="icon-lg"
                            aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
                            onClick={handleWishlistToggle}
                            className={`rounded-full border transition-all ${isWishlisted ? 'bg-red-500/10 border-red-500 text-red-500 hover:text-red-600 hover:border-red-600' : 'bg-background border-surface-highlight text-white hover:text-red-500 hover:border-red-500 hover:bg-background'}`}
                        >
                            <span className={`material-symbols-outlined text-lg sm:text-xl ${isWishlisted ? 'filled' : ''}`} style={{ fontVariationSettings: isWishlisted ? "'FILL' 1" : "" }} aria-hidden="true">favorite</span>
                        </Button>
                        <Button
                            size="icon-lg"
                            aria-label={`Add ${product.name} to cart`}
                            onClick={handleAddToCart}
                            className="rounded-full shadow-none hover:shadow-[0_0_15px_rgba(54,226,123,0.3)] transition-all"
                        >
                            <span className="material-symbols-outlined text-lg sm:text-xl" aria-hidden="true">add_shopping_cart</span>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
