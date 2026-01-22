import api from './api';
import { Category, Brand } from '../types';

export const categoryService = {
    async getCategories(): Promise<Category[]> {
        const response = await api.get<Category[]>('/categories');
        return response.data;
    },

    async getCategory(id: string): Promise<Category> {
        const response = await api.get<Category>(`/categories/${id}`);
        return response.data;
    },

    async createCategory(data: Partial<Category>): Promise<Category> {
        const response = await api.post<Category>('/categories', data);
        return response.data;
    },

    async updateCategory(id: string, data: Partial<Category>): Promise<Category> {
        const response = await api.put<Category>(`/categories/${id}`, data);
        return response.data;
    },

    async deleteCategory(id: string): Promise<void> {
        await api.delete(`/categories/${id}`);
    },

    async getCategoryStats() {
        const response = await api.get('/dashboard/categories/stats');

        return response.data;
    }
};

export const brandService = {
    async getBrands(): Promise<Brand[]> {
        const response = await api.get<Brand[]>('/brands');
        return response.data;
    },

    async getBrand(id: string): Promise<Brand> {
        const response = await api.get<Brand>(`/brands/${id}`);
        return response.data;
    },

    async createBrand(data: Partial<Brand>): Promise<Brand> {
        const response = await api.post<Brand>('/brands', data);
        return response.data;
    },

    async updateBrand(id: string, data: Partial<Brand>): Promise<Brand> {
        const response = await api.put<Brand>(`/brands/${id}`, data);
        return response.data;
    },

    async deleteBrand(id: string): Promise<void> {
        await api.delete(`/brands/${id}`);
    },

    async getBrandStats() {
        const response = await api.get('/dashboard/brands/stats');
        return response.data;
    }
};
