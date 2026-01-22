import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Language = 'en' | 'ar';

interface LanguageState {
    language: Language;
    setLanguage: (lang: Language) => void;
    dir: 'ltr' | 'rtl';
}

export const useLanguageStore = create<LanguageState>()(
    persist(
        (set) => ({
            language: 'en',
            dir: 'ltr',
            setLanguage: (language) => set({
                language,
                dir: language === 'ar' ? 'rtl' : 'ltr'
            }),
        }),
        {
            name: 'language-storage',
        }
    )
);
