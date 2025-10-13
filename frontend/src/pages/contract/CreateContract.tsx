import { useNavigate } from "react-router-dom";

import ContractForm from "../../components/forms/ContractForm";

function CreateContract() {
    const navigate = useNavigate();

    const handleContractCreated = () => {
        navigate(-1);
    };

    return (
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg mt-10 p-10">
            <ContractForm onCreated={handleContractCreated} />
        </div>
    );
}

export default CreateContract;