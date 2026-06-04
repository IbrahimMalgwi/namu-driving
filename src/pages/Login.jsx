// src/pages/Login.jsx - Enhanced Design
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import BrandMark from "../components/BrandMark";
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
            if (profile.role === "student") navigate("/dashboard");
            else navigate("/instructor-dashboard");
        } catch (error) {
            setErrorText(error.message || "Invalid email or password");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Layout showPublicNav title="Login" contentClassName="flex-1 overflow-y-auto">
            <div className="min-h-[calc(100vh-84px)] bg-gradient-to-b from-[#061943] via-primary/10 to-muted flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="mb-8 flex justify-center">
                    <BrandMark light />
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-[2rem] shadow-2xl p-8">
                    <h2 className="text-2xl font-bold text-primary text-center mb-2">Welcome Back!</h2>
                    <p className="text-center text-gray-600 text-sm mb-8">Sign in to your account</p>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                            <input
                                type="email"
                                required
                                placeholder="you@example.com"
                                className="w-full border border-gray-200 rounded-2xl px-4 py-4 focus:outline-none focus:border-primary transition"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                            <input
                                type="password"
                                required
                                placeholder="Enter your password"
                                className="w-full border border-gray-200 rounded-2xl px-4 py-4 focus:outline-none focus:border-primary transition"
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                            />
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="button"
                                className="text-sm text-secondary hover:underline font-semibold"
                            >
                                Forgot Password?
                            </button>
                        </div>

                        {errorText && (
                            <div className="bg-red-50 border-l-4 border-secondary text-red-700 p-4 rounded">
                                <p className="font-semibold">Error</p>
                                <p className="text-sm">{errorText}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary text-white rounded-2xl py-4 font-bold text-lg hover:shadow-xl transition disabled:opacity-60 transform hover:scale-[1.01]"
                        >
                            {loading ? "Signing in..." : "Sign In"}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center my-6">
                        <div className="flex-1 border-t border-gray-300"></div>
                        <span className="px-3 text-gray-500 text-sm">or</span>
                        <div className="flex-1 border-t border-gray-300"></div>
                    </div>

                    {/* Sign Up Link */}
                    <button
                        onClick={() => navigate("/register")}
                        className="w-full border border-slate-300 text-primary rounded-2xl py-3 font-bold hover:bg-slate-50 transition"
                    >
                        Create New Account
                    </button>
                </div>

                {/* Trust Section */}
                <div className="mt-8 text-center">
                    <div className="flex justify-center gap-6 text-sm text-gray-600 mb-6">
                        <div>🛡️ Secure</div>
                        <div>👩‍🏫 Professional</div>
                        <div>📱 Easy to Use</div>
                    </div>
                    <p className="text-xs text-gray-400">
                        By continuing, you agree to our Terms & Conditions and Privacy Policy
                    </p>
                </div>
            </div>
            </div>
        </Layout>
    );
}
