import DashboardBase from "./DashboardBase";

interface ContractOverviewProps {
    total_contracts: number;
    active_contracts: number;
    inactive_contracts: number;
    monthly_new_contracts: number;
    new_contracts_percentage: number;
}

function ContractOverview({ data, title = "Contracts Summary" }: { data: ContractOverviewProps; title?: string }) {
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