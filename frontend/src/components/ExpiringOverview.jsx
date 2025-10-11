import ExpiringContractCard from "./cards/dashboard/ExpiringContractCard";

function ExpiringOverview({ data }) {
    return (
        <div className={`w-full rounded-lg shadow-lg p-6 bg-white flex flex-col`}>
            <div>
                <h2 className="text-3xl font-bold text-center mb-6">Expiring Soon</h2>
                <ul className="flex justify-between items-center flex-wrap gap-2 gap-x-4">
                    {data.length === 0 ? (
                        <li className="text-gray-500">No contracts about to expire.</li>
                    ) : (
                        data.map((contract) => (
                            <ExpiringContractCard key={contract.id} data={contract} />
                        ))
                    )}
                </ul>
            </div>
        </div>
    );
}

export default ExpiringOverview;