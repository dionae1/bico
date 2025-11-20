import { useState } from "react";

import FormInput from "../FormInput";
import FormButton from "../buttons/FormButton";
import BackButton from "../buttons/BackButton";

import api from "../../api/client";

function ServiceForm({ onCreated }: { onCreated?: () => void }) {
    const [serviceName, setServiceName] = useState("");
    const [serviceDescription, setServiceDescription] = useState("");
    const [servicePrice, setServicePrice] = useState("");
    const [serviceCost, setServiceCost] = useState("");
    const [servicePeriodity, setServicePeriodicity] = useState("");

    const isValid = (serviceName !== "" && serviceDescription !== "" && servicePrice !== "" && serviceCost !== "" && servicePeriodity !== "");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!isValid) return;

        try {
            const newService = {
                name: serviceName,
                description: serviceDescription,
                price: servicePrice,
                cost: serviceCost,
                periodicity: servicePeriodity,
            };

            await api.post("/services/", newService);
            clearFields();

            if (onCreated) {
                onCreated();
            }

        } catch (error) {
            console.error("Error creating service:", error);
        }
    };

    const clearFields = () => {
        setServiceName("");
        setServiceDescription("");
        setServicePrice("");
        setServiceCost("");
        setServicePeriodicity("");
    }

    return (
        <div className="m-auto rounded-sm bg-white flex flex-col p-4 w-full">
            <div>
                <BackButton />
            </div>

            <form onSubmit={e => handleSubmit(e)} className="flex flex-col justify-center m-6 space-y-2">
                <h2 className="text-xl font-semibold text-slate-800 text-center mb-10">Fill the form below to create a new service</h2>
                <FormInput
                    id="serviceName"
                    label="Service Name"
                    placeholder="Web Hosting"
                    value={serviceName}
                    onChange={e => setServiceName(e.target.value)}
                    required
                />
                <FormInput
                    id="serviceDescription"
                    label="Description"
                    placeholder="Brief description of the service"
                    value={serviceDescription}
                    onChange={e => setServiceDescription(e.target.value)}
                    required
                />
                <FormInput
                    id="servicePrice"
                    label="Price"
                    type="number"
                    placeholder="99.99"
                    value={servicePrice}
                    onChange={e => setServicePrice(e.target.value)}
                    required
                />
                <FormInput
                    id="serviceCost"
                    label="Cost"
                    type="number"
                    placeholder="49.99"
                    value={serviceCost}
                    onChange={e => setServiceCost(e.target.value)}
                    required
                />
                <select name="servicePeriodicity" id="servicePeriodicity" value={servicePeriodity} onChange={e => setServicePeriodicity(e.target.value)} required>
                    <option value="" disabled>Select periodicity</option>
                    <option value="one-time">One-time</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                </select>

                <FormButton title="Add Service" onClick={handleSubmit} isValid={isValid} />
            </form>
        </div>
    )
}

export default ServiceForm;