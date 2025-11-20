function CancelButton({ onClick }: { onClick: () => void }) {
    return (
        <button onClick={onClick} className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-sm cursor-pointer transition-colors duration-200 shadow-sm">
            Cancel
        </button>
    );
}

export default CancelButton;