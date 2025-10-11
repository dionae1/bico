import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";

import ContractCard from "../../components/cards/ContractCard";
import NoItems from "../../components/NoItems";
import api from "../../api/client";

function MainContract() {
    const [contracts, setContracts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");


    const fetchContracts = async () => {
        try {
            const response = await api.get("/contracts/user");
            const { data } = response.data;

            await Promise.all(data.map(async (contract) => {
                contract.client = await api.get(`/clients/${contract['client_id']}`).then(res => res.data.data);
                contract.service = await api.get(`/services/${contract['service_id']}`).then(res => res.data.data);
            }));

            setContracts(data);
        } catch (error) {
            if (error.response.data.message !== "No contracts found") {
                console.error("Error fetching contracts:", error);
            }
        }
    };

    const filteredContracts = useMemo(() => {
        return contracts.filter(contract =>
            contract.service.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [contracts, searchTerm]);

    useEffect(() => {
        fetchContracts();
    }, []);


    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Manage your contracts</h1>


            <div className="bg-white shadow-lg rounded-lg p-6 mb-8 mt-4">
                <Link className="p-2 transition-colors duration-200 cursor-pointer hover:text-white hover:bg-emerald-400 rounded text-lg"
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
                            <li key={contract.id}>
                                <ContractCard contract={contract} refreshContracts={fetchContracts} />
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default MainContract;