import { useState, useEffect } from "react";
import { capitalize } from "../services/util";

import { DashboardData } from "@/types/Dashboard";
import { User } from "@/types/User";


import Dashboard from "../components/dashboard/Dashboard";
import Loading from "../components/Loading";
import api from "../api/client";
import EmptyDashboard from "../components/dashboard/EmptyDashboard";

function HomePage() {
    const [user, setUser] = useState<User | null>(null);
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [topServices, setTopServices] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const responseUser = await api.get("/users/me");
            const responseDashboard = await api.get("/dashboard");
            const responseTopServices = await api.get("/dashboard/top-services/?limit=3");

            setUser(responseUser.data);
            setDashboardData(responseDashboard.data);
            setTopServices(responseTopServices.data);
            setLoading(false);
        };
        fetchData();
    }, []);

    if (loading) {
        return <Loading fullScreen message="Loading your dashboard..." />;
    }
    const hasClients = dashboardData && dashboardData.clients.total_clients > 0;
    const hasContracts = dashboardData && dashboardData.contracts.total_contracts > 0;
    const hasServices = topServices.length > 0;

    const isEmpty = !(hasClients || hasContracts || hasServices);

    if (isEmpty) {
        return <EmptyDashboard />;
    }

    return (
        <div className="max-w-7xl mx-auto p-6">
            <h1 className="text-3xl font-bold text-center text-slate-800">
                Welcome, {user ? capitalize(user.name.split(" ")[0]) : "Guest"}!
            </h1>

            <div className="mt-4 mb-8">
                <h2 className="text-xl font-medium text-center text-slate-700">
                    Here's an overview of your dashboard.
                </h2>
                <h4 className="text-center block text-sm font-normal text-slate-500 mt-2">
                    Detailed statistics on their respective pages.
                </h4>
            </div>
            {dashboardData && <Dashboard data={dashboardData} topServices={topServices} />}
        </div>
    );
}

export default HomePage;
