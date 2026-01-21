import { useEffect, useState, useMemo } from "react"
import { Link, useNavigate } from "react-router-dom"
import { FaEdit } from "react-icons/fa";
import { FaDeleteLeft } from "react-icons/fa6";

import Loading from "../../components/Loading";
import DashboardBase from "../../components/cards/dashboard/DashboardBase"
import ServiceModal from "../../components/modals/ServiceModal"
import NoItems from "../../components/NoItems"
import ServicePerformanceChart from "../../components/charts/ServicePerformanceChart"
import ConfirmModal from "../../components/modals/ConfirmModal";
import ErrorModal from "../../components/modals/ErrorModal";
import ServiceCard from "../../components/cards/ServiceCard";

import api from "../../api/client"
import { Service, ServiceData } from "@/types/Service"
import { AxiosError } from "axios";

function MainService() {
    const [services, setServices] = useState<Service[]>([])
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("")
    const [serviceModal, setServiceModal] = useState(false);
    const [highlightItem, setHighlightItem] = useState<Service | null>(null);

    const [confirmModal, setConfirmModal] = useState(false);
    const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);
    const [error, setError] = useState<string | null>(null);

    const [servicesData, setServicesData] = useState<ServiceData | null>(null);
    const [sortConfig, setSortConfig] = useState<{ key: keyof Service; direction: 'asc' | 'desc' } | null>(null);

    const navigate = useNavigate();

    const openModal = () => setServiceModal(true);
    const closeModal = () => setServiceModal(false);

    const fetchServices = async () => {
        try {
            const response = await api.get("/services")
            const servicesData = await api.get("/dashboard/services");
            setServices(response.data);
            setServicesData(servicesData.data);
        } catch (error) {
            if (error instanceof AxiosError && error.response?.status !== 404)    
                console.error("Error fetching services");

        } finally {
            setLoading(false);
        }
    }

    const handleDeleteClick = (service: Service) => {
        setServiceToDelete(service);
        setConfirmModal(true);
    };

    const handleConfirmDelete = () => {
        if (serviceToDelete) {
            api.delete(`/services/${serviceToDelete.id}`)
                .then(() => {
                    // Atualizar estado local imediatamente
                    setServices(services.filter(s => s.id !== serviceToDelete.id));
                    // Buscar dados atualizados do servidor
                    fetchServices();
                    setConfirmModal(false);
                    setServiceToDelete(null);
                })
                .catch((error) => {
                    if (error.response && error.response.data) {
                        setError(error.response.data.message);
                    }
                    setConfirmModal(false);
                });
        }
    };

    const filteredServices = useMemo(() => {
        return services.filter(service =>
            service.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
    }, [services, searchTerm])

    const sortedServices = useMemo(() => {
        let sortableItems = [...filteredServices];
        if (sortConfig !== null) {
            const { key, direction } = sortConfig;
            sortableItems.sort((a, b) => {
                const valA = a[key];
                const valB = b[key];

                if (valA == null && valB == null) return 0;
                if (valA == null) return direction === 'asc' ? -1 : 1;
                if (valB == null) return direction === 'asc' ? 1 : -1;

                if (typeof valA === 'string' && typeof valB === 'string') {
                    return direction === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
                }

                if (valA < valB) {
                    return direction === 'asc' ? -1 : 1;
                }
                if (valA > valB) {
                    return direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [filteredServices, sortConfig]);

    const requestSort = (key: keyof Service) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const getSortIndicator = (key: keyof Service) => {
        if (sortConfig?.key === key) {
            return sortConfig.direction === 'asc' ? ' ▲' : ' ▼';
        }
        return null;
    };

    useEffect(() => {
        fetchServices()
    }, [])

    if (loading) {
        return <Loading fullScreen message="Loading services..." />;
    }

    return (
        <div className="max-w-6xl mx-auto p-6">
            {error && <ErrorModal message={error} onClose={() => setError(null)} />}

            <h1 className="text-2xl font-bold mb-8 text-slate-800">Services Overview</h1>

            <div className="mb-8">
                {servicesData && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <DashboardBase data={servicesData.total_services} title="Total Services" />
                        <DashboardBase data={servicesData.with_contracts} title="Active Services" />
                        <DashboardBase data={servicesData.most_sold || "—"} title="Most Popular" />
                        <DashboardBase data={servicesData.most_profitable || "—"} title="Most Profitable" />
                    </div>
                )}
            </div>

            <div className="mb-8">
                <ServicePerformanceChart />
            </div>

            <div className="bg-white shadow-sm rounded-lg border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <Link to="/services/new" className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition-colors font-medium w-full sm:w-auto text-center">
                        Register New Service
                    </Link>

                    <div className="w-full sm:w-3/4">
                        <input
                            type="text"
                            placeholder="Search services..."
                            className="border border-slate-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {filteredServices.length === 0 ? (
                    <div className="p-6">
                        <NoItems item="services" />
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 text-slate-600 text-sm uppercase tracking-wider">
                                    <th
                                        className="px-6 py-4 font-semibold border-b border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors select-none"
                                        onClick={() => requestSort('name')}
                                    >
                                        Name {getSortIndicator('name')}
                                    </th>
                                    <th
                                        className="px-6 py-4 font-semibold border-b border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors select-none"
                                        onClick={() => requestSort('price')}
                                    >
                                        Price {getSortIndicator('price')}
                                    </th>
                                    <th
                                        className="px-6 py-4 font-semibold border-b border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors select-none"
                                        onClick={() => requestSort('cost')}
                                    >
                                        Cost {getSortIndicator('cost')}
                                    </th>
                                    <th className="px-6 py-4 font-semibold border-b border-slate-200 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {sortedServices.map(service => (
                                    <ServiceCard
                                        key={service.id}
                                        service={service}
                                        onDelete={handleDeleteClick}
                                        onHighlight={(s) => {
                                            setHighlightItem(s);
                                            openModal();
                                        }}
                                    />
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <ServiceModal isOpen={serviceModal} onClose={closeModal} service={highlightItem} />

            <ConfirmModal
                isOpen={confirmModal}
                onClose={() => setConfirmModal(false)}
                onConfirm={handleConfirmDelete}
                title="Confirm Deletion"
                message={`Are you sure you want to delete service - ${serviceToDelete?.name}? This action cannot be undone.`}
            />
        </div>
    )
}

export default MainService;