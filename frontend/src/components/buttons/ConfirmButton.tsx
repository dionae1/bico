function ConfirmButton({ onClick }: { onClick: () => void }) {
    return (
        <button onClick={onClick} className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2 px-4 rounded-sm cursor-pointer transition-colors duration-200 shadow-sm">
            Confirm
        </button>
    );
}

export default ConfirmButton;