interface Service {
    id: number;
    user_id: number;
    name: string;
    description: string;
    price: number;
    cost: number;
    periodicity: "monthly" | "weekly" | "yearly" | "one-time";
    status: boolean;
}

export default Service;