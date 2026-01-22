import api from './api';
import { Portfolio, PortfolioOwnerResponse } from '../types';

export const portfolioService = {
    async getPortfolios(): Promise<Portfolio[]> {
        const response = await api.get<Portfolio[]>('/portfolio');
        return response.data;
    },

    async getPortfolioById(id: string): Promise<Portfolio> {
        const response = await api.get<Portfolio>(`/portfolio/${id}`);
        return response.data;
    },

    async createPortfolio(data: Partial<Portfolio>): Promise<Portfolio> {
        const response = await api.post<Portfolio>('/portfolio', data);
        return response.data;
    },

    async updatePortfolio(id: string, data: Partial<Portfolio>): Promise<Portfolio> {
        const response = await api.put<Portfolio>(`/portfolio/${id}`, data);
        return response.data;
    },

    async deletePortfolio(id: string): Promise<void> {
        await api.delete(`/portfolio/${id}`);
    },

    async getOwnerPortfolio(): Promise<PortfolioOwnerResponse> {
        const response = await api.get<PortfolioOwnerResponse>('/portfolio/owner');
        return response.data;
    }
};
