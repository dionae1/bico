import { FaEdit } from "react-icons/fa";
import { FaDeleteLeft } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import ConfirmModal from "../modals/ConfirmModal";
import ErrorModal from "../modals/ErrorModal";

import api from "../../api/client";
import Contract from "@/types/Contract";

function ContractCard({ contract, refreshContracts }: { contract: Contract; refreshContracts: () => void }) {
    const [confirmModal, setConfirmModal] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();
    const openModal = () => setConfirmModal(true);
    const closeModal = () => setConfirmModal(false);

    const handleDelete = () => {
        api.delete(`/contracts/${contract.id}`)
            .then(() => {
                refreshContracts();
            })
            .catch((error) => {
                if (error.response && error.response.data) {
                    setError(error.response.data.message);
                }
            });
    }

    const handleView = () => navigate(`/contracts/view/${contract.id}`);

    const handleConfirmDelete = () => {
        handleDelete();
        closeModal();
    }

    return (
        <div className="p-4 rounded-lg w-full md:w-auto flex-1 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            {error && <ErrorModal message={error} onClose={() => setError(null)} />}
            <div className="grid grid-cols-[1fr_auto] gap-4 mt-1 p-1">
                <div>
                    <h3 className="text-lg font-semibold">{contract.client.name} - {contract.service.name}</h3>
                    <p className="text-sm text-gray-600">Creation Date: {new Date(contract.created_at).toLocaleDateString()}</p>
                    <p className="text-sm text-gray-600">End date: {new Date(contract.end_at).toLocaleDateString()}</p>
                    <p className="text-sm text-gray-600">Value: U$ {contract.value.toFixed(2)}</p>
                </div>

                <div className="flex space-y-4 justify-around flex-col">
                    <button onClick={handleView} className="text-white text-center text-xl bg-gray-700 p-2 rounded-md hover:bg-gray-800 transition-colors cursor-pointer w-10 flex items-center justify-center">
                        <FaEdit />
                    </button>
                    <button onClick={openModal} className="text-white font-bold text-center text-xl bg-red-500 p-2 rounded-md hover:bg-red-800 transition-colors cursor-pointer w-10 flex items-center justify-center">
                        <FaDeleteLeft />
                    </button>

                    <ConfirmModal
                        isOpen={confirmModal}
                        onClose={closeModal}
                        onConfirm={handleConfirmDelete}
                        title="Confirm Deletion"
                        message={`Are you sure you want to delete contract '${contract.client.name} - ${contract.service.name}'? This action cannot be undone.`}
                    />
                </div>
            </div>
        </div>
    );
}

export default ContractCard;