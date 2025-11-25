import { useState } from "react"

import FormInput from "../FormInput"
import FormButton from "../buttons/FormButton"
import BackButton from "../buttons/BackButton"

import api from "../../api/client"

function ClientForm({ onCreated }: { onCreated?: () => void }) {
    const [clientName, setClientName] = useState("")
    const [clientEmail, setClientEmail] = useState("")
    const [clientPhone, setClientPhone] = useState("")
    const [clientAddress, setClientAddress] = useState("")

    const isValid = (clientName !== "")

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!isValid) return;

        try {
            const newClient = {
                name: clientName,
                email: clientEmail,
                phone: clientPhone,
                address: clientAddress
            };

            await api.post("/clients/", newClient);
            clearFields();

            if (onCreated) {
                onCreated();
            }

        } catch (error) {
            console.error("Error creating client");
        }
    };

    const clearFields = () => {
        setClientName("");
        setClientEmail("");
        setClientPhone("");
        setClientAddress("");
    };

    return (
        <div className="m-auto rounded-sm bg-white flex flex-col p-4 w-full">
            <div>
                <BackButton />
            </div>

            <form onSubmit={e => handleSubmit(e)} className="flex flex-col justify-center m-6 space-y-2">
                <h2 className="text-xl font-semibold text-slate-800 text-center mb-10">Fill the form below to create a new client</h2>
                <FormInput
                    id="clientName"
                    label="Name"
                    placeholder="Jonas Kahnwald"
                    required
                    onChange={e => setClientName(e.target.value)} value={clientName}
                />
                <FormInput
                    id="clientEmail"
                    label="Email"
                    placeholder="jonas1@example.com"
                    required
                    onChange={e => setClientEmail(e.target.value)} value={clientEmail}
                />
                <FormInput
                    id="clientPhone"
                    label="Phone"
                    placeholder="(99) 91234-5678"
                    required
                    onChange={e => setClientPhone(e.target.value)} value={clientPhone}
                />
                <FormInput
                    id="clientAddress"
                    label="Address"
                    placeholder="Street 1, House 3, Downtown."
                    required
                    onChange={e => setClientAddress(e.target.value)} value={clientAddress}
                />

                <FormButton title="Add Client" onClick={handleSubmit} isValid={isValid} />
            </form>
        </div>
    )
}

export default ClientForm;