"use client";

import Link from "next/link";
import { useWishlistStore, WishlistItem } from "@/store/useWishlistStore";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "react-hot-toast";
import Image from "next/image";

export default function WishlistPage() {
    const { wishlistItems, removeItem } = useWishlistStore();
    const { addItem } = useCartStore();
    const { user } = useAuthStore();

    const handleAddToCart = (item: WishlistItem) => {
        if (!user) {
            toast.error("Please login to add items to cart");
            return;
        }
        addItem({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: 1,
            imageUrl: item.imageUrl,
            inStock: true
        });
        toast.success("Added to cart!");
    };

    return (
        <div className="w-full min-h-[calc(100vh-200px)] bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display flex flex-col items-center">
            <div className="w-full max-w-[1440px] px-4 md:px-10 py-12">
                <div className="flex items-center gap-4 mb-10">
                    <h1 className="text-4xl font-bold tracking-tight">My Wishlist</h1>
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-bold">
                        {wishlistItems.length} {wishlistItems.length === 1 ? 'Item' : 'Items'}
                    </span>
                </div>

                {wishlistItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 bg-surface-dark/30 rounded-[3rem] border border-surface-highlight/10">
                        <div className="size-24 rounded-full bg-surface-highlight/20 flex items-center justify-center mb-6">
                            <span className="material-symbols-outlined text-5xl text-gray-500">favorite</span>
                        </div>
                        <h2 className="text-2xl font-bold mb-2">Your wishlist is empty</h2>
                        <p className="text-gray-400 mb-8">Save items you like to see them here.</p>
                        <Link href="/shop">
                            <button className="h-12 px-8 rounded-full bg-primary text-[#122118] font-bold hover:scale-105 transition-all">
                                Continue Shopping
                            </button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {wishlistItems.map((item) => (
                            <div key={item.id} className="group relative bg-surface-dark rounded-[2rem] p-4 hover:bg-surface-highlight transition-all duration-300 border border-surface-highlight/10">
                                <button
                                    onClick={() => removeItem(item.id)}
                                    className="absolute top-6 right-6 z-10 size-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-red-500 transition-colors"
                                >
                                    <span className="material-symbols-outlined text-xl">close</span>
                                </button>

                                <Link href={`/product/${item.id}`}>
                                    <div className="relative aspect-square rounded-[1.5rem] overflow-hidden bg-white mb-4">
                                        <Image
                                            alt={item.name}
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            src={item.imageUrl}
                                            fill
                                            sizes="(max-width: 768px) 90vw, (max-width: 1024px) 45vw, (max-width: 1280px) 30vw, 22vw"
                                        />
                                    </div>
                                    <h3 className="font-bold text-lg mb-1 truncate group-hover:text-primary transition-colors">
                                        {item.name}
                                    </h3>
                                </Link>

                                <div className="flex items-center justify-between mt-4">
                                    <span className="text-primary text-xl font-bold">${item.price.toFixed(2)}</span>
                                    <button
                                        onClick={() => handleAddToCart(item)}
                                        className="h-10 px-4 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-[#122118] font-bold text-sm transition-all flex items-center gap-2"
                                    >
                                        <span className="material-symbols-outlined text-lg">add_shopping_cart</span>
                                        Add
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
