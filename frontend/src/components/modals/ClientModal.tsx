import { useEffect, useState } from "react";

import { formatPhoneNumber } from "../../services/util";

import HighlightField from "../HighlightField";
import Client from "@/types/Client";

interface ClientModalProps {
    isOpen: boolean;
    onClose: () => void;
    client: Client | null;
}

function ClientModal({ isOpen, onClose, client }: ClientModalProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(isOpen)
    }, [isOpen])

    if (!isVisible || !client) return null;

    return (
        <div
            className={'fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs transition-all'}
            onClick={onClose}
        >
            <div
                className={'bg-white p-6 rounded-sm w-11/12 md:w-auto md:min-w-[400px] shadow-xl relative'}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="absolute top-4 right-4 text-xl">
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">X</button>
                </div>
                <div className="mt-2 px-4 py-6 space-y-4">
                    <h2 className="text-2xl font-semibold mb-6 text-center text-slate-800">{client.name.split(" ")[0]}</h2>
                    <HighlightField legend="Name" text={client.name} />
                    <HighlightField legend="Email" text={client.email} />
                    <HighlightField legend="Phone" text={formatPhoneNumber(client.phone)} />
                    <HighlightField legend="Address" text={client.address} />
                </div>
            </div>
        </div>
    );
}

export default ClientModal;