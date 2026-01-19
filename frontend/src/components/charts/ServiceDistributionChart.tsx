import { useEffect, useState } from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import Loading from '../Loading';
import api from '../../api/client';

interface ServiceData {
    name: string;
    contracts_count: number;
    popularity_percentage: number;
    [key: string]: string | number;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const ServiceDistributionChart = () => {
    const [data, setData] = useState<ServiceData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get('/dashboard/top-services/?limit=5');
                setData(response.data);
            } catch (error) {
                console.error("Error fetching service distribution");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return (
        <div className="bg-white p-6 rounded-sm shadow-sm border border-slate-200">
            <Loading size="small" message="Loading chart..." />
        </div>
    );
    
    if (!data || data.length === 0) return (
        <div className="bg-white p-6 rounded-sm shadow-sm border border-slate-200">
            <h3 className="text-xl font-semibold text-slate-800 mb-4">Service Popularity Distribution</h3>
            <div className="h-64 w-full flex flex-col items-center justify-center text-slate-400">
                <p className="text-lg font-medium">No service distribution data yet</p>
                <p className="text-sm mt-2">Add contracts to see service popularity</p>
            </div>
        </div>
    );

    return (
        <div className="bg-white p-6 rounded-sm shadow-sm border border-slate-200">
            <h3 className="text-xl font-semibold text-slate-800 mb-4">Service Popularity Distribution</h3>
            <div className="h-64 w-full flex justify-center">
                <PieChart
                    series={[
                        {
                            data: data.map((item, index) => ({
                                id: index,
                                value: item.contracts_count,
                                label: item.name,
                                color: COLORS[index % COLORS.length],
                            })),
                            innerRadius: 60,
                            outerRadius: 100,
                            paddingAngle: 5,
                            cornerRadius: 5,
                            highlightScope: { fade: 'global', highlight: 'item' },
                            faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                        },
                    ]}
                    height={250}
                />
            </div>
        </div>
    );
};

export default ServiceDistributionChart;
