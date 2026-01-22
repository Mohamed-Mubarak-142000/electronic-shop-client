'use client';

import { useState, Suspense } from 'react';
import { AxiosError } from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import { authService } from '@/services/authService';
import { toast } from 'react-hot-toast';
import { useTranslation } from '@/hooks/useTranslation';

function VerifyOtpContent() {
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get('email');
    const { t, language } = useTranslation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            toast.error('Email missing');
            return;
        }
        setLoading(true);
        try {
            await authService.verifyOTP({ email, otp });
            toast.success(language === 'ar' ? 'تم تفعيل الحساب بنجاح' : 'Account verified successfully');
            router.push('/');
        } catch (error: unknown) {
            toast.error((error as AxiosError<{ message: string }>).response?.data?.message || 'Verification failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-20 p-8 bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800">
            <h1 className="text-2xl font-bold mb-2 text-center">{t('auth.verifyOtp')}</h1>
            <p className="text-slate-500 text-sm text-center mb-8">{t('auth.enterOtp')}</p>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <input
                        type="text"
                        maxLength={6}
                        required
                        className="w-full text-center text-3xl tracking-widest py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-2 border-transparent focus:border-primary-500 outline-none transition-all"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="000000"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading || otp.length < 6}
                    className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-bold transition-all disabled:opacity-50 shadow-lg shadow-primary-500/20"
                >
                    {loading ? '...' : t('auth.verifyOtp')}
                </button>
            </form>
        </div>
    );
}

export default function VerifyOtpPage() {
    return (
        <Suspense fallback={<div className="flex justify-center mt-20">Loading...</div>}>
            <VerifyOtpContent />
        </Suspense>
    );
}
