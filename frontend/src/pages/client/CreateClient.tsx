import { useNavigate } from "react-router-dom";

import ClientForm from "../../components/forms/ClientForm";

function CreateClient() {
    const navigate = useNavigate();

    const handleClientCreated = () => {
        navigate(-1);
    };

    return (
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg mt-10 p-10">
            <ClientForm onCreated={handleClientCreated} />
        </div>
    );
}

export default CreateClient;