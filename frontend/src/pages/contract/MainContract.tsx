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
            const { data } = response.data;
            setContracts(data);

        } catch (error: any) {
            if (error.response.data.message !== "No contracts found") {
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

            <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Manage your contracts</h1>

            <div className="bg-white shadow-lg rounded-lg p-6 mb-8 mt-4">

                <Link className="p-2 transition-colors duration-200 cursor-pointer hover:underline rounded text-lg"
                    to="/contracts/new">Register a new contract</Link>

                <div className="mb-4 mt-8">
                    <input
                        type="text"
                        placeholder="Search by name ..."
                        className="border-2 border-gray-300 rounded-lg p-2 w-full"
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