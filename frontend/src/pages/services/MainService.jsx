import { useEffect, useState, useMemo } from "react"
import { Link } from "react-router-dom"

import ServiceCard from "../../components/cards/ServiceCard"
import NoItems from "../../components/NoItems"
import api from "../../api/client"

function MainService() {
    const [services, setServices] = useState([])
    const [searchTerm, setSearchTerm] = useState("")

    const fetchServices = async () => {
        try {
            const response = await api.get("/services")
            const { data } = response.data
            setServices(data)
        } catch (error) {
            if (error.response.data.message !== "No services found") {
                console.error("Error fetching services:", error)
            }
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
            <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Manage your Services</h1>


            <div className="bg-white shadow-lg rounded-lg p-6 mt-4">
                <Link className="p-2 transition-colors duration-200 cursor-pointer hover:text-white hover:bg-emerald-400 rounded text-lg"
                    to="/services/new">Register a new service</Link>
                <div className="mb-4 mt-8">
                    <input
                        type="text"
                        placeholder="Search by name ..."
                        className="border-2 border-gray-300 rounded-lg p-2 w-full"
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
                            <ServiceCard key={service.id} service={service} refreshServices={fetchServices} />
                        ))}
                    </ul>
                )}
            </div>
        </div>
    )
}

export default MainService;