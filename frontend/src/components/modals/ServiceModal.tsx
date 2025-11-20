import { useEffect, useState } from "react";


import HighlightField from "../HighlightField";
import Service from "@/types/Service";

interface ClientModalProps {
    isOpen: boolean;
    onClose: () => void;
    service: Service | null;
}

function ServiceModal({ isOpen, onClose, service }: ClientModalProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(isOpen)
    }, [isOpen])

    if (!isVisible || !service) return null;

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
                    <h2 className="text-2xl font-semibold mb-6 text-center text-slate-800">{service.name}</h2>
                    <HighlightField legend="Description" text={service.description} />
                    <HighlightField legend="Cost" text={"$".concat(service.cost.toFixed(2).toString())} />
                    <HighlightField legend="Price" text={"$".concat(service.price.toFixed(2).toString())} />
                    <HighlightField legend="Periodicity" text={service.periodicity} />
                </div>
            </div>
        </div>
    );
}

export default ServiceModal;