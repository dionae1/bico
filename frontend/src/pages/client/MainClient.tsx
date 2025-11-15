import { useEffect, useState, useMemo, use } from "react";
import { Link } from "react-router-dom";

import ClientModal from "../../components/modals/ClientModal";
import ClientCard from "../../components/cards/ClientCard";
import NoItems from "../../components/NoItems";

import api from "../../api/client";
import Client from "@/types/Client";

function MainClient() {
    const [clients, setClients] = useState<Client[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [clientModal, setClientModal] = useState(false);
    const [highlightItem, setHighlightItem] = useState<Client | null>(null)

    const openModal = () => setClientModal(true);
    const closeModal = () => setClientModal(false);

    const fetchClients = async () => {
        try {
            const response = await api.get("/clients");
            setClients(response.data);
        } catch (error) {
            console.error("Error fetching clients:", error);
        }
    };


    const filteredClients = useMemo(() => {
        return clients.filter(client =>
            client.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [clients, searchTerm]);


    useEffect(() => {
        fetchClients();
    }, []);

    return (
        <div className="max-w-4xl mx-auto p-6">

            <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Manage your Clients</h1>

            <div className="bg-white shadow-lg rounded-lg p-6 mb-8 mt-4">

                <Link className="p-2 transition-colors duration-200 cursor-pointer hover:underline rounded text-lg"
                    to="/clients/new">Register a new client</Link>

                <div className="mb-4 mt-4">
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

                {filteredClients.length === 0 ? (
                    <NoItems item="clients" />
                ) : (
                    <ul className="space-y-4">
                        {filteredClients.map(client => (

                            <li key={client.id}
                                onClick={() => {
                                    setHighlightItem(client);
                                    openModal();
                                }}
                            >
                                <ClientCard client={client} refreshClients={fetchClients} />
                            </li>

                        ))}
                    </ul>
                )}
                <ClientModal isOpen={clientModal} onClose={closeModal} client={highlightItem ? highlightItem : null} />
            </div>
        </div>
    );
}

export default MainClient;