interface FormInputProps {
    id: string;
    label: string;
    placeholder?: string;
    type?: string;
    value: string | number;
    required?: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    disable?: boolean;
}

function FormInput({ id, label, placeholder, type = "text", value, required = false, onChange, disable = false }: FormInputProps) {
    return (
        <div className="mb-4">
            <label htmlFor={id} className="text-sm font-medium text-slate-700 mb-1.5 block">
                {label}
            </label>
            <input
                type={type}
                id={id}
                placeholder={placeholder}
                className="w-full p-2.5 border border-slate-300 rounded-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:bg-slate-100 disabled:text-slate-500 transition-all duration-200 shadow-sm"
                value={value}
                onChange={onChange}
                required={required}
                disabled={disable}
            />
        </div>
    );
}

export default FormInput;