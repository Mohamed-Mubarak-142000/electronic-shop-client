'use client';

import React, { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useForm, Resolver, FieldError } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { brandService, categoryService } from '@/services/metadataService';
import { uploadService } from '@/services/uploadService';
import { useTranslation } from '@/hooks/useTranslation';
import { Brand, Category } from '@/types';
import Image from 'next/image';

const brandSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    nameAr: z.string().min(1, 'Arabic Name is required'),
    description: z.string().min(1, 'Description is required'),
    descriptionAr: z.string().min(1, 'Arabic Description is required'),
    logoUrl: z.string().optional().or(z.literal('')),
    isPublished: z.boolean().default(true),
    category: z.string().optional().or(z.literal('')),
});

type BrandFormValues = z.infer<typeof brandSchema>;

interface BrandFormProps {
    initialData?: Brand;
}

export default function BrandForm({ initialData }: BrandFormProps) {
    const { t } = useTranslation();
    const router = useRouter();
    const queryClient = useQueryClient();
    const { data: categoriesData } = useQuery({ queryKey: ['categories'], queryFn: categoryService.getCategories });
    const categoriesList = Array.isArray(categoriesData) ? categoriesData : [];
    const [uploading, setUploading] = React.useState(false);

    const form = useForm<BrandFormValues>({
        resolver: zodResolver(brandSchema) as Resolver<BrandFormValues>,
        defaultValues: {
            name: initialData?.name || '',
            nameAr: initialData?.nameAr || '',
            description: initialData?.description || '',
            descriptionAr: initialData?.descriptionAr || '',
            logoUrl: initialData?.logoUrl || initialData?.image || '',
            isPublished: initialData?.isPublished ?? true,
            category: typeof initialData?.category === 'string' ? initialData.category : initialData?.category?._id || '',
        },
        mode: 'onChange'
    });

    useEffect(() => {
        if (initialData) {
            form.reset({
                name: initialData.name,
                nameAr: initialData.nameAr,
                description: initialData.description,
                descriptionAr: initialData.descriptionAr,
                logoUrl: initialData.logoUrl || initialData.image,
                isPublished: initialData.isPublished ?? true,
                category: typeof initialData.category === 'string' ? initialData.category : initialData.category?._id || '',
            });
        }
    }, [initialData, form]);

    const uploadFileHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setUploading(true);
            try {
                const data = await uploadService.uploadImage(file);
                if (data.path) {
                    form.setValue('logoUrl', data.path);
                    toast.success('Image uploaded successfully');
                } else {
                    throw new Error('Invalid response from server');
                }
            } catch (error) {
                console.error(error);
                toast.error('Image upload failed');
            } finally {
                setUploading(false);
            }
        }
    };

    const createMutation = useMutation({
        mutationFn: brandService.createBrand,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['brands'] });
            toast.success('Brand created successfully');
            router.push('/admin/brands');
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to create brand');
        }
    });

    const updateMutation = useMutation({
        mutationFn: (data: BrandFormValues) => brandService.updateBrand(initialData!._id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['brands'] });
            toast.success('Brand updated successfully');
            router.push('/admin/brands');
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to update brand');
        }
    });

    const onSubmit = (values: BrandFormValues) => {
        if (initialData) {
            updateMutation.mutate(values);
        } else {
            createMutation.mutate(values);
        }
    };

    const inputClass = (error?: FieldError) => `form-input flex w-full rounded-lg border-white/10 bg-background-dark text-white focus:ring-2 focus:ring-primary focus:border-primary h-12 px-4 placeholder:text-gray-400 ${error ? 'border-red-500 focus:border-red-500' : ''}`;

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Main Form Data (2/3 width) */}
            <div className="lg:col-span-2 flex flex-col gap-8">
                {/* General Information Card */}
                <div className="bg-surface-dark rounded-xl p-6 shadow-sm border border-white/10">
                    <h2 className="text-lg font-bold text-white mb-6">General Information</h2>
                    <div className="flex flex-col gap-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <label className="flex flex-col w-full">
                                <span className="text-white text-sm font-bold uppercase tracking-wide pb-2">Brand Name (EN)</span>
                                <input
                                    {...form.register('name')}
                                    className={inputClass(form.formState.errors.name)}
                                    placeholder="e.g. Siemens"
                                    type="text"
                                />
                                {form.formState.errors.name && <span className="text-red-500 text-sm mt-1">{form.formState.errors.name.message}</span>}
                            </label>
                            <label className="flex flex-col w-full">
                                <span className="text-white text-sm font-bold uppercase tracking-wide pb-2">Brand Name (AR)</span>
                                <input
                                    {...form.register('nameAr')}
                                    className={inputClass(form.formState.errors.nameAr)}
                                    placeholder="اسم العلامة التجارية بالعربية"
                                    type="text"
                                />
                                {form.formState.errors.nameAr && <span className="text-red-500 text-sm mt-1">{form.formState.errors.nameAr.message}</span>}
                            </label>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <label className="flex flex-col w-full">
                                <span className="text-white text-sm font-bold uppercase tracking-wide pb-2">Description (EN)</span>
                                <div className="flex flex-col rounded-lg border border-white/10 bg-background-dark overflow-hidden">
                                    <textarea
                                        {...form.register('description')}
                                        className="form-textarea w-full border-none bg-transparent focus:ring-0 p-4 min-h-[160px] text-white resize-y placeholder:text-gray-400"
                                        placeholder="Enter brand description..."
                                    ></textarea>
                                </div>
                                {form.formState.errors.description && <span className="text-red-500 text-sm mt-1">{form.formState.errors.description.message}</span>}
                            </label>
                            <label className="flex flex-col w-full">
                                <span className="text-white text-sm font-bold uppercase tracking-wide pb-2">Description (AR)</span>
                                <div className="flex flex-col rounded-lg border border-white/10 bg-background-dark overflow-hidden">
                                    <textarea
                                        {...form.register('descriptionAr')}
                                        className="form-textarea w-full border-none bg-transparent focus:ring-0 p-4 min-h-[160px] text-white resize-y placeholder:text-gray-400"
                                        placeholder="وصف العلامة التجارية بالعربية..."
                                    ></textarea>
                                </div>
                                {form.formState.errors.descriptionAr && <span className="text-red-500 text-sm mt-1">{form.formState.errors.descriptionAr.message}</span>}
                            </label>
                        </div>
                    </div>
                </div>
                {/* Media Card */}
                <div className="bg-surface-dark rounded-xl p-6 shadow-sm border border-white/10">
                    <h2 className="text-lg font-bold text-white mb-6">Brand Media</h2>
                    <div className="flex flex-col gap-6">
                        <label className="flex flex-col w-full">
                            <span className="text-white text-sm font-bold uppercase tracking-wide pb-2">Logo Image</span>
                            <label className="relative cursor-pointer">
                                <input
                                    type="file"
                                    onChange={uploadFileHandler}
                                    className="hidden"
                                    id="brand-logo-upload"
                                />
                                <div className="flex items-center justify-center gap-3 w-full h-32 rounded-lg border-2 border-dashed border-white/20 bg-background-dark hover:border-primary hover:bg-white/5 transition-all">
                                    <span className="material-symbols-outlined text-4xl text-primary">add_photo_alternate</span>
                                    <div className="flex flex-col">
                                        <span className="text-white font-semibold">Choose Logo</span>
                                        <span className="text-gray-400 text-sm">or drag and drop</span>
                                    </div>
                                </div>
                            </label>
                            {uploading && <p className="text-sm text-yellow-400">Uploading to Cloudinary...</p>}
                            {form.watch('logoUrl') && (
                                <div className="mt-4 relative group w-fit">
                                    <Image src={form.watch('logoUrl') || ''} alt="Brand Logo" width={128} height={128} className="object-contain rounded-lg border border-white/10 bg-white" />
                                    <button
                                        type="button"
                                        onClick={() => form.setValue('logoUrl', '')}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <span className="material-symbols-outlined text-sm">close</span>
                                    </button>
                                </div>
                            )}
                            {form.formState.errors.logoUrl && <span className="text-red-500 text-sm mt-1">{form.formState.errors.logoUrl.message}</span>}
                        </label>
                    </div>
                </div>
            </div>
            {/* Right Column: Sidebar (1/3 width) */}
            <div className="flex flex-col gap-8">
                {/* Organization Card */}
                <div className="bg-surface-dark rounded-xl p-6 shadow-sm border border-white/10">
                    <h2 className="text-lg font-bold text-white mb-6">{t('admin.product.organization')}</h2>
                    <div className="flex flex-col gap-6">
                        {/* Status / Published */}
                        <label className="flex flex-col w-full">
                            <span className="text-white text-sm font-bold uppercase tracking-wide pb-2">{t('admin.product.status')}</span>
                            <select
                                {...form.register('isPublished')}
                                className="form-select flex w-full rounded-lg border-white/10 bg-background-dark text-white focus:ring-2 focus:ring-primary focus:border-primary h-12 px-4"
                                onChange={(e) => form.setValue('isPublished', e.target.value === 'true')}
                                value={form.watch('isPublished') ? 'true' : 'false'}
                            >
                                <option value="true">{t('admin.product.published')}</option>
                                <option value="false">{t('admin.product.draft')}</option>
                            </select>
                        </label>
                        {/* Category Select Box */}
                        <label className="flex flex-col w-full">
                            <span className="text-white text-sm font-bold uppercase tracking-wide pb-2">{t('admin.product.category')}</span>
                            <select
                                {...form.register('category')}
                                className="form-select flex w-full rounded-lg border-white/10 bg-background-dark text-white focus:ring-2 focus:ring-primary focus:border-primary h-12 px-4"
                            >
                                <option value="">{t('admin.product.select_category')}</option>
                                {categoriesList.map((cat: Category) => (
                                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                                ))}
                            </select>
                        </label>
                    </div>
                </div>
                {/* Submit Action */}
                <button
                    type="submit"
                    disabled={createMutation.isPending || updateMutation.isPending}
                    className="w-full flex items-center justify-center rounded-lg h-12 bg-primary text-background-dark text-base font-bold shadow-lg hover:bg-green-400 transition-colors disabled:opacity-50"
                >
                    {(createMutation.isPending || updateMutation.isPending) ? t('admin.product.saving') : (initialData ? t('admin.brand.update') : t('admin.brand.create'))}
                </button>
            </div>
        </form>
    );
}
