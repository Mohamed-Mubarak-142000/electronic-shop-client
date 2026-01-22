import { useLanguageStore } from '../store/useLanguageStore';
import { en, ar } from '../locales/translations';

export const useTranslation = () => {
    const { language } = useLanguageStore();
    const translations = language === 'ar' ? ar : en;

    const t = (key: keyof typeof en, params?: Record<string, string | number>) => {
        let text = translations[key] || en[key] || key;

        if (params) {
            Object.entries(params).forEach(([k, v]) => {
                text = text.replace(`{${k}}`, String(v));
            });
        }

        return text;
    };

    return { t, language, dir: language === 'ar' ? 'rtl' : 'ltr' };
};
