import MultipleItemsDashboardBase from "./MultipleItemsDashboardBase";
import { formatPrice } from "../../../services/util";


interface RevenueOverviewProps {
    total_revenue: number;
    total_expected_revenue: number;
    total_cost: number;
    revenue: number;
    profit_margin: number;
}

function RevenueOverview({ data, title = "Revenue" }: { data: RevenueOverviewProps; title?: string }) {
    return (
        <MultipleItemsDashboardBase
            dataMap={[
                ["Costs", `$${formatPrice(data.total_cost)}`],
                ["Expected", `$${formatPrice(data.total_expected_revenue)}`],
                ["Earnings", `$${formatPrice(data.total_revenue)}`],
            ]}
            title={title}
            percentage={data.profit_margin}
        />
    );
}

export default RevenueOverview;