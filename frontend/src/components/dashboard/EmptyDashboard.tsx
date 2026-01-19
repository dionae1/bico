import { Link } from "react-router-dom";
import { FaUsers, FaFileContract, FaTools, FaRocket } from "react-icons/fa";

function EmptyDashboard() {
    return (
        <div className="max-w-4xl mx-auto mt-12">
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8 md:p-12">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 rounded-full mb-4">
                        <FaRocket className="text-4xl text-emerald-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-800 mb-3">
                        Welcome to BiCO!
                    </h2>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        You're all set up! Let's get started by adding your first clients, services, and contracts.
                    </p>
                </div>

                {/* Steps */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <Link 
                        to="/clients/new" 
                        className="group p-6 bg-slate-50 rounded-lg border-2 border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 transition-all duration-200 cursor-pointer"
                    >
                        <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 group-hover:bg-emerald-100 transition-colors">
                                <FaUsers className="text-3xl text-emerald-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-slate-800 mb-2">1. Add Clients</h3>
                            <p className="text-sm text-slate-600">
                                Start by registering your clients with their contact information
                            </p>
                        </div>
                    </Link>

                    <Link 
                        to="/services/new" 
                        className="group p-6 bg-slate-50 rounded-lg border-2 border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 transition-all duration-200 cursor-pointer"
                    >
                        <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 group-hover:bg-emerald-100 transition-colors">
                                <FaTools className="text-3xl text-emerald-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-slate-800 mb-2">2. Create Services</h3>
                            <p className="text-sm text-slate-600">
                                Define the services you offer with pricing and details
                            </p>
                        </div>
                    </Link>

                    <Link 
                        to="/contracts/new" 
                        className="group p-6 bg-slate-50 rounded-lg border-2 border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 transition-all duration-200 cursor-pointer"
                    >
                        <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 group-hover:bg-emerald-100 transition-colors">
                                <FaFileContract className="text-3xl text-emerald-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-slate-800 mb-2">3. Setup Contracts</h3>
                            <p className="text-sm text-slate-600">
                                Link clients with services and manage your contracts
                            </p>
                        </div>
                    </Link>
                </div>

                {/* Quick Tips */}
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-emerald-900 mb-3">💡 Quick Tips</h4>
                    <ul className="space-y-2 text-sm text-emerald-800">
                        <li className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>Start by adding at least one client and one service before creating contracts</span>
                        </li>
                        <li className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>Your dashboard will populate automatically as you add data</span>
                        </li>
                        <li className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>Track revenue, monitor contracts, and analyze your business growth all in one place</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default EmptyDashboard;
