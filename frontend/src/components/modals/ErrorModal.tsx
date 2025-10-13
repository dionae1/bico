import OkButton from "../buttons/OkButton";

interface ErrorModalProps {
    onClose: () => void;
    message: string;
}

function ErrorModal({ onClose, message }: ErrorModalProps) {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-xs"
            onClick={onClose}>
            <div className="bg-white p-6 rounded-md max-w-xl w-full">
                <h2 className="text-2xl font-semibold mb-4">Oops!</h2>
                <p className="text-gray-700 mb-6 text-xl">{message}.</p>
                <div className="mt-10 flex justify-center">
                    <OkButton onClick={onClose} />
                </div>
            </div>
        </div>
    );
}

export default ErrorModal;