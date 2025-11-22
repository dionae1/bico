import { useEffect, useState, useMemo, use } from "react";
import { Link } from "react-router-dom";

import DashboardBase from "../../components/cards/dashboard/DashboardBase";
import ContractModal from "../../components/modals/ContractModal";
import ContractCard from "../../components/cards/ContractCard";
import NoItems from "../../components/NoItems";
import ContractTimelineChart from "../../components/charts/ContractTimelineChart";
import api from "../../api/client";

import { Contract, ContractData } from "@/types/Contract";

function MainContract() {
    const [contracts, setContracts] = useState<Contract[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [contractModal, setContractModal] = useState(false);
    const [highlightItem, setHighlightItem] = useState<Contract | null>(null);
    const [contractsData, setContractsData] = useState<ContractData | null>(null);

    const openModal = () => setContractModal(true);
    const closeModal = () => setContractModal(false);

    const fetchContracts = async () => {
        try {
            const response = await api.get("/contracts/user");
            const contractsData = await api.get("/dashboard/contracts");
            setContracts(response.data);
            setContractsData(contractsData.data);
        } catch (error: any) {
            if (error.response.data.detail !== "No contracts found") {
                console.error("Error fetching contracts");
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
        <div className="max-w-5xl mx-auto p-6">
            <h1 className="text-xl font-bold mb-8 text-center text-slate-800">Contracts Overview</h1>
            <div className="mb-10">
                {contractsData && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-6">
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

            <div className="bg-white shadow-sm rounded-sm border border-slate-200 p-6 mb-8 mt-4">
                <Link to="/contracts/new" className="p-2 transition-colors duration-200 cursor-pointer hover:underline rounded-sm text-lg text-emerald-600 hover:text-emerald-700 font-medium">
                    Register a new contract
                </Link>
                <div className="mb-4 mt-8">
                    <input
                        type="text"
                        placeholder="Search by a service name ..."
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