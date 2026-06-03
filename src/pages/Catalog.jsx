// src/pages/Catalog.jsx
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

const plans = [
    {
        title: "Regular Training",
        duration: "2 Weeks",
        price: "₦90,000",
        highlight: false,
        icon: "🚗",
        description: "Essential driving fundamentals",
        features: [
            "Professional instruction",
            "2-week intensive course",
            "Vehicle provided",
            "All safety equipment",
            "Progress tracking"
        ]
    },
    {
        title: "Special Training",
        desc: "Home Pick-up/Drop-off",
        duration: "2 Weeks",
        price: "₦300,000",
        highlight: false,
        icon: "🏠",
        description: "Premium convenience & comfort",
        features: [
            "Home pickup & drop-off",
            "2-week intensive course",
            "Premium vehicle",
            "One-on-one instruction",
            "Flexible scheduling"
        ]
    },
    {
        title: "Premium + Certificate",
        price: "₦330,000",
        highlight: true,
        icon: "🎓",
        duration: "2 Weeks",
        description: "Complete training with certification",
        features: [
            "All Special Training features",
            "Official NAMU Certificate",
            "Exam preparation",
            "Document assistance",
            "Lifetime support"
        ]
    },
    {
        title: "Premium + 3-Year License",
        price: "₦370,000",
        highlight: false,
        icon: "📋",
        duration: "2 Weeks",
        description: "Complete package with license",
        features: [
            "All Premium features",
            "3-Year License support",
            "Advanced defensive driving",
            "Insurance guidance",
            "Lifetime support"
        ]
    },
];

export default function Catalog() {
    const navigate = useNavigate();

    return (
        <Layout showBottomNav={true}>
            <div className="space-y-6">
                <div className="bg-gradient-to-r from-primary to-blue-900 text-white rounded-2xl p-6 shadow-lg">
                    <h2 className="text-3xl font-bold mb-2">📋 Service Catalog</h2>
                    <p className="text-blue-100">Choose the perfect training package for your needs</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {plans.map((plan, i) => (
                        <div
                            key={i}
                            className={`rounded-2xl overflow-hidden transition transform hover:scale-105 ${
                                plan.highlight 
                                    ? "bg-gradient-to-br from-secondary/20 to-red-50 border-4 border-secondary shadow-2xl md:col-span-2 md:max-w-lg" 
                                    : "bg-white shadow-lg border border-gray-200 hover:shadow-2xl"
                            }`}
                        >
                            {plan.highlight && (
                                <div className="bg-gradient-to-r from-secondary to-red-600 text-white py-2 px-4 text-center font-bold text-sm">
                                    ⭐ MOST POPULAR CHOICE
                                </div>
                            )}

                            <div className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <div className="text-5xl mb-2">{plan.icon}</div>
                                        <h3 className="font-bold text-2xl text-primary">{plan.title}</h3>
                                    </div>
                                </div>

                                {plan.desc && <p className="text-secondary font-semibold text-sm mb-2">📌 {plan.desc}</p>}
                                <p className="text-gray-600 text-sm mb-4">{plan.description}</p>

                                <div className="bg-gray-50 rounded-xl p-4 mb-4">
                                    <div className="text-primary text-4xl font-bold">{plan.price}</div>
                                    <div className="text-gray-600 text-sm mt-1">⏱️ {plan.duration}</div>
                                </div>

                                <div className="space-y-2 mb-6">
                                    {plan.features?.map((feature, idx) => (
                                        <div key={idx} className="flex items-start text-sm">
                                            <span className="text-secondary mr-2 font-bold">✓</span>
                                            <span className="text-gray-700">{feature}</span>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    onClick={() => navigate("/register")}
                                    className={`w-full py-3 rounded-xl font-bold transition transform hover:scale-105 text-white ${
                                        plan.highlight
                                            ? "bg-gradient-to-r from-secondary to-red-600 shadow-lg"
                                            : "bg-primary hover:bg-blue-900"
                                    }`}
                                >
                                    Enroll Now →
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-blue-50 border-l-4 border-primary rounded-lg p-5 mt-8">
                    <h3 className="font-bold text-primary mb-2">💡 Need Help Choosing?</h3>
                    <p className="text-gray-700 text-sm mb-3">
                        Not sure which package is right for you? Our instructors can help!
                    </p>
                    <button className="text-secondary font-semibold text-sm hover:underline">
                        Contact us for a free consultation
                    </button>
                </div>
            </div>
        </Layout>
    );
}