import { FaAnglesUp } from "react-icons/fa6";

interface DashboardBaseProps {
    dataMap: Array<[string, number | string]>;
    title?: string;
    percentage?: number;
}

function DashboardBase({ dataMap, title = "Dashboard Overview", percentage = 0 }: DashboardBaseProps) {
    const n = dataMap.length;
    const cols = n === 0 ? 1 : (n <= 3 ? n : Math.ceil(Math.sqrt(n)));

    return (
        <div className={`relative w-full rounded-lg shadow-sm p-6 bg-white flex flex-col hover:shadow-md transition-shadow`}>
            <h2 className="text-xl font-semibold text-center mb-6">{title}</h2>

            <div
                className="grid gap-4 w-full mb-4"
                style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
            >
                {dataMap.map(([key, value]) => (
                    <div key={key} className="flex flex-col items-center justify-center p-3">
                        <h3 className="text-center text-md font-medium">{key}</h3>
                        <p className="text-2xl font-semibold text-center">{value}</p>
                    </div>
                ))}
            </div>

            {percentage > 0 && (
                <div className="self-end flex items-center text-green-500 absolute bottom-4 right-6">
                    <FaAnglesUp className="inline" />
                    <span className="text-sm font-bold">+{percentage}%</span>
                </div>
            )}
        </div>
    );
}

export default DashboardBase;