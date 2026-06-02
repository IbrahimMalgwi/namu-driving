// src/pages/Catalog.jsx
import Layout from "../components/Layout";

const plans = [
    { title: "Regular Training", duration: "2 Weeks", price: "₦90,000", highlight: false },
    { title: "Special Training", desc: "Home Pick-up/Drop-off", price: "₦300,000", highlight: false },
    { title: "Premium + Certificate", price: "₦330,000", highlight: true },
    { title: "Premium + 3-Year License", price: "₦370,000", highlight: false },
];

export default function Catalog() {
    return (
        <Layout showBottomNav={true}>
            <h2 className="text-xl font-bold text-primary mb-4">Service Catalog</h2>
            <div className="space-y-4">
                {plans.map((plan, i) => (
                    <div
                        key={i}
                        className={`bg-white p-5 rounded-2xl shadow ${plan.highlight ? "border-2 border-secondary" : ""}`}
                    >
                        <h3 className="font-bold text-lg">{plan.title}</h3>
                        {plan.desc && <p className="text-gray-500 text-sm">{plan.desc}</p>}
                        <p className="text-primary text-2xl mt-2 font-bold">{plan.price}</p>
                        <button className="mt-4 w-full bg-secondary text-white py-2 rounded-xl hover:bg-red-700">
                            Select Plan
                        </button>
                    </div>
                ))}
            </div>
        </Layout>
    );
}