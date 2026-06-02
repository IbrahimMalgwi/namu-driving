// src/pages/Progress.jsx (already good, just ensure colors match)
import { useEffect, useMemo, useState } from "react";
import Layout from "../components/Layout";
import { getMyProgress, updateProgress } from "../services/progressService";

export default function Progress() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const data = await getMyProgress();
                setItems(data);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    async function toggle(item) {
        const newCompleted = !item.is_completed;
        setItems(prev => prev.map(i => i.id === item.id ? { ...i, is_completed: newCompleted } : i));
        try {
            await updateProgress(item.id, newCompleted);
        } catch (err) {
            // revert on error
            setItems(prev => prev.map(i => i.id === item.id ? { ...i, is_completed: !newCompleted } : i));
        }
    }

    const percent = useMemo(() => {
        if (!items.length) return 0;
        const completed = items.filter(i => i.is_completed).length;
        return Math.round((completed / items.length) * 100);
    }, [items]);

    return (
        <Layout showBottomNav={true}>
            <h2 className="font-bold text-xl mb-4 text-primary">My Progress</h2>
            <div className="bg-white p-5 rounded-2xl shadow mb-6">
                <p className="text-gray-500">Confidence Level</p>
                <div className="w-full bg-gray-200 h-3 rounded-full mt-2">
                    <div className="bg-secondary h-3 rounded-full" style={{ width: `${percent}%` }} />
                </div>
                <p className="mt-2 text-primary font-semibold">{percent}% confident</p>
            </div>
            <div className="space-y-3">
                {items.map(item => (
                    <button
                        key={item.id}
                        onClick={() => toggle(item)}
                        className={`w-full text-left p-4 rounded-xl shadow-sm transition ${
                            item.is_completed ? "bg-success text-white" : "bg-white text-gray-800"
                        }`}
                    >
                        <div className="flex justify-between">
                            <span>{item.skill_name}</span>
                            <span>{item.is_completed ? "✓" : "○"}</span>
                        </div>
                    </button>
                ))}
            </div>
        </Layout>
    );
}