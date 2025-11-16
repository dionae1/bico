import DashboardBase from "./DashboardBase";

interface ClientsOverviewProps {
    total_clients: number;
    active_clients: number;
    inactive_clients: number;
    clients_with_contracts: number;
    monthly_new_clients: number;
    new_clients_percentage: number;
}

function ClientsOverview({ data, title = "About your Clients" }: { data: ClientsOverviewProps; title?: string }) {
    return (
        <DashboardBase
            dataMap={[
                ["Total", data.total_clients],
                ["In Contracts", data.clients_with_contracts],
                // ["Active", data.active_clients],
                // ["Inactive", data.inactive_clients],
                ["This Month", data.monthly_new_clients],
            ]}
            title={title}
            percentage={data.new_clients_percentage}
        />
    );
}

export default ClientsOverview;