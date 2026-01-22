'use client';

import React, { useState } from 'react';
import { useForm, Resolver, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { AxiosError } from 'axios';
import Image from 'next/image';
import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Dialog from '@/components/ui/dialog';
import { scheduleService } from '@/services/scheduleService';
import { productService } from '@/services/productService';
import { Product } from '@/types';
import { X } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { useCurrency } from '@/hooks/useCurrency';
import { en } from '@/locales/translations';

const createScheduleSchema = (t: (key: keyof typeof en) => string) => z.object({
    productId: z.string().min(1, t('admin.schedules.form.product') + ' ' + t('validation.required')),
    type: z.enum(['percentage', 'fixed']),
    value: z.coerce.number().min(0.01, t('admin.schedules.form.value') + ' must be greater than 0'),
    startTime: z.string().min(1, t('admin.schedules.form.start_time') + ' ' + t('validation.required')),
    endTime: z.string().min(1, t('admin.schedules.form.end_time') + ' ' + t('validation.required')),
}).refine(data => new Date(data.endTime) > new Date(data.startTime), {
    message: t('admin.schedules.form.validation.end_time'),
    path: ["endTime"]
}).refine(data => {
    if (data.type === 'percentage') {
        return data.value <= 100;
    }
    return true;
}, {
    message: t('admin.schedules.form.validation.percentage'),
    path: ["value"]
});

type ScheduleFormValues = z.infer<ReturnType<typeof createScheduleSchema>>;

export default function ScheduleForm() {
    const { t } = useTranslation();
    const { formatPrice } = useCurrency();
    const [open, setOpen] = useState(false);
    
    const scheduleSchema = createScheduleSchema(t);
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    // Fetch products for selection
    const { data: productData, isLoading: isLoadingProducts } = useQuery({
        queryKey: ['products', searchTerm],
        queryFn: () => productService.getProducts({ keyword: searchTerm, limit: 10 }),
        enabled: open // only fetch when dialog is open
    });

    const products: Product[] = productData?.products || [];

    const form = useForm<ScheduleFormValues>({
        resolver: zodResolver(scheduleSchema) as Resolver<ScheduleFormValues>,
        defaultValues: {
            type: 'percentage',
            value: 0,
        },
    });

    const createMutation = useMutation({
        mutationFn: scheduleService.createSchedule,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['schedules'] });
            toast.success('Schedule created successfully');
            setOpen(false);
            form.reset();
            setSelectedProduct(null);
        },
        onError: (error: AxiosError<{ message: string }>) => {
            toast.error(error.response?.data?.message || 'Failed to create schedule');
        }
    });

    const onSubmit = (data: ScheduleFormValues) => {
        createMutation.mutate(data);
    };

    const type = useWatch({ control: form.control, name: 'type' });
    const value = Number(useWatch({ control: form.control, name: 'value' }) || 0);

    // Calculate preview price
    const calculateNewPrice = () => {
        if (!selectedProduct) return null;

        if (type === 'percentage') {
            return Math.max(0, Math.round(selectedProduct.price * (1 - value / 100)));
        } else {
            return Math.max(0, selectedProduct.price - value);
        }
    };

    const newPrice = calculateNewPrice();

    return (
        <>
            <Button onClick={() => setOpen(true)} className="bg-primary hover:bg-primary/90">
                <span className="material-symbols-outlined mr-2">add</span>
                {t('admin.schedules.new_schedule')}
            </Button>

            <Dialog 
                isOpen={open} 
                onClose={() => setOpen(false)} 
                title={t('admin.schedules.create_title')}
                className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white flex flex-col overflow-hidden max-h-[85vh] h-auto"
            >
                <div className="p-6">
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        {/* Product Selector */}
                        <div className="space-y-2">
                            <Label className="text-gray-300">{t('admin.schedules.form.product')}</Label>
                            {selectedProduct ? (
                                <div className="flex items-center justify-between p-2 border border-white/10 rounded-md bg-black/20">
                                    <div className="flex items-center gap-2">
                                        <div className="w-10 h-10 bg-gray-700 rounded overflow-hidden relative">
                                            {selectedProduct.images?.[0] && (
                                                <Image 
                                                    src={selectedProduct.images[0]} 
                                                    alt={selectedProduct.name} 
                                                    fill
                                                    className="object-cover"
                                                    sizes="40px"
                                                />
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm text-white">{selectedProduct.name}</p>
                                            <p className="text-xs text-gray-400">{formatPrice(selectedProduct.price)}</p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSelectedProduct(null);
                                            form.setValue('productId', '');
                                        }}
                                        className="text-gray-400 hover:text-red-400"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <Input
                                        placeholder={t('admin.schedules.form.search_placeholder')}
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="mb-2 bg-black/20 border-white/10 text-white placeholder:text-gray-500"
                                    />
                                    <div className="max-h-40 overflow-y-auto border border-white/10 rounded-md divide-y divide-white/10">
                                        {isLoadingProducts ? (
                                            <div className="p-2 text-center text-xs text-gray-400">{t('admin.schedules.table.loading')}</div>
                                        ) : products.length === 0 ? (
                                            <div className="p-2 text-center text-xs text-gray-400">{t('admin.schedules.form.no_products')}</div>
                                        ) : (
                                            products.map(p => (
                                                <div
                                                    key={p._id}
                                                    className="p-2 hover:bg-white/5 cursor-pointer flex justify-between items-center text-sm"
                                                    onClick={() => {
                                                        setSelectedProduct(p);
                                                        form.setValue('productId', p._id);
                                                    }}
                                                >
                                                    <span className="text-gray-200">{p.name}</span>
                                                    <span className="text-gray-400">{formatPrice(p.price)}</span>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}
                            {form.formState.errors.productId && (
                                <p className="text-red-400 text-xs">{form.formState.errors.productId.message}</p>
                            )}
                        </div>

                        {/* Discount Type */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-gray-300">{t('admin.schedules.form.type')}</Label>
                                <select
                                    className="w-full p-2.5 rounded-md border border-white/10 bg-black/20 text-white outline-none focus:border-primary/50"
                                    {...form.register('type')}
                                >
                                    <option value="percentage">{t('admin.schedules.form.type.percentage')}</option>
                                    <option value="fixed">{t('admin.schedules.form.type.fixed')}</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-gray-300">{t('admin.schedules.form.value')}</Label>
                                <Input 
                                    type="number" 
                                    step="0.01" 
                                    className="bg-black/20 border-white/10 text-white" 
                                    {...form.register('value')} 
                                />
                                {form.formState.errors.value && (
                                    <p className="text-red-400 text-xs">{form.formState.errors.value.message}</p>
                                )}
                            </div>
                        </div>

                        {/* Preview */}
                        {selectedProduct && newPrice !== null && (
                            <div className="p-3 bg-primary/10 rounded-md flex justify-between items-center text-sm border border-primary/20">
                                <span className="font-medium text-primary">{t('admin.schedules.form.new_price')}</span>
                                <div className="flex items-center gap-2">
                                    <span className="line-through text-gray-500">{formatPrice(selectedProduct.price)}</span>
                                    <span className="text-lg font-bold text-primary">{formatPrice(newPrice)}</span>
                                </div>
                            </div>
                        )}

                        {/* Date Time */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-gray-300">{t('admin.schedules.form.start_time')}</Label>
                                <input
                                    type="datetime-local"
                                    className="w-full p-2 rounded-md border border-white/10 bg-black/20 text-white text-sm outline-none focus:border-primary/50"
                                    {...form.register('startTime')}
                                />
                                {form.formState.errors.startTime && (
                                    <p className="text-red-400 text-xs">{form.formState.errors.startTime.message}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label className="text-gray-300">{t('admin.schedules.form.end_time')}</Label>
                                <input
                                    type="datetime-local"
                                    className="w-full p-2 rounded-md border border-white/10 bg-black/20 text-white text-sm outline-none focus:border-primary/50"
                                    {...form.register('endTime')}
                                />
                                {form.formState.errors.endTime && (
                                    <p className="text-red-400 text-xs">{form.formState.errors.endTime.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button type="submit" disabled={createMutation.isPending}>
                            {createMutation.isPending ? t('admin.schedules.form.submitting') : t('admin.schedules.form.submit')}
                        </Button>
                    </div>
                    </form>
                </div>
            </Dialog>
        </>
    );
}
