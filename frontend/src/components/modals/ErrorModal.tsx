import OkButton from "../buttons/OkButton";

interface ErrorModalProps {
    onClose: () => void;
    message: string;
}

function ErrorModal({ onClose, message }: ErrorModalProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs"
            onClick={onClose}>
            <div className="bg-white p-6 rounded-sm w-11/12 max-w-md shadow-xl">
                <h2 className="text-2xl font-semibold mb-4 text-slate-800">Oops!</h2>
                <p className="text-slate-600 mb-6 text-lg">{message}.</p>
                <div className="mt-8 flex justify-center">
                    <OkButton onClick={onClose} />
                </div>
            </div>
        </div>
    );
}

export default ErrorModal;