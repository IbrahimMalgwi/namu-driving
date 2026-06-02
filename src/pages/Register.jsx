// src/pages/Register.jsx (fixed version with proper message handling)
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signUpStudent } from "../services/authService";

export default function Register() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        fullName: "",
        phone: "",
        email: "",
        password: "",
        trainingPackage: "regular",
    });
    const [message, setMessage] = useState("");
    const [errorText, setErrorText] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            setLoading(true);
            setErrorText("");
            setMessage("");

            const result = await signUpStudent(form);
            if (result.user === null) {
                setMessage(result.message || "Check your email to confirm your account.");
            } else {
                setMessage("Account created! Please verify your email (if required) then login.");
                setTimeout(() => navigate("/login"), 3000);
            }
        } catch (error) {
            setErrorText(error.message || "Unable to create account.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-muted flex items-center justify-center p-5">
            <div className="bg-white w-full max-w-md rounded-3xl shadow-xl p-6">
                <h1 className="text-2xl font-bold text-primary text-center">Create Account</h1>
                <p className="text-center text-gray-500 text-sm mb-6">Join us and learn to drive safely</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        placeholder="Full name"
                        className="w-full border rounded-xl px-4 py-3"
                        value={form.fullName}
                        onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    />
                    <input
                        placeholder="Phone number"
                        className="w-full border rounded-xl px-4 py-3"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    />
                    <input
                        type="email"
                        placeholder="Email address"
                        className="w-full border rounded-xl px-4 py-3"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full border rounded-xl px-4 py-3"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                    />
                    <select
                        className="w-full border rounded-xl px-4 py-3"
                        value={form.trainingPackage}
                        onChange={(e) => setForm({ ...form, trainingPackage: e.target.value })}
                    >
                        <option value="regular">Regular Training - ₦90,000</option>
                        <option value="special">Special Training - ₦300,000</option>
                        <option value="premium_certificate">Premium + Certificate - ₦330,000</option>
                        <option value="premium_license">Premium + 3-Year License - ₦370,000</option>
                    </select>

                    {message && <p className="text-green-600 text-sm">{message}</p>}
                    {errorText && <p className="text-red-600 text-sm">{errorText}</p>}

                    <button
                        disabled={loading}
                        className="w-full bg-secondary text-white rounded-xl py-3 font-semibold disabled:opacity-60"
                    >
                        {loading ? "Creating..." : "Create Account"}
                    </button>
                </form>

                <p className="text-center text-xs text-gray-400 mt-6">
                    By signing up, you agree to our Terms & Conditions and Privacy Policy
                </p>
            </div>
        </div>
    );
}