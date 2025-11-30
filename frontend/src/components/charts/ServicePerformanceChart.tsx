import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import api from '../../api/client';

interface ServiceData {
    name: string;
    revenue: number;
    cost: number;
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

    if (loading) return <div className="h-64 flex items-center justify-center text-slate-400">Loading chart...</div>;
    if (!data || data.length === 0) return null;

    return (
        <div className="bg-white p-4 md:p-6 rounded-sm shadow-sm border border-slate-200 flex flex-col items-center">
            <h3 className="text-xl font-semibold text-slate-800 mb-2 text-center w-full">Top Services Performance</h3>
            <div className="w-full h-64 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        layout="vertical"
                        margin={{
                            top: 10,
                            right: 30,
                            left: 40,
                            bottom: 0,
                        }}
                        barGap={2}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                        <XAxis
                            type="number"
                            stroke="#94a3b8"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `$${value}`}
                        />
                        <YAxis
                            dataKey="name"
                            type="category"
                            stroke="#64748b"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            width={100}
                        />
                        <Tooltip
                            cursor={{ fill: '#f8fafc' }}
                            contentStyle={{
                                backgroundColor: '#fff',
                                borderRadius: '8px',
                                border: 'none',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                            }}
                            itemStyle={{ color: '#1e293b', fontSize: '12px', fontWeight: 500 }}
                        />
                        <Legend wrapperStyle={{ paddingTop: '20px' }} />
                        <Bar
                            dataKey="revenue"
                            name="Revenue"
                            fill="#10b981"
                            radius={[0, 4, 4, 0]}
                            maxBarSize={20}
                        />
                        <Bar
                            dataKey="cost"
                            name="Cost"
                            fill="#ef4444"
                            radius={[0, 4, 4, 0]}
                            maxBarSize={20}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default ServicePerformanceChart;
