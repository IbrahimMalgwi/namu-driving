// src/pages/Register.jsx - Enhanced with Better Package Display
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

    const packages = [
        { value: "regular", label: "Regular Training", price: "₦90,000", icon: "🚗" },
        { value: "special", label: "Special Training (Home Pickup)", price: "₦300,000", icon: "🏠" },
        { value: "premium_certificate", label: "Premium + Certificate", price: "₦330,000", icon: "🎓" },
        { value: "premium_license", label: "Premium + 3-Year License", price: "₦370,000", icon: "📋" },
    ];

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
        <div className="min-h-screen bg-gradient-to-b from-primary/10 to-muted">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-blue-900 text-white py-8 text-center">
                <h1 className="text-4xl font-bold">NAMU DRIVING SCHOOL</h1>
                <p className="text-blue-100 mt-2">Giving you confidence on the wheel</p>
            </div>

            <div className="max-w-2xl mx-auto px-4 py-8">
                {/* Form Card */}
                <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
                    <h2 className="text-3xl font-bold text-primary text-center mb-2">Create Your Account</h2>
                    <p className="text-center text-gray-600 mb-8">Join our female-led driving academy and start your journey to confident driving</p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                required
                                placeholder="Full name"
                                className="border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition"
                                value={form.fullName}
                                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                            />
                            <input
                                required
                                placeholder="Phone number"
                                className="border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition"
                                value={form.phone}
                                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                            />
                        </div>

                        <input
                            required
                            type="email"
                            placeholder="Email address"
                            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                        />
                        <input
                            required
                            type="password"
                            placeholder="Password (min 6 characters)"
                            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                        />

                        {/* Package Selection */}
                        <div className="mt-8">
                            <label className="block font-bold text-primary mb-4">Choose Your Training Package:</label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {packages.map(pkg => (
                                    <button
                                        key={pkg.value}
                                        type="button"
                                        onClick={() => setForm({ ...form, trainingPackage: pkg.value })}
                                        className={`p-4 rounded-xl border-2 transition text-left ${
                                            form.trainingPackage === pkg.value
                                                ? "border-secondary bg-red-50 ring-2 ring-secondary/50"
                                                : "border-gray-200 bg-white hover:border-secondary"
                                        }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="text-2xl mb-1">{pkg.icon}</div>
                                                <p className="font-bold text-sm text-gray-800">{pkg.label}</p>
                                                <p className="text-secondary font-bold">{pkg.price}</p>
                                            </div>
                                            <span className="text-2xl">
                                                {form.trainingPackage === pkg.value ? "✓" : ""}
                                            </span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {message && <p className="text-green-600 font-semibold text-center p-3 bg-green-50 rounded-xl">{message}</p>}
                        {errorText && <p className="text-red-600 font-semibold text-center p-3 bg-red-50 rounded-xl">{errorText}</p>}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-secondary to-red-600 text-white rounded-xl py-4 font-bold text-lg hover:shadow-xl transition disabled:opacity-60 transform hover:scale-105"
                        >
                            {loading ? "Creating Account..." : "Create Account & Start Learning"}
                        </button>
                    </form>

                    <div className="text-center mt-8">
                        <p className="text-gray-600 mb-2">Already have an account?</p>
                        <button
                            onClick={() => navigate("/login")}
                            className="text-primary font-bold hover:underline text-lg"
                        >
                            Sign in here
                        </button>
                    </div>
                </div>

                {/* Trust Section */}
                <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="bg-white rounded-xl p-4 shadow">
                        <div className="text-3xl mb-2">👩‍🏫</div>
                        <p className="text-sm font-semibold text-gray-700">Female Instructors</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow">
                        <div className="text-3xl mb-2">🛡️</div>
                        <p className="text-sm font-semibold text-gray-700">Safe & Certified</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow">
                        <div className="text-3xl mb-2">📈</div>
                        <p className="text-sm font-semibold text-gray-700">Track Progress</p>
                    </div>
                </div>

                <p className="text-center text-xs text-gray-500 mt-8">
                    By signing up, you agree to our Terms & Conditions and Privacy Policy
                </p>
            </div>
        </div>
    );
}