import { FaAnglesUp } from "react-icons/fa6";

function DashboardBase({ dataMap, title = "Dashboard Overview", percentage = null }) {
    return (
        <div className={`ww-full rounded-lg shadow-lg p-6 bg-white flex flex-col`}>
            <h2 className="text-xl font-semibold text-center mb-6">{title}</h2>
            <div className="flex justify-between items-center flex-wrap gap-2 gap-x-4">
                {dataMap.map(([key, value]) => (
                    <div key={key} className="">
                        <h3 className="text-md font-semibold">{key}</h3>
                        <p className="text-2xl font-bold text-center">{value}</p>
                    </div>
                ))}
            </div>
            {percentage !== null && (
                <div className="mt-auto self-end flex items-center text-green-500">
                    <FaAnglesUp className="inline" />
                    <span className="text-sm">+{percentage}%</span>
                </div>
            )}
        </div>
    );
}

export default DashboardBase;