import { FaEdit } from "react-icons/fa";
import { FaDeleteLeft } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import { formatPhoneNumber } from "../../services/util";

import ConfirmModal from "../modals/ConfirmModal";
import ErrorModal from "../modals/ErrorModal";

import api from "../../api/client";

function ClientCard({ client, refreshClients }) {

    const navigate = useNavigate();
    const [confirmModal, setConfirmModal] = useState(false);
    const [error, setError] = useState(null);

    const handleDelete = () => {
        api.delete(`/clients/${client.id}`)
            .then(() => {
                refreshClients();
            })
            .catch((error) => {
                if (error.response && error.response.data) {
                    setError(error.response.data.message);
                }
            });
    }

    const handleView = () => {
        navigate(`/clients/view/${client.id}`);
    }

    const openModal = () => {
        setConfirmModal(true);
    }

    const closeModal = () => {
        setConfirmModal(false);
    }

    const handleConfirmDelete = () => {
        handleDelete();
        closeModal();
    }

    return (
        <div className="p-4 rounded-lg w-full md:w-auto flex-1 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            {error && <ErrorModal message={error} onClose={() => setError(null)} />}
            <div className="grid grid-cols-[1fr_auto] gap-4 mt-1 p-1">
                <div>
                    <h3 className="text-lg font-semibold">{client.name}</h3>
                    <p className="text-sm text-gray-600">Email: {client.email}</p>
                    <p className="text-sm text-gray-600">Phone: {formatPhoneNumber(client.phone)}</p>
                    <p className="text-sm text-gray-600">Address: {client.address}</p>
                </div>

                <div className="flex space-y-4 justify-end flex-col">
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
                        message={`Are you sure you want to delete client - ${client.name}? This action cannot be undone.`}
                    />
                </div>
            </div>
        </div>
    );
}

export default ClientCard;