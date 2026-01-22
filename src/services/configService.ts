import api from './api';
import { Config } from '../types';

export const configService = {
    async getConfigs(): Promise<Config> {
        const response = await api.get('/config');
        return response.data;
    },

    async updateConfigs(data: Partial<Config>): Promise<Config> {
        const response = await api.post('/config', data);
        return response.data;
    }
};
