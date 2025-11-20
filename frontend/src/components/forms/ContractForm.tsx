import { useState, useEffect } from "react";

import FormInput from "../FormInput";
import FormButton from "../buttons/FormButton";
import BackButton from "../buttons/BackButton";

import Service from "@/types/Service";
import Client from "@/types/Client";

import api from "../../api/client";

function ContractForm({ onCreated }: { onCreated?: () => void }) {
    const [clientId, setClientId] = useState("");
    const [serviceId, setServiceId] = useState("");
    const [created_at, setCreatedAt] = useState("");
    const [end_at, setEndAt] = useState("");
    const [value, setValue] = useState("");

    const [services, setServices] = useState<Service[]>([]);
    const [clients, setClients] = useState<Client[]>([]);

    const isValid = (clientId !== "" && serviceId !== "" && created_at !== "" && end_at !== "" && value !== "");

    useEffect(() => {
        try {
            const fetchServices = async () => {
                const response = await api.get("/services/");
                setServices(response.data);
            };
            fetchServices();
        } catch (error) {
            console.error("Error fetching services:", error);
        }
    }, []);

    useEffect(() => {
        try {
            const fetchClients = async () => {
                const response = await api.get("/clients/");
                setClients(response.data);
            };
            fetchClients();
        } catch (error) {
            console.error("Error fetching clients:", error);
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!isValid) return;

        try {
            const newContract = {
                'client_id': clientId,
                'service_id': serviceId,
                'created_at': created_at,
                'end_at': end_at,
                'value': value
            }

            await api.post("/contracts/", newContract);
            clearFields();

            if (onCreated) {
                onCreated();
            }
        } catch (error) {
            console.error("Error adding contract:", error);
        }
    }

    const clearFields = () => {
        setClientId("");
        setServiceId("");
        setCreatedAt("");
        setEndAt("");
        setValue("");
    }

    return (
        <div className="m-auto rounded-sm bg-white flex flex-col p-4 w-full">
            <div>
                <BackButton />
            </div>

            <form onSubmit={e => handleSubmit(e)} className="flex flex-col justify-center m-6 space-y-2">
                <h2 className="text-xl font-semibold text-slate-800 text-center mb-10">Fill the form below to create a new contract</h2>
                <FormInput
                    id="contractValue"
                    label="Value $"
                    type="number"
                    placeholder="U$9.90"
                    required
                    onChange={e => setValue(e.target.value)} value={value}
                />

                <FormInput
                    id="contractCreatedAt"
                    label="Start date"
                    type="date"
                    required
                    onChange={e => setCreatedAt(e.target.value)} value={created_at}
                />

                <div className="flex flex-row space-x-1 -mt-4 mb-6">
                    <input type="checkbox" name="useToday" id="useToday" onChange={e => {
                        if (e.target.checked) {
                            setCreatedAt(new Date().toISOString().split("T")[0]);
                        } else {
                            setCreatedAt("");
                        }
                    }} />
                    <label htmlFor="useToday">Use today's date</label>
                </div>

                <FormInput
                    id="contractEndAt"
                    label="End date"
                    type="date"
                    required
                    onChange={e => setEndAt(e.target.value)} value={end_at}
                />

                <div className="mb-6 mt-4 space-y-3">
                    <label htmlFor="serviceId" className="text-2xl">Service to link</label>
                    <select name="serviceId" id="serviceId" value={serviceId} onChange={e => {
                        setServiceId(e.target.value)
                        const selectedService = services.find(s => s.id === parseInt(e.target.value));
                        if (selectedService) {
                            setValue(selectedService.price.toFixed(2));
                        }
                    }} className="mt-1 p-2 border border-gray-300 rounded w-full" required>
                        <option value="">Select a service</option>
                        {services.map(service => (
                            <option key={service.id} value={service.id}>
                                {service.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-6 space-y-3">
                    <label htmlFor="clientId" className="text-2xl">Client to link</label>
                    <select name="clientId" id="clientId" value={clientId} onChange={e => setClientId(e.target.value)} className="mt-1 p-2 border border-gray-300 rounded w-full" required>
                        <option value="">Select a client</option>
                        {clients.map(client => (
                            <option key={client.id} value={client.id}>
                                {client.name}
                            </option>
                        ))}
                    </select>
                </div>

                <FormButton title="Add Contract" onClick={handleSubmit} isValid={isValid} />
            </form>
        </div>
    )
}

export default ContractForm;