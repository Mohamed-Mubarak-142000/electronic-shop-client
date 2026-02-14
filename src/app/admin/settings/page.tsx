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
import { useQuery } from '@tanstack/react-query';
import { productService } from '@/services/productService';
import { Product } from '@/types';

const createSettingsSchema = (t: (key: keyof typeof en, params?: Record<string, string | number>) => string) => z.object({
    language: z.enum(['en', 'ar']),
    currency: z.enum(['USD', 'EGP', 'AED']),
    vodafoneCashNumber: z.string().min(1, t('validation.required')),
    instapayNumber: z.string().min(1, t('validation.required')),
    creditCardNumber: z.string().min(1, t('validation.required')),
    taxiAmount: z.coerce.number().min(0),
    minProductImages: z.coerce.number().min(1),
    maxProductImages: z.coerce.number().min(1),
    emailHost: z.string().min(1, t('validation.required')),
    emailPort: z.coerce.number().min(1),
    emailUser: z.string().email(t('auth.email')),
    emailPassword: z.string().min(1, t('validation.required')),
    fromName: z.string().min(1, t('validation.required')),
    fromEmail: z.string().email(t('auth.email')),
    showPortfolioPage: z.boolean(),
    showCategoriesSection: z.boolean(),
    showBestSellersSection: z.boolean(),
    showPartnerSection: z.boolean(),
    showNewArrivalsSection: z.boolean(),
    showTestimonialsSection: z.boolean(),
    showShowroomMapSection: z.boolean(),
    heroType: z.enum(['hero', 'slider']),
    heroTitle1: z.string().min(1, t('validation.required')),
    heroTitle2: z.string().min(1, t('validation.required')),
    heroSubtitle: z.string().min(1, t('validation.required')),
    heroSliderProduct1: z.string().optional(),
    heroSliderProduct2: z.string().optional(),
    heroSliderProduct3: z.string().optional(),
    heroSliderProduct4: z.string().optional(),
    b2bBadge: z.string().min(1, t('validation.required')),
    b2bTitle1: z.string().min(1, t('validation.required')),
    b2bTitle2: z.string().min(1, t('validation.required')),
    b2bDescription: z.string().min(1, t('validation.required')),
    testimonialsTitle: z.string().min(1, t('validation.required')),
    testimonialsSubtitle: z.string().min(1, t('validation.required')),
});

type SettingsFormValues = z.infer<ReturnType<typeof createSettingsSchema>>;

export default function SettingsPage() {
    const { configs, updateConfigs, fetchConfigs, isLoading: isConfigLoading } = useConfigStore();
    const { t, language } = useTranslation();

    const { data: productsData } = useQuery({
        queryKey: ['admin-products-select'],
        queryFn: () => productService.getProducts({ limit: 1000 }),
    });

    const products = productsData?.products as Product[] || [];

    const settingsSchema = createSettingsSchema(t);

    const form = useForm<SettingsFormValues>({
        resolver: zodResolver(settingsSchema) as Resolver<SettingsFormValues>,
        defaultValues: {
            ...configs,
            showPortfolioPage: configs?.showPortfolioPage ?? true,
            showCategoriesSection: configs?.showCategoriesSection ?? true,
            showBestSellersSection: configs?.showBestSellersSection ?? true,
            showPartnerSection: configs?.showPartnerSection ?? true,
            showNewArrivalsSection: configs?.showNewArrivalsSection ?? true,
            showTestimonialsSection: configs?.showTestimonialsSection ?? true,
            showShowroomMapSection: configs?.showShowroomMapSection ?? true,
            heroType: configs?.heroType ?? 'hero',
            heroSliderProduct1: configs?.heroSliderProduct1 ?? '',
            heroSliderProduct2: configs?.heroSliderProduct2 ?? '',
            heroSliderProduct3: configs?.heroSliderProduct3 ?? '',
            heroSliderProduct4: configs?.heroSliderProduct4 ?? '',
        } as unknown as SettingsFormValues,
    });

    useEffect(() => {
        fetchConfigs();
    }, []);

    useEffect(() => {
        if (configs) {
            form.reset({
                ...configs,
                heroSliderProduct1: configs.heroSliderProduct1 || '',
                heroSliderProduct2: configs.heroSliderProduct2 || '',
                heroSliderProduct3: configs.heroSliderProduct3 || '',
                heroSliderProduct4: configs.heroSliderProduct4 || '',
            } as unknown as SettingsFormValues);
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
        <div className="p-6 w-full mx-auto">
            <h1 className="text-2xl font-bold text-foreground mb-6">{t('settings.title')}</h1>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                <div className="space-y-4 p-6 rounded-2xl bg-card-dark/40 border border-border shadow-sm">
                    <h2 className="text-lg font-semibold text-primary flex items-center gap-2">
                        <span className="material-symbols-outlined">settings</span>
                        {t('settings.general')}
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label className="text-text-secondary">{t('settings.language')}</Label>
                            <select
                                className="w-full p-3 rounded-xl border border-border bg-surface-dark/80 text-foreground outline-none focus:border-primary/50 transition-all font-medium"
                                {...form.register('language')}
                            >
                                <option value="en" className="bg-surface-dark">English</option>
                                <option value="ar" className="bg-surface-dark">Arabic</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-text-secondary">{t('settings.currency')}</Label>
                            <select
                                className="w-full p-3 rounded-xl border border-border bg-surface-dark/80 text-foreground outline-none focus:border-primary/50 transition-all font-medium"
                                {...form.register('currency')}
                            >
                                <option value="USD" className="bg-surface-dark">USD ($)</option>
                                <option value="EGP" className="bg-surface-dark">EGP (جنيه)</option>
                                <option value="AED" className="bg-surface-dark">AED (د.إ)</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="space-y-4 p-6 rounded-2xl bg-card-dark/40 border border-border shadow-sm">
                    <h2 className="text-lg font-semibold text-primary flex items-center gap-2">
                        <span className="material-symbols-outlined">payments</span>
                        {t('settings.payment')}
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label className="text-text-secondary">{t('settings.vodafone')}</Label>
                            <Input
                                className="bg-surface-dark/80 border-border text-foreground p-3 rounded-xl"
                                {...form.register('vodafoneCashNumber')}
                            />
                            {form.formState.errors.vodafoneCashNumber && (
                                <p className="text-red-400 text-xs">{form.formState.errors.vodafoneCashNumber.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label className="text-text-secondary">{t('settings.instapay')}</Label>
                            <Input
                                className="bg-surface-dark/80 border-border text-foreground p-3 rounded-xl"
                                {...form.register('instapayNumber')}
                            />
                            {form.formState.errors.instapayNumber && (
                                <p className="text-red-400 text-xs">{form.formState.errors.instapayNumber.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label className="text-text-secondary">{t('settings.credit_card')}</Label>
                            <Input
                                className="bg-surface-dark/80 border-border text-foreground p-3 rounded-xl"
                                {...form.register('creditCardNumber')}
                            />
                            {form.formState.errors.creditCardNumber && (
                                <p className="text-red-400 text-xs">{form.formState.errors.creditCardNumber.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label className="text-text-secondary">{t('settings.taxi')}</Label>
                            <Input
                                type="number"
                                className="bg-surface-dark/80 border-border text-foreground p-3 rounded-xl"
                                {...form.register('taxiAmount')}
                            />
                        </div>
                    </div>
                </div>

                {/* Email Settings Section */}
                <div className="space-y-4 p-6 rounded-2xl bg-card-dark/40 border border-border shadow-sm">
                    <h2 className="text-lg font-semibold text-primary flex items-center gap-2">
                        <span className="material-symbols-outlined">mail</span>
                        {t('settings.email_settings')}
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label className="text-text-secondary">{t('settings.email_host')}</Label>
                            <Input
                                placeholder="smtp.gmail.com"
                                className="bg-surface-dark/80 border-border text-foreground p-3 rounded-xl"
                                {...form.register('emailHost')}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-text-secondary">{t('settings.email_port')}</Label>
                            <Input
                                type="number"
                                placeholder="587"
                                className="bg-surface-dark/80 border-border text-foreground p-3 rounded-xl"
                                {...form.register('emailPort')}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-text-secondary">{t('settings.email_user')}</Label>
                            <Input
                                placeholder="user@gmail.com"
                                className="bg-surface-dark/80 border-border text-foreground p-3 rounded-xl"
                                {...form.register('emailUser')}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-text-secondary">{t('settings.email_password')}</Label>
                            <Input
                                type="password"
                                placeholder="••••••••••••"
                                className="bg-surface-dark/80 border-border text-foreground p-3 rounded-xl"
                                {...form.register('emailPassword')}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-text-secondary">{t('settings.from_name')}</Label>
                            <Input
                                placeholder="Electro Shop"
                                className="bg-surface-dark/80 border-border text-foreground p-3 rounded-xl"
                                {...form.register('fromName')}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-text-secondary">{t('settings.from_email')}</Label>
                            <Input
                                placeholder="noreply@electroshop.com"
                                className="bg-surface-dark/80 border-border text-foreground p-3 rounded-xl"
                                {...form.register('fromEmail')}
                            />
                        </div>
                    </div>
                </div>

                {/* Homepage Configuration Section */}
                <div className="space-y-6 p-6 rounded-2xl bg-card-dark/40 border border-border shadow-sm">
                    <h2 className="text-lg font-semibold text-primary flex items-center gap-2">
                        <span className="material-symbols-outlined">home</span>
                        {t('settings.homepage_config')}
                    </h2>

                    <div className="space-y-6">
                        {/* Hero Section Type Selection */}
                        <div className="p-4 rounded-xl bg-surface-dark/40 border border-border">
                            <Label className="text-text-secondary mb-2 block">{t('settings.hero_type')}</Label>
                            <div className="flex gap-4">
                                <label className="flex-1 flex items-center justify-between p-3 rounded-xl bg-surface-dark/60 border border-border cursor-pointer hover:border-primary/50 transition-all">
                                    <div className="flex items-center gap-3">
                                        <span className="material-symbols-outlined text-primary-400">image</span>
                                        <span className="text-foreground text-sm font-medium">{t('settings.hero_type_static')}</span>
                                    </div>
                                    <input
                                        type="radio"
                                        value="hero"
                                        {...form.register('heroType')}
                                        className="w-4 h-4 accent-primary"
                                    />
                                </label>
                                <label className="flex-1 flex items-center justify-between p-3 rounded-xl bg-surface-dark/60 border border-border cursor-pointer hover:border-primary/50 transition-all">
                                    <div className="flex items-center gap-3">
                                        <span className="material-symbols-outlined text-primary-400">view_carousel</span>
                                        <span className="text-foreground text-sm font-medium">{t('settings.hero_type_slider')}</span>
                                    </div>
                                    <input
                                        type="radio"
                                        value="slider"
                                        {...form.register('heroType')}
                                        className="w-4 h-4 accent-primary"
                                    />
                                </label>
                            </div>
                        </div>

                        {/* Static Hero Content */}
                        {form.watch('heroType') === 'hero' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 rounded-xl bg-surface-dark/30 border border-border animate-in fade-in slide-in-from-top-2 duration-300">
                                <div className="space-y-2">
                                    <Label className="text-text-secondary">{t('settings.hero_title1')}</Label>
                                    <Input
                                        className="bg-surface-dark/80 border-border text-foreground p-3 rounded-xl"
                                        {...form.register('heroTitle1')}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-text-secondary">{t('settings.hero_title2')}</Label>
                                    <Input
                                        className="bg-surface-dark/80 border-border text-foreground p-3 rounded-xl"
                                        {...form.register('heroTitle2')}
                                    />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <Label className="text-text-secondary">{t('settings.hero_subtitle')}</Label>
                                    <textarea
                                        className="w-full bg-surface-dark/80 border border-border text-foreground p-3 rounded-xl min-h-[100px] outline-none focus:border-primary transition-all font-sans"
                                        {...form.register('heroSubtitle')}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Product Slider Content */}
                        {form.watch('heroType') === 'slider' && (
                            <div className="p-4 rounded-xl bg-surface-dark/30 border border-border space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                <Label className="text-text-secondary">{t('settings.hero_slider_products')}</Label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {[1, 2, 3, 4].map((num) => (
                                        <div key={num} className="space-y-2">
                                            <Label className="text-xs text-text-secondary uppercase tracking-wider font-bold">Slide {num}</Label>
                                            <select
                                                className="w-full bg-surface-dark/80 border border-border text-foreground p-3 rounded-xl outline-none focus:border-primary transition-all appearance-none cursor-pointer"
                                                {...form.register(`heroSliderProduct${num}` as any)}
                                            >
                                                <option value="">{t('settings.select_product')}</option>
                                                {products.map((p) => (
                                                    <option key={p._id} value={p._id}>
                                                        {language === 'ar' ? p.nameAr : p.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* B2B Content */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 rounded-xl bg-surface-dark/30 border border-border">
                            <div className="space-y-2">
                                <Label className="text-text-secondary">{t('settings.b2b_badge')}</Label>
                                <Input
                                    className="bg-surface-dark/80 border-border text-foreground p-3 rounded-xl"
                                    {...form.register('b2bBadge')}
                                />
                            </div>
                            <div className="hidden md:block"></div>
                            <div className="space-y-2">
                                <Label className="text-text-secondary">{t('settings.b2b_title1')}</Label>
                                <Input
                                    className="bg-surface-dark/80 border-border text-foreground p-3 rounded-xl"
                                    {...form.register('b2bTitle1')}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-text-secondary">{t('settings.b2b_title2')}</Label>
                                <Input
                                    className="bg-surface-dark/80 border-border text-foreground p-3 rounded-xl"
                                    {...form.register('b2bTitle2')}
                                />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <Label className="text-text-secondary">{t('settings.b2b_description')}</Label>
                                <textarea
                                    className="w-full bg-surface-dark/80 border border-border text-foreground p-3 rounded-xl min-h-[100px] outline-none focus:border-primary transition-all font-sans"
                                    {...form.register('b2bDescription')}
                                />
                            </div>
                        </div>

                        {/* Testimonials Content */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 rounded-xl bg-surface-dark/30 border border-border">
                            <div className="space-y-2">
                                <Label className="text-text-secondary">{t('settings.testimonials_title')}</Label>
                                <Input
                                    className="bg-surface-dark/80 border-border text-foreground p-3 rounded-xl"
                                    {...form.register('testimonialsTitle')}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-text-secondary">{t('settings.testimonials_subtitle')}</Label>
                                <Input
                                    className="bg-surface-dark/80 border-border text-foreground p-3 rounded-xl"
                                    {...form.register('testimonialsSubtitle')}
                                />
                            </div>
                        </div>

                        {/* Visibility Toggles */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                { key: 'showPortfolioPage', label: t('settings.show_portfolio'), icon: 'work' },
                                { key: 'showCategoriesSection', label: t('settings.show_categories'), icon: 'category' },
                                { key: 'showBestSellersSection', label: t('settings.show_best_sellers'), icon: 'stars' },
                                { key: 'showPartnerSection', label: t('settings.show_partner'), icon: 'handshake' },
                                { key: 'showNewArrivalsSection', label: t('settings.show_new_arrivals'), icon: 'new_releases' },
                                { key: 'showTestimonialsSection', label: t('settings.show_testimonials'), icon: 'format_quote' },
                                { key: 'showShowroomMapSection', label: t('settings.show_showroom_map'), icon: 'map' },
                            ].map((item) => (
                                <div key={item.key} className="flex items-center justify-between p-4 rounded-xl bg-surface-dark/30 border border-border hover:bg-surface-highlight transition-colors">
                                    <div className="flex items-center gap-3">
                                        <span className="material-symbols-outlined text-text-secondary">{item.icon}</span>
                                        <span className="text-text-secondary font-medium">{item.label}</span>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            {...form.register(item.key as any)}
                                        />
                                        <div className="w-11 h-6 bg-surface-dark peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-4 p-6 rounded-2xl bg-card-dark/40 border border-border shadow-sm">
                    <h2 className="text-lg font-semibold text-primary flex items-center gap-2">
                        <span className="material-symbols-outlined">image</span>
                        {t('settings.product_limits')}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label className="text-text-secondary">{t('settings.min_images')}</Label>
                            <Input
                                type="number"
                                className="bg-surface-dark/80 border-border text-foreground p-3 rounded-xl"
                                {...form.register('minProductImages')}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-text-secondary">{t('settings.max_images')}</Label>
                            <Input
                                type="number"
                                className="bg-surface-dark/80 border-border text-foreground p-3 rounded-xl"
                                {...form.register('maxProductImages')}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-6 border-t border-border">
                    <Button
                        type="submit"
                        disabled={isConfigLoading}
                        className="bg-primary-600 hover:bg-primary-700 text-text-on-primary px-8 h-12 rounded-xl font-bold shadow-lg shadow-primary-600/20 active:scale-95 transition-all"
                    >
                        {isConfigLoading ? (
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                {t('settings.saving')}
                            </div>
                        ) : (
                            t('settings.save')
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}
