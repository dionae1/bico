import { useState, useEffect } from "react";
import { capitalize } from "../services/util";

import Dashboard from "../components/Dashboard";
import api from "../api/client";

function HomePage() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const response = await api.get("/users/me");
            setUser(response.data.data);
            setLoading(false);
        };
        fetchData();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="max-w-7xl mx-auto p-6">
            <h1 className="text-3xl font-bold text-center text-gray-800 mt-8">
                Welcome back, {capitalize(user?.name)}!
            </h1>

            <h2 className="text-xl font-semibold text-center text-gray-800 mt-4 mb-10">Your Dashboard Overview</h2>
            <Dashboard />
        </div>
    );
}

export default HomePage;
