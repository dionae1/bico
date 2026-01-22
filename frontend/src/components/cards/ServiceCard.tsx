import { FaEdit } from "react-icons/fa";
import { FaDeleteLeft } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

import { Service } from "@/types/Service";
import { formatPrice } from "../../services/util";

interface ServiceCardProps {
    service: Service;
    onDelete: (service: Service) => void;
    onHighlight: (service: Service) => void;
}

function ServiceCard({ service, onDelete, onHighlight }: ServiceCardProps) {
    const navigate = useNavigate();

    return (
        <tr className="hover:bg-slate-50 transition-colors">
            <td className="px-6 py-4 text-slate-800 font-medium">
                <button
                    onClick={() => onHighlight(service)}
                    className="hover:text-emerald-600 hover:underline text-left"
                >
                    {service.name}
                </button>
            </td>
            <td className="px-6 py-4 text-slate-600">U$ {formatPrice(service.price)}</td>
            <td className="px-6 py-4 text-slate-600"> { service.cost ? `U$ ${formatPrice(service.cost)}` : ""}</td>
            <td className="px-6 py-4 text-right">
                <div className="flex justify-end gap-2">
                    <button
                        className="text-slate-600 hover:text-emerald-600 p-2 rounded-full hover:bg-emerald-50 transition-colors"
                        onClick={() => navigate(`/services/view/${service.id}`)}
                        title="Edit/View"
                    >
                        <FaEdit size={18} />
                    </button>
                    <button
                        className="text-slate-600 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors"
                        onClick={() => onDelete(service)}
                        title="Delete"
                    >
                        <FaDeleteLeft size={18} />
                    </button>
                </div>
            </td>
        </tr>
    )
}

export default ServiceCard;