// src/pages/Learn.jsx - Enhanced Learning Center
import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { getLearnCategories } from "../services/learnService";

export default function Learn() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const data = await getLearnCategories();
                setCategories(data);
            } catch (err) {
                console.error("Error loading categories:", err);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    return (
        <Layout showBottomNav={true}>
            <div className="space-y-6">
                {/* Header */}
                <div className="bg-gradient-to-r from-primary to-blue-900 text-white rounded-2xl p-6 shadow-lg">
                    <h2 className="text-3xl font-bold mb-2">📚 Learn to Drive</h2>
                    <p className="text-blue-100">Master essential driving skills with our comprehensive lessons</p>
                </div>

                {/* Learning Categories */}
                {loading ? (
                    <div className="text-center py-8 text-gray-500">
                        Loading lessons...
                    </div>
                ) : categories.length === 0 ? (
                    <div className="bg-blue-50 border border-primary/30 rounded-xl p-6 text-center">
                        <p className="text-gray-600">Lessons coming soon. Check back later!</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {categories.map((cat, idx) => (
                            <button
                                key={cat.name}
                                className="w-full bg-white hover:bg-gray-50 rounded-2xl shadow-lg hover:shadow-2xl p-6 transition transform hover:scale-105 text-left"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4 flex-1">
                                        <div className="text-5xl bg-blue-50 rounded-xl p-3">{cat.icon}</div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-xl text-primary">{cat.name}</h3>
                                            <div className="flex gap-3 mt-1">
                                                <span className="text-gray-500 text-sm">
                                                    📖 {cat.lessonCount || 0} lessons
                                                </span>
                                                <span className="text-success text-sm font-semibold">
                                                    ✓ Beginner Friendly
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-4xl text-primary opacity-20">→</div>
                                </div>

                                {/* Progress Bar (dummy) */}
                                <div className="mt-4 w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                                    <div
                                        className="bg-gradient-to-r from-primary to-blue-900 h-full"
                                        style={{ width: `${Math.random() * 60 + 20}%` }}
                                    ></div>
                                </div>
                            </button>
                        ))}
                    </div>
                )}

                {/* Learning Tips */}
                <div className="bg-green-50 border-l-4 border-success rounded-lg p-6">
                    <h3 className="font-bold text-success mb-3">💡 Learning Tips</h3>
                    <ul className="text-sm text-gray-700 space-y-2">
                        <li>✓ Watch each lesson carefully</li>
                        <li>✓ Practice the skills during your training sessions</li>
                        <li>✓ Mark skills as complete in your Progress tracker</li>
                        <li>✓ Review lessons anytime you need a refresher</li>
                    </ul>
                </div>
            </div>
        </Layout>
    );
}