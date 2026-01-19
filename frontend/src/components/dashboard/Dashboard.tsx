import { useState, useEffect } from "react";

import RevenueOverview from "../cards/dashboard/RevenueOverview";
import ClientsOverview from "../cards/dashboard/ClientsOverview";
import ContractOverview from "../cards/dashboard/ContractOverview";
import ContractsOverview from "./ContractsOverview";
import ServicesOverview from "./ServicesOverview";
import RevenueChart from "../charts/RevenueChart";

import { DashboardData } from "@/types/Dashboard";

function Dashboard({ data: dashboardData, topServices }: { data: DashboardData; topServices: any[] }) {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                <RevenueOverview data={dashboardData.revenue} />
                <ClientsOverview data={dashboardData.clients} />
                <ContractOverview data={dashboardData.contracts} />
            </div>
            <RevenueChart />
            <div className="space-y-6">
                <ServicesOverview data={topServices} />
                <ContractsOverview data={dashboardData.contracts.expiring_contracts} />
            </div>
        </div>
    );
}

export default Dashboard;