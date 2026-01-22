'use client';

import React, { useEffect } from 'react';
import { useForm, Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useConfigStore } from '@/store/useConfigStore';
import { useTranslation } from '@/hooks/useTranslation';
import { en } from '@/locales/translations';

const createSettingsSchema = (t: (key: keyof typeof en, params?: Record<string, string | number>) => string) => z.object({
    language: z.enum(['en', 'ar']),
    currency: z.enum(['USD', 'EGP', 'AED']),
    vodafoneCashNumber: z.string().min(1, t('validation.required')),
    instapayNumber: z.string().min(1, t('validation.required')),
    creditCardNumber: z.string().min(1, t('validation.required')),
    taxiAmount: z.coerce.number().min(0),
    minProductImages: z.coerce.number().min(1),
    maxProductImages: z.coerce.number().min(1),
});

type SettingsFormValues = z.infer<ReturnType<typeof createSettingsSchema>>;

export default function SettingsPage() {
    const { configs, updateConfigs, fetchConfigs, isLoading } = useConfigStore();
    const { t } = useTranslation();

    const settingsSchema = createSettingsSchema(t);

    const form = useForm<SettingsFormValues>({
        resolver: zodResolver(settingsSchema) as Resolver<SettingsFormValues>,
        defaultValues: configs as unknown as SettingsFormValues,
    });

    useEffect(() => {
        fetchConfigs();
    }, []);

    useEffect(() => {
        if (configs) {
            form.reset(configs as unknown as SettingsFormValues);
        }
    }, [configs, form]);

    const onSubmit = async (data: SettingsFormValues) => {
        try {
            await updateConfigs(data);
            toast.success(t('settings.success'));
        } catch {
            toast.error(t('settings.error'));
        }
    };

    return (
        <div className="p-6 w-full">
            <h1 className="text-2xl font-bold text-white mb-6">{t('settings.title')}</h1>
            
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                
                <div className="space-y-4 p-4 rounded-xl bg-surface-dark border border-white/5">
                    <h2 className="text-lg font-semibold text-primary">{t('settings.general')}</h2>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-gray-300">{t('settings.language')}</Label>
                            <select
                                className="w-full p-2.5 rounded-lg border border-white/10 bg-black/20 text-white outline-none focus:border-primary/50"
                                {...form.register('language')}
                            >
                                <option value="en">English</option>
                                <option value="ar">Arabic</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-gray-300">{t('settings.currency')}</Label>
                            <select
                                className="w-full p-2.5 rounded-lg border border-white/10 bg-black/20 text-white outline-none focus:border-primary/50"
                                {...form.register('currency')}
                            >
                                <option value="USD">USD ($)</option>
                                <option value="EGP">EGP (جنيه)</option>
                                <option value="AED">AED (د.إ)</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="space-y-4 p-4 rounded-xl bg-surface-dark border border-white/5">
                    <h2 className="text-lg font-semibold text-primary">{t('settings.payment')}</h2>
                    
                    <div className="space-y-2">
                        <Label className="text-gray-300">{t('settings.vodafone')}</Label>
                        <Input 
                            className="bg-black/20 border-white/10 text-white" 
                            {...form.register('vodafoneCashNumber')} 
                        />
                         {form.formState.errors.vodafoneCashNumber && (
                            <p className="text-red-400 text-xs">{form.formState.errors.vodafoneCashNumber.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label className="text-gray-300">{t('settings.instapay')}</Label>
                        <Input 
                            className="bg-black/20 border-white/10 text-white" 
                            {...form.register('instapayNumber')} 
                        />
                         {form.formState.errors.instapayNumber && (
                            <p className="text-red-400 text-xs">{form.formState.errors.instapayNumber.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label className="text-gray-300">{t('settings.credit_card')}</Label>
                        <Input 
                            className="bg-black/20 border-white/10 text-white" 
                            {...form.register('creditCardNumber')} 
                        />
                         {form.formState.errors.creditCardNumber && (
                            <p className="text-red-400 text-xs">{form.formState.errors.creditCardNumber.message}</p>
                        )}
                    </div>

                     <div className="space-y-2">
                        <Label className="text-gray-300">{t('settings.taxi')}</Label>
                        <Input 
                            type="number"
                            className="bg-black/20 border-white/10 text-white" 
                            {...form.register('taxiAmount')} 
                        />
                    </div>
                </div>

                <div className="space-y-4 p-4 rounded-xl bg-surface-dark border border-white/5">
                    <h2 className="text-lg font-semibold text-primary">{t('settings.product_limits')}</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-gray-300">{t('settings.min_images')}</Label>
                            <Input 
                                type="number"
                                className="bg-black/20 border-white/10 text-white" 
                                {...form.register('minProductImages')} 
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-gray-300">{t('settings.max_images')}</Label>
                            <Input 
                                type="number"
                                className="bg-black/20 border-white/10 text-white" 
                                {...form.register('maxProductImages')} 
                            />
                        </div>
                    </div>
                </div>

                <Button type="submit" disabled={isLoading || form.formState.isSubmitting} className="w-full bg-primary hover:bg-primary/90 text-black font-bold">
                    {isLoading || form.formState.isSubmitting ? t('settings.saving') : t('settings.save')}
                </Button>
            </form>
        </div>
    );
}
