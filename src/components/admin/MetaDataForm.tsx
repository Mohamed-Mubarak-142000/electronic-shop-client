'use client';

import React, { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { categoryService, brandService } from '@/services/metadataService';
import { useTranslation } from '@/hooks/useTranslation';

const schema = z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().optional(),
    imageUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
    logoUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});

type FormValues = z.infer<typeof schema>;

interface MetaDataFormProps {
    type: 'category' | 'brand';
    initialData?: {
        _id: string;
        name: string;
        description?: string;
        imageUrl?: string;
        logoUrl?: string;
    };
}

export default function MetaDataForm({ type, initialData }: MetaDataFormProps) {
    const { t } = useTranslation();
    const router = useRouter();
    const queryClient = useQueryClient();
    const isCategory = type === 'category';

    const form = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: initialData?.name || '',
            description: initialData?.description || '',
            imageUrl: initialData?.imageUrl || '',
            logoUrl: initialData?.logoUrl || '',
        }
    });

    useEffect(() => {
        if (initialData) {
            form.reset({
                name: initialData.name,
                description: initialData.description,
                imageUrl: initialData.imageUrl,
                logoUrl: initialData.logoUrl,
            });
        }
    }, [initialData, form]);

    const queryKey = isCategory ? 'categories' : 'brands';
    const redirectPath = isCategory ? '/admin/categories' : '/admin/brands';

    const createMutation = useMutation({
        mutationFn: (data: FormValues) => isCategory ? categoryService.createCategory(data) : brandService.createBrand(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [queryKey] });
            router.push(redirectPath);
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to create');
        }
    });

    const updateMutation = useMutation({
        mutationFn: (data: FormValues) => isCategory ? categoryService.updateCategory(initialData!._id, data) : brandService.updateBrand(initialData!._id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [queryKey] });
            router.push(redirectPath);
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to update');
        }
    });

    const onSubmit = (values: FormValues) => {
        if (initialData) {
            updateMutation.mutate(values);
        } else {
            createMutation.mutate(values);
        }
    };

    const inputClass = (error?: { message?: string }) => `form-input flex w-full rounded-lg border-white/10 bg-background-dark text-white focus:ring-2 focus:ring-primary focus:border-primary h-12 px-4 placeholder:text-gray-400 ${error ? 'border-red-500 focus:border-red-500' : ''}`;

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6 max-w-2xl">
            <div className="bg-surface-dark rounded-xl p-6 shadow-sm border border-white/10 flex flex-col gap-6">
                <label className="flex flex-col w-full">
                    <span className="text-white text-sm font-bold uppercase tracking-wide pb-2">{t('admin.table.name')}</span>
                    <input
                        {...form.register('name')}
                        className={inputClass(form.formState.errors.name)}
                        placeholder="e.g. New Category"
                    />
                    {form.formState.errors.name && <span className="text-red-500 text-sm mt-1">{form.formState.errors.name.message}</span>}
                </label>

                <label className="flex flex-col w-full">
                    <span className="text-white text-sm font-bold uppercase tracking-wide pb-2">{t('admin.table.description')}</span>
                    <textarea
                        {...form.register('description')}
                        className="form-textarea w-full rounded-lg border-white/10 bg-background-dark text-white focus:ring-2 focus:ring-primary focus:border-primary p-4 min-h-[100px] placeholder:text-gray-400"
                        placeholder="Description..."
                    />
                </label>

                {isCategory ? (
                    <label className="flex flex-col w-full">
                        <span className="text-white text-sm font-bold uppercase tracking-wide pb-2">{t('admin.category.image')}</span>
                        <input
                            {...form.register('imageUrl')}
                            className={inputClass(form.formState.errors.imageUrl)}
                            placeholder="https://..."
                        />
                        {form.formState.errors.imageUrl && <span className="text-red-500 text-sm mt-1">{form.formState.errors.imageUrl.message}</span>}
                    </label>
                ) : (
                    <label className="flex flex-col w-full">
                        <span className="text-white text-sm font-bold uppercase tracking-wide pb-2">{t('admin.brand.logo')}</span>
                        <input
                            {...form.register('logoUrl')}
                            className={inputClass(form.formState.errors.logoUrl)}
                            placeholder="https://..."
                        />
                        {form.formState.errors.logoUrl && <span className="text-red-500 text-sm mt-1">{form.formState.errors.logoUrl.message}</span>}
                    </label>
                )}

                <button
                    type="submit"
                    disabled={createMutation.isPending || updateMutation.isPending}
                    className="w-full flex items-center justify-center rounded-lg h-12 bg-primary text-background-dark text-base font-bold shadow-lg hover:bg-green-400 transition-colors disabled:opacity-50"
                >
                    {(createMutation.isPending || updateMutation.isPending) ? t('admin.product.saving') : (initialData ? t('admin.orders.update_status') : t(isCategory ? 'admin.category.create' : 'admin.brand.create'))}
                </button>
            </div>
        </form>
    );
}
