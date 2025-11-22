import { useState, useEffect } from "react";
import { capitalize } from "../services/util";

import Dashboard from "../components/dashboard/Dashboard";
import api from "../api/client";

interface User {
    id: number;
    name: string;
    email: string;
}

function HomePage() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const response = await api.get("/users/me");
            setUser(response.data);
            setLoading(false);
        };
        fetchData();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
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
            <Dashboard />
        </div>
    );
}

export default HomePage;
