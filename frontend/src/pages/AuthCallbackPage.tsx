import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function AuthCallbackPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const token = searchParams.get("token");
        const error = searchParams.get("error");

        if (error) {
            let message = "Authentication failed. Please try again.";
            switch (error) {
                case "no_token":
                    message = "Failed to obtain token from Google.";
                    break;
                case "incomplete_info":
                    message = "Incomplete user information from Google.";
                    break;
                case "user_creation_failed":
                    message = "Failed to create or retrieve user.";
                    break;
                case "authentication_failed":
                    message = "Authentication failed. Please try again.";
                    break;
            }
            setErrorMessage(message);
            setStatus("error");
            
            setTimeout(() => {
                navigate("/login");
            }, 3000);
            return;
        }

        if (token) {
            localStorage.setItem("token", token);
            setStatus("success");
            
            setTimeout(() => {
                navigate("/home");
            }, 1000);
        } else {
            setErrorMessage("No token received from authentication.");
            setStatus("error");
            setTimeout(() => {
                navigate("/login");
            }, 3000);
        }
    }, [searchParams, navigate]);

    return (
        <div className="flex items-center justify-center h-screen bg-slate-50">
            <div className="shadow-md p-10 rounded-sm bg-white w-full max-w-md mx-4 border border-slate-200">
                {status === "loading" && (
                    <div className="flex flex-col items-center space-y-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800"></div>
                        <p className="text-slate-600">Authenticating...</p>
                    </div>
                )}
                
                {status === "success" && (
                    <div className="flex flex-col items-center space-y-4">
                        <div className="text-green-500 text-5xl">✓</div>
                        <p className="text-slate-800 font-semibold">Authentication successful!</p>
                        <p className="text-slate-600 text-sm">Redirecting to home...</p>
                    </div>
                )}
                
                {status === "error" && (
                    <div className="flex flex-col items-center space-y-4">
                        <div className="text-red-500 text-5xl">✗</div>
                        <p className="text-slate-800 font-semibold">Authentication failed</p>
                        <p className="text-red-500 text-sm text-center">{errorMessage}</p>
                        <p className="text-slate-600 text-sm">Redirecting to login...</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AuthCallbackPage;
