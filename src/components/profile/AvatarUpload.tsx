'use client';

import { useState, useRef } from 'react';
import { uploadService } from '@/services/uploadService';
import { toast } from 'react-hot-toast';
import { UseFormReturn } from 'react-hook-form';
import { ProfileFormValues } from './profile-schema';

interface AvatarUploadProps {
    form: UseFormReturn<ProfileFormValues>;
    language: string;
}

export function AvatarUpload({ form, language }: AvatarUploadProps) {
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const currentAvatar = form.watch('avatar');

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error(language === 'ar' ? 'يرجى اختيار صورة صحيحة' : 'Please select a valid image');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error(language === 'ar' ? 'حجم الصورة يجب أن يكون أقل من 5 ميجابايت' : 'Image size must be less than 5MB');
            return;
        }

        setUploading(true);
        try {
            const result = await uploadService.uploadImage(file);
            form.setValue('avatar', result.path, { shouldDirty: true });
            toast.success(language === 'ar' ? 'تم رفع الصورة بنجاح' : 'Image uploaded successfully');
        } catch (error) {
            console.error('Upload error:', error);
            toast.error(language === 'ar' ? 'فشل رفع الصورة' : 'Failed to upload image');
        } finally {
            setUploading(false);
        }
    };

    const handleRemoveAvatar = () => {
        form.setValue('avatar', '', { shouldDirty: true });
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="bg-white dark:bg-surface-dark p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-border-dark">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">account_circle</span>
                {language === 'ar' ? 'الصورة الشخصية' : 'Profile Picture'}
            </h2>
            
            <div className="flex flex-col items-center gap-4">
                {/* Avatar Display */}
                <div className="relative group">
                    <div 
                        className="w-32 h-32 rounded-full border-4 border-slate-200 dark:border-gray-700 overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center"
                    >
                        {currentAvatar ? (
                            <img 
                                src={currentAvatar} 
                                alt="Avatar" 
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <span className="material-symbols-outlined text-primary text-6xl">person</span>
                        )}
                    </div>
                    
                    {uploading && (
                        <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center">
                            <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    )}
                </div>

                {/* Upload Buttons */}
                <div className="flex gap-3 flex-wrap justify-center">
                    <label className="cursor-pointer">
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                            disabled={uploading}
                        />
                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-green-400 text-background-dark rounded-full font-semibold text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-50">
                            <span className="material-symbols-outlined text-lg">upload</span>
                            {language === 'ar' ? 'رفع صورة' : 'Upload Image'}
                        </span>
                    </label>

                    {currentAvatar && (
                        <button
                            type="button"
                            onClick={handleRemoveAvatar}
                            disabled={uploading}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-full font-semibold text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-50"
                        >
                            <span className="material-symbols-outlined text-lg">delete</span>
                            {language === 'ar' ? 'حذف الصورة' : 'Remove'}
                        </button>
                    )}
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
                    {language === 'ar' 
                        ? 'JPG, PNG أو GIF (حد أقصى 5 ميجابايت)'
                        : 'JPG, PNG or GIF (Max 5MB)'
                    }
                </p>
            </div>
        </div>
    );
}
