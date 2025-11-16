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

function NavBar() {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <aside className="w-64 bg-gradient-to-b from-slate-50 via-slate-100 flex-shrink-0 flex flex-col shadow-xl sticky top-0 h-screen overflow-hidden border-r border-slate-300">

            {/* Header */}
            <div className="text-center mt-14 mb-4">
                <h1 className="text-5xl text-slate-700 font-extrabold tracking-wider">BiCO</h1>
                <p className="text-md text-slate-500 font-bold">Services Manager</p>
            </div>

            {/* Navigation */}
            <nav className="flex-grow px-2 mt-4">
                <ul className="space-y-2">
                    {items.map((item) => {
                        const IconComponent = item.icon;
                        const isActive = location.pathname === item.path;

                        return (
                            <li key={item.title}>
                                <Link
                                    to={item.path}
                                    className={`
                                        flex items-center p-3 rounded-md transition-all duration-300 group relative overflow-hidden
                                        ${isActive
                                            ? 'bg-green-100 shadow-xs'
                                            : 'hover:bg-slate-100 hover:shadow-sm'
                                        }
                                    `}
                                >
                                    <IconComponent className={`
                                        text-lg mr-3 transition-all duration-300
                                        ${isActive
                                            ? 'text-emerald-600'
                                            : 'text-slate-600 group-hover:text-emerald-500'
                                        }
                                    `} />
                                    <span className={`
                                        font-bold
                                        ${isActive
                                            ? 'text-emerald-700'
                                            : 'text-slate-600 group-hover:text-slate-700'
                                        }
                                    `}>
                                        {item.title}
                                    </span>
                                    {isActive && (
                                        <div className="absolute right-2 w-2 h-2 bg-emerald-500 rounded-full" />
                                    )}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>


            {/* Logout Button */}
            <div className="p-4 mt-auto">
                <button className="w-full py-2 px-4 bg-emerald-400 text-white rounded-lg hover:bg-emerald-500 hover:cursor-pointer transition duration-200" onClick={handleLogout}>
                    Logout
                </button>
            </div>
        </aside>
    );
}

export default NavBar;