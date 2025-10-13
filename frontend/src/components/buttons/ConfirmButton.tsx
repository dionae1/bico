function ConfirmButton({ onClick }: { onClick: () => void }) {
    return (
        <button onClick={onClick} className="bg-emerald-400 hover:bg-emerald-500 text-white font-bold py-2 px-4 rounded cursor-pointer">
            Confirm
        </button>
    );
}

export default ConfirmButton;