import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import FormButton from "../components/buttons/FormButton";
import FormInput from "../components/FormInput";

import { register, login, googleURI } from "../services/auth";
import { isValidEmail, isValidPassword, isValidName } from "../services/util";

function SignupPage() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [invalidEmail, setInvalidEmail] = useState(true);
    const [invalidPassword, setInvalidPassword] = useState(true);
    const [invalidName, setInvalidName] = useState(true);

    const [errorMessage, setErrorMessage] = useState("");

    const validateForm = () => {
        setInvalidEmail(!isValidEmail(email));
        setInvalidPassword(!isValidPassword(password));
        setInvalidName(!isValidName(name));
        return isValidEmail(email) && isValidPassword(password) && isValidName(name);
    };

    useEffect(() => {
        setErrorMessage("");
        const timeoutId = setTimeout(() => {
            validateForm();
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [email, password, name]);

    const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!email || !password || !name) {
            setErrorMessage("Please enter both email and password.");
            return;
        }

        if (!validateForm()) {
            setErrorMessage("Please enter valid email, password, and name.");
            return;
        }

        try {
            const response = await register(name, email, password);
            if (response.status === 201) {
                const loginSuccess = await login(email, password);
                if (loginSuccess) {
                    navigate("/home");
                }
            }
        } catch (error: any) {
            if (error.response && error.response.status === 409) {
                setErrorMessage("This email is already registered.");
            }
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const URI = await googleURI();
            window.location.href = URI;
        } catch (error) {
            setErrorMessage("Google login failed. Please try again.");
        }
    };  

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
            <div className="shadow-xl p-8 sm:p-10 rounded-lg bg-white w-full max-w-md border border-slate-200">
                <div className="flex justify-end">
                    <button
                        className="text-slate-400 text-xl font-semibold hover:text-slate-700 hover:cursor-pointer transition-colors duration-200"
                        onClick={() => navigate(-1)}
                        aria-label="Close"
                    >✕</button>
                </div>
                <div className="flex flex-col items-center justify-center mt-2">
                    <h1 className="text-3xl font-bold text-center text-slate-800">Create account</h1>
                    <p className="text-slate-600 mt-3 text-center">Start managing your business with BiCO</p>
                    {errorMessage && (
                        <div className="mt-4 w-full">
                            <p className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-md border border-red-200">{errorMessage}</p>
                        </div>
                    )}
                </div>

                <div className="mt-8">
                    <button 
                        onClick={handleGoogleLogin} 
                        className="flex items-center justify-center gap-3 w-full border-2 border-slate-300 rounded-lg p-3 hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 font-medium text-slate-700"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        Continue with Google
                    </button>
                </div>

                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-white text-slate-500">Or continue with email</span>
                    </div>
                </div>

                <form className="flex flex-col w-full space-y-4" onSubmit={handleSignup}>
                    <div>
                        <FormInput id="name" label="Name" placeholder="Enter your full name" type="text" value={name} onChange={(e) => setName(e.target.value)} />
                        {(name && invalidName) && <p className="text-red-500 text-xs mt-1.5">Name must be 8-50 characters with letters and spaces only.</p>}
                    </div>
                    <div>
                        <FormInput id="email" label="Email" placeholder="Enter your email" type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
                        {(email && invalidEmail) && <p className="text-red-500 text-xs mt-1.5">Please enter a valid email address.</p>}
                    </div>
                    <div>
                        <FormInput id="password" label="Password" placeholder="Create a password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        {(password && invalidPassword) && <p className="text-red-500 text-xs mt-1.5">Password must be at least 4 characters.</p>}
                    </div>
                    <FormButton title="Create Account" onClick={handleSignup} />
                </form>

                <div className="mt-6 text-center">
                    <p className="text-slate-600 text-sm">
                        Already have an account?{" "}
                        <button 
                            onClick={() => navigate("/login")} 
                            className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors"
                        >
                            Sign in
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default SignupPage;
