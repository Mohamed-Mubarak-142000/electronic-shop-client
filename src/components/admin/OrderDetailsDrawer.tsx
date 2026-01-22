'use client';

import { useTranslation } from '@/hooks/useTranslation';
import { useCurrency } from '@/hooks/useCurrency';
import { Order } from '@/types';
import Image from 'next/image';

interface OrderDetailsDrawerProps {
    order?: Order | null;
    onClose: () => void;
}

export default function OrderDetailsDrawer({ order, onClose }: OrderDetailsDrawerProps) {
    const { t } = useTranslation();
    const { formatPrice } = useCurrency();
    
    if (!order) return null;

    // Safely parse shipping address
    const shippingAddr = order.shippingAddress?.address || order.shipping?.address || '';
    const addressParts = shippingAddr.split(',').map(s => s.trim());
    const [street, city, postalCode, country] = addressParts.length >= 4 
        ? addressParts 
        : [shippingAddr, '', '', ''];

    return (
        <div className="flex flex-col absolute inset-y-0 right-0 w-full md:w-[450px] lg:w-[35%] bg-surface-dark border-l border-white/5 shadow-[-10px_0_30px_rgba(0,0,0,0.5)] z-30">
            {/* Header */}
            <div className="flex flex-col p-6 border-b border-white/5 bg-[#15261d]">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                        <h3 className="text-2xl font-bold text-white">#{order._id.substring(0, 8)}</h3>
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${order.isPaid ? 'bg-blue-500/20 text-blue-400 border-blue-500/20' : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/20'} border`}>
                            {order.isDelivered ? t('admin.status.delivered') : (order.isPaid ? t('admin.status.paid') : t('admin.status.pending'))}
                        </span>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
                {/* Status Actions */}
                <div className="flex gap-2">
                    <select className="bg-surface-dark border border-white/10 text-white text-sm rounded-lg px-3 py-2 focus:ring-primary focus:border-primary w-full" defaultValue={order.isDelivered ? 'delivered' : (order.isPaid ? 'paid' : 'pending')}>
                        <option value="pending">{t('admin.status.pending')}</option>
                        <option value="paid">{t('admin.status.paid')}</option>
                        <option value="delivered">{t('admin.status.delivered')}</option>
                    </select>
                    <button className="bg-primary text-black font-bold px-4 py-2 rounded-lg text-sm whitespace-nowrap">
                        {t('admin.orders.update_status')}
                    </button>
                </div>
            </div>
            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Customer Info */}
                <div className="bg-[#112117] rounded-xl p-4 border border-white/10">
                    <h4 className="text-gray-400 text-xs uppercase font-bold tracking-wider mb-3">{t('admin.orders.details.customer_details')}</h4>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-full bg-indigo-900/50 border border-indigo-700 text-indigo-300 flex items-center justify-center text-lg font-bold uppercase">
                            {order.user?.name?.substring(0, 2) || 'NA'}
                        </div>
                        <div>
                            <p className="text-white font-bold">{order.user?.name}</p>
                            <p className="text-primary text-sm">{order.user?.email}</p>
                        </div>
                    </div>
                </div>
                {/* Products */}
                <div>
                    <h4 className="text-gray-400 text-xs uppercase font-bold tracking-wider mb-3">{t('admin.orders.details.items')} ({order.orderItems?.length || 0})</h4>
                    <div className="space-y-3">
                        {order.orderItems?.map((item, index) => (
                            <div key={index} className="flex gap-4 p-3 rounded-xl bg-[#112117] border border-white/10 hover:border-gray-600 transition-colors">
                                <Image className="rounded-lg object-cover bg-white/5" src={item.image || '/placeholder.png'} alt={item.name} width={64} height={64} />
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <p className="text-white text-sm font-bold line-clamp-2">{item.name}</p>
                                        <p className="text-white font-mono text-sm font-bold">{formatPrice(item.price)}</p>
                                    </div>
                                    <div className="flex justify-between items-center mt-2">
                                        <span className="text-xs text-gray-400">{t('quantity')}: {item.qty}</span>
                                        <p className="text-primary text-sm font-bold">{formatPrice(item.price * item.qty)}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                {/* Shipping Address */}
                <div className="bg-[#112117] rounded-xl p-4 border border-white/10">
                    <h4 className="text-gray-400 text-xs uppercase font-bold tracking-wider mb-3">{t('admin.orders.details.shipping_address')}</h4>
                    <div className="flex gap-3">
                        <span className="material-symbols-outlined text-gray-500 mt-0.5">location_on</span>
                        <div>
                            {street && <p className="text-white text-sm">{street}</p>}
                            {(city || postalCode) && (
                                <p className="text-white text-sm">
                                    {city}{city && postalCode && ', '}{postalCode}
                                </p>
                            )}
                            {country && <p className="text-gray-500 text-xs mt-1">{country}</p>}
                        </div>
                    </div>
                </div>
                {/* Payment Summary */}
                <div className="bg-[#112117] rounded-xl p-4 border border-white/10">
                    <h4 className="text-gray-400 text-xs uppercase font-bold tracking-wider mb-3">{t('admin.orders.details.payment_summary')}</h4>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between text-gray-400">
                            <span>{t('admin.orders.summary.subtotal')}</span>
                            <span className="text-white font-mono">{formatPrice(order.itemsPrice || 0)}</span>
                        </div>
                        <div className="flex justify-between text-gray-400">
                            <span>{t('admin.orders.summary.shipping')}</span>
                            <span className="text-white font-mono">{formatPrice(order.shippingPrice || order.shipping?.cost || 0)}</span>
                        </div>
                        <div className="flex justify-between text-gray-400">
                            <span>{t('admin.orders.summary.tax')}</span>
                            <span className="text-white font-mono">{formatPrice(order.taxPrice || 0)}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-white/10 mt-2 items-end">
                            <span className="text-white font-bold">{t('admin.orders.summary.total')}</span>
                            <span className="text-2xl text-primary font-bold font-mono">{formatPrice(order.totalPrice || order.total || 0)}</span>
                        </div>
                    </div>
                </div>
                <div className="h-10"></div>
            </div>
            {/* Sticky Footer Actions */}
            <div className="p-4 border-t border-white/5 bg-[#15261d] flex gap-3">
                <button className="flex-1 py-3 rounded-full bg-surface-dark border border-white/10 text-white font-bold hover:bg-white/5 transition-colors flex justify-center items-center gap-2">
                    <span className="material-symbols-outlined text-sm">print</span>
                    {t('admin.orders.invoice')}
                </button>
            </div>
        </div>
    );
}
