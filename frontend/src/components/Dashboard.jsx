import { useState, useEffect } from "react";

import RevenueOverview from "./cards/dashboard/RevenueOverview";
import ClientsOverview from "./cards/dashboard/ClientsOverview";
import ContractOverview from "./cards/dashboard/ContractOverview";
import ExpiringOverview from "./ExpiringOverview";
import ServicesOverview from "./ServicesOverview";

import api from "../api/client";

function Dashboard() {
    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const response = await api.get("/dashboard");
            const topServices = await api.get("/dashboard/top-services/?limit=3");
            setData({ ...response.data, top_services: topServices.data });
        };
        fetchData();
    }, []);

    if (!data) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4">
                <RevenueOverview data={data["data"]["revenue"]} />
                <ClientsOverview data={data["data"]["clients"]} />
                <ContractOverview data={data["data"]["contracts"]} />
            </div>
            <div className="mb-4 p-4">
                <ServicesOverview data={data["top_services"]["data"]} />
            </div>
            <div className="mb-4 p-4">
                <ExpiringOverview data={data["data"]["contracts"]["next_to_expire"]} />
            </div>
        </div>
    );
}

export default Dashboard;