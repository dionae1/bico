import { Contract } from "@/types/Contract";

function ExpiringContractCard({ data }: { data: Contract }) {
    return (
        <div className="p-4 min-h-32 rounded-sm w-full md:w-auto flex-1 bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200">
            <p className="font-semibold text-slate-800">{data.client.name}</p>
            <p className="text-slate-600">{data.service.name}</p>
            <p className="text-sm text-slate-400 mt-2">Expires on: {new Date(data.end_at).toLocaleDateString()}</p>
        </div>
    );
}

export default ExpiringContractCard;