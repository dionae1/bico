import ServiceForm from "../../components/forms/ServiceForm";

import { useNavigate } from "react-router-dom";

function CreateService() {
    const navigate = useNavigate();

    const handleServiceCreated = () => {
        navigate(-1);
    };

    return (
        <div className="max-w-4xl mx-auto bg-white shadow-sm rounded-sm border border-slate-200 mt-10 p-10">
            <ServiceForm onCreated={handleServiceCreated} />
        </div>
    );
}

export default CreateService;