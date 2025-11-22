function OkButton({ onClick, label = "OK" }: { onClick: () => void; label?: string }) {
    return (
        <button
            onClick={onClick}
            className="text-white font-medium text-center text-lg bg-slate-600 p-2 rounded-sm hover:bg-slate-700 transition-colors cursor-pointer w-full shadow-sm"
        >
            {label}
        </button>
    );
}

export default OkButton;