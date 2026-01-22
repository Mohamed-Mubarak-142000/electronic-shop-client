import api from './api';
import { Order, PaginationParams, OrderPaginatedResponse } from '../types';

export const orderService = {
    async createOrder(data: Record<string, unknown>): Promise<Order> {
        const response = await api.post('/orders', data);
        return response.data;
    },

    async getOrderById(id: string): Promise<Order> {
        const response = await api.get(`/orders/${id}`);
        return response.data;
    },

    async getMyOrders(): Promise<Order[]> {
        const response = await api.get('/orders/myorders');
        return response.data;
    },

    async getOrders(params: PaginationParams): Promise<OrderPaginatedResponse> {
        const response = await api.get('/orders', { params });
        return response.data;
    },

    async updateOrderToPaid(id: string, data: object): Promise<Order> {
        const response = await api.put(`/orders/${id}/pay`, data);
        return response.data;
    },

    async updateOrderToDelivered(id: string): Promise<Order> {
        const response = await api.put(`/orders/${id}/deliver`);
        return response.data;
    },

    async updateOrderStatus(id: string, status: string): Promise<Order> {
        const response = await api.put(`/orders/${id}/status`, { status });
        return response.data;
    }
};
