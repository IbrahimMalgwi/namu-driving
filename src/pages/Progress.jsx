// src/pages/Progress.jsx - Student read-only performance view
import { useEffect, useMemo, useState } from "react";
import Layout from "../components/Layout";
import {
    buildProgressChecklist,
    getMyProgress,
    getProgressPercent,
    SKILL_EMOJIS,
} from "../services/progressService";

export default function Progress() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const data = await getMyProgress();
                setItems(buildProgressChecklist(data));
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    const percent = useMemo(() => getProgressPercent(items), [items]);
    const completed = items.filter((item) => item.is_completed).length;
    const remaining = Math.max(items.length - completed, 0);

    function ratingFor(item) {
        return item.is_completed ? 5 : 3;
    }

    return (
        <Layout showBottomNav={true} title="My Progress" contentClassName="flex-1 overflow-y-auto bg-gradient-to-br from-sky-50 via-white to-amber-50">
            <div className="mx-auto max-w-4xl md:px-4 md:py-6">
                <div className="bg-gradient-to-r from-primary via-sky to-success px-5 py-5 text-white shadow-xl md:rounded-t-[2rem]">
                    <h1 className="text-center text-xl font-black">My Progress</h1>
                    <p className="mt-1 text-center text-sm text-blue-100">View your instructor-updated performance</p>
                </div>

                <div className="space-y-5 px-4 py-5 md:rounded-b-[2rem] md:bg-white/90 md:p-6 md:shadow-xl md:ring-1 md:ring-sky-100">
                    {loading ? (
                        <div className="rounded-[1.5rem] bg-white p-8 text-center text-slate-500 shadow">Loading your progress...</div>
                    ) : (
                        <>
                            <section className="rounded-[1.5rem] bg-white p-5 shadow">
                                <h2 className="mb-5 font-black text-slate-900">Overall Progress</h2>
                                <div className="grid gap-5 md:grid-cols-[180px_1fr] md:items-center">
                                    <div className="relative mx-auto h-36 w-36">
                                        <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
                                            <circle cx="60" cy="60" r="49" fill="none" stroke="#eef2f7" strokeWidth="10" />
                                            <circle
                                                cx="60"
                                                cy="60"
                                                r="49"
                                                fill="none"
                                                stroke="#F5B700"
                                                strokeWidth="10"
                                                strokeDasharray={`${(percent / 100) * 308} 308`}
                                                strokeLinecap="round"
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                            <p className="text-3xl font-black text-primary">{percent}%</p>
                                            <p className="text-xs font-bold text-slate-500">Completed</p>
                                        </div>
                                    </div>

                                    <div className="grid gap-3 sm:grid-cols-3">
                                        <Stat label="Lessons Completed" value={completed} />
                                        <Stat label="Lessons Remaining" value={remaining} />
                                        <Stat label="Total Lessons" value={items.length} />
                                    </div>
                                </div>
                            </section>

                            <section className="rounded-[1.5rem] bg-white p-5 shadow">
                                <div className="mb-4 flex items-center justify-between">
                                    <div>
                                        <h2 className="font-black text-slate-900">Skill Breakdown</h2>
                                        <p className="text-xs font-semibold text-slate-500">Students can view only. Instructors update status.</p>
                                    </div>
                                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-primary">View only</span>
                                </div>

                                <div className="space-y-3">
                                    {items.map((item) => (
                                        <div key={item.skill_name} className="flex items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                                            <div className="flex items-center gap-3">
                                                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-xl text-white">
                                                    {SKILL_EMOJIS[item.skill_name] || "🎯"}
                                                </span>
                                                <div>
                                                    <p className="font-black text-slate-800">{item.skill_name}</p>
                                                    <p className={`text-xs font-bold ${item.is_completed ? "text-green-600" : "text-slate-500"}`}>
                                                        {item.is_completed ? "Completed" : "In progress"}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm text-gold">{"★".repeat(ratingFor(item))}<span className="text-slate-300">{"★".repeat(5 - ratingFor(item))}</span></div>
                                                <p className="text-xs font-black text-slate-500">{ratingFor(item).toFixed(1)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </>
                    )}
                </div>
            </div>
        </Layout>
    );
}

function Stat({ label, value }) {
    return (
        <div className="rounded-2xl bg-slate-50 p-4 text-center">
            <p className="text-2xl font-black text-primary">{value}</p>
            <p className="mt-1 text-xs font-bold text-slate-500">{label}</p>
        </div>
    );
}
