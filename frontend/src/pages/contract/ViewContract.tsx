import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Loading from "../../components/Loading";
import BackButton from "../../components/buttons/BackButton";
import FormButton from "../../components/buttons/FormButton";

import api from "../../api/client";
import FormInput from "../../components/FormInput";

import { Contract } from "@/types/Contract";

function ViewContract() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);

    const [contract, setContract] = useState<Contract | null>(null);
    const [value, setValue] = useState<string>("");
    const [endAt, setEndAt] = useState<string>("");

    const isValid = (contract !== null && value !== "" && endAt !== "");

    useEffect(() => {
        const fetchContract = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/contracts/${id}`);
                const { data } = response;

                setValue(data.value || "");
                setEndAt(data.end_at ? data.end_at.split('T')[0] : "");
                setContract(data);
            } catch (error) {
                console.error("Error fetching contracts");
            } finally {
                setLoading(false);
            }
        };
        fetchContract();
    }, []);

    const handleUpdate = async () => {
        try {
            setLoading(true);
            const response = await api.put(`/contracts/${id}`, {
                value: value,
                end_at: endAt
            });
        } catch (error) {
            console.error("Error updating contract");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isValid) {
            handleUpdate();
            navigate("/contracts");
        }
    };

    if (loading) return <Loading fullScreen message="Loading contract data..." />;

    return (
        <div className="max-w-4xl mx-auto bg-white shadow-sm rounded-sm border border-slate-200 mt-10 p-10">
            <div className="m-auto rounded-sm bg-white flex flex-col p-4 w-full">
                <div>
                    <BackButton />
                </div>
                {
                    contract === null ? <p>Contract not found.</p> :
                        <form onSubmit={e => handleSubmit(e)} className="flex flex-col justify-center my-4 space-y-2">
                            <h2 className="text-xl font-semibold text-slate-800 text-center">Change the info below to update the contract.</h2>
                            <FormInput
                                id="clientName"
                                label="Client"
                                value={contract.client?.name || ""}
                                onChange={() => { }}
                                disable={true}
                            />
                            <FormInput
                                id="serviceName"
                                label="Service"
                                value={contract.service?.name || ""}
                                onChange={() => { }}
                                disable={true}
                            />
                            <FormInput
                                id="value"
                                label="Value"
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                                required
                            />
                            <FormInput
                                id="endAt"
                                label="End At"
                                type="date"
                                value={endAt}
                                onChange={(e) => setEndAt(e.target.value)}
                                required
                            />
                            <FormButton title="Confirm Changes" onClick={handleSubmit} isValid={isValid} />

                        </form>
                }

            </div>
        </div>
    );
}

export default ViewContract;