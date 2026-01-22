import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { ProfileFormValues } from "./profile-schema";

interface ProfessionalInfoProps {
  form: UseFormReturn<ProfileFormValues>;
  language: string;
}

export function ProfessionalInfo({ form, language }: ProfessionalInfoProps) {
    return (
        <div className="bg-white dark:bg-surface-dark p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-border-dark w-full">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">work</span>
                {language === 'ar' ? 'معلومات مهنية' : 'Professional Info'}
            </h2>
            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="jobTitle"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-slate-700 dark:text-slate-300 text-sm font-semibold ml-1">{language === 'ar' ? 'المسمى الوظيفي (EN)' : 'Job Title (EN)'}</FormLabel>
                                <FormControl>
                                    <Input {...field} className="rounded-full h-12 px-4 shadow-sm" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="jobTitleAr"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-slate-700 dark:text-slate-300 text-sm font-semibold ml-1">{language === 'ar' ? 'المسمى الوظيفي (AR)' : 'Job Title (AR)'}</FormLabel>
                                <FormControl>
                                    <Input {...field} className="rounded-full h-12 px-4 shadow-sm text-right" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <FormField
                        control={form.control}
                        name="experience"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-slate-700 dark:text-slate-300 text-sm font-semibold ml-1">{language === 'ar' ? 'سنوات الخبرة' : 'Experience Years'}</FormLabel>
                                <FormControl>
                                    <Input 
                                        type="number" 
                                        {...field}
                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                        className="rounded-full h-12 px-4 shadow-sm" 
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                     <FormField
                        control={form.control}
                        name="isHiring"
                        render={({ field }) => (
                            <FormItem className="flex items-center gap-3 pt-8 px-2 space-y-0">
                                <FormControl>
                                    <div className="relative flex items-center">
                                         <input
                                            type="checkbox"
                                            checked={field.value}
                                            onChange={field.onChange}
                                            className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-surface-dark checked:bg-primary checked:border-primary focus:ring-primary/20 transition-all"
                                        />
                                         <span className="absolute text-background-dark opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                                            <span className="material-symbols-outlined" style={{ fontSize: "16px", fontWeight: "bold" }}>check</span>
                                        </span>
                                    </div>
                                </FormControl>
                                <FormLabel className="text-sm font-semibold cursor-pointer text-slate-700 dark:text-white m-0">
                                    {language === 'ar' ? 'متاح للتوظيف' : 'Available for Hire'}
                                </FormLabel>
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <FormField
                        control={form.control}
                        name="bio"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-slate-700 dark:text-slate-300 text-sm font-semibold ml-1">{language === 'ar' ? 'نبذة (EN)' : 'Bio (EN)'}</FormLabel>
                                <FormControl>
                                    <textarea
                                        {...field}
                                        className="w-full rounded-2xl bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white h-24 p-4 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="bioAr"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-slate-700 dark:text-slate-300 text-sm font-semibold ml-1">{language === 'ar' ? 'نبذة (AR)' : 'Bio (AR)'}</FormLabel>
                                <FormControl>
                                    <textarea
                                        {...field}
                                        className="w-full rounded-2xl bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white h-24 p-4 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm text-right"
                                    />
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
