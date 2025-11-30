import { FaEdit } from "react-icons/fa";
import { FaDeleteLeft } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

import { Contract } from "@/types/Contract";

interface ContractCardProps {
    contract: Contract;
    onDelete: (contract: Contract) => void;
    onHighlight: (contract: Contract) => void;
}

function ContractCard({ contract, onDelete, onHighlight }: ContractCardProps) {
    const navigate = useNavigate();

    return (
        <tr className="hover:bg-slate-50 transition-colors">
            <td className="px-6 py-4 text-slate-800 font-medium">
                <button
                    onClick={() => onHighlight(contract)}
                    className="hover:text-emerald-600 hover:underline text-left"
                >
                    {contract.client?.name}
                </button>
            </td>
            <td className="px-6 py-4 text-slate-600">{contract.service?.name}</td>
            <td className="px-6 py-4 text-slate-600">{new Date(contract.end_at).toLocaleDateString()}</td>
            <td className="px-6 py-4 text-slate-600 font-medium">U$ {contract.value.toFixed(2)}</td>
            <td className="px-6 py-4 text-right">
                <div className="flex justify-end gap-2">
                    <button
                        className="text-slate-600 hover:text-emerald-600 p-2 rounded-full hover:bg-emerald-50 transition-colors"
                        onClick={() => navigate(`/contracts/view/${contract.id}`)}
                        title="Edit/View"
                    >
                        <FaEdit size={18} />
                    </button>
                    <button
                        className="text-slate-600 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors"
                        onClick={() => onDelete(contract)}
                        title="Delete"
                    >
                        <FaDeleteLeft size={18} />
                    </button>
                </div>
            </td>
        </tr>
    );
}

export default ContractCard;