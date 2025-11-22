export interface Service {
    id: number;
    user_id: number;
    name: string;
    description: string;
    price: number;
    cost: number;
    periodicity: "monthly" | "weekly" | "yearly" | "one-time";
    status: boolean;
}

export interface ServiceData {
    total_services: number;
    with_contracts: number;
    without_contracts: number;
    most_sold: string;
    most_profitable: string;
    most_sold_monthly: Array<{
        service_name: string;
        monthly_count: number;
        month: string;
    }>;
}