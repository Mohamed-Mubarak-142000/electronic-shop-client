'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService } from '@/services/orderService';
import { useTranslation } from '@/hooks/useTranslation';
import { useCurrency } from '@/hooks/useCurrency';
import { generateInvoicePDF } from '@/lib/invoiceGenerator';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

export default function OrderDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const { t, language } = useTranslation();
    const { formatPrice } = useCurrency();
    const orderId = params.id as string;
    const queryClient = useQueryClient();
    const [selectedStatus, setSelectedStatus] = useState('');

    const { data: order, isLoading, error } = useQuery({
        queryKey: ['order', orderId],
        queryFn: () => orderService.getOrderById(orderId),
        enabled: !!orderId,
    });

    const updateStatusMutation = useMutation({
        mutationFn: (status: string) => orderService.updateOrderStatus(orderId, status),
        onSuccess: () => {
            // Invalidate both the specific order and all orders queries
            queryClient.invalidateQueries({ queryKey: ['order', orderId] });
            queryClient.invalidateQueries({ 
                queryKey: ['orders'],
                refetchType: 'all' // This ensures both active and inactive queries are refetched
            });
            toast.success('Order status updated successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to update order status');
        },
    });

    const handleStatusUpdate = () => {
        if (!selectedStatus) {
            toast.error('Please select a status');
            return;
        }
        updateStatusMutation.mutate(selectedStatus);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="flex flex-col items-center justify-center h-full">
                <span className="material-symbols-outlined text-red-500 text-6xl mb-4">error</span>
                <h3 className="text-xl font-bold text-white mb-2">{t('admin.orders.order_not_found')}</h3>
                <Link href="/admin/orders" className="text-primary hover:underline">
                    {t('admin.orders.back_to_orders')}
                </Link>
            </div>
        );
    }

    // Safely parse shipping address
    const shippingAddr = order.shippingAddress?.address || order.shipping?.address || '';
    const addressParts = shippingAddr.split(',').map(s => s.trim());
    const [street, city, postalCode, country] = addressParts.length >= 4 
        ? addressParts 
        : [shippingAddr, '', '', ''];

    // Get current status
    const currentStatus = order.status || (order.isDelivered ? 'Delivered' : (order.isPaid ? 'Processing' : 'Pending'));

    return (
        <div className="h-full flex flex-col overflow-hidden bg-background-dark">
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-white/5 bg-surface-dark">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => router.back()}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <span className="material-symbols-outlined text-2xl">arrow_back</span>
                    </button>
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h1 className="text-2xl md:text-3xl font-black text-white">
                                {t('admin.orders.order')} #{order._id.substring(0, 8)}
                            </h1>
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                                currentStatus === 'Delivered' ? 'bg-green-500/20 text-green-400 border-green-500/20' :
                                currentStatus === 'Shipped' ? 'bg-blue-500/20 text-blue-400 border-blue-500/20' :
                                currentStatus === 'Processing' ? 'bg-purple-500/20 text-purple-400 border-purple-500/20' :
                                currentStatus === 'Cancelled' ? 'bg-red-500/20 text-red-400 border-red-500/20' :
                                'bg-yellow-500/20 text-yellow-400 border-yellow-500/20'
                            }`}>
                                {currentStatus}
                            </span>
                        </div>
                        <p className="text-gray-400 text-sm">
                            {new Date(order.createdAt).toLocaleDateString()} • {t('admin.orders.payment_method')}: {order.paymentMethod}
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => {
                        const invoiceData = {
                            invoiceNumber: order._id.substring(0, 8),
                            date: new Date(order.createdAt).toLocaleDateString(),
                            clientName: order.user?.name || 'Customer',
                            companyName: 'Electro Shop',
                            companyEmail: 'info@electroshop.com',
                            currency: '$',
                            items: order.orderItems?.map(item => ({
                                description: item.name,
                                quantity: item.qty,
                                price: item.price
                            })) || [],
                            notes: `Payment Method: ${order.paymentMethod} | Status: ${currentStatus}`
                        };
                        generateInvoicePDF(invoiceData, language as 'ar' | 'en', 'download');
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-black font-bold rounded-lg hover:bg-green-400 transition-colors"
                >
                    <span className="material-symbols-outlined text-xl">download</span>
                    {t('admin.orders.download_invoice') || 'Download Invoice'}
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto py-8">
                <div className=" mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content - Left Side */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Status Update */}
                        <div className="bg-surface-dark rounded-2xl p-6 border border-white/5">
                            <h3 className="text-white font-bold text-lg mb-4">{t('admin.orders.update_status')}</h3>
                            <div className="flex gap-3">
                                <select 
                                    className="flex-1 bg-background-dark border border-white/10 text-white text-sm rounded-lg px-4 py-3 focus:ring-primary focus:border-primary" 
                                    value={selectedStatus || currentStatus}
                                    onChange={(e) => setSelectedStatus(e.target.value)}
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="Processing">Processing</option>
                                    <option value="Shipped">Shipped</option>
                                    <option value="Delivered">Delivered</option>
                                    <option value="Cancelled">Cancelled</option>
                                </select>
                                <button 
                                    className="bg-primary text-black font-bold px-6 py-3 rounded-lg text-sm whitespace-nowrap hover:bg-green-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    onClick={handleStatusUpdate}
                                    disabled={updateStatusMutation.isPending || !selectedStatus || selectedStatus === currentStatus}
                                >
                                    {updateStatusMutation.isPending ? 'Updating...' : t('admin.orders.update_status')}
                                </button>
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="bg-surface-dark rounded-2xl p-6 border border-white/5">
                            <h3 className="text-white font-bold text-lg mb-4">
                                {t('admin.orders.details.items')} ({order.orderItems?.length || 0})
                            </h3>
                            <div className="space-y-4">
                                {order.orderItems?.map((item, index) => (
                                    <div key={index} className="flex gap-4 p-4 rounded-xl bg-background-dark border border-white/10 hover:border-gray-600 transition-colors">
                                        <Image 
                                            className="rounded-lg object-cover bg-white/5" 
                                            src={item.image || '/placeholder.png'} 
                                            alt={item.name} 
                                            width={80} 
                                            height={80} 
                                        />
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-2">
                                                <p className="text-white font-bold">{item.name}</p>
                                                <p className="text-white font-mono font-bold">{formatPrice(item.price)}</p>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-gray-400">
                                                    {t('quantity')}: <span className="text-white font-semibold">{item.qty}</span>
                                                </span>
                                                <p className="text-primary font-bold font-mono">{formatPrice(item.price * item.qty)}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar - Right Side */}
                    <div className="space-y-6">
                        {/* Customer Info */}
                        <div className="bg-surface-dark rounded-2xl p-6 border border-white/5">
                            <h4 className="text-gray-400 text-xs uppercase font-bold tracking-wider mb-4">
                                {t('admin.orders.details.customer_details')}
                            </h4>
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-full bg-indigo-900/50 border border-indigo-700 text-indigo-300 flex items-center justify-center text-xl font-bold uppercase">
                                    {order.user?.name?.substring(0, 2) || 'NA'}
                                </div>
                                <div>
                                    <p className="text-white font-bold text-lg">{order.user?.name}</p>
                                    <p className="text-primary text-sm">{order.user?.email}</p>
                                </div>
                            </div>
                        </div>

                        {/* Shipping Address */}
                        <div className="bg-surface-dark rounded-2xl p-6 border border-white/5">
                            <h4 className="text-gray-400 text-xs uppercase font-bold tracking-wider mb-4">
                                {t('admin.orders.details.shipping_address')}
                            </h4>
                            <div className="flex gap-3">
                                <span className="material-symbols-outlined text-primary mt-0.5">location_on</span>
                                <div>
                                    {street && <p className="text-white text-sm mb-1">{street}</p>}
                                    {(city || postalCode) && (
                                        <p className="text-white text-sm mb-1">
                                            {city}{city && postalCode && ', '}{postalCode}
                                        </p>
                                    )}
                                    {country && <p className="text-gray-500 text-xs">{country}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Payment Summary */}
                        <div className="bg-surface-dark rounded-2xl p-6 border border-white/5">
                            <h4 className="text-gray-400 text-xs uppercase font-bold tracking-wider mb-4">
                                {t('admin.orders.details.payment_summary')}
                            </h4>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between text-gray-400">
                                    <span>{t('admin.orders.summary.subtotal')}</span>
                                    <span className="text-white font-mono font-semibold">{formatPrice(order.itemsPrice || 0)}</span>
                                </div>
                                <div className="flex justify-between text-gray-400">
                                    <span>{t('admin.orders.summary.shipping')}</span>
                                    <span className="text-white font-mono font-semibold">{formatPrice(order.shippingPrice || order.shipping?.cost || 0)}</span>
                                </div>
                                <div className="flex justify-between text-gray-400">
                                    <span>{t('admin.orders.summary.tax')}</span>
                                    <span className="text-white font-mono font-semibold">{formatPrice(order.taxPrice || 0)}</span>
                                </div>
                                <div className="flex justify-between pt-3 border-t border-white/10 mt-3">
                                    <span className="text-white font-bold text-base">{t('admin.orders.summary.total')}</span>
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
