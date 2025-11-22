import { FaAnglesUp } from "react-icons/fa6";

interface MultipleItemsDashboardBaseProps {
    dataMap: Array<[string, number | string]>;
    title?: string;
    percentage?: number;
}

function MultipleItemsDashboardBase({ dataMap, title = "Dashboard Overview", percentage = 0 }: MultipleItemsDashboardBaseProps) {
    const n = dataMap.length;
    const cols = n === 0 ? 1 : (n <= 3 ? n : Math.ceil(Math.sqrt(n)));

    return (
        <div className={`relative w-full rounded-sm shadow-sm border border-slate-200 p-6 bg-white flex flex-col hover:shadow-md transition-all duration-200`}>
            <h2 className="text-lg font-semibold text-slate-800 text-center mb-4">{title}</h2>

            <div
                className="grid gap-4 w-full mb-4"
                style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
            >
                {dataMap.map(([key, value]) => (
                    <div key={key} className="flex flex-col items-center justify-center p-3">
                        <h3 className="text-center text-sm font-medium text-slate-500 uppercase tracking-wide">{key}</h3>
                        <p className="text-2xl font-bold text-slate-900 text-center mt-1">{value}</p>
                    </div>
                ))}
            </div>

            {percentage > 0 && (
                <div className="self-end flex items-center text-emerald-500 absolute bottom-4 right-6">
                    <FaAnglesUp className="inline mr-1" />
                    <span className="text-sm font-bold">+{percentage}%</span>
                </div>
            )}
        </div>
    );
}

export default MultipleItemsDashboardBase;