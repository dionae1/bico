import DashboardBase from "./DashboardBase";

function ContractOverview({ data, title = "Contracts Summary" }) {
    return (
        <DashboardBase
            dataMap={[
                ["Total", data.total_contracts],
                ["Active", data.active_contracts],
                ["Expired", data.inactive_contracts],
                ["This Month", data.monthly_new_contracts],
            ]}
            percentage={data.new_contracts_percentage}
            title={title}
        />
    );
}
export default ContractOverview;