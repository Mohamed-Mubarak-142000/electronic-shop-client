'use client';

import { useState } from 'react';
import { AxiosError } from 'axios';
import { authService } from '@/services/authService';
import { toast } from 'react-hot-toast';
import { useTranslation } from '@/hooks/useTranslation';
import Link from 'next/link';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const { t, language } = useTranslation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await authService.forgotPassword(email);
            setSent(true);
            toast.success(language === 'ar' ? 'تم إرسال رابط إعادة التعيين' : 'Reset link sent to your email');
        } catch (error: unknown) {
            toast.error((error as AxiosError<{ message: string }>).response?.data?.message || 'Error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-20 p-8 bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800">
            <h1 className="text-2xl font-bold mb-2 text-center">{t('auth.forgotPassword')}</h1>

            {!sent ? (
                <form onSubmit={handleSubmit} className="space-y-6 mt-8">
                    <div>
                        <label className="block text-sm font-medium mb-1">{t('auth.email')}</label>
                        <input
                            type="email"
                            required
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-transparent focus:border-primary-500 outline-none transition-all"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your@email.com"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-bold transition-all disabled:opacity-50 shadow-lg shadow-primary-500/20"
                    >
                        {loading ? '...' : (language === 'ar' ? 'إرسال رابط التعيين' : 'Send Reset Link')}
                    </button>

                    <div className="text-center">
                        <Link href="/login" className="text-sm text-primary-600 hover:underline">
                            {language === 'ar' ? 'العودة لتسجيل الدخول' : 'Back to Login'}
                        </Link>
                    </div>
                </form>
            ) : (
                <div className="mt-8 text-center space-y-4">
                    <div className="size-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                        <span className="material-symbols-outlined text-4xl">check_circle</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400">
                        {language === 'ar' ? 'تم إرسال تعليمات إعادة تعيين كلمة المرور إلى بريدك الإلكتروني.' : 'Instructions to reset your password have been sent to your email.'}
                    </p>
                    <Link href="/login" className="block w-full py-4 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl font-bold">
                        {language === 'ar' ? 'العودة لتسجيل الدخول' : 'Back to Login'}
                    </Link>
                </div>
            )}
        </div>
    );
}
