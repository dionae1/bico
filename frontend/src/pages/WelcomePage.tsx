import { FaHandshake, FaCloud, FaChartLine, FaUserTie, FaFileContract, FaArrowRight } from "react-icons/fa6";
import { Link } from 'react-router-dom';

import api from "../api/client";

function WelcomePage() {

    const handleDemoClick = async () => {
        const res = await api.post('/auth/demo', {})
        if (res.status === 200) {
            localStorage.setItem('token', res.data.access_token);
            window.location.href = '/home';
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="bg-white shadow-sm border-b border-slate-200">
                <div className="max-w-6xl mx-auto px-6 py-16">
                    <div className="text-center">
                        <h1 className="text-5xl md:text-6xl font-bold text-slate-800 mb-6">
                            Welcome to <span className="text-emerald-500">BiCO</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-slate-600 mb-8 max-w-3xl mx-auto">
                            Your complete freelancer services management system. Manage clients, track contracts, and grow with us.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Link
                                to="/signup"
                                className="bg-emerald-500 text-white px-8 py-3 rounded-sm text-lg font-semibold hover:bg-emerald-600 transition-colors duration-200 flex items-center gap-2 shadow-sm"
                            >
                                Create an Account <FaArrowRight />
                            </Link>
                            <button
                                className="bg-white text-slate-800 px-8 py-3 rounded-sm text-lg font-semibold hover:bg-slate-50 transition-colors border border-slate-300 hover:cursor-pointer shadow-sm"
                                onClick={handleDemoClick}
                            >
                                Try Demo
                            </button>
                            <Link
                                to="/login"
                                className="bg-white text-slate-800 px-8 py-3 rounded-sm text-lg font-semibold hover:bg-slate-50 transition-colors duration-200 border border-slate-300 shadow-sm"
                            >
                                Sign In
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 py-16">
                <h2 className="text-3xl font-bold text-center text-slate-800 mb-12">
                    Everything You Need to Manage Your Freelance Business
                </h2>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div className="bg-white p-6 rounded-sm shadow-sm border border-slate-200 hover:shadow-md transition-shadow duration-200">
                        <div className="flex items-center mb-4">
                            <div className="bg-emerald-100 p-3 rounded-sm">
                                <FaChartLine className="text-emerald-500 text-3xl" />
                            </div>
                        </div>
                        <h3 className="text-xl font-semibold text-slate-800 mb-2">Smart Reports</h3>
                        <p className="text-slate-600">
                            Visualize your business metrics in real-time with intuitive dashboards and detailed analytics.
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-sm shadow-sm border border-slate-200 hover:shadow-md transition-shadow duration-200">
                        <div className="flex items-center mb-4">
                            <div className="bg-emerald-100 p-3 rounded-sm">
                                <FaUserTie className="text-emerald-500 text-3xl" />
                            </div>
                        </div>
                        <h3 className="text-xl font-semibold text-slate-800 mb-2">Client Management</h3>
                        <p className="text-slate-600">
                            Keep track of all your clients, their contact information, and communication history in one place.
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-sm shadow-sm border border-slate-200 hover:shadow-md transition-shadow duration-200">
                        <div className="flex items-center mb-4">
                            <div className="bg-emerald-100 p-3 rounded-sm">
                                <FaFileContract className="text-emerald-500 text-3xl" />
                            </div>
                        </div>
                        <h3 className="text-xl font-semibold text-slate-800 mb-2">Contract Tracking</h3>
                        <p className="text-slate-600">
                            Monitor active contracts, track deadlines, and manage service agreements with ease.
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-sm shadow-sm border border-slate-200 hover:shadow-md transition-shadow duration-200">
                        <div className="flex items-center mb-4">
                            <div className="bg-emerald-100 p-3 rounded-sm">
                                <FaHandshake className="text-emerald-500 text-3xl" />
                            </div>
                        </div>
                        <h3 className="text-xl font-semibold text-slate-800 mb-2">Service Management</h3>
                        <p className="text-slate-600">
                            Organize your services catalog, set pricing, and manage service offerings efficiently.
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-sm shadow-sm border border-slate-200 hover:shadow-md transition-shadow duration-200">
                        <div className="flex items-center mb-4">
                            <div className="bg-emerald-100 p-3 rounded-sm">
                                <FaCloud className="text-emerald-500 text-3xl" />
                            </div>
                        </div>
                        <h3 className="text-xl font-semibold text-slate-800 mb-2">Cloud Access</h3>
                        <p className="text-slate-600">
                            Access your data from anywhere, anytime. Everything synced and available 24/7 in the cloud.
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-sm shadow-sm border border-slate-200 hover:shadow-md transition-shadow duration-200">
                        <div className="flex items-center mb-4">
                            <div className="bg-emerald-100 p-3 rounded-sm">
                                <FaChartLine className="text-emerald-500 text-3xl" />
                            </div>
                        </div>
                        <h3 className="text-xl font-semibold text-slate-800 mb-2">Revenue Tracking</h3>
                        <p className="text-slate-600">
                            Monitor your income, track payments, and analyze your revenue streams with detailed reports.
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-white py-16">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
                        Ready to Take Control of Your Freelance Business?
                    </h2>
                    <p className="text-lg text-slate-600 mb-8">
                        Join thousands of freelancers who are already managing their business with BICO.
                    </p>
                    <Link
                        to="/signup"
                        className="inline-flex items-center gap-2 bg-emerald-500 text-white px-10 py-4 rounded-sm text-xl font-semibold hover:bg-emerald-600 transition-colors duration-200 shadow-sm"
                    >
                        Start Free Today <FaArrowRight />
                    </Link>
                </div>
            </div>

            <div className="bg-slate-800 text-white py-8">
                <div className="max-w-6xl mx-auto px-6 text-center">
                    <p className="text-slate-400">© 2025 BICO. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
}

export default WelcomePage;
