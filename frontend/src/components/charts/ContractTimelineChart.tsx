import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import api from '../../api/client';

interface ContractData {
    month: string;
    count: number;
    value_at_risk: number;
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
                console.error("Error fetching contract history:", error);
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
            <h3 className="text-xl font-semibold text-slate-800 mb-4">Contract Timeline</h3>
            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        margin={{
                            top: 10,
                            right: 30,
                            left: 0,
                            bottom: 0,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                        <XAxis
                            dataKey="month"
                            stroke="#64748b"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="#64748b"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            allowDecimals={false}
                        />
                        <Tooltip
                            cursor={{ fill: '#f1f5f9' }}
                            contentStyle={{
                                backgroundColor: '#fff',
                                borderRadius: '4px',
                                border: '1px solid #e2e8f0',
                                boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
                            }}
                        />
                        <Legend />
                        <Bar
                            dataKey="count"
                            name="Contracts Created"
                            fill="#3b82f6"
                            radius={[4, 4, 0, 0]}
                            maxBarSize={50}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default ContractTimelineChart;
