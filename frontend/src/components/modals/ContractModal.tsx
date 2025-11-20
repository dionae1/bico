import { useEffect, useState } from "react";

import Contract from "@/types/Contract";
import HighlightField from "../HighlightField";

interface ContractModalProps {
    isOpen: boolean;
    onClose: () => void;
    contract: Contract | null;
}

function ContractModal({ isOpen, onClose, contract }: ContractModalProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(isOpen)
    }, [isOpen])

    if (!isVisible || !contract) return null;

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
                    <h2 className="text-2xl font-semibold mb-6 text-center text-slate-800">{`${contract.client.name.split(" ")[0]} X ${contract.service.name}`}</h2>
                    <h3 className="text-lg font-medium text-slate-700 border-b border-slate-100 pb-1">Client</h3>
                    <HighlightField legend="Name" text={contract.client.name} />
                    <HighlightField legend="Email" text={contract.client.email} />
                    <h3 className="text-lg font-medium text-slate-700 border-b border-slate-100 pb-1 mt-4">Service</h3>
                    <HighlightField legend="Name" text={contract.service.name} />
                    <HighlightField legend="Description" text={contract.service.description} />
                </div>
            </div>
        </div>
    );
}

export default ContractModal;