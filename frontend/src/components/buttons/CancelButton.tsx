function CancelButton({ onClick }: { onClick: () => void }) {
    return (
        <button onClick={onClick} className="bg-red-400 hover:bg-red-500 text-white font-bold py-2 px-4 rounded cursor-pointer">
            Cancel
        </button>
    );
}

export default CancelButton;