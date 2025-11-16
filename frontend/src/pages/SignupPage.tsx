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
            console.error("Signup failed:", error);
        }
    };

    return (
        <>
            <div className="flex items-center justify-center h-screen bg-gray-100">
                <div className="shadow-lg/10 p-10 rounded-lg bg-white w-1/3">
                    <div>
                        <button
                            className="text-gray-500 text-xl font-bold hover:cursor-pointer float-right"
                            onClick={() => navigate(-1)}
                        >X</button>
                    </div>
                    <div className="flex flex-col items-center justify-center mt-10 space-x-4">
                        <h1 className="text-3xl font-bold text-center text-gray-800">Create your account</h1>
                        <h2 className="text-lg text-gray-600">Please enter your details to sign up</h2>
                    </div>

                    <form action="" className="flex flex-col justify-center m-auto mb-5 mt-10 w-3/4 space-y-4" onSubmit={handleSignup}>
                        <FormInput id="name" label="Name" placeholder="Name" type="text" value={name} onChange={(e) => setName(e.target.value)} />
                        {(name && invalidName) && <p className="text-red-500">Name must be between 8 and 50 characters and can only contain letters and spaces.</p>}
                        <FormInput id="email" label="Email" placeholder="Email" type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
                        {(email && invalidEmail) && <p className="text-red-500">Invalid email format.</p>}
                        <FormInput id="password" label="Password" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        {(password && invalidPassword) && <p className="text-red-500">Password must be at least 4 characters long.</p>}
                        <FormButton title="Sign Up" onClick={handleSignup} />
                    </form>
                </div>
            </div>
        </>
    );
}

export default SignupPage;
