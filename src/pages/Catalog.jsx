// src/pages/Catalog.jsx
import Layout from "../components/Layout";

const plans = [
    {
        title: "Regular Training",
        duration: "2 Weeks",
        price: "₦90,000",
    },
    {
        title: "Special Training",
        desc: "Home Pick-up/Drop-off",
        price: "₦300,000",
    },
    {
        title: "Premium + Certificate",
        price: "₦330,000",
        highlight: true,
    },
    {
        title: "Premium + 3-Year License",
        price: "₦370,000",
    },
];

export default function Catalog() {
    return (
        <Layout title="Catalog">
            <div className="space-y-4">
                {plans.map((plan, i) => (
                    <div
                        key={i}
                        className={`bg-white p-5 rounded-2xl shadow ${
                            plan.highlight ? "border-2 border-secondary" : ""
                        }`}
                    >
                        <h3 className="font-bold">{plan.title}</h3>
                        <p className="text-gray-500 text-sm">{plan.desc}</p>
                        <p className="text-primary text-xl mt-2 font-semibold">
                            {plan.price}
                        </p>

                        <button className="mt-4 w-full bg-secondary text-white py-2 rounded-xl">
                            Select Plan
                        </button>
                    </div>
                ))}
            </div>
        </Layout>
    );
}