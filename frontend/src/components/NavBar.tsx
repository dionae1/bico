import { FaHome, FaCog, FaUsers, FaUser, FaOutdent } from "react-icons/fa";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { logout } from "../services/auth";

const items = [
    {
        title: 'Home',
        path: '/home',
        icon: FaHome
    },
    {
        title: 'Services',
        path: '/services',
        icon: FaCog
    },
    {
        title: 'Clients',
        path: '/clients',
        icon: FaUsers
    },
    {
        title: 'Contracts',
        path: '/contracts',
        icon: FaOutdent
    },
    {
        title: 'Profile',
        path: '/profile',
        icon: FaUser
    }
];

function NavBar({ isOpen, onClose }: { isOpen?: boolean; onClose?: () => void }) {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const sidebarClasses = `
        fixed inset-y-0 left-0 z-30 w-64 bg-slate-50 flex flex-col border-r border-slate-200 transition-transform duration-300 ease-in-out
        md:translate-x-0 md:fixed md:h-screen
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
    `;

    return (
        <>
            {/* mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-20 md:hidden"
                    onClick={onClose}
                />
            )}

            <aside className={sidebarClasses}>
                {/* head */}
                <div className="text-center mt-10 mb-8 relative">
                    <h1 className="text-4xl text-slate-800 font-bold tracking-tight">BiCO</h1>
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-widest mt-1">Services Manager</p>
                </div>

                {/* nav */}
                <nav className="flex-grow px-3 mt-2">
                    <ul className="space-y-1">
                        {items.map((item) => {
                            const IconComponent = item.icon;
                            const isActive = location.pathname === item.path;

                            return (
                                <li key={item.title}>
                                    <Link
                                        to={item.path}
                                        onClick={onClose}
                                        className={`
                                            flex items-center px-4 py-2.5 rounded-sm transition-all duration-200 group relative
                                            ${isActive
                                                ? 'bg-white text-emerald-700 shadow-sm border-l-2 border-emerald-500'
                                                : 'text-slate-600 hover:bg-white hover:text-slate-900'
                                            }
                                        `}
                                    >
                                        <IconComponent className={`
                                            text-lg mr-3 transition-colors duration-200
                                            ${isActive
                                                ? 'text-emerald-600'
                                                : 'text-slate-400 group-hover:text-emerald-500'
                                            }
                                        `} />
                                        <span className={`
                                            font-medium text-sm
                                        `}>
                                            {item.title}
                                        </span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>


                {/* out */}
                <div className="p-4 mt-auto border-t border-slate-200">
                    <button className="w-full py-2.5 px-4 bg-white border border-slate-200 text-slate-600 font-medium text-sm rounded-sm hover:bg-slate-50 hover:text-red-600 hover:border-red-200 hover:cursor-pointer transition duration-200 shadow-sm" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </aside>
        </>
    );
}

export default NavBar;