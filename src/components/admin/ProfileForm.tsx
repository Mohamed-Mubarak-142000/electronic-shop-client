'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { userService } from '@/services/userService';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import MapSelector from '../shared/MapSelector';

const profileSchema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    jobTitle: z.string().optional(),
    experience: z.number().optional(),
    email: z.string().email('Invalid email address'),
    phone: z.string().optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    country: z.string().optional(),
    zipCode: z.string().optional(),
    location: z.object({
        lat: z.number(),
        lng: z.number()
    }).optional() // Making location optional to start with potentially empty
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfileForm() {
    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            location: { lat: 30.0444, lng: 31.2357 } // Default to Cairo
        }
    });

    const { data: userProfile, isLoading } = useQuery({
        queryKey: ['userProfile'],
        queryFn: userService.getProfile
    });

    useEffect(() => {
        if (userProfile) {
            // Map flat user object to form structure if needed. 
            // Assuming userProfile has fields matching schema or similar.
            // Adjusting based on standard user object often having 'name' instead of first/last.
            // If backend provides name, I might need to split it or use name field.
            // For this implementation, I'll assume backend supports these fields or I'll map them.
            // "edit all personal data" was requested.
            
            // If userProfile.name exists, split it for first/last if needed or just use what's available.
            // Let's assume the backend was updated or supports these fields. 
            // If not, I'll map 'name' to 'firstName' and leave 'lastName' empty or similar.
            
            const [first, ...rest] = (userProfile.name || '').split(' ');
            const last = rest.join(' ');

            reset({
                firstName: userProfile.firstName || first || '',
                lastName: userProfile.lastName || last || '',
                jobTitle: userProfile.jobTitle || '',
                experience: userProfile.experience ? Number(userProfile.experience) : 0,
                email: userProfile.email || '',
                phone: userProfile.phone || '',
                address: userProfile.address?.street || '',
                city: userProfile.address?.city || '',
                country: userProfile.address?.country || '',
                zipCode: userProfile.address?.zip || '',
                location: userProfile.location || { lat: 30.0444, lng: 31.2357 }
            });
        }
    }, [userProfile, reset]);

    const mutation = useMutation({
        mutationFn: async (values: ProfileFormData) => {
             // Combine first/last back to name if backend expects 'name'
             const dataToSend = {
                 name: `${values.firstName} ${values.lastName}`.trim(),
                 email: values.email,
                 phone: values.phone,
                 jobTitle: values.jobTitle,
                 experience: values.experience,
                 location: values.location,
                 address: {
                     street: values.address,
                     city: values.city,
                     country: values.country,
                     zip: values.zipCode
                 }
             };
             return await userService.updateProfile(dataToSend);
        },
        onSuccess: () => {
            toast.success('Profile updated successfully');
        },
        onError: (err: Error & { response?: { data?: { message?: string } } }) => {
            toast.error(err.response?.data?.message || 'Failed to update profile');
        }
    });

    const onSubmit = (values: ProfileFormData) => {
        mutation.mutate(values);
    };

    if (isLoading) {
        return <div className="p-8 text-center text-white">Loading profile...</div>;
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            {/* Tabs */}
            <div className="px-4">
                <div className="flex border-b border-white/10 gap-8 overflow-x-auto">
                    <button type="button" className="flex flex-col items-center justify-center border-b-[3px] border-primary text-white pb-3 pt-2 min-w-max px-2">
                        <p className="text-sm font-bold tracking-[0.015em]">General Info</p>
                    </button>
                    {/* Other tabs can be added here or kept as visual placeholders */}
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-4 pt-6">
                {/* Left Column: Avatar & Quick Status */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                    <div className="bg-surface-dark rounded-xl p-6 border border-white/10 flex flex-col items-center text-center gap-4">
                        <div className="relative group cursor-pointer">
                            <div
                                className="bg-center bg-no-repeat bg-cover rounded-full h-32 w-32 border-4 border-white/10 group-hover:opacity-75 transition-opacity"
                                style={{ backgroundImage: `url("${userProfile?.avatar || 'https://lh3.googleusercontent.com/aida-public/AB6AXuC6Zlu2-4pLAUk_AjGaIqvcrn5kp2F0CNlwZ639jwYUQk1HJpyjM-XMkHKnsi5TmbwYbTiIxCw-_0eCY_qpMjJdOWGeES1HCzMB_a4LmrAr7lZFcyCOCLrAosuznXarnRvoU-zGeDNvSMDwl1ybqsNUoKkKwbJdUnuWo5Ydxs5QaAYJLwYriJ7RPt3ZIUvm3ud65Quar0UdSHJByPmgBUlfC0HPdimTQF8-jsBxMAt96HdcFYbzVDX7azHDpu4Y9Be7yp5wz_vVq5Q'}")` }}
                            ></div>
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="material-symbols-outlined text-white text-3xl drop-shadow-lg">photo_camera</span>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-white text-xl font-bold">{userProfile?.name || 'User'}</h3>
                            <p className="text-gray-400 text-sm">{userProfile?.role || 'Member'}</p>
                        </div>
                    </div>
                </div>

                {/* Right Column: Form Fields */}
                <div className="lg:col-span-8 flex flex-col gap-8">
                    {/* Personal Details Section */}
                    <div className="flex flex-col gap-5">
                        <h3 className="text-white text-lg font-bold border-b border-white/10 pb-2">Personal Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="flex flex-col gap-2">
                                <label className="text-white text-sm font-medium">First Name</label>
                                <input {...register('firstName')} className="w-full bg-surface-dark border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all" placeholder="e.g. Alex" type="text" />
                                {errors.firstName && <p className="text-red-500 text-xs">{errors.firstName.message}</p>}
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-white text-sm font-medium">Last Name</label>
                                <input {...register('lastName')} className="w-full bg-surface-dark border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all" placeholder="e.g. Watts" type="text" />
                                {errors.lastName && <p className="text-red-500 text-xs">{errors.lastName.message}</p>}
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="flex flex-col gap-2">
                                <label className="text-white text-sm font-medium">Job Title</label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-400 text-[20px]">badge</span>
                                    <input {...register('jobTitle')} className="w-full bg-surface-dark border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all" placeholder="e.g. Senior Technician" type="text" />
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-white text-sm font-medium">Experience (Years)</label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-400 text-[20px]">history</span>
                                    <input {...register('experience', { valueAsNumber: true })} className="w-full bg-surface-dark border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all" placeholder="e.g. 5" type="number" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Info Section */}
                    <div className="flex flex-col gap-5">
                        <h3 className="text-white text-lg font-bold border-b border-white/10 pb-2">Contact Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="flex flex-col gap-2">
                                <label className="text-white text-sm font-medium">Email Address</label>
                                <input {...register('email')} className="w-full bg-surface-dark border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all" placeholder="name@example.com" type="email" />
                                {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-white text-sm font-medium">Phone Number</label>
                                <input {...register('phone')} className="w-full bg-surface-dark border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all" placeholder="+1 (555) 000-0000" type="tel" />
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-white text-sm font-medium">Address</label>
                            <input {...register('address')} className="w-full bg-surface-dark border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all" placeholder="Street address" type="text" />
                        </div>
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            <div className="flex flex-col gap-2">
                                <label className="text-white text-sm font-medium">City</label>
                                <input {...register('city')} className="w-full bg-surface-dark border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all" placeholder="City" type="text" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-white text-sm font-medium">Country</label>
                                <input {...register('country')} className="w-full bg-surface-dark border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all" placeholder="Country" type="text" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-white text-sm font-medium">Zip Code</label>
                                <input {...register('zipCode')} className="w-full bg-surface-dark border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all" placeholder="Zip Code" type="text" />
                            </div>
                        </div>
                    </div>
                
                    {/* Location Section */}
                    <div className="flex flex-col gap-5">
                        <h3 className="text-white text-lg font-bold border-b border-white/10 pb-2">Location</h3>
                        <p className="text-gray-400 text-sm">Pin your location on the map to help customers find you.</p>
                        <Controller
                            control={control}
                            name="location"
                            render={({ field }) => (
                                <MapSelector
                                    value={field.value || { lat: 30.0444, lng: 31.2357 }} // Default Cairo if undefined
                                    onChange={(val) => field.onChange(val)}
                                />
                            )}
                        />
                    </div>
                </div>

                {/* Save Button */}
                <div className="lg:col-span-12 flex justify-end gap-3 mt-4">
                     <button type="button" onClick={() => reset()} className="flex items-center justify-center rounded-lg h-10 px-6 border border-white/10 bg-transparent text-white hover:bg-white/10 transition-colors font-bold text-sm">
                        Reset
                    </button>
                    <button type="submit" disabled={isSubmitting} className="flex items-center justify-center rounded-lg h-10 px-6 bg-primary text-black hover:bg-green-400 transition-colors font-bold text-sm shadow-[0_0_15px_rgba(54,226,123,0.3)] disabled:opacity-70">
                        {isSubmitting ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </form>
    );
}
