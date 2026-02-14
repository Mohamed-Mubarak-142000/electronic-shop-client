import Link from 'next/link';
import { useLanguageStore } from '@/store/useLanguageStore';

interface AuthHeaderProps {
    type: 'login' | 'register';
}

export default function AuthHeader({ type }: AuthHeaderProps) {
    const { language, setLanguage } = useLanguageStore();
    return (
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-surface-highlight px-6 lg:px-10 py-4 absolute top-0 w-full z-10 bg-background-dark/80 backdrop-blur-md">
            <Link href="/" className="flex items-center gap-3">
                <div className="size-8 text-primary">
                    <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
                </div>
                <h2 className="text-white text-xl font-bold tracking-tight">ElectroShop</h2>
            </Link>
            <div className="hidden md:flex flex-1 justify-end gap-8">
                <div className="flex items-center gap-6 text-sm font-medium text-gray-300">
                    <Link href="/shop" className="hover:text-primary transition-colors">Products</Link>
                    <Link href="/brand" className="hover:text-primary transition-colors">Brands</Link>
                    <Link href="/support" className="hover:text-primary transition-colors">Support</Link>
                    <button
                        onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
                        className="flex items-center gap-1 hover:text-primary transition-colors"
                        aria-label="Switch Language"
                    >
                        <span className="material-symbols-outlined text-xl">language</span>
                        <span>{language === 'ar' ? 'English' : 'العربية'}</span>
                    </button>
                </div>
                <Link href={type === 'login' ? '/register' : '/login'}>
                    <button className="flex cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-6 bg-primary text-background-dark text-sm font-bold leading-normal hover:bg-primary/90 transition-all shadow-[0_0_15px_rgba(54,226,123,0.3)]">
                        <span className="truncate">{type === 'login' ? 'Sign Up' : 'Log In'}</span>
                    </button>
                </Link>
            </div>
            {/* Mobile Menu Icon Placeholder */}
            <button className="md:hidden text-white">
                <span className="material-symbols-outlined">menu</span>
            </button>
        </header>
    );
}
