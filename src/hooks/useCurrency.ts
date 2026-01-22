import { useConfigStore } from '@/store/useConfigStore';

export const useCurrency = () => {
    const { configs } = useConfigStore();
    const currencyCode = configs.currency || 'USD';

    const getSymbol = () => {
        switch(currencyCode) {
            case 'USD': return '$';
            case 'EGP': return 'جنيه ';
            case 'AED': return 'AED ';
            default: return currencyCode + ' ';
        }
    };

    const formatPrice = (price: number | undefined | null) => {
        const symbol = getSymbol();
        const numPrice = Number(price) || 0;
        return `${symbol}${numPrice.toFixed(2)}`;
    };

    return { 
        currencyCode, 
        symbol: getSymbol(), 
        formatPrice 
    };
};
