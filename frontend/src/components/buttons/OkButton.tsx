function OkButton({ onClick, label = "OK" }) {
    return (
        <button
            onClick={onClick}
            className="text-white font-bold text-center text-xl bg-gray-600 p-2 rounded-md hover:bg-gray-700 transition-colors cursor-pointer w-full"
        >
            {label}
        </button>
    );
}

export default OkButton;