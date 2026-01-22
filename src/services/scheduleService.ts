import api from './api';
import { DiscountSchedule } from '@/types';

export const scheduleService = {
    async getSchedules() {
        const response = await api.get<DiscountSchedule[]>('/schedules');
        return response.data;
    },

    async createSchedule(data: {
        productId: string;
        type: 'percentage' | 'fixed';
        value: number;
        startTime: string;
        endTime: string;
    }) {
        const response = await api.post('/schedules', data);
        return response.data;
    },

    async cancelSchedule(id: string) {
        const response = await api.put(`/schedules/${id}/cancel`);
        return response.data;
    }
};
