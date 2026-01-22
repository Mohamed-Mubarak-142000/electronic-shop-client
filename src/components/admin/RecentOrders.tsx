'use client';

import Link from 'next/link';
import { useTranslation } from '@/hooks/useTranslation';
import { useCurrency } from '@/hooks/useCurrency';
import { Order } from '@/types';

export default function RecentOrders({ orders }: { orders?: Order[] }) {
    const { t } = useTranslation();
    const { formatPrice } = useCurrency();

    if (!orders || orders.length === 0) {
        return (
            <div className="xl:col-span-2 bg-card-dark rounded-xl border border-white/5 overflow-hidden flex flex-col p-6 items-center justify-center text-gray-400">
                <p>{t('admin.orders.no_orders')}</p>
            </div>
        );
    }

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'Delivered': return t('admin.status.delivered');
            case 'Cancelled': return t('admin.status.cancelled');
            case 'Shipped': return t('admin.status.shipped');
            case 'Paid': return t('admin.status.paid');
            case 'Pending': return t('admin.status.pending');
            case 'Processing': return t('admin.status.processing');
            default: return status;
        }
    };

    return (
        <div className="xl:col-span-2 bg-card-dark rounded-xl border border-white/5 overflow-hidden flex flex-col">
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
                <h3 className="text-lg font-bold text-white">{t('admin.recent_orders')}</h3>
                <Link href="/admin/orders" className="text-primary text-sm font-semibold hover:underline">{t('admin.view_all')}</Link>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-400">
                    <thead className="bg-background-dark text-xs uppercase font-semibold text-gray-500">
                        <tr>
                            <th className="px-6 py-4">{t('admin.orders.id')}</th>
                            <th className="px-6 py-4">{t('admin.orders.customer')}</th>
                            <th className="px-6 py-4">{t('admin.orders.status')}</th>
                            <th className="px-6 py-4 text-right">{t('admin.orders.total')}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {orders.map((order) => {
                             const status = order.isDelivered ? 'Delivered' : (order.isPaid ? 'Paid' : 'Pending');
                             return (
                            <tr key={order._id} className="hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4 font-mono text-white">#{order._id.slice(-6).toUpperCase()}</td>
                                <td className="px-6 py-4">{order.user?.name || 'Unknown'}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${status === 'Delivered' ? 'bg-blue-400/10 text-blue-400' :
                                        status === 'Paid' ? 'bg-primary/10 text-primary' :
                                                'bg-yellow-400/10 text-yellow-400'
                                        }`}>
                                        <span className={`size-1.5 rounded-full ${status === 'Delivered' ? 'bg-blue-400' :
                                            status === 'Paid' ? 'bg-primary' :
                                                    'bg-yellow-400'
                                            }`}></span>
                                        {getStatusLabel(status)}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right font-medium text-white">{formatPrice(order.totalPrice)}</td>
                            </tr>
                        )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
