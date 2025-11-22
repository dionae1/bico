import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import FormButton from "../components/buttons/FormButton";
import FormInput from "../components/FormInput";

import { register, login } from "../services/auth";
import { isValidEmail, isValidPassword, isValidName } from "../services/util";

function SignupPage() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [invalidEmail, setInvalidEmail] = useState(true);
    const [invalidPassword, setInvalidPassword] = useState(true);
    const [invalidName, setInvalidName] = useState(true);

    const validateForm = () => {
        setInvalidEmail(!isValidEmail(email));
        setInvalidPassword(!isValidPassword(password));
        setInvalidName(!isValidName(name));
        return isValidEmail(email) && isValidPassword(password) && isValidName(name);
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            validateForm();
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [email, password, name]);

    const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!email || !password || !name) {
            alert("Please enter both email and password.");
            return;
        }

        if (!validateForm()) {
            alert("Please enter valid email, password, and name.");
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

        } catch (error) {
            console.error("Signup failed");
        }
    };

    return (
        <>
            <div className="flex items-center justify-center h-screen bg-slate-50">
                <div className="shadow-md p-10 rounded-sm bg-white w-full max-w-md border border-slate-200">
                    <div>
                        <button
                            className="text-slate-400 text-xl font-bold hover:text-slate-600 hover:cursor-pointer float-right transition-colors"
                            onClick={() => navigate(-1)}
                        >X</button>
                    </div>
                    <div className="flex flex-col items-center justify-center mt-10 space-x-4">
                        <h1 className="text-3xl font-bold text-center text-slate-800">Create your account</h1>
                        <h2 className="text-lg text-slate-600 mt-2">Please enter your details to sign up</h2>
                    </div>

                    <form action="" className="flex flex-col justify-center m-auto mb-5 mt-10 w-full space-y-4" onSubmit={handleSignup}>
                        <FormInput id="name" label="Name" placeholder="Name" type="text" value={name} onChange={(e) => setName(e.target.value)} />
                        {(name && invalidName) && <p className="text-red-500 text-sm mt-1">Name must be between 8 and 50 characters and can only contain letters and spaces.</p>}
                        <FormInput id="email" label="Email" placeholder="Email" type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
                        {(email && invalidEmail) && <p className="text-red-500 text-sm mt-1">Invalid email format.</p>}
                        <FormInput id="password" label="Password" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        {(password && invalidPassword) && <p className="text-red-500 text-sm mt-1">Password must be at least 4 characters long.</p>}
                        <FormButton title="Sign Up" onClick={handleSignup} />
                    </form>
                </div>
            </div>
        </>
    );
}

export default SignupPage;
