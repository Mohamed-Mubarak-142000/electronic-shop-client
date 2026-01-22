'use client';

import { AxiosError } from 'axios';
import { useState, useEffect } from 'react';
import { useForm, Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '@/store/useAuthStore';
import { userService } from '@/services/userService';
import { toast } from 'react-hot-toast';
import MapSelector from '@/components/shared/MapSelector';
import { useTranslation } from '@/hooks/useTranslation';
import { profileSchema, ProfileFormValues } from '@/components/profile/profile-schema';
import { BasicInfo } from '@/components/profile/BasicInfo';
import { AddressInfo } from '@/components/profile/AddressInfo';
import { ProfessionalInfo } from '@/components/profile/ProfessionalInfo';
import { AvatarUpload } from '@/components/profile/AvatarUpload';
import { Form } from '@/components/ui/form';

export default function ProfilePage() {
    const { user, login } = useAuthStore();
    const { t, language, dir } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [initialData, setInitialData] = useState<ProfileFormValues | null>(null);

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema) as Resolver<ProfileFormValues>,
        defaultValues: {
            name: '',
            email: '',
            avatar: '',
            phone: '',
            address: {
                street: '',
                city: '',
                state: '',
                country: '',
                zip: ''
            },
            location: {
                lat: 0,
                lng: 0
            },
            jobTitle: '',
            jobTitleAr: '',
            bio: '',
            bioAr: '',
            experience: 0,
            isHiring: false,
            skills: []
        }
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await userService.getProfile();
                const profileData: ProfileFormValues = {
                    name: data.name || '',
                    email: data.email || '',
                    avatar: data.avatar || '',
                    phone: data.phone || '',
                    address: {
                        street: data.address?.street || '',
                        city: data.address?.city || '',
                        state: data.address?.state || '',
                        country: data.address?.country || '',
                        zip: data.address?.zip || ''
                    },
                    location: {
                        lat: data.location?.lat || 0,
                        lng: data.location?.lng || 0
                    },
                    jobTitle: data.jobTitle || '',
                    jobTitleAr: data.jobTitleAr || '',
                    bio: data.bio || '',
                    bioAr: data.bioAr || '',
                    experience: data.experience || 0,
                    isHiring: data.isHiring || false,
                    skills: data.skills || []
                };
                form.reset(profileData);
                setInitialData(profileData);
            } catch (error) {
                console.error('Failed to fetch profile:', error);
            }
        };

        if (user) {
            fetchProfile();
        }
    }, [user, form]);

    const handleSubmit = async (values: ProfileFormValues) => {
        setLoading(true);
        try {
            const updatedUser = await userService.updateProfile(values);
            // Ensure token is preserved if not returned on update
            login({ ...updatedUser, token: updatedUser.token || user?.token || '' });
            toast.success(language === 'ar' ? 'تم تحديث الملف الشخصي بنجاح' : 'Profile updated successfully');
            setInitialData(values);
            form.reset(values); // reset dirty state to current values
        } catch (error: unknown) {
            toast.error((error as AxiosError<{ message: string }>).response?.data?.message || 'Update failed');
        } finally {
            setLoading(false);
        }
    };

    const hasChanges = form.formState.isDirty;

    // Show loading spinner while checking auth or fetching initial data
    if (!user || (!initialData && user)) return (
        <div className="flex flex-col items-center justify-center w-full min-h-screen bg-background-dark">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="flex flex-col items-center w-full bg-background-dark text-white font-display min-h-screen" dir={dir}>
            <div className="w-full px-4 py-8 lg:py-12">
                <div className="mb-8 items-center justify-between gap-6 flex flex-col md:flex-row">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white mb-2">
                            {language === 'ar' ? 'الملف الشخصي' : 'Profile'}
                        </h1>
                        <p className="text-slate-400 text-sm md:text-base">
                            {language === 'ar' ? 'إدارة معلوماتك الشخصية' : 'Manage your personal information'}
                        </p>
                    </div>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-8">
                        {/* Avatar Upload */}
                        <AvatarUpload form={form} language={language} />

                        {/* Top Row: Basic Info & Address */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <BasicInfo form={form} t={t} language={language} />
                            <AddressInfo form={form} language={language} />
                        </div>

                        {/* Professional Info */}
                        {(user.role === 'admin' || user.role === 'business') && (
                             <ProfessionalInfo form={form} language={language} />
                        )}

                        {/* Location Info */}
                        <div className="bg-surface-dark p-6 md:p-8 rounded-2xl shadow-sm border border-border-dark w-full">
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">location_on</span>
                                {language === 'ar' ? 'الموقع الجغرافي' : 'Geographic Location'}
                            </h2>
                            <p className="text-sm text-slate-400 mb-6">{language === 'ar' ? 'ابحث عن عنوانك أو انقر على الخريطة لتحديد موقعك' : 'Search for your address or click on the map to set your location'}</p>
                            
                            <div className="rounded-2xl overflow-hidden border border-gray-700">
                                <MapSelector
                                    value={form.watch('location')}
                                    onChange={(loc) => form.setValue('location', loc, { shouldDirty: true })}
                                />
                            </div>

                            <div className="mt-8">
                                <button
                                    type="submit"
                                    disabled={loading || !hasChanges}
                                    className="w-full py-4 bg-primary hover:bg-green-400 text-background-dark rounded-full font-black text-lg transition-all shadow-lg hover:shadow-[0_0_20px_rgba(54,226,123,0.4)] transform hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none disabled:shadow-none"
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <span className="animate-spin material-symbols-outlined text-xl">progress_activity</span>
                                            {language === 'ar' ? 'جاري الحفظ...' : 'Saving...'}
                                        </span>
                                    ) : (language === 'ar' ? 'حفظ التغييرات' : 'Save Changes')}
                                </button>
                            </div>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
}
