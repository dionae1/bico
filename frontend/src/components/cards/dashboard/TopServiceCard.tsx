interface TopServiceCardProps {
    id: number;
    name: string;
    revenue: number;
    contracts_count: number;
}

function TopServiceCard({ data }: { data: TopServiceCardProps }) {

    return (
        <div className="p-4 rounded-sm w-full md:w-auto flex-1 bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200">
            <p className="font-semibold text-slate-800">{data.name}</p>
            <p className="text-slate-600">Default price of ${data.revenue.toFixed(2)}</p>
            <p className="text-sm text-slate-500 mt-1">Sold on {data.contracts_count} contracts.</p>
        </div>
    );
}

export default TopServiceCard;