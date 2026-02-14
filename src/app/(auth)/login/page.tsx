'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation } from '@tanstack/react-query';
import { authService } from '@/services/authService';
import { useRouter } from 'next/navigation';
import AuthLayout from '@/components/auth/AuthLayout';
import SocialLogin from '@/components/auth/SocialLogin';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useTranslation } from '@/hooks/useTranslation';

// Existing schema
const formSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

export default function LoginPage() {
    const router = useRouter();
    const { t, language } = useTranslation();
    const [error, setError] = useState('');

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const mutation = useMutation({
        mutationFn: async (values: z.infer<typeof formSchema>) => {
            return await authService.login(values);
        },
        onSuccess: (data) => {
            if (data.role === 'admin') router.push('/admin');
            else router.push('/');
        },
        onError: (err: Error & { response?: { data?: { message?: string } } }) => {
            setError(err.response?.data?.message || err.message || 'Login failed');
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        mutation.mutate(values);
    }

    return (
        <AuthLayout type="login" heading={t('auth.welcome')} subheading={t('auth.loginSubtitle')}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
                    {/* Email Field */}
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-white">{t('auth.email')}</FormLabel>
                                <FormControl>
                                    <div className="relative group">
                                        <div className={`absolute inset-y-0 ${language === 'ar' ? 'right-0 pr-4' : 'left-0 pl-4'} flex items-center pointer-events-none z-10`}>
                                            <span className="material-symbols-outlined text-gray-400 group-focus-within:text-primary transition-colors">mail</span>
                                        </div>
                                        <Input
                                            {...field}
                                            className={`w-full rounded-full bg-surface-dark border border-border-dark text-white placeholder:text-[#95c6a9] h-14 ${language === 'ar' ? 'pr-12 pl-4' : 'pl-12 pr-4'} focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 shadow-sm`}
                                            placeholder={t('auth.register.emailPlaceholder')}
                                            type="email"
                                        />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Password Field */}
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex justify-between items-center ml-1">
                                    <FormLabel className="text-white">{t('auth.register.password')}</FormLabel>
                                    <Link href="/forgot-password" className="text-xs font-medium text-primary hover:text-primary/80 transition-colors">{t('auth.forgotPassword')}</Link>
                                </div>
                                <FormControl>
                                    <div className="relative group">
                                        <div className={`absolute inset-y-0 ${language === 'ar' ? 'right-0 pr-4' : 'left-0 pl-4'} flex items-center pointer-events-none z-10`}>
                                            <span className="material-symbols-outlined text-gray-400 group-focus-within:text-primary transition-colors">lock</span>
                                        </div>
                                        <PasswordInput
                                            {...field}
                                            className={`w-full rounded-full bg-surface-dark border border-border-dark text-white placeholder:text-[#95c6a9] h-14 ${language === 'ar' ? 'pr-12 pl-4' : 'pl-12 pr-4'} focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 shadow-sm`}
                                            placeholder={t('auth.register.passwordPlaceholder')}
                                        />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Remember Me */}
                    <div className="flex items-center gap-3 ml-1 mt-1">
                        <div className="relative flex items-center">
                            <input className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-border-dark bg-surface-dark checked:bg-primary checked:border-primary focus:ring-primary/20 transition-all" id="remember" type="checkbox" />
                            <span className="absolute text-background-dark opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                                <span className="material-symbols-outlined" style={{ fontSize: "16px", fontWeight: "bold" }}>check</span>
                            </span>
                        </div>
                        <label className="text-sm text-gray-400 cursor-pointer select-none" htmlFor="remember">{t('auth.rememberMe')}</label>
                    </div>

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <Button
                        type="submit"
                        disabled={mutation.isPending}
                        className="mt-4 flex w-full h-14 text-base tracking-wide active:scale-[0.98] transition-all duration-200"
                    >
                        {mutation.isPending ? t('auth.signingIn') : t('auth.signIn')}
                    </Button>

                    <SocialLogin />

                    <div className="flex justify-center mt-6">
                        <p className="text-gray-400 text-sm">{t('auth.noAccount')} <Link href="/register" className="text-primary font-semibold hover:underline">{t('auth.registerNow')}</Link></p>
                    </div>
                </form>
            </Form>
        </AuthLayout>
    );
}
