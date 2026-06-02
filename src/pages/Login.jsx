// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signIn, getCurrentUserProfile } from "../services/authService";

export default function Login() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [errorText, setErrorText] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            setLoading(true);
            setErrorText("");

            await signIn(form.email, form.password);

            const profile = await getCurrentUserProfile();

            if (profile.role === "student") {
                navigate("/progress");
            } else {
                navigate("/dashboard");
            }
        } catch (error) {
            setErrorText(error.message || "Unable to login.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-muted flex items-center justify-center p-5">
            <form
                onSubmit={handleSubmit}
                className="bg-white w-full max-w-md rounded-3xl shadow-xl p-6"
            >
                <h1 className="text-2xl font-bold text-primary text-center">
                    NAMU DRIVING SCHOOL
                </h1>

                <p className="text-center text-sm text-gray-500 mt-1">
                    Giving you confidence on the wheel.
                </p>

                <div className="mt-8 space-y-4">
                    <input
                        type="email"
                        placeholder="Email address"
                        className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
                        value={form.email}
                        onChange={(e) =>
                            setForm({ ...form, email: e.target.value })
                        }
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
                        value={form.password}
                        onChange={(e) =>
                            setForm({ ...form, password: e.target.value })
                        }
                    />
                </div>

                {errorText && (
                    <p className="text-red-600 text-sm mt-4">{errorText}</p>
                )}

                <button
                    disabled={loading}
                    className="w-full bg-primary text-white rounded-xl py-3 mt-6 font-semibold disabled:opacity-60"
                >
                    {loading ? "Signing in..." : "Login"}
                </button>
            </form>
        </div>
    );
}