import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import BackButton from "../../components/buttons/BackButton";
import FormButton from "../../components/buttons/FormButton";
import FormInput from "../../components/FormInput";

import api from "../../api/client";
import Service from "@/types/Service";

function ViewService() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [service, setService] = useState<Service | null>(null);
    const [serviceName, setServiceName] = useState("");
    const [serviceDescription, setServiceDescription] = useState("");
    const [servicePrice, setServicePrice] = useState("");
    const [serviceCost, setServiceCost] = useState("");
    const [servicePeriodicity, setServicePeriodicity] = useState("");

    const isValid = (serviceName !== "" && serviceDescription !== "" && servicePrice !== "" && serviceCost !== "" && servicePeriodicity !== "");

    const fetchService = async () => {
        try {
            const response = await api.get(`/services/${id}`);
            const { data } = response.data;
            setService(data);

            setServiceName(data.name || "");
            setServiceDescription(data.description || "");
            setServicePrice(data.price || "");
            setServiceCost(data.cost || "");
            setServicePeriodicity(data.periodicity || "");
        } catch (error) {
            console.error("Error fetching service:", error);
        }
    }

    const updateService = async () => {
        try {
            const response = await api.put(`/services/${id}`, {
                name: serviceName,
                description: serviceDescription,
                price: servicePrice,
                cost: serviceCost,
                periodicity: servicePeriodicity
            });
        } catch (error) {
            console.error("Error updating service:", error);
        }
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (isValid) {
            updateService();
            navigate("/services");
        }
    }

    useEffect(() => {
        if (id) {
            fetchService();
        }
    }, [id]);

    if (!service) return <p>Loading...</p>;

    return (
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg mt-10 p-10">
            <div className="m-auto rounded-lg bg-white flex flex-col p-4 w-full">
                <div>
                    <BackButton />
                </div>
                <form onSubmit={e => handleSubmit(e)} className="flex flex-col justify-center my-4 space-y-2">
                    <h2 className="text-xl font-semibold text-gray-800 text-center">Change the info below to update the service.</h2>
                    <FormInput
                        id="serviceName"
                        label="Name"
                        value={serviceName}
                        onChange={(e) => setServiceName(e.target.value)}
                        required
                    />
                    <FormInput
                        id="serviceDescription"
                        label="Description"
                        value={serviceDescription}
                        onChange={(e) => setServiceDescription(e.target.value)}
                        required
                    />
                    <FormInput
                        id="servicePrice"
                        label="Price"
                        type="number"
                        value={servicePrice}
                        onChange={(e) => setServicePrice(e.target.value)}
                        required
                    />
                    <FormInput
                        id="serviceCost"
                        label="Cost"
                        type="number"
                        value={serviceCost}
                        onChange={(e) => setServiceCost(e.target.value)}
                        required
                    />
                    <select
                        name="servicePeriodicity"
                        id="servicePeriodicity"
                        value={servicePeriodicity}
                        onChange={e => setServicePeriodicity(e.target.value)}
                        required
                        className="mb-6 p-2 border border-gray-300 rounded w-full"
                    >
                        <option value="" disabled>Select periodicity</option>
                        <option value="one-time">One-time</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                    </select>
                    <FormButton title="Confirm Changes" onClick={handleSubmit} isValid={isValid} />
                </form>
            </div>
        </div>
    );
}

export default ViewService;