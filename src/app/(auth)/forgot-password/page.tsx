'use client';

import { useState, useEffect } from 'react';
import { AxiosError } from 'axios';
import { authService } from '@/services/authService';
import { toast } from 'react-hot-toast';
import { useTranslation } from '@/hooks/useTranslation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

type Step = 'email' | 'otp' | 'reset';

export default function ForgotPasswordPage() {
    const [step, setStep] = useState<Step>('email');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [timer, setTimer] = useState(0);
    const { t, language } = useTranslation();

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await authService.forgotPassword(email);
            setStep('otp');
            setTimer(600); // 10 minutes
            toast.success(t('auth.otpSent'));
        } catch (error: unknown) {
            toast.error((error as AxiosError<{ message: string }>).response?.data?.message || 'Error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleOtpSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await authService.verifyResetOTP({ email, otp });
            setStep('reset');
            toast.success(language === 'ar' ? 'تم التحقق من الرمز بنجاح' : 'OTP verified successfully');
        } catch (error: unknown) {
            toast.error((error as AxiosError<{ message: string }>).response?.data?.message || 'Invalid OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleResetSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error(t('auth.register.passwordsDoNotMatch'));
            return;
        }
        setLoading(true);
        try {
            await authService.resetPassword({ email, password });
            toast.success(t('auth.passwordResetSuccess'));
            setStep('email'); // Reset to start or redirect
            window.location.href = '/login';
        } catch (error: unknown) {
            toast.error((error as AxiosError<{ message: string }>).response?.data?.message || 'Failed to reset password');
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        if (timer > 540) return; // Prevent resending too quickly (wait 1 min)
        setLoading(true);
        try {
            await authService.forgotPassword(email);
            setTimer(600);
            toast.success(t('auth.otpSent'));
        } catch (error: unknown) {
            toast.error((error as AxiosError<{ message: string }>).response?.data?.message || 'Error occurred');
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return (
        <div className="max-w-md mx-auto mt-20 p-8 bg-surface-dark rounded-3xl shadow-xl border border-border-dark">
            <h1 className="text-2xl font-bold mb-2 text-center text-white">
                {step === 'email' && t('auth.forgotPassword')}
                {step === 'otp' && t('auth.verifyOtp')}
                {step === 'reset' && t('auth.resetPassword')}
            </h1>

            {step === 'email' && (
                <form onSubmit={handleEmailSubmit} className="space-y-6 mt-8">
                    <p className="text-gray-400 text-sm text-center mb-4">
                        {language === 'ar' ? 'أدخل بريدك الإلكتروني لتلقي رمز التحقق' : 'Enter your email to receive a verification code'}
                    </p>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-white">{t('auth.email')}</label>
                        <input
                            type="email"
                            required
                            className="w-full px-4 py-3 bg-background-dark rounded-xl border border-border-dark focus:border-primary outline-none transition-all text-white placeholder:text-gray-500"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your@email.com"
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 text-lg font-bold h-auto shadow-lg shadow-primary/20"
                    >
                        {loading ? '...' : (language === 'ar' ? 'إرسال الرمز' : 'Send Code')}
                    </Button>

                    <div className="text-center">
                        <Link href="/login" className="text-sm text-primary-600 hover:underline">
                            {t('auth.backToLogin')}
                        </Link>
                    </div>
                </form>
            )}

            {step === 'otp' && (
                <form onSubmit={handleOtpSubmit} className="space-y-6 mt-8">
                    <p className="text-gray-400 text-sm text-center">
                        {t('auth.enterOtp')}
                    </p>
                    <p className="text-primary font-bold text-center text-xl">
                        {formatTime(timer)}
                    </p>
                    <div>
                        <input
                            type="text"
                            maxLength={6}
                            required
                            className="w-full text-center text-3xl tracking-widest py-4 bg-background-dark rounded-2xl border-2 border-border-dark focus:border-primary outline-none transition-all text-white"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            placeholder="000000"
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={loading || otp.length < 6}
                        className="w-full py-4 text-lg font-bold h-auto shadow-lg shadow-primary/20"
                    >
                        {loading ? '...' : t('auth.verifyOtp')}
                    </Button>

                    <div className="text-center space-y-4">
                        <button
                            type="button"
                            onClick={handleResendOtp}
                            disabled={loading || timer > 540}
                            className="text-sm text-primary hover:underline disabled:text-gray-500"
                        >
                            {t('auth.resendOtp')}
                        </button>
                        <button
                            type="button"
                            onClick={() => setStep('email')}
                            className="block w-full text-sm text-gray-400 hover:underline"
                        >
                            {language === 'ar' ? 'تغيير البريد الإلكتروني' : 'Change Email'}
                        </button>
                    </div>
                </form>
            )}

            {step === 'reset' && (
                <form onSubmit={handleResetSubmit} className="space-y-6 mt-8">
                    <p className="text-gray-400 text-sm text-center">
                        {t('auth.enterNewPassword')}
                    </p>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1 text-white">{t('auth.newPassword')}</label>
                            <input
                                type="password"
                                required
                                minLength={6}
                                className="w-full px-4 py-3 bg-background-dark rounded-xl border border-border-dark focus:border-primary outline-none transition-all text-white"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-white">{t('auth.confirmNewPassword')}</label>
                            <input
                                type="password"
                                required
                                minLength={6}
                                className="w-full px-4 py-3 bg-background-dark rounded-xl border border-border-dark focus:border-primary outline-none transition-all text-white"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 text-lg font-bold h-auto shadow-lg shadow-primary/20"
                    >
                        {loading ? '...' : t('auth.resetPassword')}
                    </Button>
                </form>
            )}
        </div>
    );
}
