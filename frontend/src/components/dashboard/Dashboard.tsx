import { useState, useEffect } from "react";

import RevenueOverview from "../cards/dashboard/RevenueOverview";
import ClientsOverview from "../cards/dashboard/ClientsOverview";
import ContractOverview from "../cards/dashboard/ContractOverview";
import ContractsOverview from "./ContractsOverview";
import ServicesOverview from "./ServicesOverview";

import api from "../../api/client";

function Dashboard() {
    const [data, setData] = useState(null);
    const [topServices, setTopServices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const response = await api.get("/dashboard");
            setData(response.data);
            const topServices = await api.get("/dashboard/top-services/?limit=3");
            setTopServices(topServices.data);
            setLoading(false);
        };
        fetchData();
    }, []);

    if (!data || loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4">
                <RevenueOverview data={data["revenue"]} />
                <ClientsOverview data={data["clients"]} />
                <ContractOverview data={data["contracts"]} />
            </div>
            <div className="mb-4 p-4">
                <ServicesOverview data={topServices} />
            </div>
            <div className="mb-4 p-4">
                <ContractsOverview data={data["contracts"]["next_to_expire"]} />
            </div>
        </div>
    );
}

export default Dashboard;