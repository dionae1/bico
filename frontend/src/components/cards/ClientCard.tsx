import { FaEdit } from "react-icons/fa";
import { FaDeleteLeft } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

import { formatPhoneNumber } from "../../services/util";
import { Client } from "@/types/Client";

interface ClientCardProps {
    client: Client;
    onDelete: (client: Client) => void;
    onHighlight: (client: Client) => void;
}

function ClientCard({ client, onDelete, onHighlight }: ClientCardProps) {
    const navigate = useNavigate();

    return (
        <tr className="hover:bg-slate-50 transition-colors">
            <td className="px-6 py-4 text-slate-800 font-medium">
                <button
                    onClick={() => onHighlight(client)}
                    className="hover:text-emerald-600 hover:underline text-left"
                >
                    {client.name}
                </button>
            </td>
            <td className="px-6 py-4 text-slate-600">{client.email}</td>
            <td className="px-6 py-4 text-slate-600">{formatPhoneNumber(client.phone)}</td>
            <td className="px-6 py-4 text-right">
                <div className="flex justify-end gap-2">
                    <button
                        className="text-slate-600 hover:text-emerald-600 p-2 rounded-full hover:bg-emerald-50 transition-colors"
                        onClick={() => navigate(`/clients/view/${client.id}`)}
                        title="Edit/View"
                    >
                        <FaEdit size={18} />
                    </button>
                    <button
                        className="text-slate-600 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors"
                        onClick={() => onDelete(client)}
                        title="Delete"
                    >
                        <FaDeleteLeft size={18} />
                    </button>
                </div>
            </td>
        </tr>
    );
}

export default ClientCard;