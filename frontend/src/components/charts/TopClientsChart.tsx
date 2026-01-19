import { useEffect, useState } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import Loading from '../Loading';
import api from '../../api/client';

interface TopClientData {
    id: number;
    name: string;
    total_spent: number;
    contracts_count: number;
    [key: string]: string | number;
}

const COLORS = ['#10b981', '#34d399', '#6ee7b7', '#a7f3d0', '#d1fae5'];

const TopClientsChart = () => {
    const [data, setData] = useState<TopClientData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get('/dashboard/top-clients/?limit=3');
                // Truncate names if too long
                const processedData = response.data.map((client: TopClientData) => ({
                    ...client,
                    name: client.name.length > 15 ? client.name.slice(0, 15) + '...' : client.name
                }));
                setData(processedData);
            } catch (error) {
                console.error("Error fetching top clients");
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
    
    if (!data || data.length === 0) return (
        <div className="bg-white p-4 md:p-6 rounded-sm shadow-sm border border-slate-200 flex flex-col items-center">
            <h3 className="text-xl font-semibold text-slate-800 mb-2 text-center w-full">Top Clients by Revenue</h3>
            <div className="w-full h-32 flex flex-col items-center justify-center text-slate-400">
                <p className="text-lg font-medium">No client revenue data yet</p>
                <p className="text-sm mt-2">Create contracts to see top clients</p>
            </div>
        </div>
    );

    return (
        <div className="bg-white p-4 md:p-6 rounded-sm shadow-sm border border-slate-200 flex flex-col items-center">
            <h3 className="text-xl font-semibold text-slate-800 mb-2 text-center w-full">Top Clients by Revenue</h3>
            <div className="w-full h-48">
                <BarChart
                    dataset={data}
                    yAxis={[{ scaleType: 'band', dataKey: 'name' }]}
                    series={[{
                        dataKey: 'total_spent',
                        label: 'Total Spent',
                        color: '#10b981',
                    }]}
                    layout="horizontal"
                    height={200}
                    grid={{ vertical: true }}
                    margin={{ left: 100 }}
                />
            </div>
        </div>
    );
};

export default TopClientsChart;
