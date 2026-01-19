import { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import { FaDeleteLeft } from "react-icons/fa6";

import Loading from "../../components/Loading";
import DashboardBase from "../../components/cards/dashboard/DashboardBase";
import ContractModal from "../../components/modals/ContractModal";
import NoItems from "../../components/NoItems";
import ContractTimelineChart from "../../components/charts/ContractTimelineChart";
import ConfirmModal from "../../components/modals/ConfirmModal";
import ErrorModal from "../../components/modals/ErrorModal";
import ContractCard from "../../components/cards/ContractCard";

import api from "../../api/client";
import { Contract, ContractData } from "@/types/Contract";

function MainContract() {
    const [contracts, setContracts] = useState<Contract[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [contractModal, setContractModal] = useState(false);
    const [highlightItem, setHighlightItem] = useState<Contract | null>(null);

    const [confirmModal, setConfirmModal] = useState(false);
    const [contractToDelete, setContractToDelete] = useState<Contract | null>(null);
    const [error, setError] = useState<string | null>(null);

    const [contractsData, setContractsData] = useState<ContractData | null>(null);
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

    const navigate = useNavigate();

    const openModal = () => setContractModal(true);
    const closeModal = () => setContractModal(false);

    const fetchContracts = async () => {
        try {
            setLoading(true);
            const response = await api.get("/contracts/user");
            const contractsData = await api.get("/dashboard/contracts");
            setContracts(response.data);
            setContractsData(contractsData.data);
        } catch (error: any) {
            if (error.response?.data?.detail !== "No contracts found") {
                console.error("Error fetching contracts");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = (contract: Contract) => {
        setContractToDelete(contract);
        setConfirmModal(true);
    };

    const handleConfirmDelete = () => {
        if (contractToDelete) {
            api.delete(`/contracts/${contractToDelete.id}`)
                .then(() => {
                    fetchContracts();
                    setConfirmModal(false);
                    setContractToDelete(null);
                })
                .catch((error) => {
                    if (error.response && error.response.data) {
                        setError(error.response.data.detail);
                    }
                    setConfirmModal(false);
                });
        }
    };

    const filteredContracts = useMemo(() => {
        return contracts.filter(contract =>
            contract.service?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            contract.client?.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [contracts, searchTerm]);

    const getNestedValue = (obj: any, path: string) => {
        return path.split('.').reduce((acc, part) => acc && acc[part], obj);
    };

    const sortedContracts = useMemo(() => {
        let sortableItems = [...filteredContracts];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                const valA = getNestedValue(a, sortConfig.key);
                const valB = getNestedValue(b, sortConfig.key);

                if (valA == null && valB == null) return 0;
                if (valA == null) return sortConfig.direction === 'asc' ? -1 : 1;
                if (valB == null) return sortConfig.direction === 'asc' ? 1 : -1;

                if (typeof valA === 'string' && typeof valB === 'string') {
                    return sortConfig.direction === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
                }

                if (valA < valB) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (valA > valB) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [filteredContracts, sortConfig]);

    const requestSort = (key: string) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const getSortIndicator = (key: string) => {
        if (sortConfig?.key === key) {
            return sortConfig.direction === 'asc' ? ' ▲' : ' ▼';
        }
        return null;
    };

    useEffect(() => {
        fetchContracts();
    }, []);

    if (loading) {
        return <Loading fullScreen message="Loading contracts..." />;
    }

    return (
        <div className="max-w-6xl mx-auto p-6">
            {error && <ErrorModal message={error} onClose={() => setError(null)} />}

            <h1 className="text-2xl font-bold mb-8 text-slate-800">Contracts Overview</h1>

            <div className="mb-10">
                {contractsData && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                        <DashboardBase data={contractsData.total_contracts} title="Total Contracts" />
                        <DashboardBase data={contractsData.active_contracts} title="Active Contracts" />
                        <DashboardBase data={contractsData.monthly_new_contracts} title="Monthly New Contracts" percentage={contractsData.new_contracts_percentage} />
                        <DashboardBase data={contractsData.end_this_month_contracts} title="Ending This Month" />
                        <DashboardBase data={contractsData.finished_contracts} title="Finished Contracts" />

                        {
                            contractsData.most_profitable && <DashboardBase data={contractsData.most_profitable} title="Most Profitable Contract" />
                        }
                    </div>
                )}
            </div>

            <div className="mb-8">
                <ContractTimelineChart />
            </div>

            <div className="bg-white shadow-sm rounded-lg border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <Link to="/contracts/new" className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition-colors font-medium w-full sm:w-auto text-center">
                        Register New Contract
                    </Link>
                    <div className="w-full sm:w-3/4">
                        <input
                            type="text"
                            placeholder="Search by service or client..."
                            className="border border-slate-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {filteredContracts.length === 0 ? (
                    <div className="p-6">
                        <NoItems item="contracts" />
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 text-slate-600 text-sm uppercase tracking-wider">
                                    <th
                                        className="px-6 py-4 font-semibold border-b border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors select-none"
                                        onClick={() => requestSort('client.name')}
                                    >
                                        Client {getSortIndicator('client.name')}
                                    </th>
                                    <th
                                        className="px-6 py-4 font-semibold border-b border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors select-none"
                                        onClick={() => requestSort('service.name')}
                                    >
                                        Service {getSortIndicator('service.name')}
                                    </th>
                                    <th
                                        className="px-6 py-4 font-semibold border-b border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors select-none"
                                        onClick={() => requestSort('end_at')}
                                    >
                                        End Date {getSortIndicator('end_at')}
                                    </th>
                                    <th
                                        className="px-6 py-4 font-semibold border-b border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors select-none"
                                        onClick={() => requestSort('value')}
                                    >
                                        Value {getSortIndicator('value')}
                                    </th>
                                    <th className="px-6 py-4 font-semibold border-b border-slate-200 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {sortedContracts.map(contract => (
                                    <ContractCard
                                        key={contract.id}
                                        contract={contract}
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

            <ContractModal isOpen={contractModal} onClose={closeModal} contract={highlightItem} />

            <ConfirmModal
                isOpen={confirmModal}
                onClose={() => setConfirmModal(false)}
                onConfirm={handleConfirmDelete}
                title="Confirm Deletion"
                message={`Are you sure you want to delete contract '${contractToDelete?.client?.name} - ${contractToDelete?.service?.name}'? This action cannot be undone.`}
            />
        </div>
    );
}

export default MainContract;