import { FaAnglesUp } from "react-icons/fa6";

interface DashboardBaseProps {
    title: string;
    data: string | number;
    percentage?: number;
}

function DashboardBase({ data, title = "Dashboard Overview", percentage = 0 }: DashboardBaseProps) {
    return (
        <div className={`relative w-full rounded-sm shadow-sm border border-slate-200 py-6 px-4 bg-white flex flex-col hover:shadow-md transition-all duration-200`}>
            <h2 className="text-lg font-semibold text-slate-800 text-center mb-4">{title}</h2>
            <p className="text-2xl font-bold text-slate-900 text-center mb-6">{data}</p>

            {percentage > 0 && (
                <div className="self-end flex items-center text-emerald-500 absolute bottom-4 right-6">
                    <FaAnglesUp className="inline mr-1" />
                    <span className="text-sm font-bold">+{percentage}%</span>
                </div>
            )}
        </div>
    );
}

export default DashboardBase;