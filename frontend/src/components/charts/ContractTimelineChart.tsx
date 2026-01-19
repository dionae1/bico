import { useEffect, useState } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import Loading from '../Loading';
import api from '../../api/client';

interface ContractData {
    month: string;
    count: number;
    value_at_risk: number;
    [key: string]: string | number;
}

const ContractTimelineChart = () => {
    const [data, setData] = useState<ContractData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get('/dashboard/contracts-history/');
                setData(response.data);
            } catch (error) {
                console.error("Error fetching contract history");
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
            <h3 className="text-xl font-semibold text-slate-800 mb-4">Contract Timeline</h3>
            <div className="h-32 w-full flex flex-col items-center justify-center text-slate-400">
                <p className="text-lg font-medium">No contract timeline data yet</p>
                <p className="text-sm mt-2">Add contracts to see creation timeline</p>
            </div>
        </div>
    );

    return (
        <div className="bg-white p-6 rounded-sm shadow-sm border border-slate-200">
            <h3 className="text-xl font-semibold text-slate-800 mb-4">Contract Timeline</h3>
            <div className="h-64 w-full">
                <BarChart
                    dataset={data}
                    xAxis={[{ scaleType: 'band', dataKey: 'month' }]}
                    series={[{ dataKey: 'count', label: 'Contracts Created', color: '#3b82f6' }]}
                    height={250}
                    grid={{ horizontal: true }}
                    borderRadius={4}
                />
            </div>
        </div>
    );
};

export default ContractTimelineChart;
