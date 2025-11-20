import { useEffect, useState, useMemo } from "react"
import { Link } from "react-router-dom"

import ServiceModal from "../../components/modals/ServiceModal"
import ServiceCard from "../../components/cards/ServiceCard"
import NoItems from "../../components/NoItems"

import api from "../../api/client"
import Service from "@/types/Service"

function MainService() {
    const [services, setServices] = useState<Service[]>([])
    const [searchTerm, setSearchTerm] = useState("")
    const [serviceModal, setServiceModal] = useState(false);
    const [highlightItem, setHighlightItem] = useState<Service | null>(null);

    const openModal = () => setServiceModal(true);
    const closeModal = () => setServiceModal(false);

    const fetchServices = async () => {
        try {
            const response = await api.get("/services")
            setServices(response.data);
        } catch (error) {
            console.error("Error fetching services:", error);
        }
    }

    const filteredServices = useMemo(() => {
        return services.filter(service =>
            service.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
    }, [services, searchTerm])

    useEffect(() => {
        fetchServices()
    }, [])

    return (
        <div className="max-w-4xl mx-auto p-6">

            <h1 className="text-3xl font-bold mb-6 text-center text-slate-800">Manage your Services</h1>

            <div className="bg-white shadow-sm rounded-sm border border-slate-200 p-6 mt-4">

                <Link className="p-2 transition-colors duration-200 cursor-pointer hover:underline rounded-sm text-lg text-emerald-600 hover:text-emerald-700 font-medium"
                    to="/services/new">Register a new service</Link>

                <div className="mb-4 mt-8">
                    <input
                        type="text"
                        placeholder="Search by name ..."
                        className="border border-slate-300 rounded-sm p-2.5 w-full focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value)
                        }}
                    />
                </div>

                {filteredServices.length === 0 ? (
                    <NoItems item="services" />
                ) : (
                    <ul className="space-y-4">

                        {filteredServices.map(service => (
                            <li key={service.id}
                                onClick={() => {
                                    setHighlightItem(service);
                                    openModal();
                                }}
                            >
                                <ServiceCard service={service} refreshServices={fetchServices} />
                            </li>
                        ))}

                    </ul>
                )}
                <ServiceModal isOpen={serviceModal} onClose={closeModal} service={highlightItem ? highlightItem : null} />
            </div>
        </div>
    )
}

export default MainService;