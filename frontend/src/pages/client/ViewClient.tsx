import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import BackButton from "../../components/buttons/BackButton";
import FormButton from "../../components/buttons/FormButton";
import FormInput from "../../components/FormInput";

import api from "../../api/client";

function ViewClient() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);

    const [clientName, setClientName] = useState<string>("");
    const [clientEmail, setClientEmail] = useState<string>("");
    const [clientPhone, setClientPhone] = useState<string>("");
    const [clientAddress, setClientAddress] = useState<string>("");

    const isValid = (clientName !== "" && clientEmail !== "" && clientPhone !== "" && clientAddress !== "");

    useEffect(() => {
        const fetchClient = async () => {
            try {
                setLoading(true);
                const { data } = await api.get(`/clients/${id}`);

                setClientName(data.name || "");
                setClientEmail(data.email || "");
                setClientPhone(data.phone || "");
                setClientAddress(data.address || "");
            } catch (error) {
                console.error("Error fetching client:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchClient();
    }, []);

    const handleUpdate = async () => {
        try {
            setLoading(true);
            const response = await api.put(`/clients/${id}`, {
                name: clientName,
                email: clientEmail,
                phone: clientPhone,
                address: clientAddress,
            });
        } catch (error) {
            console.error("Error updating client:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isValid) {
            handleUpdate();
            navigate("/clients");
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto bg-white shadow-sm rounded-sm border border-slate-200 mt-10 p-10">
            <div className="m-auto rounded-sm bg-white flex flex-col p-4 w-full">
                <div>
                    <BackButton />
                </div>
                <form onSubmit={e => handleSubmit(e)} className="flex flex-col justify-center my-4 space-y-2">
                    <h2 className="text-xl font-semibold text-slate-800 text-center">Change the info below to update the client.</h2>
                    <FormInput
                        id="clientName"
                        label="Name"
                        value={clientName}
                        onChange={e => setClientName(e.target.value)}
                        required
                    />
                    <FormInput
                        id="clientEmail"
                        label="Email"
                        value={clientEmail}
                        onChange={e => setClientEmail(e.target.value)}
                        required
                    />
                    <FormInput
                        id="clientPhone"
                        label="Phone"
                        value={clientPhone}
                        onChange={e => setClientPhone(e.target.value)}
                        required
                    />
                    <FormInput
                        id="clientAddress"
                        label="Address"
                        value={clientAddress}
                        onChange={e => setClientAddress(e.target.value)}
                        required
                    />
                    <FormButton title="Confirm Changes" onClick={handleSubmit} isValid={isValid} />
                </form>
            </div>
        </div>
    )
}

export default ViewClient;