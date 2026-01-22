'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { toast } from 'react-hot-toast';

/**
 * UserRoleGuard - Protects public user routes from admin access
 * If an admin tries to access user pages, they will be logged out and redirected
 */
export default function UserRoleGuard({ children }: { children: React.ReactNode }) {
    const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);
    const router = useRouter();

    useEffect(() => {
        // If user is logged in and has admin role, log them out
        if (user && user.role === 'admin') {
            // Clear all storage
            logout();
            
            // Clear localStorage completely
            if (typeof window !== 'undefined') {
                localStorage.clear();
                sessionStorage.clear();
            }

            // Show notification
            toast.error('Admin users cannot access customer pages. Please login with a customer account.');
            
            // Redirect to login page
            router.push('/login');
        }
    }, [user, logout, router]);

    // Don't render content if user is admin (prevents flash of content)
    if (user && user.role === 'admin') {
        return null;
    }

    return <>{children}</>;
}
