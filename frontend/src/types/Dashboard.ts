export interface DashboardData {
    revenue: {
        total_revenue: number,
        total_expected_revenue: number,
        total_cost: number,
        revenue: number,
        profit_margin: number
    },
    clients: {
        total_clients: number,
        clients_with_contracts: number,
        clients_without_contracts: number,
        monthly_new_clients: number,
        new_clients_percentage: number,
        most_contracts: any,
        most_valuable: any
    },
    contracts: {
        total_contracts: number,
        active_contracts: number,
        inactive_contracts: number,
        monthly_new_contracts: number,
        new_contracts_percentage: number,
        most_profitable: null,
        end_this_month_contracts: number,
        finished_contracts: number,
        expiring_contracts: any[]
    }
}