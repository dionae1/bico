interface LoadingProps {
    size?: 'small' | 'medium' | 'large';
    fullScreen?: boolean;
    message?: string;
}

function Loading({ size = 'medium', fullScreen = false, message }: LoadingProps) {
    const sizeClasses = {
        small: 'w-8 h-8 border-2',
        medium: 'w-12 h-12 border-3',
        large: 'w-16 h-16 border-4'
    };

    const containerClasses = fullScreen
        ? 'flex flex-col items-center justify-center min-h-screen'
        : 'flex flex-col items-center justify-center py-12';

    return (
        <div className={containerClasses}>
            <div
                className={`${sizeClasses[size]} border-slate-300 border-t-slate-600 rounded-full animate-spin`}
                role="status"
                aria-label="Loading"
            />
            {message && (
                <p className="mt-4 text-slate-600 text-sm font-medium animate-pulse">
                    {message}
                </p>
            )}
        </div>
    );
}

export default Loading;
