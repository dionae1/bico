import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import BackButton from "../../components/buttons/BackButton";
import FormInput from "../../components/FormInput";
import FormButton from "../../components/buttons/FormButton";

import api from "../../api/client";
import Client from "@/types/Client";
import Service from "@/types/Service";

interface Contract {
    id: number;
    client_id: number;
    service_id: number;
    created_at: string;
    end_at: string;
    value: number;
    client: Client;
    service: Service;
}

function ViewContract() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [contract, setContract] = useState<Contract | null>(null);
    const [client, setClient] = useState<Client | null>(null);
    const [service, setService] = useState<Service | null>(null);
    const [value, setValue] = useState<number | null>(null);
    const [endAt, setEndAt] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const isValid = (contract !== null && value !== null && endAt !== null);

    useEffect(() => {
        const fetchContract = async () => {
            setLoading(true);
            const response = await api.get(`/contracts/${id}`);
            setContract(response.data);
            setClient(response.data.client);
            setService(response.data.service);
            setLoading(false);
        };
        fetchContract();
    }, [id]);

    const handleUpdate = async () => {
        try {
            setLoading(true);
            const response = await api.put(`/contracts/${id}`, {
                end_at: contract?.end_at,
                value: contract?.value,
            });
            setContract(response.data);
            setClient(response.data.client);
            setService(response.data.service);
            setLoading(false);
        } catch (error) {
            console.error("Error updating contract:", error);
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isValid) {
            handleUpdate();
            navigate("/contracts");
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-4 text-slate-800">View Contract</h1>
            <div>
                <BackButton />
            </div>
            {isValid ? (
                <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6 bg-white shadow-sm rounded-sm border border-slate-200 my-4 flex flex-col space-y-4">
                    <h2 className="text-xl font-semibold text-slate-800 text-center">Change the info below to update the contract.</h2>
                    <FormInput
                        id="client"
                        label="Client"
                        value={contract.client?.name || ""}
                        onChange={() => { }}
                        disable={true}
                    />
                    <FormInput
                        id="service"
                        label="Service"
                        value={contract.service?.name || ""}
                        onChange={() => { }}
                        disable={true}
                    />

                    <FormInput
                        id="value"
                        label="Value"
                        type="number"
                        value={value}
                        onChange={(e) => setValue(Number(e.target.value))}
                    />
                    <FormInput
                        id="endAt"
                        label="End At"
                        type="date"
                        value={endAt}
                        onChange={(e) => setEndAt(e.target.value)}
                    />
                    <FormButton title="Confirm Changes" onClick={handleSubmit} isValid={isValid} />
                </form>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}

export default ViewContract;