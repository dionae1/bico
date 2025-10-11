import DashboardBase from "./DashboardBase";

function RevenueOverview({ data, title = "Revenue Summary" }) {
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