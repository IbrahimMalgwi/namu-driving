// src/pages/Learn.jsx - Enhanced Learning Center
import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { getLearningContentForStudent, groupLearningContent } from "../services/learnService";

export default function Learn() {
    const [groups, setGroups] = useState([]);
    const [activeType, setActiveType] = useState("lesson");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const data = await getLearningContentForStudent();
                setGroups(groupLearningContent(data));
            } catch (err) {
                console.error("Error loading learning content:", err);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    const activeGroup = groups.find((group) => group.value === activeType);

    return (
        <Layout showBottomNav={true}>
            <div className="space-y-6">
                <div className="bg-gradient-to-r from-primary to-blue-900 text-white rounded-2xl p-6 shadow-lg">
                    <h2 className="text-3xl font-bold mb-2">📚 Learn to Drive</h2>
                    <p className="text-blue-100">Lessons, road signs, driving tips, and car maintenance guidance for your training.</p>
                </div>

                {loading ? (
                    <div className="text-center py-8 text-gray-500">
                        Loading learning content...
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {groups.map((group) => (
                                <button
                                    key={group.value}
                                    onClick={() => setActiveType(group.value)}
                                    className={`rounded-2xl p-4 text-left shadow transition ${
                                        activeType === group.value
                                            ? "bg-secondary text-white"
                                            : "bg-white text-gray-800 hover:shadow-lg"
                                    }`}
                                >
                                    <div className="text-3xl mb-2">{group.icon}</div>
                                    <p className="font-bold">{group.label}</p>
                                    <p className={activeType === group.value ? "text-white/80 text-sm" : "text-gray-500 text-sm"}>
                                        {group.items.length} items
                                    </p>
                                </button>
                            ))}
                        </div>

                        {!activeGroup || activeGroup.items.length === 0 ? (
                            <div className="bg-blue-50 border border-primary/30 rounded-xl p-6 text-center">
                                <p className="text-gray-600">No content available in this section yet.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <h3 className="text-2xl font-bold text-primary">
                                    {activeGroup.icon} {activeGroup.label}
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {activeGroup.items.map((item) => (
                                        <article key={item.id} className="bg-white rounded-2xl shadow p-5 border border-gray-100">
                                            <div className="flex items-start justify-between gap-3 mb-3">
                                                <h4 className="text-lg font-bold text-primary">{item.title}</h4>
                                                <span className={`text-xs font-bold rounded-full px-3 py-1 ${
                                                    item.is_fixed
                                                        ? "bg-blue-50 text-primary"
                                                        : "bg-green-50 text-success"
                                                }`}>
                                                    {item.is_fixed ? "Fixed" : "Added"}
                                                </span>
                                            </div>

                                            {item.file_url && (
                                                item.file_url.match(/\.(jpg|jpeg|png|webp|gif)$/i) ? (
                                                    <img
                                                        src={item.file_url}
                                                        alt={item.title}
                                                        className="w-full h-48 object-cover rounded-xl mb-4 bg-gray-100"
                                                    />
                                                ) : (
                                                    <a
                                                        href={item.file_url}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="inline-block mb-4 text-secondary font-bold hover:underline"
                                                    >
                                                        Open uploaded file →
                                                    </a>
                                                )
                                            )}

                                            <p className="text-gray-700 leading-relaxed">{item.body}</p>

                                            {item.package_type && item.package_type !== "all" && (
                                                <p className="mt-4 text-xs font-semibold text-gray-500">
                                                    Package: {item.package_type.replaceAll("_", " ")}
                                                </p>
                                            )}
                                        </article>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}

                <div className="bg-green-50 border-l-4 border-success rounded-lg p-6">
                    <h3 className="font-bold text-success mb-3">💡 Learning Tips</h3>
                    <ul className="text-sm text-gray-700 space-y-2">
                        <li>✓ Review each section before your practical lesson</li>
                        <li>✓ Ask your instructor about any content assigned to your package</li>
                        <li>✓ Practice the skills during your training sessions</li>
                        <li>✓ Revisit road signs and maintenance tips regularly</li>
                    </ul>
                </div>
            </div>
        </Layout>
    );
}
