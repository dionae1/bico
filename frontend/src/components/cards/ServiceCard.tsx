import { FaEdit } from "react-icons/fa";
import { FaDeleteLeft } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { use, useState } from "react";

import ConfirmModal from "../modals/ConfirmModal";
import ErrorModal from "../modals/ErrorModal";

import api from "../../api/client";
import Service from "@/types/Service";

function ServiceCard({ service, refreshServices }: { service: Service; refreshServices: () => void }) {
    const [confirmModal, setConfirmModal] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();
    const openModal = () => setConfirmModal(true);
    const closeModal = () => setConfirmModal(false);

    const handleDelete = () => {
        api
            .delete(`/services/${service.id}`)
            .then(() => {
                refreshServices();
            })
            .catch((error) => {
                if (error.response && error.response.data) {
                    setError(error.response.data.message);
                }
            });
    };

    const handleView = () => navigate(`/services/view/${service.id}`);

    const handleConfirmDelete = () => {
        handleDelete();
        closeModal();
    }

    return (
        <div className="p-6 rounded-sm w-full md:w-auto flex-1 bg-white border border-slate-200 shadow-sm hover:shadow-md hover:cursor-pointer transition-all duration-200">
            {error && <ErrorModal message={error} onClose={() => setError(null)} />}
            <div className="flex flex-col sm:flex-row sm:justify-between gap-4 mt-1 p-1">
                <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-semibold text-slate-800 truncate">{service.name}</h3>
                    <p className="text-base text-slate-600 mt-1 break-words">{service.description}</p>
                    <p className="text-base text-slate-600">Price: U${service.price.toFixed(2)}</p>
                    <p className="text-base text-slate-600">Cost: U${service.cost.toFixed(2)}</p>
                </div>

                <div className="flex flex-row sm:flex-col gap-3 sm:gap-3 justify-start sm:justify-around mt-2 sm:mt-0">
                    <button
                        className="text-white text-center text-lg bg-slate-700 p-2 rounded-sm hover:bg-slate-800 transition-colors cursor-pointer w-full sm:w-9 h-9 flex items-center justify-center shadow-sm"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleView();
                        }}>
                        <FaEdit />
                    </button>

                    <button
                        className="text-white font-bold text-center text-lg bg-red-500 p-2 rounded-sm hover:bg-red-600 transition-colors cursor-pointer w-full sm:w-9 h-9 flex items-center justify-center shadow-sm"
                        onClick={(e) => {
                            e.stopPropagation();
                            openModal();
                        }}>
                        <FaDeleteLeft />
                    </button>

                    <ConfirmModal
                        isOpen={confirmModal}
                        onClose={closeModal}
                        onConfirm={handleConfirmDelete}
                        title="Confirm Deletion"
                        message={`Are you sure you want to delete service - ${service.name}? This action cannot be undone.`}
                    />
                </div>
            </div>
        </div>
    )
}

export default ServiceCard;