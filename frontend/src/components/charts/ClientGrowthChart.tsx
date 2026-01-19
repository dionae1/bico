import { useEffect, useState } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import Loading from '../Loading';
import api from '../../api/client';

interface ClientData {
    month: string;
    count: number;
    [key: string]: string | number;
}

const ClientGrowthChart = () => {
    const [data, setData] = useState<ClientData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get('/dashboard/clients-history/');
                setData(response.data);
            } catch (error) {
                console.error("Error fetching client history");
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
    if (!data || data.length === 0) return null;

    return (
        <div className="bg-white p-6 rounded-sm shadow-sm border border-slate-200">
            <h3 className="text-xl font-semibold text-slate-800 mb-4">Client Acquisition</h3>
            <div className="h-64 w-full">
                <BarChart
                    dataset={data}
                    xAxis={[{ scaleType: 'band', dataKey: 'month' }]}
                    series={[{ dataKey: 'count', label: 'New Clients', color: '#10b981' }]}
                    height={250}
                    grid={{ horizontal: true }}
                    borderRadius={4}
                />
            </div>
        </div>
    );
};

export default ClientGrowthChart;
