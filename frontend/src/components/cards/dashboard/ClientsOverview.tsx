import MultipleItemsDashboardBase from "./MultipleItemsDashboardBase";

interface ClientsOverviewProps {
    total_clients: number;
    active_clients: number;
    inactive_clients: number;
    clients_with_contracts: number;
    monthly_new_clients: number;
    new_clients_percentage: number;
}

function ClientsOverview({ data, title = "Clients" }: { data: ClientsOverviewProps; title?: string }) {
    return (
        <MultipleItemsDashboardBase
            dataMap={[
                ["Total", data.total_clients],
                ["This Month", data.monthly_new_clients],
            ]}
            title={title}
            percentage={data.total_clients > 0 ? data.new_clients_percentage : 0}
        />
    );
}

export default ClientsOverview;