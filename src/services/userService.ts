import api from './api';
import { User, PaginationParams, UserPaginatedResponse } from '../types';

export const userService = {
    async getUsers(params: PaginationParams): Promise<UserPaginatedResponse> {
        const response = await api.get('/users', { params });
        return response.data;
    },

    async getUser(id: string): Promise<User> {
        const response = await api.get(`/users/${id}`);
        return response.data;
    },

    async updateUser(id: string, data: Partial<User>): Promise<User> {
        const response = await api.put(`/users/${id}`, data);
        return response.data;
    },

    async deleteUser(id: string): Promise<void> {
        const response = await api.delete(`/users/${id}`);
        return response.data;
    },

    async updateProfile(data: Partial<User> | FormData): Promise<User> {
        const response = await api.put('/users/profile', data);
        return response.data;
    },

    async getProfile() {
        const response = await api.get('/users/profile');
        return response.data;
    },

    async getShowroomInfo() {
        const response = await api.get('/users/showroom');
        return response.data;
    }
};
