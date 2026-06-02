// src/pages/Learn.jsx
import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { getLearnCategories } from "../services/learnService";

export default function Learn() {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        async function load() {
            const data = await getLearnCategories();
            setCategories(data);
        }
        load();
    }, []);

    return (
        <Layout showBottomNav={true}>
            <h2 className="text-xl font-bold text-primary mb-4">Learn to Drive</h2>
            <div className="space-y-4">
                {categories.map((cat) => (
                    <div
                        key={cat.name}
                        className="bg-white rounded-2xl shadow p-5 flex justify-between items-center"
                    >
                        <div className="flex items-center gap-3">
                            <span className="text-3xl">{cat.icon}</span>
                            <div>
                                <h3 className="font-bold text-lg">{cat.name}</h3>
                                <p className="text-gray-500 text-sm">{cat.lessonCount} lessons</p>
                            </div>
                        </div>
                        <button className="text-primary font-semibold">Start →</button>
                    </div>
                ))}
            </div>
        </Layout>
    );
}