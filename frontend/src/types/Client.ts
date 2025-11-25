export interface Client {
    id: number;
    user_id: number;
    name: string;
    email: string | null;
    phone: string | null;
    address: string | null;
    status: boolean | null;
    created_at: string | null;
}

export type ClientsData = {
    total_clients: number;
    clients_with_contracts: number;
    clients_without_contracts: number;
    monthly_new_clients: number;
    new_clients_percentage: number;
    most_contracts: string | null;
    most_valuable: string | null;
};