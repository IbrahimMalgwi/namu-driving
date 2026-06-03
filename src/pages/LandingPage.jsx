// src/pages/LandingPage.jsx

import { useNavigate } from "react-router-dom";

export default function LandingPage() {
    const navigate = useNavigate();

    const features = [
        {
            title: "PROFESSIONAL TRAINING",
            desc: "Learn from experienced and certified female instructors.",
            icon: "👩‍🏫",
        },
        {
            title: "TRUSTED & SAFE",
            desc: "Certified methods ensuring your safety and confidence.",
            icon: "🛡️",
        },
        {
            title: "FLEXIBLE SCHEDULING",
            desc: "Book lessons easily anytime, anywhere with convenient pickups.",
            icon: "📅",
        },
        {
            title: "TRACK YOUR PROGRESS",
            desc: "Monitor your skills and confidence level in real-time.",
            icon: "📈",
        },
    ];

    const categories = [
        { name: "Traffic Signs", lessons: 12, icon: "🛑" },
        { name: "Parallel Parking", lessons: 8, icon: "🅿️" },
        { name: "Highway Driving", lessons: 10, icon: "🛣️" },
        { name: "Defensive Driving", lessons: 15, icon: "🚗" },
    ];

    const plans = [
        {
            title: "Regular Training",
            price: "₦90,000",
            duration: "2 Weeks",
            features: ["Vehicle provided", "2-week course", "Basic skills"],
            highlight: false
        },
        {
            title: "Special Training",
            price: "₦300,000",
            desc: "Home Pick-up/Drop-off",
            duration: "2 Weeks",
            features: ["Home pickup & dropoff", "2-week course", "Premium vehicle"],
            highlight: false
        },
        {
            title: "Premium + Certificate",
            price: "₦330,000",
            duration: "2 Weeks",
            features: ["All Special Training features", "Official Certificate", "Exam prep"],
            highlight: true
        },
        {
            title: "Premium + 3-Year License",
            price: "₦370,000",
            duration: "2 Weeks",
            features: ["All Premium features", "3-Year License", "Lifetime support"],
            highlight: false
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-primary via-blue-50 to-muted">
            {/* Header / Hero Section */}
            <div className="bg-gradient-to-r from-primary to-blue-900 text-white py-16 px-4 text-center relative overflow-hidden">
                <div className="max-w-4xl mx-auto relative z-10">
                    <h1 className="text-5xl md:text-6xl font-bold mb-3 drop-shadow-lg">NAMU DRIVING SCHOOL</h1>
                    <p className="text-xl md:text-2xl text-blue-100 mb-2 font-semibold">
                        🎯 Giving you confidence on the wheel
                    </p>
                    <p className="text-base md:text-lg text-blue-50 mb-8">
                        Female-led driving academy specializing in safe, professional training
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => navigate("/login")}
                            className="bg-secondary hover:bg-red-700 text-white font-semibold py-4 px-10 rounded-xl transition shadow-lg transform hover:scale-105"
                        >
                            Login
                        </button>
                        <button
                            onClick={() => navigate("/register")}
                            className="bg-white text-primary hover:bg-gray-100 font-semibold py-4 px-10 rounded-xl transition shadow-lg transform hover:scale-105"
                        >
                            Start Training
                        </button>
                    </div>
                    <div className="flex justify-center mt-8">
                        <button
                            onClick={() => navigate("/catalog")}
                            className="text-primary hover:text-secondary font-semibold text-lg transition underline"
                        >
                            View Full Catalog →
                        </button>
                    </div>
                </div>
            </div>

            {/* Features Grid */}
            <div className="max-w-6xl mx-auto px-4 py-16">
                <h2 className="text-3xl font-bold text-center text-primary mb-12">Why Choose NAMU?</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((f, i) => (
                        <div key={i} className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-2xl hover:-translate-y-2 transition duration-300">
                            <div className="text-5xl mb-4">{f.icon}</div>
                            <h3 className="font-bold text-primary text-lg mb-3">{f.title}</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Key Skills We Teach */}
            <div className="bg-white py-16">
                <div className="max-w-6xl mx-auto px-4">
                    <h2 className="text-3xl font-bold text-primary text-center mb-10">
                        ✨ Skills You'll Master
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {categories.map((cat, i) => (
                            <div key={i} className="border-2 border-primary/20 bg-gradient-to-br from-blue-50 to-white rounded-2xl p-6 hover:border-secondary hover:shadow-lg transition">
                                <div className="text-4xl mb-3">{cat.icon}</div>
                                <h3 className="font-bold text-lg text-primary mb-2">{cat.name}</h3>
                                <p className="text-gray-500">Comprehensive lessons</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Pricing Plans */}
            <div className="py-16 bg-gradient-to-b from-muted to-primary/5">
                <div className="max-w-6xl mx-auto px-4">
                    <h2 className="text-3xl font-bold text-primary text-center mb-12">
                        💰 Choose Your Training Package
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {plans.map((plan, i) => (
                            <div
                                key={i}
                                className={`bg-white rounded-2xl shadow-lg p-8 text-center relative transition transform hover:scale-105 ${
                                    plan.highlight ? "border-4 border-secondary ring-8 ring-secondary/10 md:row-span-2 md:col-span-1" : "border border-gray-200"
                                }`}
                            >
                                {plan.highlight && (
                                    <span className="absolute -top-4 right-4 bg-gradient-to-r from-secondary to-red-600 text-white text-xs px-4 py-1 rounded-full font-bold shadow-lg">
                                        ⭐ MOST POPULAR
                                    </span>
                                )}
                                <h3 className="font-bold text-2xl mb-2 text-primary">{plan.title}</h3>
                                {plan.desc && <p className="text-secondary text-sm font-semibold mb-3">{plan.desc}</p>}
                                <div className="text-primary text-4xl font-bold my-5">{plan.price}</div>
                                {plan.duration && <p className="text-gray-500 text-sm mb-5 font-medium">{plan.duration}</p>}
                                <ul className="text-left text-sm space-y-2 mb-6">
                                    {plan.features?.map((feature, idx) => (
                                        <li key={idx} className="flex items-center text-gray-700">
                                            <span className="text-secondary mr-2">✓</span>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                                <button
                                    onClick={() => navigate("/register")}
                                    className={`w-full py-3 rounded-xl font-semibold transition ${
                                        plan.highlight
                                            ? "bg-secondary hover:bg-red-700 text-white shadow-lg"
                                            : "bg-primary hover:bg-blue-900 text-white"
                                    }`}
                                >
                                    Enroll Now
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Call to Action */}
            <div className="bg-gradient-to-r from-primary to-blue-900 text-white py-16 text-center">
                <div className="max-w-2xl mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-4">🎯 Ready to Become a Confident Driver?</h2>
                    <p className="text-lg text-blue-100 mb-8">Join hundreds of women who've transformed their driving skills with NAMU Driving School</p>
                    <button
                        onClick={() => navigate("/register")}
                        className="bg-secondary hover:bg-red-700 text-white font-semibold py-4 px-12 rounded-xl transition shadow-lg transform hover:scale-105 text-lg"
                    >
                        Start Your Journey Today
                    </button>
                    <p className="text-sm text-blue-200 mt-8">
                        ✓ No experience necessary | ✓ Female instructors | ✓ Safe & professional
                    </p>
                </div>
            </div>
        </div>
    );
}