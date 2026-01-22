import api from './api';

export const productService = {
    async getProducts(params: Record<string, unknown> = {}) {
        const response = await api.get('/products', { params });
        return response.data;
    },

    async getProduct(id: string) {
        const response = await api.get(`/products/${id}`);
        return response.data;
    },

    async createProduct(data: Record<string, unknown>) {
        const response = await api.post('/products', data);
        return response.data;
    },

    async updateProduct(id: string, data: Record<string, unknown>) {
        const response = await api.put(`/products/${id}`, data);
        return response.data;
    },

    async deleteProduct(id: string) {
        const response = await api.delete(`/products/${id}`);
        return response.data;
    },

    async getProductStats() {
        const response = await api.get('/dashboard/products/stats');
        return response.data;
    }
};
