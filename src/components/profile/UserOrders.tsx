'use client';

import { useQuery } from '@tanstack/react-query';
import { orderService } from '@/services/orderService';
import { useCurrency } from '@/hooks/useCurrency';
import { useTranslation } from '@/hooks/useTranslation';
import Image from 'next/image';
import Link from 'next/link';

export function UserOrders() {
    const { formatPrice } = useCurrency();
    const { language } = useTranslation();

    const { data: orders, isLoading, error } = useQuery({
        queryKey: ['myOrders'],
        queryFn: () => orderService.getMyOrders(),
    });

    if (isLoading) {
        return (
            <div className="bg-white dark:bg-surface-dark p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-border-dark">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">shopping_bag</span>
                    {language === 'ar' ? 'طلباتي' : 'My Orders'}
                </h2>
                <div className="flex items-center justify-center py-12">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white dark:bg-surface-dark p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-border-dark">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">shopping_bag</span>
                    {language === 'ar' ? 'طلباتي' : 'My Orders'}
                </h2>
                <p className="text-red-500 text-center py-8">
                    {language === 'ar' ? 'فشل في تحميل الطلبات' : 'Failed to load orders'}
                </p>
            </div>
        );
    }

    const statusColors = {
        Pending: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/20', dot: 'bg-yellow-400' },
        Processing: { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/20', dot: 'bg-purple-400' },
        Shipped: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/20', dot: 'bg-blue-400' },
        Delivered: { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/20', dot: 'bg-green-400' },
        Cancelled: { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/20', dot: 'bg-red-400' },
    };

    return (
        <div className="bg-white dark:bg-surface-dark p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-border-dark">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">shopping_bag</span>
                {language === 'ar' ? 'طلباتي' : 'My Orders'}
            </h2>

            {!orders || orders.length === 0 ? (
                <div className="text-center py-12">
                    <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-600 mb-4 block">receipt_long</span>
                    <p className="text-slate-500 dark:text-slate-400">
                        {language === 'ar' ? 'لا توجد طلبات بعد' : 'No orders yet'}
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => {
                        const status = order.status || (order.isDelivered ? 'Delivered' : (order.isPaid ? 'Processing' : 'Pending'));
                        const statusStyle = statusColors[status as keyof typeof statusColors] || statusColors.Pending;

                        return (
                            <Link
                                key={order._id}
                                href={`/orders/${order._id}`}
                                className="block bg-slate-50 dark:bg-background-dark p-4 rounded-xl border border-slate-200 dark:border-border-dark hover:border-primary dark:hover:border-primary transition-all"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">
                                            {language === 'ar' ? 'رقم الطلب' : 'Order'} #{order._id.substring(0, 8)}
                                        </p>
                                        <p className="text-xs text-slate-400 mt-1">
                                            {new Date(order.createdAt).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`}></span>
                                        {status}
                                    </span>
                                </div>

                                {/* Order Items Preview */}
                                <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
                                    {order.orderItems?.slice(0, 4).map((item, idx) => (
                                        <div key={idx} className="flex-shrink-0">
                                            <Image
                                                src={item.image || '/placeholder.png'}
                                                alt={item.name}
                                                width={60}
                                                height={60}
                                                className="rounded-lg object-cover bg-white"
                                            />
                                        </div>
                                    ))}
                                    {order.orderItems && order.orderItems.length > 4 && (
                                        <div className="flex-shrink-0 w-[60px] h-[60px] bg-slate-200 dark:bg-slate-700 rounded-lg flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300">
                                            +{order.orderItems.length - 4}
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-border-dark">
                                    <span className="text-sm text-slate-600 dark:text-slate-400">
                                        {language === 'ar' ? 'المجموع' : 'Total'}
                                    </span>
                                    <span className="text-lg font-bold text-primary font-mono">
                                        {formatPrice(order.totalPrice || order.total || 0)}
                                    </span>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
