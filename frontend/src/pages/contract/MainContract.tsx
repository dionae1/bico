import { useEffect, useState, useMemo, use } from "react";
import { Link } from "react-router-dom";

import ContractModal from "../../components/modals/ContractModal";
import ContractCard from "../../components/cards/ContractCard";
import NoItems from "../../components/NoItems";
import api from "../../api/client";

import Client from "@/types/Client";
import Service from "@/types/Service";

interface Contract {
    id: number;
    client_id: number;
    service_id: number;
    created_at: string;
    end_at: string;
    value: number;
    client: Client;
    service: Service;
}

function MainContract() {
    const [contracts, setContracts] = useState<Contract[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [contractModal, setContractModal] = useState(false);
    const [highlightItem, setHighlightItem] = useState<Contract | null>(null);

    const openModal = () => setContractModal(true);
    const closeModal = () => setContractModal(false);


    const fetchContracts = async () => {
        try {
            const response = await api.get("/contracts/user");
            setContracts(response.data);

        } catch (error: any) {
            if (error.response.data.detail !== "No contracts found") {
                console.error("Error fetching contracts:", error);
            }
        }
    };

    const filteredContracts = useMemo(() => {
        return contracts.filter(contract =>
            contract.service?.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [contracts, searchTerm]);

    useEffect(() => {
        fetchContracts();
    }, []);


    return (
        <div className="max-w-4xl mx-auto p-6">

            <h1 className="text-3xl font-bold mb-8 text-center text-slate-800">Manage your contracts</h1>

            <div className="bg-white shadow-sm rounded-sm border border-slate-200 p-6 mb-8 mt-4">

                <Link className="p-2 transition-colors duration-200 cursor-pointer hover:underline rounded-sm text-lg text-emerald-600 hover:text-emerald-700 font-medium"
                    to="/contracts/new">Register a new contract</Link>

                <div className="mb-4 mt-8">
                    <input
                        type="text"
                        placeholder="Search by name ..."
                        className="border border-slate-300 rounded-sm p-2.5 w-full focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value)
                        }}
                    />
                </div>

                {filteredContracts.length === 0 ? (
                    <NoItems item="contracts" />
                ) : (
                    <ul className="space-y-4">
                        {filteredContracts.map(contract => (

                            <li key={contract.id}
                                onClick={() => {
                                    setHighlightItem(contract);
                                    openModal();
                                }}
                            >
                                <ContractCard contract={contract} refreshContracts={fetchContracts} />
                            </li>

                        ))}
                    </ul>
                )}
                <ContractModal isOpen={contractModal} onClose={closeModal} contract={highlightItem ? highlightItem : null} />
            </div>
        </div>
    );
}

export default MainContract;