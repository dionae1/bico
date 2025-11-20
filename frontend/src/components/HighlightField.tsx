interface HighlightFieldProps {
    legend: string;
    text: string
}

function HighlightField({ legend, text }: HighlightFieldProps) {
    return (
        <div className="space-y-1">
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">{legend}</p>
            <p className="py-2 text-base text-slate-800 border-b border-slate-200">{text}</p>
        </div>
    );
}
export default HighlightField;