import { useState } from "react";
import { useNavigate } from "react-router-dom";

import FormButton from "../components/buttons/FormButton";
import FormInput from "../components/FormInput";

import { register, login } from "../services/auth";

function SignupPage() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const response = await register(name, email, password);

            if (response["success"] === true) {
                const loginSuccess = await login(email, password);

                if (loginSuccess) {
                    navigate("/home");
                }
            }

        } catch (error) {
            console.error("Signup failed:", error);
        }
    };

    return (
        <>
            <div className="flex items-center justify-center h-screen bg-gray-100">
                <div className="shadow-lg/10 p-10 rounded-lg bg-white w-2/5 flex flex-col items-center justify-center">
                    <h1 className="text-3xl font-bold text-center text-gray-800">Create your account</h1>
                    <h2 className="text-lg text-gray-600">Please enter your details to sign up</h2>
                    <form action="" className="flex flex-col justify-center m-auto mb-5 mt-10 w-3/4" onSubmit={handleSignup}>
                        <FormInput id="name" label="Name" placeholder="Name" type="text" value={name} onChange={(e) => setName(e.target.value)} />
                        <FormInput id="email" label="Email" placeholder="Email" type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
                        <FormInput id="password" label="Password" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        <FormButton title="Sign Up" onClick={handleSignup} />
                    </form>
                </div>
            </div>
        </>
    );
}

export default SignupPage;
