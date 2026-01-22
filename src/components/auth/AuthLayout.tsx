import React from 'react';
import AuthHeader from './AuthHeader';
import Image from 'next/image';

interface AuthLayoutProps {
    children: React.ReactNode;
    type: 'login' | 'register';
    heading: string;
    subheading: string;
    showVisualOnMobile?: boolean;
    visualHeading?: string;
    visualDescription?: string;
}

export default function AuthLayout({ 
    children, 
    type, 
    heading, 
    subheading, 
    showVisualOnMobile = false,
    visualHeading = "Powering Your Next Big Project",
    visualDescription = "Join thousands of electricians and contractors getting exclusive trade pricing, bulk discounts, and next-day delivery on premium electrical supplies."
}: AuthLayoutProps) {
    return (
        <main className="relative flex min-h-screen w-full flex-col lg:flex-row">
            <AuthHeader type={type} />

            {/* Left Column: Visual */}
            <div className={`${showVisualOnMobile ? 'flex min-h-[300px]' : 'hidden'} lg:flex lg:w-1/2 relative overflow-hidden bg-surface-dark items-center justify-center pt-[72px]`}>

                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <Image alt="Electrical components background" className="object-cover opacity-40 mix-blend-overlay" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBxdlJ5rZ3NmZHDntb8x9I3MDDL9poTTM3QL5U7lUUPHb-Cpbeg3dwehO4Ss4d3nzKXuTR37NZYKoA0ZNSQNrNH7O-b5eyagGba9CwpWgZG499xcbn-ywdR0ZUkGDf8F13zqvQVA3SunWUZW3C4w-OfpI0rSaWa0vCcc3L3Q0s-6xksaacgzc-5CoGBLuyvLVhdCYOHA5s-7yGcGiCqzJY4b7XWVo2Hmm9wkCDzvVd1HgWL9BZ6hs_nZWgrEc3pICaFYa3B7-WYnVo" fill priority sizes="50vw" />
                </div>
                {/* Abstract Glow effects */}
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-[100px] z-0"></div>
                {/* Content Overlay */}
                <div className="relative z-10 max-w-lg px-12 text-center">
                    <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-8 backdrop-blur-sm border border-primary/20">
                        <span className="material-symbols-outlined text-primary text-4xl">bolt</span>
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-6 leading-tight">{visualHeading}</h1>
                    <p className="text-gray-300 text-lg leading-relaxed">{visualDescription}</p>
                    <div className="mt-12 flex gap-4 justify-center">
                        <div className="flex -space-x-3">
                            <Image alt="User 1" className="rounded-full border-2 border-surface-dark" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA_a2eSJu9Phkg0DpMD1KrRqUhEMsX4AdYcvcrAGKqp8CF6gtW3-vIlkGkupBGCSTdZOmeTJF_8qsylhecfQOJKzjKlqsxlLeMfPnLnVmMYjqHdhNvLuLkszJh7XfOAkd4kF8U_hBK6WVRqB-iA7GfjAJdZKTlDLILQKxggsruUgdIoI8HLA9EdySq6viVpZNxoBr0kHpAiFPdqyGGw7opAXog0cjuq39sxRZXxlewfJ4nNOYJwxww62tjAE_3jL9dR4SZt4O-EH9E" width={40} height={40} />
                            <Image alt="User 2" className="rounded-full border-2 border-surface-dark" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAybcPAt-MzG1pgZII4uxuKnM6u9kkMHO7h3TVzAByqVaJnREMF93kIRizopJfbXlZHqwhVJCY-D_qwFXKM4OMBlAalpSlRKxzFzhQ8vlRQOt7_RavDVsaeT6GBnVxCAExKOXTQJNgqF9bsVyuAe2-oHMXmzLEoeGyNWOrSKcdw_8l_amHkgG_HokkE07Ey43fZbCuDyVziY2OmKxhoZbdC-inm8VaYEfYqsBpH1zdP3sadg6HIVyXNrwsmqAn8dAB0Ilo02iJsXv4" width={40} height={40} />
                            <Image alt="User 3" className="rounded-full border-2 border-surface-dark" src="https://lh3.googleusercontent.com/aida-public/AB6AXuASHu64l2tD0lRbligPIQT1q6jawwMtQv9aINFBF3HZPRS0P_DCbvy4EzoJFUaHm8zocT5l5uhs0JhjnVr5ueijWnWNk1ev1yeHX99cM59efcrSOHTbAxN7K9UMuAKK36T8Ov7cg1mLM2jtXIZezpEmZ76WV9Bl2BeB27LFqvRWZBiHp0PKXF5ZU8eZTCOfHeOHnJxjc7Akg7PtF4baG6tau2tAAkmIJjpb7cGyMgKelJW_fE6CrYtrYPKkzRTUDFUhahaipCyStIg" width={40} height={40} />
                            <div className="w-10 h-10 rounded-full border-2 border-surface-dark bg-gray-700 flex items-center justify-center text-xs text-white font-medium">+2k</div>
                        </div>
                        <div className="flex flex-col items-start justify-center">
                            <div className="flex text-yellow-400 text-xs">
                                {[1, 2, 3, 4, 5].map(i => <span key={i} className="material-symbols-outlined text-[16px] filled" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>)}
                            </div>
                            <span className="text-gray-400 text-xs font-medium pl-1">Trusted by pros</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Column: Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-24 bg-background-light dark:bg-background-dark pt-[100px] lg:pt-0">
                <div className="w-full max-w-[480px] flex flex-col gap-8">
                    <div className="text-center lg:text-left">
                        <h1 className="text-gray-900 dark:text-white tracking-tight text-3xl md:text-4xl font-bold leading-tight mb-2">{heading}</h1>
                        <p className="text-gray-500 dark:text-gray-400 text-base font-normal leading-normal">{subheading}</p>
                    </div>

                    {children}
                </div>
            </div>
        </main>
    );
}
