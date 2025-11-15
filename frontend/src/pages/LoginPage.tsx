import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/auth";
import { isValidEmail, isValidPassword } from "../services/util";

import FormButton from "../components/buttons/FormButton";
import FormInput from "../components/FormInput";

function LoginPage() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [invalidEmail, setInvalidEmail] = useState(true);
    const [invalidPassword, setInvalidPassword] = useState(true);

    const validateForm = () => {
        setInvalidEmail(!isValidEmail(email));
        setInvalidPassword(!isValidPassword(password));
        return isValidEmail(email) && isValidPassword(password);
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            validateForm();
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [email, password]);

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!email || !password) {
            alert("Please enter both email and password.");
            return;
        }

        if (!validateForm()) {
            alert("Please enter valid email and password.");
            return;
        }

        try {
            const data = await login(email, password);

            if (data["access_token"]) {
                navigate("/home");
            }

        } catch (error) {
            console.error("Login failed:", error);
            alert("Login failed. Please check your credentials and try again.");
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="shadow-lg/10 p-10 rounded-lg bg-white w-1/3">
                <div>
                    <button
                        className="text-gray-500 text-xl font-bold hover:cursor-pointer float-right"
                        onClick={() => navigate(-1)}
                    >X</button>
                </div>
                <div className="flex flex-col items-center justify-center mt-10 space-x-4">
                    <h1 className="text-2xl font-bold text-center">Welcome back to BiCO</h1>
                    <h2 className="text-lg text-gray-600">Please enter your credentials to continue</h2>
                </div>

                <form action="" className="flex flex-col justify-center m-auto mb-5 mt-10 w-3/4 space-y-4" onSubmit={handleLogin}>
                    <div>
                        <FormInput id="email" label="Email" placeholder="Email" type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
                        {(email && invalidEmail) && <p className="text-red-500">Invalid email format.</p>}
                    </div>
                    <div>
                        <FormInput id="password" label="Password" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        {(password && invalidPassword) && <p className="text-red-500">Password must be at least 4 characters long.</p>}
                    </div>
                    <FormButton title="Login" onClick={handleLogin} />
                </form>
            </div>
        </div>
    );
}

export default LoginPage;