import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/auth";

import FormButton from "../components/buttons/FormButton";
import FormInput from "../components/FormInput";

function LoginPage() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!email || !password) {
            alert("Please enter both email and password.");
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
        <>
            <div className="flex items-center justify-center h-screen bg-gray-100">
                <div className="grid grid-cols-2 place-items-center mx-auto h-auto rounded-lg gap-10">
                    <img src={"/images/welcome.png"} alt="Welcome" className="w-full h-auto" />
                    <div className="shadow-lg/10 p-10 rounded-lg bg-white w-full">
                        <div className="flex flex-col items-center justify-center mt-10 space-x-4">
                            <h1 className="text-2xl font-bold text-center">Welcome back to BICO</h1>
                            <h2 className="text-lg text-gray-600">Please enter your credentials to continue</h2>
                        </div>

                        <form action="" className="flex flex-col justify-center m-auto mb-5 mt-10 w-3/4" onSubmit={handleLogin}>
                            <FormInput id="email" label="Email" placeholder="Email" type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
                            <FormInput id="password" label="Password" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                            <FormButton title="Login" onClick={handleLogin} />
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default LoginPage;