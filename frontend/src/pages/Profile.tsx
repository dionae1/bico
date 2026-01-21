import { useState, useEffect } from "react";
import { capitalize } from "../services/util";

import Loading from "../components/Loading";
import FormInput from "../components/FormInput";
import FormButton from "../components/buttons/FormButton";

import api from "../api/client";
import { FaUserCircle } from "react-icons/fa";
import { AxiosError } from "axios";

interface User {
    id: number;
    name: string;
    email: string;
}

function Profile() {
    const [user, setUser] = useState<User | null>(null);
    const [originalUser, setOriginalUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get("/users/me");
                setUser(response.data);
                setOriginalUser(response.data);
            } catch (error) {
                if (error instanceof AxiosError && error.response?.status !== 404)
                    console.error("Failed to fetch profile");
                
                setError("Failed to load profile.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const updateProfile = async () => {
        if (!user) return;
        try {
            setLoading(true);
            const response = await api.put(`/users/${user.id}`, {
                name: user.name,
                email: user.email,
            });
            setUser(response.data);
            setOriginalUser(response.data);
            setMessage("Profile updated successfully.");
            setError(null);
            setEditMode(false);
        } catch (err: any) {
            console.error("Error updating profile");
            setError(err?.response?.data?.detail || "Failed to update profile.");
            setMessage(null);
        } finally {
            setLoading(false);
        }
    };

    const handlePrimary = (e: any) => {
        e.preventDefault();
        if (editMode) {
            updateProfile();
        } else {
            setEditMode(true);
            setMessage(null);
            setError(null);
        }
    };

    const handleCancel = (e: any) => {
        e.preventDefault();
        setUser(originalUser);
        setEditMode(false);
        setMessage(null);
        setError(null);
    };

    if (loading) {
        return <Loading fullScreen message="Loading profile..." />;
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-xl font-bold text-center text-slate-800">
                Profile Settings
            </h1>

            <div className="mt-10 max-w-4xl mx-auto bg-white shadow-sm rounded-sm border border-slate-200 p-10">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-20 h-20 bg-slate-200 flex items-center justify-center text-4xl text-slate-600">
                        {user?.name ? (
                            <span>
                                {user.name
                                    .split(" ")
                                    .map((p) => p[0])
                                    .slice(0, 2)
                                    .join("")
                                    .toUpperCase()}
                            </span>
                        ) : (
                            <FaUserCircle size={40} />
                        )}
                    </div>
                    <div className="flex-1 ml-2">
                        <div className="text-lg font-semibold text-slate-800">
                            {user ? capitalize(user.name) : "—"}
                        </div>
                        <div className="text-sm text-slate-500">{user?.email}</div>
                    </div>
                    <div className="flex flex-col items-end">
                        <div className="text-2xs font-bold text-slate-700">Account</div>
                        <div className="text-sm text-slate-500">Member</div>
                    </div>
                </div>

                {message && <div className="mb-4 text-sm text-green-600">{message}</div>}
                {error && <div className="mb-4 text-sm text-red-600">{error}</div>}

                <form className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-14">
                    <div>
                        <FormInput
                            id="name"
                            label="Name"
                            value={user ? user.name : ""}
                            disable={!editMode}
                            onChange={(e) => setUser(user ? { ...user, name: e.target.value } : null)}
                        />
                    </div>
                    <div>
                        <FormInput
                            id="email"
                            label="Email"
                            value={user ? user.email : ""}
                            disable={!editMode}
                            onChange={(e) => setUser(user ? { ...user, email: e.target.value } : null)}
                        />
                    </div>

                    <div className="md:col-span-2 flex justify-center gap-4 mt-2 mb-4 relative">
                        <FormButton
                            title={editMode ? "Save Profile" : "Edit Profile"}
                            onClick={handlePrimary}
                        />
                        {editMode && (
                            <button
                                onClick={handleCancel}
                                className="px-4 py-2 rounded-sm bg-slate-100 text-slate-700 hover:bg-slate-200 transition absolute right-0"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Profile;
// ...existing code...