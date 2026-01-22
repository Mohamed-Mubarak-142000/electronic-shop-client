import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { ProfileFormValues } from "./profile-schema";

interface AddressInfoProps {
  form: UseFormReturn<ProfileFormValues>;
  language: string;
}

export function AddressInfo({ form, language }: AddressInfoProps) {
    return (
        <div className="bg-white dark:bg-surface-dark p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-border-dark h-full">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">home</span>
                {language === 'ar' ? 'العنوان' : 'Address'}
            </h2>
            <div className="space-y-5">
                 <FormField
                    control={form.control}
                    name="address.street"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-slate-700 dark:text-slate-300 text-sm font-semibold ml-1">{language === 'ar' ? 'الشارع' : 'Street'}</FormLabel>
                            <FormControl>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 rtl:right-0 rtl:left-auto pl-4 rtl:pr-4 flex items-center pointer-events-none">
                                        <span className="material-symbols-outlined text-gray-400 group-focus-within:text-primary transition-colors">signpost</span>
                                    </div>
                                    <Input 
                                        {...field} 
                                        className="pl-12 rtl:pr-12 rtl:pl-4 rounded-full h-14 bg-white dark:bg-surface-dark border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                                    />
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                     <FormField
                        control={form.control}
                        name="address.city"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-slate-700 dark:text-slate-300 text-sm font-semibold ml-1">{language === 'ar' ? 'المدينة' : 'City'}</FormLabel>
                                <FormControl>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 rtl:right-0 rtl:left-auto pl-4 rtl:pr-4 flex items-center pointer-events-none">
                                            <span className="material-symbols-outlined text-gray-400 group-focus-within:text-primary transition-colors">location_city</span>
                                        </div>
                                        <Input 
                                            {...field} 
                                            className="pl-12 rtl:pr-12 rtl:pl-4 rounded-full h-14 bg-white dark:bg-surface-dark border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                                        />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    
                     <FormField
                        control={form.control}
                        name="address.country"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-slate-700 dark:text-slate-300 text-sm font-semibold ml-1">{language === 'ar' ? 'الدولة' : 'Country'}</FormLabel>
                                <FormControl>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 rtl:right-0 rtl:left-auto pl-4 rtl:pr-4 flex items-center pointer-events-none">
                                            <span className="material-symbols-outlined text-gray-400 group-focus-within:text-primary transition-colors">public</span>
                                        </div>
                                        <Input 
                                            {...field} 
                                            className="pl-12 rtl:pr-12 rtl:pl-4 rounded-full h-14 bg-white dark:bg-surface-dark border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                                        />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </div>
        </div>
    );
}
