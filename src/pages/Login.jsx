// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signIn, getCurrentUserProfile } from "../services/authService";

export default function Login() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [errorText, setErrorText] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            setLoading(true);
            setErrorText("");
            await signIn(form.email, form.password);
            const profile = await getCurrentUserProfile();
            if (profile.role === "student") navigate("/");
            else navigate("/dashboard");
        } catch (error) {
            setErrorText(error.message || "Invalid email or password");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-muted flex items-center justify-center p-5">
            <div className="bg-white w-full max-w-md rounded-3xl shadow-xl p-6">
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-primary">Welcome Back!</h2>
                    <p className="text-gray-500 text-sm">Sign in to continue</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="email"
                        placeholder="Email address"
                        className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                    />
                    <div className="text-right">
                        <button type="button" className="text-sm text-secondary">
                            Forgot Password?
                        </button>
                    </div>
                    {errorText && <p className="text-red-500 text-sm">{errorText}</p>}
                    <button
                        disabled={loading}
                        className="w-full bg-primary text-white rounded-xl py-3 font-semibold disabled:opacity-60"
                    >
                        {loading ? "Signing in..." : "Login"}
                    </button>
                </form>

                <div className="text-center mt-6">
                    <p className="text-gray-500">or</p>
                    <button
                        onClick={() => navigate("/register")}
                        className="mt-2 w-full border border-primary text-primary rounded-xl py-3 font-semibold"
                    >
                        Create Account
                    </button>
                    <p className="text-xs text-gray-400 mt-4">
                        By continuing, you agree to our Terms & Conditions and Privacy Policy
                    </p>
                </div>
            </div>
        </div>
    );
}