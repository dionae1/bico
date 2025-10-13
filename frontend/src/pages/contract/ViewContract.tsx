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
    const [value, setValue] = useState<number | null>(null);
    const [endAt, setEndAt] = useState<string | null>(null);

    const isValid = (contract !== null && value !== null && endAt !== null);

    const fetchContract = async () => {
        try {
            const response = await api.get(`/contracts/${id}`);
            const { data } = response.data;

            data.client = await api.get(`/clients/${data['client_id']}`).then(res => res.data.data);
            data.service = await api.get(`/services/${data['service_id']}`).then(res => res.data.data);

            setValue(data.value || "");
            setEndAt(data.end_at ? data.end_at.split('T')[0] : "");

            setContract(data);
        } catch (error: any) {
            if (error.response.data.message !== "No contracts found") {
                console.error("Error fetching contracts:", error);
            }
        }
    };

    const updateContract = async () => {
        try {
            const response = await api.put(`/contracts/${id}`, {
                value,
                end_at: endAt
            });

            setContract(response.data);
        } catch (error) {
            console.error("Error updating contract:", error);
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isValid) {
            updateContract();
            navigate("/contracts");
        }
    };

    useEffect(() => {
        if (id) {
            fetchContract();
        }
    }, []);

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-4">View Contract</h1>
            <div>
                <BackButton />
            </div>
            {isValid ? (
                <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg my-4 flex flex-col space-y-4">
                    <h2 className="text-xl font-semibold text-gray-800 text-center">Change the info below to update the contract.</h2>
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