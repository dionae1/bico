import { useState } from "react";
import NavBar from "../NavBar";
import { Outlet } from "react-router-dom";
import { FaBars } from "react-icons/fa";

function MainLayout() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-slate-50">
            <NavBar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

            <div className="flex-1 flex flex-col min-w-0">
                {/* Mobile Header */}
                <div className="md:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between sticky top-0 z-20">
                    <h1 className="text-xl font-bold text-slate-800">BiCO</h1>
                    <button
                        onClick={() => setIsMobileMenuOpen(true)}
                        className="p-2 text-slate-600 hover:bg-slate-100 rounded-sm"
                    >
                        <FaBars className="text-xl" />
                    </button>
                </div>

                <main className="flex-1 p-4 md:p-6 overflow-x-hidden">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default MainLayout;