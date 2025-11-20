function FormButton({ title, onClick, isValid = true }: { title: string; onClick: (e: any) => any; isValid?: boolean }) {
    const validStyle = "bg-emerald-500 text-white hover:bg-emerald-600 hover:cursor-pointer shadow-sm";
    const invalidStyle = "bg-slate-300 text-slate-500 cursor-not-allowed";

    return (
        <button
            onClick={onClick}
            className={`min-w-1/5 m-auto py-2.5 px-6 font-medium rounded-sm transition-all duration-200 ${isValid ? validStyle : invalidStyle}`}
            disabled={!isValid}
        >
            <div className="flex items-center justify-center">
                <span>{title}</span>
            </div>
        </button>
    );
}

export default FormButton;
