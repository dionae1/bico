import { useEffect, useState } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import Loading from '../Loading';
import api from '../../api/client';

interface ServiceData {
    name: string;
    revenue: number;
    cost: number;
    [key: string]: string | number;
}

const ServicePerformanceChart = () => {
    const [data, setData] = useState<ServiceData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get('/dashboard/top-services/?limit=5');
                setData(response.data);
            } catch (error) {
                console.error("Error fetching service data");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return (
        <div className="bg-white p-4 md:p-6 rounded-sm shadow-sm border border-slate-200">
            <Loading size="small" message="Loading chart..." />
        </div>
    );
    if (!data || data.length === 0) return null;

    return (
        <div className="bg-white p-4 md:p-6 rounded-sm shadow-sm border border-slate-200 flex flex-col items-center">
            <h3 className="text-xl font-semibold text-slate-800 mb-2 text-center w-full">Top Services Performance</h3>
            <div className="w-full h-64">
                <BarChart
                    dataset={data}
                    yAxis={[{ scaleType: 'band', dataKey: 'name' }]}
                    series={[
                        { dataKey: 'revenue', label: 'Revenue', color: '#10b981' },
                        { dataKey: 'cost', label: 'Cost', color: '#ef4444' },
                    ]}
                    layout="horizontal"
                    height={250}
                    grid={{ vertical: true }}
                    margin={{ left: 100 }}
                />
            </div>
        </div>
    );
};

export default ServicePerformanceChart;
