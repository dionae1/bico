import { FaBackward } from "react-icons/fa"
import { useNavigate } from "react-router-dom";


function BackButton() {
    const navigate = useNavigate();

    return (
        <button className="flex justify-center items-center p-2 m-2 transition-colors duration-200 cursor-pointer hover:underline rounded-sm text-sm font-medium text-slate-600 hover:text-slate-900" onClick={() => navigate(-1)}>
            <FaBackward className="mr-2" />
            Back
        </button>
    );
}

export default BackButton;