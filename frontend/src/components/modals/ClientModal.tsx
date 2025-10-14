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
            className={'fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-xs transition-all'}
            onClick={onClose}
        >
            <div
                className={'bg-white p-4 rounded-md min-w-2/6'}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="absolute text-xl">
                    <button onClick={onClose} className="hover:cursor-pointer hover:font-bold">X</button>
                </div>
                <div className="m-6"></div>
                <div className="px-16 py-10 space-y-4">
                    <h2 className="text-2xl font-semibold mb-6 text-center">{client.name.split(" ")[0]}</h2>
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