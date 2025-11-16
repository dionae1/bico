import DashboardBase from "./DashboardBase";

interface RevenueOverviewProps {
    total_revenue: number;
    total_expected_revenue: number;
    total_cost: number;
    revenue: number;
    profit_margin: number;
}

function RevenueOverview({ data, title = "Your Revenue" }: { data: RevenueOverviewProps; title?: string }) {
    return (
        <DashboardBase
            dataMap={[
                ["Earnings", `$${data.total_revenue.toFixed(2)}`],
                ["Expected", `$${data.total_expected_revenue.toFixed(2)}`],
                ["Expenses", `$${data.total_cost.toFixed(2)}`],
                ["Profit", `$${data.revenue.toFixed(2)}`],
            ]}
            title={title}
            percentage={data.profit_margin}
        />
    );
}

export default RevenueOverview;