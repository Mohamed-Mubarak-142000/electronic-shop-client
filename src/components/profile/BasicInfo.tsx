import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { ProfileFormValues } from "./profile-schema";
import { en } from "@/locales/translations";

interface BasicInfoProps {
  form: UseFormReturn<ProfileFormValues>;
  t: (key: keyof typeof en) => string;
  language: string;
}

export function BasicInfo({ form, t, language }: BasicInfoProps) {
    return (
        <div className="bg-white dark:bg-surface-dark p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-border-dark h-full">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">person</span>
                {language === 'ar' ? 'المعلومات الأساسية' : 'Basic Info'}
            </h2>
            <div className="space-y-5">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-slate-700 dark:text-slate-300 text-sm font-semibold ml-1">{t('auth.name')}</FormLabel>
                            <FormControl>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 rtl:right-0 rtl:left-auto pl-4 rtl:pr-4 flex items-center pointer-events-none">
                                        <span className="material-symbols-outlined text-gray-400 group-focus-within:text-primary transition-colors">person</span>
                                    </div>
                                    <Input 
                                        {...field} 
                                        className="pl-12 rtl:pr-12 rtl:pl-4 rounded-full h-14 bg-white dark:bg-surface-dark border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 shadow-sm" 
                                    />
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-slate-700 dark:text-slate-300 text-sm font-semibold ml-1">{t('auth.email')}</FormLabel>
                            <FormControl>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 rtl:right-0 rtl:left-auto pl-4 rtl:pr-4 flex items-center pointer-events-none">
                                        <span className="material-symbols-outlined text-gray-400 transition-colors">mail</span>
                                    </div>
                                    <Input 
                                        {...field} 
                                        disabled 
                                        className="pl-12 rtl:pr-12 rtl:pl-4 rounded-full h-14 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed" 
                                    />
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                 <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-slate-700 dark:text-slate-300 text-sm font-semibold ml-1">{language === 'ar' ? 'رقم الهاتف' : 'Phone Number'}</FormLabel>
                            <FormControl>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 rtl:right-0 rtl:left-auto pl-4 rtl:pr-4 flex items-center pointer-events-none">
                                        <span className="material-symbols-outlined text-gray-400 group-focus-within:text-primary transition-colors">phone</span>
                                    </div>
                                    <Input 
                                        {...field} 
                                        className="pl-12 rtl:pr-12 rtl:pl-4 rounded-full h-14 bg-white dark:bg-surface-dark border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 shadow-sm" 
                                    />
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        </div>
    );
}
