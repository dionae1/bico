function TopServiceCard({ data }) {

    return (
        <div className="p-4 rounded-lg w-full md:w-auto flex-1 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <p className="font-semibold">{data.name}</p>
            <p>Default price of ${data.revenue.toFixed(2)}</p>
            <p>Sold on {data.contracts_count} contracts.</p>
        </div>
    );
}

export default TopServiceCard;