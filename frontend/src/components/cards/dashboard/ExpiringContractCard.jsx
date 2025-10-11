function ExpiringContractCard({ data }) {

    return (
        <div className="p-4 rounded-lg w-full md:w-auto flex-1 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <p className="font-semibold">{data.client.name}</p>
            <p>{data.service.name}</p>
            <p className="text-sm text-gray-500">Expires on: {new Date(data.end_at).toLocaleDateString()}</p>
        </div>
    );
}

export default ExpiringContractCard;