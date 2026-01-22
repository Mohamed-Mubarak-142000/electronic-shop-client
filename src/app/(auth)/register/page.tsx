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
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const formSchema = z.object({
    account_type: z.enum(['homeowner', 'business']),
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

type FormData = z.infer<typeof formSchema>;

export default function RegisterPage() {
    const router = useRouter();
    const [serverError, setServerError] = useState('');

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            account_type: 'homeowner',
            name: '',
            email: '',
            password: '',
        },
    });

    const mutation = useMutation({
        mutationFn: async (values: FormData) => {
            return await authService.register(values);
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
            heading="Join the Circuit" 
            subheading="Create an account to start your project today."
            visualHeading="Power up your workflow."
            visualDescription="Access wholesale pricing, manage project lists, and get same-day shipping on over 10,000 electrical components."
            showVisualOnMobile={true}
        >
            {serverError && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded dark:bg-red-900/30 dark:border-red-900 dark:text-red-400">
                    {serverError}
                </div>
            )}

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
                    {/* Segmented Control */}
                    <FormField
                        control={form.control}
                        name="account_type"
                        render={({ field }) => (
                            <FormItem className="space-y-0">
                                <div className="p-1 bg-gray-200 dark:bg-surface-dark rounded-full flex relative">
                                    <label className="flex-1 text-center cursor-pointer relative z-10">
                                        <input 
                                            type="radio" 
                                            className="peer sr-only" 
                                            {...field}
                                            value="homeowner"
                                            checked={field.value === 'homeowner'}
                                        />
                                        <div className="w-full py-2.5 rounded-full text-sm font-medium text-gray-500 dark:text-gray-400 peer-checked:bg-white dark:peer-checked:bg-surface-highlight peer-checked:text-black dark:peer-checked:text-primary peer-checked:shadow-sm transition-all">
                                            Homeowner
                                        </div>
                                    </label>
                                    <label className="flex-1 text-center cursor-pointer relative z-10">
                                        <input 
                                             type="radio" 
                                             className="peer sr-only" 
                                             {...field}
                                             value="business"
                                             checked={field.value === 'business'}
                                        />
                                        <div className="w-full py-2.5 rounded-full text-sm font-medium text-gray-500 dark:text-gray-400 peer-checked:bg-white dark:peer-checked:bg-surface-highlight peer-checked:text-black dark:peer-checked:text-primary peer-checked:shadow-sm transition-all">
                                            Electrician / Business
                                        </div>
                                    </label>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Name Input */}
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Full Name</FormLabel>
                                <FormControl>
                                    <div className="relative flex items-center">
                                        <Input 
                                            {...field}
                                            className="w-full bg-white dark:bg-surface-dark border border-gray-300 dark:border-border-dark text-gray-900 dark:text-white text-base rounded-full h-14 pl-5 pr-12 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500" 
                                            placeholder="e.g. Thomas Edison" 
                                        />
                                        <div className="absolute right-5 text-gray-400 dark:text-[#95c6a9] flex items-center pointer-events-none">
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
                                <FormLabel>Email Address</FormLabel>
                                <FormControl>
                                    <div className="relative flex items-center">
                                        <Input 
                                            {...field}
                                            className="w-full bg-white dark:bg-surface-dark border border-gray-300 dark:border-border-dark text-gray-900 dark:text-white text-base rounded-full h-14 pl-5 pr-12 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500" 
                                            placeholder="name@example.com" 
                                            type="email" 
                                        />
                                        <div className="absolute right-5 text-gray-400 dark:text-[#95c6a9] flex items-center pointer-events-none">
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
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <div className="relative flex items-center">
                                        <Input 
                                            {...field}
                                            className="w-full bg-white dark:bg-surface-dark border border-gray-300 dark:border-border-dark text-gray-900 dark:text-white text-base rounded-full h-14 pl-5 pr-12 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500" 
                                            placeholder="Create a strong password" 
                                            type="password" 
                                        />
                                        <div className="absolute right-5 text-gray-400 dark:text-[#95c6a9] flex items-center pointer-events-none">
                                            <span className="material-symbols-outlined">lock</span>
                                        </div>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button 
                        type="submit" 
                        disabled={mutation.isPending}
                        className="mt-2 w-full h-14 rounded-full bg-primary hover:bg-primary/90 text-background-dark text-base font-bold shadow-[0_0_20px_rgba(54,226,123,0.4)] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        {mutation.isPending ? 'Creating Account...' : 'Create Account'}
                    </Button>
                </form>
            </Form>

            <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
                Already have an account?{' '}
                <Link href="/login" className="font-bold text-gray-900 dark:text-white hover:text-primary transition-colors">
                    Log In
                </Link>
            </p>
        </AuthLayout>
    );
}
