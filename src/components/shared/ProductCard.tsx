import Link from 'next/link';
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { toast } from "react-hot-toast";
import { useCurrency } from "@/hooks/useCurrency";
import { Product } from "@/types";
import OptimizedImage from "@/components/shared/OptimizedImage";

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
        <div className="group relative bg-surface-dark rounded-[2rem] p-4 hover:bg-surface-highlight transition-all duration-300 flex flex-col h-full font-display border border-surface-highlight/10 hover:border-primary/20">
            <div className="relative aspect-[4/3] rounded-[1.5rem] overflow-hidden bg-white mb-4 shadow-inner">
                <Link href={`/product/${product._id}`}>
                    {/* Performance: Lazy load product images with proper sizes */}
                    <OptimizedImage
                        alt={`${product.name} - ${product.description.slice(0, 50)}`}
                        className="object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                        src={imageSrc}
                        fill
                        loading="lazy"
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                </Link>
                {product.isDiscountActive && product.salePrice && (
                    <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                        -{Math.round(((product.price - product.salePrice) / product.price) * 100)}%
                    </div>
                )}
            </div>

            <div className="flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex text-yellow-400 text-xs">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <span
                                key={star}
                                className={`material-symbols-outlined text-sm ${(product.rating || 5) >= star ? 'filled' : ''}`}
                                style={{ fontVariationSettings: (product.rating || 5) >= star ? "'FILL' 1" : "" }}
                            >
                                star
                            </span>
                        ))}
                        <span className="text-gray-400 ml-1">({product.numReviews || 0})</span>
                    </div>
                    {brandName && (
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#95c6a9] bg-[#95c6a9]/10 px-2 py-0.5 rounded-md">
                            {brandName}
                        </span>
                    )}
                </div>

                <Link href={`/product/${product._id}`}>
                    <h3 className="text-white font-bold text-lg leading-tight mb-1 group-hover:text-primary transition-colors cursor-pointer line-clamp-1">
                        {product.name}
                    </h3>
                </Link>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2 min-h-[40px]">
                    {product.description}
                </p>

                <div className="mt-auto flex items-center justify-between">
                    <div className="flex flex-col min-h-[3.5rem] justify-center">
                        {product.isDiscountActive && product.salePrice ? (
                            <>
                                <span className="text-gray-500 text-sm line-through">{formatPrice(product.price)}</span>
                                <span className="text-primary text-xl font-bold">{formatPrice(product.salePrice)}</span>
                            </>
                        ) : (
                            <span className="text-primary text-xl font-bold">{formatPrice(product.price)}</span>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <button
                            aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
                            onClick={handleWishlistToggle}
                            className={`size-10 rounded-full border flex items-center justify-center transition-all ${isWishlisted ? 'bg-red-500/10 border-red-500 text-red-500' : 'bg-[#122118] border-surface-highlight text-white hover:border-red-500 hover:text-red-500'}`}
                        >
                            <span className={`material-symbols-outlined ${isWishlisted ? 'filled' : ''}`} style={{ fontVariationSettings: isWishlisted ? "'FILL' 1" : "" }} aria-hidden="true">favorite</span>
                        </button>
                        <button
                            aria-label={`Add ${product.name} to cart`}
                            onClick={handleAddToCart}
                            className="size-10 rounded-full bg-[#122118] border border-surface-highlight text-white flex items-center justify-center hover:bg-primary hover:text-[#122118] hover:border-primary transition-all shadow-[0_0_15px_rgba(54,226,123,0)_hover:shadow-[0_0_15px_rgba(54,226,123,0.3)]"
                        >
                            <span className="material-symbols-outlined" aria-hidden="true">add_shopping_cart</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
