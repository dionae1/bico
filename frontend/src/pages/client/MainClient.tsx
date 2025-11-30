import { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import { FaDeleteLeft } from "react-icons/fa6";

import DashboardBase from "../../components/cards/dashboard/DashboardBase";
import ClientModal from "../../components/modals/ClientModal";
import NoItems from "../../components/NoItems";
import ClientGrowthChart from "../../components/charts/ClientGrowthChart";
import TopClientsChart from "../../components/charts/TopClientsChart";
import ConfirmModal from "../../components/modals/ConfirmModal";
import ErrorModal from "../../components/modals/ErrorModal";
import ClientCard from "../../components/cards/ClientCard";

import { formatPhoneNumber } from "../../services/util";
import api from "../../api/client";
import { Client, ClientsData } from "@/types/Client";

function MainClient() {
    const [clients, setClients] = useState<Client[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [clientModal, setClientModal] = useState(false);
    const [highlightItem, setHighlightItem] = useState<Client | null>(null);

    const [confirmModal, setConfirmModal] = useState(false);
    const [clientToDelete, setClientToDelete] = useState<Client | null>(null);
    const [error, setError] = useState<string | null>(null);

    const [clientsData, setClientsData] = useState<ClientsData | null>(null);
    const [sortConfig, setSortConfig] = useState<{ key: keyof Client; direction: 'asc' | 'desc' } | null>(null);

    const navigate = useNavigate();

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

    const handleDeleteClick = (client: Client) => {
        setClientToDelete(client);
        setConfirmModal(true);
    };

    const handleConfirmDelete = () => {
        if (clientToDelete) {
            api.delete(`/clients/${clientToDelete.id}`)
                .then(() => {
                    fetchClients();
                    setConfirmModal(false);
                    setClientToDelete(null);
                })
                .catch((error) => {
                    if (error.response && error.response.data) {
                        setError(error.response.data.detail);
                    }
                    setConfirmModal(false);
                });
        }
    };

    const filteredClients = useMemo(() => {
        return clients.filter(client =>
            client.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [clients, searchTerm]);


    const sortedClients = useMemo(() => {
        let sortableItems = [...filteredClients];
        if (sortConfig !== null) {
            const { key, direction } = sortConfig;
            sortableItems.sort((a, b) => {
                const valA = a[key];
                const valB = b[key];

                if (valA == null && valB == null) return 0;
                if (valA == null) return direction === 'asc' ? -1 : 1;
                if (valB == null) return direction === 'asc' ? 1 : -1;

                if (typeof valA === 'string' && typeof valB === 'string') {
                    return direction === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
                }

                if (valA < valB) {
                    return direction === 'asc' ? -1 : 1;
                }
                if (valA > valB) {
                    return direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [filteredClients, sortConfig]);

    const requestSort = (key: keyof Client) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const getSortIndicator = (key: keyof Client) => {
        if (sortConfig?.key === key) {
            return sortConfig.direction === 'asc' ? ' ▲' : ' ▼';
        }
        return null;
    };

    useEffect(() => {
        fetchClients();
    }, []);

    return (
        <div className="max-w-6xl mx-auto p-6">
            {error && <ErrorModal message={error} onClose={() => setError(null)} />}

            <h1 className="text-2xl font-bold mb-8 text-slate-800">Clients Overview</h1>

            <div className="mb-8">
                {clientsData && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
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

            <div className="bg-white shadow-sm rounded-lg border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <Link to="/clients/new" className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition-colors font-medium w-full sm:w-auto text-center">
                        Register New Client
                    </Link>
                    <div className="w-full sm:w-3/4">
                        <input
                            type="text"
                            placeholder="Search clients..."
                            className="border border-slate-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {filteredClients.length === 0 ? (
                    <div className="p-6">
                        <NoItems item="clients" />
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 text-slate-600 text-sm uppercase tracking-wider">
                                    <th
                                        className="px-6 py-4 font-semibold border-b border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors select-none"
                                        onClick={() => requestSort('name')}
                                    >
                                        Name {getSortIndicator('name')}
                                    </th>
                                    <th
                                        className="px-6 py-4 font-semibold border-b border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors select-none"
                                        onClick={() => requestSort('email')}
                                    >
                                        Email {getSortIndicator('email')}
                                    </th>
                                    <th
                                        className="px-6 py-4 font-semibold border-b border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors select-none"
                                    >
                                        Phone
                                    </th>
                                    <th className="px-6 py-4 font-semibold border-b border-slate-200 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {sortedClients.map(client => (
                                    <ClientCard
                                        key={client.id}
                                        client={client}
                                        onDelete={handleDeleteClick}
                                        onHighlight={(c) => {
                                            setHighlightItem(c);
                                            openModal();
                                        }}
                                    />
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <ClientModal isOpen={clientModal} onClose={closeModal} client={highlightItem} />

            <ConfirmModal
                isOpen={confirmModal}
                onClose={() => setConfirmModal(false)}
                onConfirm={handleConfirmDelete}
                title="Confirm Deletion"
                message={`Are you sure you want to delete client ${clientToDelete?.name}? This action cannot be undone.`}
            />
        </div>
    );
}

export default MainClient;