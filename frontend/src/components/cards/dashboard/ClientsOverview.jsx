import DashboardBase from "./DashboardBase";

function ClientsOverview({ data, title = "Client Summary" }) {
    return (
        <DashboardBase
            dataMap={[
                ["Clients", data.total_clients],
                ["Active", data.active_clients],
                ["Inactive", data.inactive_clients],
                ["This Month", data.monthly_new_clients],
            ]}
            title={title}
            percentage={data.new_clients_percentage}
        />
    );
}

export default ClientsOverview;