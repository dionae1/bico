import {
    FaHandshake,
    FaChartLine,
    FaUserTie,
    FaFileContract,
    FaArrowRight,
    FaBolt,
    FaQuoteLeft,
    FaGithub,
    FaLinkedin,
    FaEnvelope
} from "react-icons/fa6";

import { FaCheckCircle, FaShieldAlt } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

import api from "../api/client";
    
function WelcomePage() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleDemoClick = async () => {
        try {
            const res = await api.post('/auth/demo', {});
            if (res.status === 200) {
                localStorage.setItem('token', res.data.access_token);
                window.location.href = '/home';
            }
        } catch (error) {
            console.error("Demo login failed", error);
        }
    };

    return (
        <div className="min-h-screen bg-white font-sans text-slate-900">
            {/* nav */}
            <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'}`}>
                <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-slate-900 tracking-tight">BiCO</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link to="/login" className="text-slate-600 hover:text-emerald-600 font-medium transition-colors border rounded-lg p-2 sm:border-none">
                            Log in
                        </Link>
                        <Link
                            to="/signup"
                            className="bg-slate-900 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-slate-800 transition-all hover:shadow-lg transform hover:-translate-y-0.5"
                        >
                            Get Started
                        </Link>
                    </div>
                </div>
            </nav>

            {/* hero */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                <div className="absolute top-0 right-0 -z-10 opacity-10 translate-x-1/3 -translate-y-1/4">
                    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-[800px] h-[800px] text-emerald-500 fill-current">
                        <path d="M44.7,-76.4C58.9,-69.2,71.8,-59.1,81.6,-46.6C91.4,-34.1,98.1,-19.2,95.8,-5.3C93.5,8.6,82.2,21.4,70.6,31.4C59,41.4,47.1,48.6,35.3,55.2C23.5,61.8,11.8,67.8,-1.8,70.9C-15.4,74,-30.8,74.2,-43.8,68.3C-56.8,62.4,-67.4,50.4,-75.6,36.9C-83.8,23.4,-89.6,8.4,-87.4,-5.6C-85.2,-19.6,-75,-32.6,-63.6,-42.2C-52.2,-51.8,-39.6,-58,-27.1,-66.3C-14.6,-74.6,-2.2,-85,12.4,-87.2C27,-89.4,41.6,-83.4,44.7,-76.4Z" transform="translate(100 100)" />
                    </svg>
                </div>

                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                        <div className="lg:w-1/2 text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm font-semibold mb-6">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                </span>
                                Comming Soon: AI-Powered Analysis
                            </div>
                            <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 leading-tight mb-6">
                                Master Your <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Freelance Business</span>
                            </h1>
                            <p className="text-xl text-slate-600 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                                Stop juggling spreadsheets and scattered emails. BiCO gives you the professional tools to manage clients, contracts, and cash flow—all in one place.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                                <button
                                    onClick={handleDemoClick}
                                    className="w-full sm:w-auto px-8 py-4 bg-emerald-600 text-white rounded-xl font-bold text-lg hover:bg-emerald-700 transition-all shadow-lg hover:shadow-emerald-500/30 flex items-center justify-center gap-2"
                                >
                                    Try Live Demo <FaArrowRight />
                                </button>
                                <Link
                                    to="/signup"
                                    className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-xl font-bold text-lg hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                                >
                                    Start for Free
                                </Link>
                            </div>
                            <div className="mt-8 flex items-center justify-center lg:justify-start gap-6 text-sm text-slate-500">
                                <div className="flex items-center gap-2">
                                    <FaCheckCircle className="text-emerald-500" /> Completely Free
                                </div>
                            </div>
                        </div>
                        <div className="lg:w-1/2 relative">
                            <div className="relative z-10 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                                <div className="bg-slate-50 rounded-xl overflow-hidden border border-slate-100 aspect-[4/3] flex items-center justify-center relative group">
                                    {/* mini ui */}
                                    <div className="absolute inset-0 bg-slate-100">
                                        <div className="absolute top-4 left-4 right-4 h-8 bg-white rounded-md shadow-sm flex items-center px-3 gap-2">
                                            <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                            <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                                            <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                                        </div>
                                        <div className="absolute top-16 left-4 w-1/4 h-full bg-white rounded-t-lg shadow-sm p-4 space-y-3">
                                            <div className="h-2 bg-slate-200 rounded w-3/4"></div>
                                            <div className="h-2 bg-slate-200 rounded w-1/2"></div>
                                            <div className="h-2 bg-slate-200 rounded w-5/6"></div>
                                        </div>
                                        <div className="absolute top-16 right-4 w-2/3 h-full bg-white rounded-t-lg shadow-sm p-6">
                                            <div className="flex justify-between mb-6">
                                                <div className="h-8 w-32 bg-slate-100 rounded"></div>
                                                <div className="h-8 w-8 bg-emerald-100 rounded-full"></div>
                                            </div>
                                            <div className="grid grid-cols-3 gap-4 mb-6">
                                                <div className="h-24 bg-emerald-50 rounded-lg border border-emerald-100"></div>
                                                <div className="h-24 bg-slate-50 rounded-lg border border-slate-100"></div>
                                                <div className="h-24 bg-slate-50 rounded-lg border border-slate-100"></div>
                                            </div>
                                            <div className="space-y-3">
                                                <div className="h-4 bg-slate-100 rounded w-full"></div>
                                                <div className="h-4 bg-slate-100 rounded w-full"></div>
                                                <div className="h-4 bg-slate-100 rounded w-2/3"></div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="absolute inset-0 flex items-center justify-center bg-slate-900/5 group-hover:bg-slate-900/0 transition-colors">
                                        <div className="bg-white/90 backdrop-blur shadow-xl px-6 py-3 rounded-full flex items-center gap-3 transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
                                            <div className="bg-emerald-100 p-2 rounded-full">
                                                <FaChartLine className="text-emerald-600" />
                                            </div>
                                            <div>
                                                <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Monthly Revenue</div>
                                                <div className="text-lg font-bold text-slate-900">$12,450.00</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-teal-500 rounded-full opacity-20 blur-2xl"></div>
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500 rounded-full opacity-20 blur-2xl"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* features */}
            <section id="features" className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Everything you need to run your business</h2>
                        <p className="text-lg text-slate-600">BiCO replaces your patchwork of apps with a single, powerful operating system for your freelance career.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="group p-8 rounded-2xl bg-white border border-slate-100 hover:border-emerald-100 hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300">
                            <div className="w-14 h-14 bg-emerald-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <FaUserTie className="text-2xl text-emerald-600" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Client Management</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Keep detailed records of every client interaction. Store contacts, notes, and preferences.
                            </p>
                        </div>

                        <div className="group p-8 rounded-2xl bg-white border border-slate-100 hover:border-emerald-100 hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300">
                            <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <FaFileContract className="text-2xl text-blue-600" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Smart Contracts</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Create, track, and manage contracts effortlessly. Be aware of renewals and expirations so you never miss an opportunity.
                            </p>
                        </div>

                        <div className="group p-8 rounded-2xl bg-white border border-slate-100 hover:border-emerald-100 hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300">
                            <div className="w-14 h-14 bg-purple-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <FaChartLine className="text-2xl text-purple-600" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Financial Analytics</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Visualize your income streams. Track paid and pending invoices, and forecast your monthly revenue with precision.
                            </p>
                        </div>

                        <div className="group p-8 rounded-2xl bg-white border border-slate-100 hover:border-emerald-100 hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300">
                            <div className="w-14 h-14 bg-amber-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <FaHandshake className="text-2xl text-amber-600" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Service Catalog</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Define your offerings clearly. Standardize your pricing and scope to send proposals faster and look more professional.
                            </p>
                        </div>

                        <div className="group p-8 rounded-2xl bg-white border border-slate-100 hover:border-emerald-100 hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300">
                            <div className="w-14 h-14 bg-rose-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <FaShieldAlt className="text-2xl text-rose-600" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Secure Data</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Security for your business data. Backups and encryption ensure your client information is safe.
                            </p>
                        </div>

                        <div className="group p-8 rounded-2xl bg-white border border-slate-100 hover:border-emerald-100 hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300">
                            <div className="w-14 h-14 bg-teal-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <FaBolt className="text-2xl text-teal-600" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Fast Workflow</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Designed for speed. Quick actions, and a clutter-free interface help you get work done faster.
                            </p>
                        </div>
                    </div>
                </div>
            </section>


            {/* footer */}
            <footer className="bg-slate-50 pt-20 pb-10 border-t border-slate-200">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-16">
                        <div className="max-w-md text-center md:text-left">
                            <div className="flex items-center justify-center md:justify-start gap-2 mb-6">
                                <span className="text-2xl font-bold text-slate-900">BiCO</span>
                            </div>
                            <p className="text-slate-500 mb-6">
                                The operating system for the modern freelancer. Built with ❤️ for the gig economy.
                            </p>
                        </div>

                        <div className="flex flex-col items-center md:items-end gap-4">
                            <p className="text-sm font-semibold text-slate-900">Connect with the Developer</p>
                            <div className="flex gap-4">
                                <a href="https://github.com/dionae1" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-emerald-600 hover:border-emerald-600 transition-colors cursor-pointer" title="GitHub">
                                    <FaGithub />
                                </a>
                                <a href="https://www.linkedin.com/in/guilhermegomespy/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-emerald-600 hover:border-emerald-600 transition-colors cursor-pointer" title="LinkedIn">
                                    <FaLinkedin />
                                </a>
                                <a href="mailto:p.guilhermemedeiros@gmail.com" className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-emerald-600 hover:border-emerald-600 transition-colors cursor-pointer" title="Email">
                                    <FaEnvelope />
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-slate-500 text-sm">© 2025 BiCO All rights reserved.</p>
                        <div className="flex gap-8 text-sm text-slate-500">
                            <a href="#" className="hover:text-slate-900">Privacy Policy</a>
                            <a href="#" className="hover:text-slate-900">Terms of Service</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default WelcomePage;
