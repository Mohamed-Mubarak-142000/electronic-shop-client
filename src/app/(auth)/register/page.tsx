'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { authService } from '@/services/authService';
import { useState } from 'react';
import toast from 'react-hot-toast';
import AuthLayout from '@/components/auth/AuthLayout';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useTranslation } from '@/hooks/useTranslation';

// We need to define schema based on translation if we want error messages translated, 
// but typically Zod messages are hardcoded or passed via map. 
// For now, I'll keep English validation messages or simple ones.
const formSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

type FormData = z.infer<typeof formSchema>;

export default function RegisterPage() {
    const router = useRouter();
    const { t, language } = useTranslation();
    const [serverError, setServerError] = useState('');

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
    });

    const mutation = useMutation({
        mutationFn: async (values: FormData) => {
            // Adapt values to backend expected format if needed
            // Backend might expect account_type or simple registration
            return await authService.register({
                name: values.name,
                email: values.email,
                password: values.password,
                // Defaulting to homeowner as we removed the switch
                account_type: 'homeowner'
            });
        },
        onSuccess: () => {
            toast.success('Registration successful! Please log in.');
            router.push('/login');
        },
        onError: (err: Error & { response?: { data?: { message?: string } } }) => {
            setServerError(err.response?.data?.message || err.message || 'Registration failed');
        },
    });

    const onSubmit = (values: FormData) => {
        setServerError('');
        mutation.mutate(values);
    };

    return (
        <AuthLayout
            type="register"
            heading={t('auth.register.title')}
            subheading={t('auth.register.subtitle')}
            visualHeading={t('auth.register.visualHeading')}
            visualDescription={t('auth.register.visualDescription')}
            showVisualOnMobile={true}
        >
            {serverError && (
                <div className="mb-4 p-3 bg-red-900/30 border border-red-900 text-red-400 rounded">
                    {serverError}
                </div>
            )}

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">

                    {/* Name Input */}
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-white">{t('auth.name')}</FormLabel>
                                <FormControl>
                                    <div className="relative flex items-center">
                                        <Input
                                            {...field}
                                            className="w-full bg-surface-dark border border-border-dark text-white text-base rounded-full h-14 pl-5 pr-12 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-gray-500"
                                            placeholder={t('auth.register.namePlaceholder')}
                                        />
                                        <div className={`absolute ${language === 'ar' ? 'left-5' : 'right-5'} text-text-secondary flex items-center pointer-events-none`}>
                                            <span className="material-symbols-outlined">person</span>
                                        </div>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Email Input */}
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-white">{t('auth.email')}</FormLabel>
                                <FormControl>
                                    <div className="relative flex items-center">
                                        <Input
                                            {...field}
                                            className="w-full bg-surface-dark border border-border-dark text-white text-base rounded-full h-14 pl-5 pr-12 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-gray-500"
                                            placeholder={t('auth.register.emailPlaceholder')}
                                            type="email"
                                        />
                                        <div className={`absolute ${language === 'ar' ? 'left-5' : 'right-5'} text-text-secondary flex items-center pointer-events-none`}>
                                            <span className="material-symbols-outlined">mail</span>
                                        </div>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Password Input */}
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-white">{t('auth.register.password')}</FormLabel>
                                <FormControl>
                                    <PasswordInput
                                        {...field}
                                        className="w-full bg-surface-dark border border-border-dark text-white text-base rounded-full h-14 pl-5 pr-12 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-gray-500"
                                        placeholder={t('auth.register.passwordPlaceholder')}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Confirm Password Input */}
                    <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-white">{t('auth.register.confirmPassword')}</FormLabel>
                                <FormControl>
                                    <PasswordInput
                                        {...field}
                                        className="w-full bg-surface-dark border border-border-dark text-white text-base rounded-full h-14 pl-5 pr-12 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-gray-500"
                                        placeholder={t('auth.register.confirmPasswordPlaceholder')}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button
                        type="submit"
                        disabled={mutation.isPending}
                        className="mt-2 w-full h-14 text-base transition-all"
                    >
                        {mutation.isPending ? t('auth.register.submitting') : t('auth.register.submit')}
                    </Button>
                </form>
            </Form>

            <p className="mt-8 text-center text-sm text-gray-400">
                {t('auth.register.haveAccount')}{' '}
                <Link href="/login" className="font-bold text-white hover:text-primary transition-colors">
                    {t('auth.register.login')}
                </Link>
            </p>
        </AuthLayout>
    );
}
