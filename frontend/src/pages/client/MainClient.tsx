import { useEffect, useState, useMemo, use } from "react";
import { Link } from "react-router-dom";

import DashboardBase from "../../components/cards/dashboard/DashboardBase";
import ClientModal from "../../components/modals/ClientModal";
import ClientCard from "../../components/cards/ClientCard";
import NoItems from "../../components/NoItems";
import ClientGrowthChart from "../../components/charts/ClientGrowthChart";
import TopClientsChart from "../../components/charts/TopClientsChart";

import api from "../../api/client";
import { Client, ClientsData } from "@/types/Client";

function MainClient() {
    const [clients, setClients] = useState<Client[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [clientModal, setClientModal] = useState(false);
    const [highlightItem, setHighlightItem] = useState<Client | null>(null)

    const [clientsData, setClientsData] = useState<ClientsData | null>(null);

    const openModal = () => setClientModal(true);
    const closeModal = () => setClientModal(false);

    const fetchClients = async () => {
        try {
            const response = await api.get("/clients");
            const clientsData = await api.get("/dashboard/clients");
            setClients(response.data);
            setClientsData(clientsData.data);
        } catch (error) {
            console.error("Error fetching clients");
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
        <div className="max-w-5xl mx-auto p-6">
            <h1 className="text-xl font-bold mb-8 text-center text-slate-800">Clients Overview</h1>
            <div className="mb-4">
                {clientsData && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-6">
                        <DashboardBase data={clientsData.total_clients} title="Total Clients" />
                        <DashboardBase data={clientsData.clients_with_contracts} title="Clients with Contracts" />
                        <DashboardBase data={clientsData.monthly_new_clients} title="Monthly New Clients" percentage={clientsData.new_clients_percentage} />
                        <DashboardBase data={clientsData.clients_without_contracts} title="Inactive Clients" />
                        {
                            clientsData.most_contracts && <DashboardBase data={clientsData.most_contracts} title="Most Contracts" />
                        }
                        {
                            clientsData.most_valuable && <DashboardBase data={clientsData.most_valuable} title="Most Valuable" />
                        }
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <ClientGrowthChart />
                <TopClientsChart />
            </div>

            <div className="bg-white shadow-sm rounded-sm border border-slate-200 p-6 mb-8 mt-4">
                <Link to="/clients/new" className="p-2 transition-colors duration-200 cursor-pointer hover:underline rounded-sm text-lg text-emerald-600 hover:text-emerald-700 font-medium">
                    Register a new client
                </Link>
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