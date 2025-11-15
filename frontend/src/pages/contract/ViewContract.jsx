import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BackButton from "../../components/buttons/BackButton";

import api from "../../api/client";
import FormInput from "../../components/FormInput";

function ViewContract() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [contract, setContract] = useState(null);
    const [value, setValue] = useState("");
    const [endAt, setEndAt] = useState("");

    const isValid = contract && value && endAt;

    const fetchContract = async () => {
        try {
            const response = await api.get(`/contracts/${id}`);
            const { data } = response;

            setValue(data.value || "");
            setEndAt(data.end_at ? data.end_at.split('T')[0] : "");
            setContract(data);
        } catch (error) {
            console.error("Error fetching contracts:", error);
        }
    };

    const updateContract = async () => {
        try {
            const response = await api.put(`/contracts/${contract.id}`, {
                value,
                end_at: endAt
            });

            setContract(response.data);
        } catch (error) {
            console.error("Error updating contract:", error);
        }
    };

    const handleSubmit = (e) => {
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
    }, [id]);

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-4">View Contract</h1>
            <BackButton onClick={() => navigate(-1)} />
            {isValid ? (
                <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg my-4 flex flex-col space-y-4">
                    <h2 className="text-xl font-semibold text-gray-800 text-center">Change the info below to update the contract.</h2>
                    <FormInput
                        label="Client"
                        value={contract.client?.name || ""}
                        onChange={() => { }}
                        disable={true}
                    />
                    <FormInput
                        label="Service"
                        value={contract.service?.name || ""}
                        onChange={() => { }}
                        disable={true}
                    />

                    <FormInput
                        label="Value"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                    />
                    <FormInput
                        label="End At"
                        type="date"
                        value={endAt}
                        onChange={(e) => setEndAt(e.target.value)}
                    />
                    <button type="submit" disabled={!isValid} className={`w-full text-white font-bold text-center text-xl p-2 rounded-md transition-colors cursor-pointer
                ${isValid ? 'bg-green-600 hover:bg-green-500' : 'bg-gray-400 cursor-not-allowed'}`}>
                        Confirm Changes
                    </button>
                </form>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}

export default ViewContract;