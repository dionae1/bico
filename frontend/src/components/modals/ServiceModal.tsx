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
                    <h2 className="text-2xl font-semibold mb-6 text-center">{service.name}</h2>
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