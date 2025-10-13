
import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";

import ClientCard from "../../components/cards/ClientCard";
import NoItems from "../../components/NoItems";

import api from "../../api/client";
import Client from "@/types/Client";

function MainClient() {
    const [clients, setClients] = useState<Client[]>([]);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchClients = async () => {
        try {
            const response = await api.get("/clients");
            const { data } = response.data;
            setClients(data);
        } catch (error: any) {
            if (error.response.data.message !== "No clients found") {
                console.error("Error fetching clients:", error);
            }
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

                            <li key={client.id}>
                                <ClientCard client={client} refreshClients={fetchClients} />
                            </li>

                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default MainClient;