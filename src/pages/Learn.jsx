// src/pages/Learn.jsx - Enhanced Learning Center
import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { getLearningContentForStudent, groupLearningContent } from "../services/learnService";

function RoadSignVisual({ item }) {
    const visual = item.sign_visual;

    if (!visual) {
        return (
            <div className="mb-4 flex h-40 items-center justify-center rounded-2xl bg-red-50">
                <div className="flex h-24 w-24 items-center justify-center rounded-full border-8 border-secondary bg-white text-4xl">
                    🛑
                </div>
            </div>
        );
    }

    if (visual.shape === "octagon") {
        return (
            <div className="mb-4 flex h-40 items-center justify-center rounded-2xl bg-red-50">
                <div
                    className="flex h-28 w-28 items-center justify-center bg-secondary text-2xl font-black text-white shadow-lg"
                    style={{ clipPath: "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)" }}
                >
                    {visual.label}
                </div>
            </div>
        );
    }

    if (visual.shape === "no_parking") {
        return (
            <div className="mb-4 flex h-40 items-center justify-center rounded-2xl bg-blue-50">
                <div className="relative flex h-28 w-28 items-center justify-center rounded-full border-8 border-secondary bg-white text-5xl font-black text-primary shadow-lg">
                    {visual.label}
                    <span className="absolute h-2 w-28 rotate-45 rounded-full bg-secondary" />
                </div>
            </div>
        );
    }

    if (visual.shape === "warning") {
        return (
            <div className="mb-4 flex h-40 items-center justify-center rounded-2xl bg-yellow-50">
                <div className="flex h-28 w-28 rotate-45 items-center justify-center rounded-2xl border-8 border-yellow-500 bg-yellow-200 shadow-lg">
                    <span className="-rotate-45 text-4xl">{visual.label}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="mb-4 flex h-40 items-center justify-center rounded-2xl bg-slate-50">
            <div className="flex h-28 w-28 items-center justify-center rounded-full border-8 border-secondary bg-white text-4xl font-black text-slate-900 shadow-lg">
                {visual.label}
            </div>
        </div>
    );
}

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
        <Layout showBottomNav={true} title="Learn Driving" contentClassName="flex-1 overflow-y-auto bg-slate-100">
            <div className="mx-auto max-w-5xl md:px-4 md:py-6">
                <div className="bg-primary px-5 py-5 text-white shadow-lg md:rounded-t-[2rem]">
                    <h1 className="text-center text-xl font-black">Learn Driving</h1>
                    <p className="mt-1 text-center text-sm text-blue-100">Lessons, road signs, tips, and maintenance</p>
                </div>

                {loading ? (
                    <div className="mx-4 mt-5 rounded-[1.5rem] bg-white p-8 text-center text-gray-500 shadow">
                        Loading learning content...
                    </div>
                ) : (
                    <div className="space-y-5 px-4 py-5 md:rounded-b-[2rem] md:bg-white md:p-6 md:shadow-xl">
                        <div className="flex items-center justify-between">
                            <h2 className="font-black text-slate-900">Categories</h2>
                            <span className="text-sm font-black text-secondary">View all</span>
                        </div>

                        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                            {groups.map((group) => (
                                <button
                                    key={group.value}
                                    onClick={() => setActiveType(group.value)}
                                    className={`rounded-[1.5rem] p-4 text-left shadow transition hover:-translate-y-1 ${
                                        activeType === group.value
                                            ? "bg-primary text-white"
                                            : "bg-white text-gray-800 hover:shadow-lg"
                                    }`}
                                >
                                    <div className={`mb-3 flex h-12 w-12 items-center justify-center rounded-2xl text-2xl ${
                                        activeType === group.value ? "bg-white/20" : "bg-primary/10"
                                    }`}>
                                        {group.icon}
                                    </div>
                                    <p className="font-bold">{group.label}</p>
                                    <p className={activeType === group.value ? "text-white/80 text-sm" : "text-gray-500 text-sm"}>
                                        {group.items.length} items
                                    </p>
                                </button>
                            ))}
                        </div>

                        {!activeGroup || activeGroup.items.length === 0 ? (
                            <div className="rounded-[1.5rem] border border-primary/20 bg-blue-50 p-6 text-center">
                                <p className="text-gray-600">No content available in this section yet.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <h3 className="text-2xl font-black text-primary">
                                    {activeGroup.icon} {activeGroup.label}
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {activeGroup.items.map((item) => (
                                        <article key={item.id} className="bg-white rounded-[1.5rem] shadow p-5 border border-gray-100">
                                            <div className="flex items-start justify-between gap-3 mb-3">
                                                <h4 className="text-lg font-black text-primary">{item.title}</h4>
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

                                            {item.type === "road_sign" && !item.file_url && (
                                                <RoadSignVisual item={item} />
                                            )}

                                            {item.type === "road_sign" && (
                                                <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-secondary">
                                                    Sign meaning
                                                </p>
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
                    </div>
                )}

                <div className="mx-4 mb-5 rounded-[1.5rem] border-l-4 border-success bg-green-50 p-6 md:mx-0">
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
