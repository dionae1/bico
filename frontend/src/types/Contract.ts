import Client from "./Client";
import Service from "./Service";

interface Contract {
    id: number;
    value: number;
    end_at: string;
    created_at: string;
    client: Client;
    service: Service;
}

export default Contract;