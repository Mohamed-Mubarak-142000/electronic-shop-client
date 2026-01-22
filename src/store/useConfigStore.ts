import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { configService } from '@/services/configService';
import { Config } from '@/types';

interface ConfigState {
    configs: Config;
    isLoading: boolean;
    fetchConfigs: () => Promise<void>;
    updateConfigs: (data: Partial<Config>) => Promise<void>;
}

export const useConfigStore = create<ConfigState>()(
    persist(
        (set) => ({
            configs: {
                language: 'en',
                currency: 'USD',
                vodafoneCashNumber: '',
                instapayNumber: '',
                creditCardNumber: '',
                taxiAmount: 0,
                minProductImages: 2,
                maxProductImages: 4
            },
            isLoading: false,
            fetchConfigs: async () => {
                set({ isLoading: true });
                try {
                    const data = await configService.getConfigs();
                    set({ configs: data, isLoading: false });
                } catch (error) {
                    console.error('Failed to fetch configs', error);
                    set({ isLoading: false });
                }
            },
            updateConfigs: async (data: Partial<Config>) => {
                set({ isLoading: true });
                try {
                    const newConfigs = await configService.updateConfigs(data);
                    set({ configs: newConfigs, isLoading: false });
                } catch (error) {
                    set({ isLoading: false });
                    throw error;
                }
            }
        }),
        {
            name: 'app-config-storage',
            partialize: (state) => ({ configs: state.configs }), // Only persist configs
        }
    )
);
