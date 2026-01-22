"use client";

import { useEffect } from 'react';
import { useSocket } from '@/hooks/useSocket';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';

interface NotificationPayload {
    body: string;
    [key: string]: unknown;
}

export default function SocketListener() {
    const socket = useSocket();
    const router = useRouter();
    const { user } = useAuthStore();

    useEffect(() => {
        if (!socket) return;

        socket.on('connect', () => {
            if (user) {
                // Join user specific room
                socket.emit('join_room', user._id);
            }
        });

        socket.on('new_notification', (notification: NotificationPayload) => {
            // Only show notification if user is NOT admin
            if (user?.role !== 'admin') {
                toast(notification.body, {
                    icon: '🔔',
                    duration: 5000,
                });
                // Play notification sound
                const audio = new Audio('/notification.mp3');
                audio.play().catch(err => console.log('Audio play failed:', err));
            }
        });

        socket.on('new_product', (product: { name: string, nameAr?: string }) => {
            // Only show to users, NOT admins
            if (user?.role !== 'admin') {
                const productName = product.name;
                toast.success(`New product available: ${productName}`, {
                    icon: '🆕',
                    duration: 6000,
                });
                // Play notification sound
                const audio = new Audio('/notification.mp3');
                audio.play().catch(err => console.log('Audio play failed:', err));
            }
        });

        socket.on('order_status_updated', () => {
             // This might be redundant if covered by 'new_notification'
             // But if specific UI update needed:
             // invalidate queries?
        });

        return () => {
            socket.off('connect');
            socket.off('new_notification');
            socket.off('new_product');
            socket.off('order_status_updated');
        };
    }, [socket, user, router]);

    return null;
}
