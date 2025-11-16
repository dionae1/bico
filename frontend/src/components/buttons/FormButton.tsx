function FormButton({ title, onClick, isValid = true }: { title: string; onClick: (e: any) => any; isValid?: boolean }) {
    const validStyle = "bg-emerald-400 text-white hover:bg-emerald-500 hover:cursor-pointer";
    const invalidStyle = "bg-gray-500 cursor-not-allowed";

    return (
        <button
            onClick={onClick}
            className={`min-w-1/5 m-auto py-2 px-4 text-white rounded-md transition-colors duration-75 ${isValid ? validStyle : invalidStyle}`}
            disabled={!isValid}
        >
            <div className="flex items-center justify-center">
                <span>{title}</span>
            </div>
        </button>
    );
}

export default FormButton;
