import api from './api';
import { Order, Product } from '../types';

export interface DashboardStats {
    totalProducts: number;
    totalOrders: number;
    totalUsers: number;
    totalCategories: number;
    totalBrands: number;
    totalRevenue: number;
    lowStockCount: number;
    trends: {
        revenue: number;
        orders: number;
        users: number;
    };
    revenueGraphData: number[];
    recentOrders: Order[];
    lowStockProducts: Product[];
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
    const { data } = await api.get('/dashboard/stats');
    return data;
};

const dashboardService = {
    getDashboardStats,
};

export default dashboardService;
