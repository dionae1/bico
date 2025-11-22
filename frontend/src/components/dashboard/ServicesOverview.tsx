import TopServiceCard from "../cards/dashboard/TopServiceCard";

interface TopServiceCardProps {
    id: number;
    name: string;
    revenue: number;
    contracts_count: number;
}

interface ServicesOverviewProps {
    data: TopServiceCardProps[];
}

function ServicesOverview({ data }: ServicesOverviewProps) {
    return (
        <div className={`w-full rounded-sm shadow-sm border border-slate-200 p-6 bg-white flex flex-col`}>
            <div>
                <h2 className="text-3xl font-bold text-center mb-6">Top Services</h2>
                <ul className="flex justify-between items-center flex-wrap gap-2 gap-x-4">
                    {data.length === 0 ? (
                        <li className="text-slate-500 text-center w-full">No services available - Try adding some services.</li>
                    ) : (
                        data.map((service) => (
                            <TopServiceCard key={service.id} data={service} />
                        ))
                    )}
                </ul>
            </div>
        </div>
    );
}

export default ServicesOverview;