'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Portfolio } from '@/types';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { portfolioService } from '@/services/portfolioService';
import { useQueryClient } from '@tanstack/react-query';

interface PortfolioFormProps {
    initialData?: Portfolio | null;
    onClose: () => void;
    isOpen: boolean;
}

export default function PortfolioForm({ initialData, onClose, isOpen }: PortfolioFormProps) {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const [uploading, setUploading] = useState(false);
    
    const [formData, setFormData] = useState({
        title: '',
        titleAr: '',
        description: '',
        descriptionAr: '',
        client: '',
        clientAr: '',
        completedAt: '',
        images: [] as string[],
        isPublished: true
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title,
                titleAr: initialData.titleAr || '',
                description: initialData.description,
                descriptionAr: initialData.descriptionAr || '',
                client: initialData.client || '',
                clientAr: initialData.clientAr || '',
                completedAt: initialData.completedAt ? initialData.completedAt.split('T')[0] : '',
                images: initialData.images,
                isPublished: initialData.isPublished
            });
        } else {
             setFormData({
                title: '',
                titleAr: '',
                description: '',
                descriptionAr: '',
                client: '',
                clientAr: '',
                completedAt: '',
                images: [],
                isPublished: true
            });
        }
    }, [initialData, isOpen]);

    const uploadFileHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const uploadFormData = new FormData();
            for (let i = 0; i < files.length; i++) {
                uploadFormData.append('images', files[i]);
            }
            setUploading(true);
            try {
                // Using existing endpoint logic from page.tsx for now
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/upload/multiple`, {
                    method: 'POST',
                    body: uploadFormData,
                });
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Upload failed');
                }

                if (Array.isArray(data)) {
                    setFormData((prev) => ({
                        ...prev,
                        images: [...prev.images, ...data]
                    }));
                } else {
                    throw new Error('Invalid response format');
                }
                
                setUploading(false);
            } catch (error: unknown) {
                console.error(error);
                setUploading(false);
                toast.error((error as Error).message || 'Image upload failed');
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (initialData) {
                await portfolioService.updatePortfolio(initialData._id, formData);
                toast.success('Project updated');
            } else {
                await portfolioService.createPortfolio(formData);
                toast.success('Project created');
            }
            queryClient.invalidateQueries({ queryKey: ['portfolio'] });
            onClose();
        } catch {
            toast.error('Failed to save project');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="bg-background-dark w-full max-w-2xl rounded-2xl border border-white/10 p-6 max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-bold text-white mb-6">
                    {initialData ? t('admin.portfolio.edit') : t('admin.portfolio.add')}
                </h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                    <div className="col-span-1">
                        <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">{t('admin.portfolio.form.title_en')}</label>
                        <input
                            type="text" required
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>
                    <div className="col-span-1">
                        <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">{t('admin.portfolio.form.title_ar')}</label>
                        <input
                            type="text" required
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
                            value={formData.titleAr}
                            onChange={(e) => setFormData({ ...formData, titleAr: e.target.value })}
                        />
                    </div>
                     <div className="col-span-2">
                        <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">{t('admin.portfolio.form.desc_en')}</label>
                        <textarea
                            required
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white h-24"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>
                    <div className="col-span-2">
                        <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">{t('admin.portfolio.form.desc_ar')}</label>
                        <textarea
                            required
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white h-24"
                            value={formData.descriptionAr}
                            onChange={(e) => setFormData({ ...formData, descriptionAr: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">{t('admin.portfolio.form.client_en')}</label>
                        <input
                            type="text"
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
                            value={formData.client}
                            onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">{t('admin.portfolio.form.client_ar')}</label>
                        <input
                            type="text"
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
                            value={formData.clientAr}
                            onChange={(e) => setFormData({ ...formData, clientAr: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">{t('admin.portfolio.form.date')}</label>
                        <input
                            type="date"
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
                            value={formData.completedAt}
                            onChange={(e) => setFormData({ ...formData, completedAt: e.target.value })}
                        />
                    </div>
                    <div className="flex items-center gap-2 h-full pt-4">
                        <input
                            type="checkbox"
                            checked={formData.isPublished}
                            onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                            className="rounded border-white/10 bg-white/5"
                        />
                        <label className="text-sm text-gray-300">{t('admin.portfolio.form.published')}</label>
                    </div>

                     <div className="col-span-2">
                        <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">{t('admin.portfolio.project_images')}</label>
                        <label className="relative cursor-pointer block mt-2">
                            <input
                                type="file"
                                multiple
                                onChange={uploadFileHandler}
                                className="hidden"
                            />
                            <div className="flex items-center justify-center gap-3 w-full h-32 rounded-lg border-2 border-dashed border-white/20 bg-background-dark hover:border-primary hover:bg-white/5 transition-all">
                                <span className="material-symbols-outlined text-4xl text-primary">add</span>
                                <div className="flex flex-col items-center">
                                    <span className="text-white font-semibold">{t('admin.product.choose_images')}</span>
                                    <span className="text-gray-400 text-sm">{t('admin.product.drag_drop')}</span>
                                </div>
                            </div>
                        </label>
                        {uploading && <p className="text-sm text-yellow-400 mt-2">{t('admin.portfolio.uploading')}</p>}
                        <div className="flex flex-wrap gap-4 mt-4">
                            {formData.images.map((img, index) => (
                                <div key={index} className="relative group">
                                    <Image src={img} alt="Project" width={96} height={96} className="object-cover rounded-lg border border-white/10" />
                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }))}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <span className="material-symbols-outlined text-sm">close</span>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="col-span-2 flex gap-4 pt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-white/10 rounded-lg text-white font-medium hover:bg-white/5"
                        >
                            {t('admin.portfolio.cancel')}
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-primary rounded-lg text-white font-medium hover:bg-primary/90"
                        >
                            {initialData ? t('admin.portfolio.update') : t('admin.portfolio.create')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
