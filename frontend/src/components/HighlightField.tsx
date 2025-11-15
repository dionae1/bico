interface HighlightFieldProps {
    legend: string;
    text: string
}

function HighlightField({ legend, text }: HighlightFieldProps) {
    return (
        <div className="space-y-1">
            <p className="text-md font-semibold">{legend}</p>
            <p className="py-1 text-lg rounded border-b border-gray-200">{text}</p>
        </div>
    );
}
export default HighlightField;