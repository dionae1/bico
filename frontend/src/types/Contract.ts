import { Client } from "@/types/Client";
import { Service } from "@/types/Service";

export interface Contract {
    id: number;
    client_id: number;
    service_id: number;
    created_at: string;
    end_at: string;
    value: number;
    client: Client;
    service: Service;
}

export interface ContractData {
    total_contracts: number;
    active_contracts: number;
    inactive_contracts: number;
    monthly_new_contracts: number;
    new_contracts_percentage: number;
    most_profitable: string | null;
    expiring_contracts: Contract[];
    end_this_month_contracts: number;
    finished_contracts: number;
}