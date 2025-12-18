import { useEffect, useState } from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import api from '../../api/client';

interface RevenueData {
    month: string;
    revenue: number;
    cost: number;
    profit: number;
    [key: string]: string | number;
}

const RevenueChart = () => {
    const [data, setData] = useState<RevenueData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get('/dashboard/revenue-history/');
                setData(response.data);
            } catch (error) {
                console.error("Error fetching revenue history");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="h-64 flex items-center justify-center text-slate-400">Loading chart...</div>;
    if (!data || data.length === 0) return null;

    return (
        <div className="bg-white p-6 rounded-sm shadow-sm border border-slate-200">
            <h3 className="text-xl font-semibold text-slate-800 mb-4">Revenue History</h3>
            <div className="h-64 w-full">
                <LineChart
                    dataset={data}
                    xAxis={[{ scaleType: 'point', dataKey: 'month' }]}
                    series={[
                        { dataKey: 'revenue', label: 'Revenue', color: '#10b981', area: true, showMark: false },
                        { dataKey: 'cost', label: 'Cost', color: '#ef4444', area: true, showMark: false },
                        // { dataKey: 'profit', label: 'Profit', color: '#3b82f6', area: true, showMark: false },
                    ]}
                    height={250}
                    grid={{ horizontal: true }}
                    sx={{
                        '.MuiAreaElement-root': {
                            fillOpacity: 0.3,
                        },
                    }}
                />
            </div>
        </div>
    );
};

export default RevenueChart;
