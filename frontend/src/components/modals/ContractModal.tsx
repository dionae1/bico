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
                    <h2 className="text-2xl font-semibold mb-6 text-center">{`${contract.client.name.split(" ")[0]} X ${contract.service.name}`}</h2>
                    <h3>Client</h3>
                    <HighlightField legend="Name" text={contract.client.name} />
                    <HighlightField legend="Email" text={contract.client.email} />
                    <h3>Service</h3>
                    <HighlightField legend="Name" text={contract.service.name} />
                    <HighlightField legend="Description" text={contract.service.description} />
                </div>
            </div>
        </div>
    );
}

export default ContractModal;