import { Spline_Sans } from "next/font/google";
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import DynamicChatWidget from '@/components/chat/DynamicChatWidget';
import UserRoleGuard from '@/components/shared/UserRoleGuard';

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <UserRoleGuard>
            <div className="flex min-h-screen flex-col">
                {/* Performance: Only preconnect to critical image domains used on every page */}
                <link rel="preconnect" href="https://lh3.googleusercontent.com" />
                <link rel="dns-prefetch" href="https://lh3.googleusercontent.com" />
                 
                <Navbar />
                <main className="flex-1">{children}</main>
                <Footer />
                <DynamicChatWidget />
            </div>
        </UserRoleGuard>
    );
}

