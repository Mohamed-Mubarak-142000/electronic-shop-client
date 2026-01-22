'use client';

import { useTranslation } from '@/hooks/useTranslation';

export default function RevenueChart({ data }: { data?: number[] }) {
    const { t } = useTranslation();

    // Basic scaling for SVG path if data exists. Assumes max value for Y scaling.
    const maxVal = data && data.length > 0 ? Math.max(...data) : 100;
    const height = 150; // max chart height (excluding padding) inside 200 viewbox
    const width = 800;
    const stepX = width / 11; // 12 points

    const points = (data || Array(12).fill(0)).map((val, index) => {
        const x = index * stepX;
        const y = 200 - (val / (maxVal || 1)) * height; // Invert Y
        return `${x},${y}`;
    }).join(' ');

    // Simple polyline/path construction. For better curves, we'd use a library or bezier algo, but polyline is fine for now.
    // L commands
    const pathD = points ? `M${points.replace(/ /g, ' L')}` : '';

    return (
        <div className="lg:col-span-2 bg-card-dark rounded-xl border border-white/5 p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-bold text-white">{t('admin.chart.revenue')}</h3>
                    <p className="text-sm text-gray-400">{t('admin.chart.ytd')}</p>
                </div>
                <select className="bg-background-dark border border-white/10 text-white text-sm rounded-lg p-2 focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none">
                    <option>{t('admin.chart.this_year')}</option>
                    <option>{t('admin.chart.last_year')}</option>
                </select>
            </div>
            {/* Line Chart Simulation */}
            <div className="relative h-64 w-full">
                <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 800 200">
                    <defs>
                        <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor="#36e27b" stopOpacity="0.2"></stop>
                            <stop offset="100%" stopColor="#36e27b" stopOpacity="0"></stop>
                        </linearGradient>
                    </defs>
                    {/* Grid Lines */}
                    <line stroke="rgba(255,255,255,0.05)" strokeWidth="1" x1="0" x2="800" y1="0" y2="0"></line>
                    <line stroke="rgba(255,255,255,0.05)" strokeWidth="1" x1="0" x2="800" y1="50" y2="50"></line>
                    <line stroke="rgba(255,255,255,0.05)" strokeWidth="1" x1="0" x2="800" y1="100" y2="100"></line>
                    <line stroke="rgba(255,255,255,0.05)" strokeWidth="1" x1="0" x2="800" y1="150" y2="150"></line>
                    <line stroke="rgba(255,255,255,0.05)" strokeWidth="1" x1="0" x2="800" y1="200" y2="200"></line>
                    {/* The Chart Line using passed data */}
                    {data && <path d={pathD} fill="none" stroke="#36e27b" strokeWidth="3"></path>}
                </svg>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-4 px-2">
                <span>{t('common.months.jan')}</span>
                <span>{t('common.months.feb')}</span>
                <span>{t('common.months.mar')}</span>
                <span>{t('common.months.apr')}</span>
                <span>{t('common.months.may')}</span>
                <span>{t('common.months.jun')}</span>
                <span>{t('common.months.jul')}</span>
                <span>{t('common.months.aug')}</span>
                <span>{t('common.months.sep')}</span>
                <span>{t('common.months.oct')}</span>
                <span>{t('common.months.nov')}</span>
                <span>{t('common.months.dec')}</span>
            </div>
        </div>
    );
}
