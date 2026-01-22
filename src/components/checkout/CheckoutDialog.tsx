"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useConfigStore } from "@/store/useConfigStore";
import { toast } from "react-hot-toast";
import { orderService } from "@/services/orderService";
import Dialog from "../ui/dialog";
import { useTranslation } from "@/hooks/useTranslation";
import { useCurrency } from "@/hooks/useCurrency";
import { isAxiosError } from "axios";

import OptimizedImage from '@/components/shared/OptimizedImage';

interface CheckoutDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CheckoutDialog({ isOpen, onClose }: CheckoutDialogProps) {
    const router = useRouter();
    const { cartItems, clearCart } = useCartStore();
    const { user } = useAuthStore();
    const { configs } = useConfigStore();
    const { t, dir } = useTranslation();
    const { symbol: currency } = useCurrency();

    const [isProcessing, setIsProcessing] = useState(false);

    // Form State
    const [shipping, setShipping] = useState({
        address: "",
        city: "",
        zip: "",
        country: "Egypt"
    });

    const [paymentMethod, setPaymentMethod] = useState("card");
    const [paymentDetails, setPaymentDetails] = useState({
        cardNumber: "",
        expiry: "",
        cvc: "",
        transactionId: "",
        referenceNumber: ""
    });

    const shippingCost = Number(configs.taxiAmount) || 0;
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = subtotal * 0.08;
    const total = subtotal + tax + shippingCost;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name in shipping) {
            setShipping(prev => ({ ...prev, [name]: value }));
        } else {
            setPaymentDetails(prev => ({ ...prev, [name]: value }));
        }
    };

    const handlePaymentMethodChange = (value: string) => {
        setPaymentMethod(value);
    };

    const validateForm = () => {
        if (!shipping.address || !shipping.city) {
            toast.error(t('req_shipping'));
            return false;
        }

        if (paymentMethod === "card") {
            if (!paymentDetails.transactionId) {
                toast.error(t('req_tx_id'));
                return false;
            }
        } else if (paymentMethod === "vodafone_cash") {
            if (!paymentDetails.transactionId) {
                toast.error(t('req_tx_id'));
                return false;
            }
        } else if (paymentMethod === "instapay") {
            if (!paymentDetails.referenceNumber) {
                toast.error(t('req_ref_id'));
                return false;
            }
        }
        return true;
    };

    const handlePlaceOrder = async () => {
        if (!validateForm()) return;
        if (!user) {
            toast.error(t('login_req'));
            onClose();
            router.push('/login');
            return;
        }

        setIsProcessing(true);

        try {
            const orderData = {
                items: cartItems.map(item => ({
                    product: item.id,
                    qty: item.quantity,
                    price: item.price
                })),
                shipping: {
                    address: `${shipping.address}, ${shipping.city}, ${shipping.zip}, ${shipping.country}`,
                    cost: shippingCost
                },
                paymentMethod,
                total: total,
                paymentResult: {
                    id: paymentMethod === 'card' ? 'simulated_card_tx' : (paymentDetails.transactionId || paymentDetails.referenceNumber),
                    status: 'completed',
                    update_time: new Date().toISOString(),
                    email_address: user?.email
                }
            };

            await orderService.createOrder(orderData);

            toast.success(t('order_success'));
            clearCart();
            onClose();
            router.push('/profile');

        } catch (error: unknown) {
            console.error("Order Error:", error);
            let message = "Failed to place order";
            
            if (isAxiosError(error)) {
                message = error.response?.data?.message || error.message || message;
            } else if (error instanceof Error) {
                message = error.message;
            }

            toast.error(message);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            title={t('checkout_title')}
            className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white flex flex-col overflow-hidden max-h-[85vh] h-auto"
        >
            <div className="flex flex-col overflow-hidden" dir={dir}>

                {/* Section 1: Top Grid (Shipping & Payment) */}
                <div className="shrink-0 px-5 py-5 pb-2 border-b border-slate-200 dark:border-surface-highlight overflow-y-auto lg:overflow-visible max-h-[35vh] lg:max-h-none">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                        {/* Shipping Address */}
                        <div className="bg-white dark:bg-surface-dark rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-surface-highlight">
                            <h3 className="font-bold mb-4 flex items-center gap-2 text-sm text-slate-500 uppercase tracking-wider">
                                <span className="material-symbols-outlined text-primary text-lg">local_shipping</span>
                                {t('shipping_address')}
                            </h3>
                            <div className="space-y-3">
                                <input
                                    type="text"
                                    name="address"
                                    value={shipping.address}
                                    onChange={handleInputChange}
                                    className="w-full bg-slate-50 dark:bg-background-dark border border-slate-200 dark:border-surface-highlight rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all font-medium"
                                    placeholder={t('address')}
                                />
                                <div className="grid grid-cols-2 gap-3">
                                    <input
                                        type="text"
                                        name="city"
                                        value={shipping.city}
                                        onChange={handleInputChange}
                                        className="w-full bg-slate-50 dark:bg-background-dark border border-slate-200 dark:border-surface-highlight rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all font-medium"
                                        placeholder={t('city')}
                                    />
                                    <input
                                        type="text"
                                        name="zip"
                                        value={shipping.zip}
                                        onChange={handleInputChange}
                                        className="w-full bg-slate-50 dark:bg-background-dark border border-slate-200 dark:border-surface-highlight rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all font-medium"
                                        placeholder={t('zip_code')}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="bg-white dark:bg-surface-dark rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-surface-highlight">
                            <h3 className="font-bold mb-4 flex items-center gap-2 text-sm text-slate-500 uppercase tracking-wider">
                                <span className="material-symbols-outlined text-primary text-lg">payments</span>
                                {t('payment_method')}
                            </h3>
                            <div className="grid grid-cols-3 gap-3">
                                {[
                                    { id: 'card', icon: 'credit_card', label: t('card_transfer') },
                                    { id: 'vodafone_cash', icon: 'account_balance_wallet', label: t('vodafone_cash') },
                                    { id: 'instapay', icon: 'currency_exchange', label: t('instapay') }
                                ].map(method => (
                                    <button
                                        key={method.id}
                                        onClick={() => handlePaymentMethodChange(method.id)}
                                        className={`p-2 rounded-xl border flex flex-col items-center justify-center gap-2 h-[88px] text-center transition-all duration-200 ${paymentMethod === method.id
                                                ? 'border-primary bg-primary/10 text-primary shadow-sm'
                                                : 'border-transparent bg-slate-50 dark:bg-background-dark text-slate-400 hover:bg-slate-100 dark:hover:bg-surface-highlight hover:text-slate-600 dark:hover:text-slate-200'
                                            }`}
                                    >
                                        <span className="material-symbols-outlined text-2xl">{method.icon}</span>
                                        <span className="text-[10px] font-bold leading-tight">{method.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section 2: Order Summary - Scrollable Area */}
                <div className="flex-1 overflow-y-auto px-5 py-4 bg-slate-50/50 dark:bg-black/10 min-h-0">
                    <h3 className="font-bold mb-3 text-xs uppercase tracking-wider text-slate-400 ml-1">{t('order_summary')}</h3>
                    <div className="space-y-3">
                        {cartItems.map(item => (
                            <div key={item.id} className="flex gap-4 p-3 rounded-2xl bg-white dark:bg-surface-dark shadow-sm border border-slate-100 dark:border-surface-highlight/50 items-center hover:border-primary/20 transition-colors">
                                <div className="relative w-12 h-12 rounded-xl bg-gray-50 dark:bg-black/20 shrink-0 overflow-hidden border border-slate-100 dark:border-surface-highlight">
                                    <OptimizedImage 
                                        src={item.imageUrl} 
                                        alt={item.name} 
                                        fill 
                                        className="object-cover" 
                                        sizes="48px"
                                        useSkeleton={false}
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-sm text-slate-900 dark:text-white truncate">{item.name}</p>
                                    <p className="text-xs text-slate-500 font-medium mt-0.5">{item.quantity} x {currency}{item.price.toFixed(2)}</p>
                                </div>
                                <div className="font-bold text-sm tabular-nums">
                                    {currency}{(item.price * item.quantity).toFixed(2)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Section 3 & 4: Transfer Info & Actions - Fixed Bottom */}
                <div className="shrink-0 px-5 py-5 bg-white dark:bg-surface-dark border-t border-slate-200 dark:border-surface-highlight shadow-[0_-10px_40px_rgba(0,0,0,0.05)] dark:shadow-[0_-10px_40px_rgba(0,0,0,0.2)] z-10">
                    <div className="flex flex-col lg:flex-row gap-5 items-start lg:items-center justify-between mb-5">
                        {/* Transfer Info Block */}
                        <div className="flex-1 w-full lg:w-auto p-3.5 rounded-2xl bg-slate-50 dark:bg-background-dark border border-slate-100 dark:border-surface-highlight flex items-center gap-4">
                            <div className="size-10 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
                                <span className="material-symbols-outlined text-xl">
                                    {paymentMethod === 'card' ? 'credit_card' : paymentMethod === 'vodafone_cash' ? 'account_balance_wallet' : 'currency_exchange'}
                                </span>
                            </div>
                            <div>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">
                                    {paymentMethod === 'card' ? "Transfer to Card" : paymentMethod === 'vodafone_cash' ? "Vodafone Cash Wallet" : "InstaPay Address"}
                                </p>
                                <p className="font-mono font-bold text-slate-900 dark:text-white text-sm select-all dir-ltr tracking-wide">
                                    {paymentMethod === 'card' && (configs.creditCardNumber || '4745 0101 3539 3008')}
                                    {paymentMethod === 'vodafone_cash' && (configs.vodafoneCashNumber || '010 5086 7135')}
                                    {paymentMethod === 'instapay' && (configs.instapayNumber || '010 5086 7135')}
                                </p>
                            </div>
                        </div>

                        {/* Input Field for Reference */}
                        <div className="flex-1 w-full lg:w-auto">
                            <input
                                type="text"
                                name={paymentMethod === 'instapay' ? 'referenceNumber' : 'transactionId'}
                                value={paymentMethod === 'instapay' ? paymentDetails.referenceNumber : paymentDetails.transactionId}
                                onChange={handleInputChange}
                                className="w-full bg-slate-50 dark:bg-background-dark border border-slate-200 dark:border-surface-highlight rounded-2xl px-5 py-3.5 text-sm font-medium focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all font-mono placeholder:text-slate-400"
                                placeholder={paymentMethod === 'instapay' ? t('enter_reference_id') : t('enter_transaction_id')}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between border-t border-dashed border-slate-200 dark:border-surface-highlight pt-5">
                        <div className="flex flex-col">
                            <span className="text-slate-400 font-medium text-xs uppercase tracking-wider">{t('total')}</span>
                            <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight -mt-1">{currency}{total.toFixed(2)}</span>
                        </div>

                        <button
                            onClick={handlePlaceOrder}
                            disabled={isProcessing}
                            className="w-full md:w-auto px-10 bg-primary hover:bg-[#2dc468] text-[#112117] font-black text-lg py-4 rounded-full shadow-xl shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isProcessing ? (
                                <span className="loading loading-spinner loading-md bg-[#112117]"></span>
                            ) : (
                                <>
                                    <span>{t('confirm_order')}</span>
                                    <span className="material-symbols-outlined font-bold text-2xl">arrow_forward</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>

            </div>
        </Dialog>
    );
}
