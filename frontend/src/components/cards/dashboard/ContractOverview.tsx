import MultipleItemsDashboardBase from "./MultipleItemsDashboardBase";

interface ContractOverviewProps {
    total_contracts: number;
    active_contracts: number;
    inactive_contracts: number;
    monthly_new_contracts: number;
    new_contracts_percentage: number;
}

function ContractOverview({ data, title = "Contracts" }: { data: ContractOverviewProps; title?: string }) {
    return (
        <MultipleItemsDashboardBase
            dataMap={[
                ["Total", data.total_contracts],
                ["Active", data.active_contracts],
            ]}
            percentage={data.total_contracts > 0 ? data.new_contracts_percentage : 0}
            title={title}
        />
    );
}
export default ContractOverview;