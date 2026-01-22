'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { orderService } from '@/services/orderService';
import { useCurrency } from '@/hooks/useCurrency';
import { useTranslation } from '@/hooks/useTranslation';
import Image from 'next/image';

export default function UserOrderDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const { formatPrice } = useCurrency();
    const { language } = useTranslation();
    const orderId = params.id as string;

    const { data: order, isLoading, error } = useQuery({
        queryKey: ['order', orderId],
        queryFn: () => orderService.getOrderById(orderId),
        enabled: !!orderId,
    });

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
                <div className="text-center">
                    <span className="material-symbols-outlined text-red-500 text-6xl mb-4 block">error</span>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                        {language === 'ar' ? 'الطلب غير موجود' : 'Order not found'}
                    </h3>
                    <button 
                        onClick={() => router.push('/profile')}
                        className="text-primary hover:underline"
                    >
                        {language === 'ar' ? 'العودة إلى الطلبات' : 'Back to orders'}
                    </button>
                </div>
            </div>
        );
    }

    const shippingAddr = order.shippingAddress?.address || order.shipping?.address || '';
    const addressParts = shippingAddr.split(',').map(s => s.trim());
    const [street, city, postalCode, country] = addressParts.length >= 4 
        ? addressParts 
        : [shippingAddr, '', '', ''];

    const currentStatus = order.status || (order.isDelivered ? 'Delivered' : (order.isPaid ? 'Processing' : 'Pending'));

    const statusColors = {
        Pending: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/20' },
        Processing: { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/20' },
        Shipped: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/20' },
        Delivered: { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/20' },
        Cancelled: { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/20' },
    };

    const statusStyle = statusColors[currentStatus as keyof typeof statusColors] || statusColors.Pending;

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark">
            <div className="max-w-[1200px] mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <button 
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-primary mb-4"
                    >
                        <span className="material-symbols-outlined">arrow_back</span>
                        {language === 'ar' ? 'العودة' : 'Back'}
                    </button>
                    
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-3xl font-black text-slate-900 dark:text-white">
                                    {language === 'ar' ? 'طلب' : 'Order'} #{order._id.substring(0, 8)}
                                </h1>
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}>
                                    {currentStatus}
                                </span>
                            </div>
                            <p className="text-slate-500 dark:text-slate-400 text-sm">
                                {new Date(order.createdAt).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })} • {language === 'ar' ? 'طريقة الدفع' : 'Payment'}: {order.paymentMethod}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Order Items */}
                        <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-border-dark">
                            <h3 className="text-slate-900 dark:text-white font-bold text-lg mb-4">
                                {language === 'ar' ? 'المنتجات' : 'Items'} ({order.orderItems?.length || 0})
                            </h3>
                            <div className="space-y-4">
                                {order.orderItems?.map((item, index) => (
                                    <div key={index} className="flex gap-4 p-4 rounded-xl bg-slate-50 dark:bg-background-dark border border-slate-100 dark:border-border-dark">
                                        <Image 
                                            src={item.image || '/placeholder.png'} 
                                            alt={item.name} 
                                            width={80} 
                                            height={80}
                                            className="rounded-lg object-cover bg-white" 
                                        />
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-2">
                                                <p className="text-slate-900 dark:text-white font-bold">{item.name}</p>
                                                <p className="text-slate-900 dark:text-white font-mono font-bold">{formatPrice(item.price)}</p>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-slate-500 dark:text-slate-400">
                                                    {language === 'ar' ? 'الكمية' : 'Qty'}: <span className="text-slate-900 dark:text-white font-semibold">{item.qty}</span>
                                                </span>
                                                <p className="text-primary font-bold font-mono">{formatPrice(item.price * item.qty)}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Shipping Address */}
                        <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-border-dark">
                            <h4 className="text-slate-500 dark:text-slate-400 text-xs uppercase font-bold tracking-wider mb-4">
                                {language === 'ar' ? 'عنوان الشحن' : 'Shipping Address'}
                            </h4>
                            <div className="flex gap-3">
                                <span className="material-symbols-outlined text-primary mt-0.5">location_on</span>
                                <div>
                                    {street && <p className="text-slate-900 dark:text-white text-sm mb-1">{street}</p>}
                                    {(city || postalCode) && (
                                        <p className="text-slate-900 dark:text-white text-sm mb-1">
                                            {city}{city && postalCode && ', '}{postalCode}
                                        </p>
                                    )}
                                    {country && <p className="text-slate-500 text-xs">{country}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Payment Summary */}
                        <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-border-dark">
                            <h4 className="text-slate-500 dark:text-slate-400 text-xs uppercase font-bold tracking-wider mb-4">
                                {language === 'ar' ? 'ملخص الدفع' : 'Payment Summary'}
                            </h4>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                                    <span>{language === 'ar' ? 'المجموع الفرعي' : 'Subtotal'}</span>
                                    <span className="text-slate-900 dark:text-white font-mono font-semibold">{formatPrice(order.itemsPrice || 0)}</span>
                                </div>
                                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                                    <span>{language === 'ar' ? 'الشحن' : 'Shipping'}</span>
                                    <span className="text-slate-900 dark:text-white font-mono font-semibold">{formatPrice(order.shippingPrice || order.shipping?.cost || 0)}</span>
                                </div>
                                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                                    <span>{language === 'ar' ? 'الضريبة' : 'Tax'}</span>
                                    <span className="text-slate-900 dark:text-white font-mono font-semibold">{formatPrice(order.taxPrice || 0)}</span>
                                </div>
                                <div className="flex justify-between pt-3 border-t border-slate-200 dark:border-border-dark mt-3">
                                    <span className="text-slate-900 dark:text-white font-bold text-base">
                                        {language === 'ar' ? 'الإجمالي' : 'Total'}
                                    </span>
                                    <span className="text-2xl text-primary font-bold font-mono">{formatPrice(order.totalPrice || order.total || 0)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
