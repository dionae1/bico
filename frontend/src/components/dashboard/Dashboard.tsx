import { useState, useEffect } from "react";

import RevenueOverview from "../cards/dashboard/RevenueOverview";
import ClientsOverview from "../cards/dashboard/ClientsOverview";
import ContractOverview from "../cards/dashboard/ContractOverview";
import ContractsOverview from "./ContractsOverview";
import ServicesOverview from "./ServicesOverview";
import RevenueChart from "../charts/RevenueChart";
import ClientGrowthChart from "../charts/ClientGrowthChart";
import ContractTimelineChart from "../charts/ContractTimelineChart";
import ServicePerformanceChart from "../charts/ServicePerformanceChart";

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
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                <RevenueOverview data={data["revenue"]} />
                <ClientsOverview data={data["clients"]} />
                <ContractOverview data={data["contracts"]} />
            </div>
            <RevenueChart />
            <div className="space-y-6">
                <ServicesOverview data={topServices} />
                <ContractsOverview data={data["contracts"]["expiring_contracts"]} />
            </div>
        </div>
    );
}

export default Dashboard;