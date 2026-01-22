import api from './api';
import { useAuthStore } from '../store/useAuthStore';

export const authService = {
    async login(data: Record<string, unknown>) {
        const response = await api.post('/auth/login', data);
        if (response.data) {
            useAuthStore.getState().login(response.data);
        }
        return response.data;
    },

    async register(data: Record<string, unknown>) {
        const response = await api.post('/auth/register', data);
        return response.data;
    },

    async registerBusiness(data: Record<string, unknown>) {
        const response = await api.post('/auth/register-business', data);
        return response.data;
    },

    async verifyOTP(data: { email: string, otp: string }) {
        const response = await api.post('/auth/verify-otp', data);
        if (response.data.token) {
            useAuthStore.getState().login(response.data);
        }
        return response.data;
    },

    async forgotPassword(email: string) {
        const response = await api.post('/auth/forgot-password', { email });
        return response.data;
    },

    async resetPassword(token: string, data: Record<string, unknown>) {
        const response = await api.put(`/auth/reset-password/${token}`, data);
        return response.data;
    },

    logout() {
        useAuthStore.getState().logout();
    }
};
