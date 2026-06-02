// src/pages/Register.jsx
import { useState } from "react";
import { signUpStudent } from "../services/authService";

export default function Register() {
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

            // If user is null, Supabase requires email confirmation
            if (result.user === null) {
                setMessage(result.message || "Check your email to confirm your account.");
            } else {
                setMessage("Account created successfully! You can now login.");
                // Optional: clear form or redirect to login after a few seconds
                // setTimeout(() => navigate("/login"), 2000);
            }
        } catch (error) {
            setErrorText(error.message || "Unable to create account.");
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
                    Create Student Account
                </h1>

                <div className="mt-6 space-y-4">
                    <input
                        placeholder="Full name"
                        className="w-full border rounded-xl px-4 py-3"
                        value={form.fullName}
                        onChange={(e) =>
                            setForm({ ...form, fullName: e.target.value })
                        }
                    />

                    <input
                        placeholder="Phone number"
                        className="w-full border rounded-xl px-4 py-3"
                        value={form.phone}
                        onChange={(e) =>
                            setForm({ ...form, phone: e.target.value })
                        }
                    />

                    <input
                        type="email"
                        placeholder="Email address"
                        className="w-full border rounded-xl px-4 py-3"
                        value={form.email}
                        onChange={(e) =>
                            setForm({ ...form, email: e.target.value })
                        }
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full border rounded-xl px-4 py-3"
                        value={form.password}
                        onChange={(e) =>
                            setForm({ ...form, password: e.target.value })
                        }
                    />

                    <select
                        className="w-full border rounded-xl px-4 py-3"
                        value={form.trainingPackage}
                        onChange={(e) =>
                            setForm({ ...form, trainingPackage: e.target.value })
                        }
                    >
                        <option value="regular">Regular Training - ₦90,000</option>
                        <option value="special">Special Training - ₦300,000</option>
                        <option value="premium_certificate">
                            Premium + Certificate - ₦330,000
                        </option>
                        <option value="premium_license">
                            Premium + 3-Year License - ₦370,000
                        </option>
                    </select>
                </div>

                {message && (
                    <p className="text-green-600 text-sm mt-4">{message}</p>
                )}

                {errorText && (
                    <p className="text-red-600 text-sm mt-4">{errorText}</p>
                )}

                <button
                    disabled={loading}
                    className="w-full bg-secondary text-white rounded-xl py-3 mt-6 font-semibold disabled:opacity-60"
                >
                    {loading ? "Creating account..." : "Create Account"}
                </button>
            </form>
        </div>
    );
}