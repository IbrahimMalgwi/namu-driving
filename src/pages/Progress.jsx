// src/pages/Progress.jsx - Enhanced with Confidence Meter
import { useEffect, useMemo, useState } from "react";
import Layout from "../components/Layout";
import { getMyProgress, updateProgress } from "../services/progressService";

const REQUIRED_SKILLS = [
    "Traffic Signs",
    "Parallel Parking",
    "Reverse Entry",
    "Highway Driving",
    "Defensive Driving"
];

const SKILL_EMOJIS = {
    "Traffic Signs": "🛑",
    "Parallel Parking": "🅿️",
    "Reverse Entry": "⬅️",
    "Highway Driving": "🛣️",
    "Defensive Driving": "🚗"
};

export default function Progress() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const data = await getMyProgress();
                // Ensure all required skills are present
                const skillMap = new Map(data.map(item => [item.skill_name, item]));
                const completeItems = REQUIRED_SKILLS.map(skillName =>
                    skillMap.get(skillName) || {
                        id: `temp-${skillName}`,
                        skill_name: skillName,
                        is_completed: false
                    }
                );
                setItems(completeItems);
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
            if (item.id && !item.id.startsWith('temp-')) {
                await updateProgress(item.id, newCompleted);
            }
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

    const getConfidenceLevel = (percent) => {
        if (percent === 0) return "Building Confidence";
        if (percent <= 20) return "Beginner";
        if (percent <= 40) return "Developing";
        if (percent <= 60) return "Advancing";
        if (percent <= 80) return "Proficient";
        return "Expert Driver! 🌟";
    };

    const getConfidenceColor = (percent) => {
        if (percent === 0) return "from-gray-400 to-gray-500";
        if (percent <= 20) return "from-red-400 to-red-500";
        if (percent <= 40) return "from-orange-400 to-orange-500";
        if (percent <= 60) return "from-yellow-400 to-yellow-500";
        if (percent <= 80) return "from-lime-400 to-lime-500";
        return "from-green-400 to-emerald-500";
    };

    return (
        <Layout showBottomNav={true}>
            <h2 className="font-bold text-2xl mb-6 text-primary">📊 Your Progress</h2>

            {/* Confidence Meter Card */}
            <div className="bg-gradient-to-br from-primary/10 to-blue-50 border-2 border-primary/30 p-8 rounded-3xl shadow-lg mb-8">
                <div className="text-center">
                    <h3 className="text-gray-600 font-semibold mb-3">Your Confidence Level</h3>

                    {/* Large Circle Progress */}
                    <div className="relative w-32 h-32 mx-auto mb-4">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                            {/* Background circle */}
                            <circle
                                cx="60"
                                cy="60"
                                r="50"
                                fill="none"
                                stroke="#eee"
                                strokeWidth="8"
                            />
                            {/* Progress circle */}
                            <circle
                                cx="60"
                                cy="60"
                                r="50"
                                fill="none"
                                stroke="url(#progressGradient)"
                                strokeWidth="8"
                                strokeDasharray={`${(percent / 100) * 314} 314`}
                                strokeLinecap="round"
                                className="transition-all duration-500"
                            />
                            <defs>
                                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#E53935" />
                                    <stop offset="100%" stopColor="#2ECC71" />
                                </linearGradient>
                            </defs>
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                                <div className="text-4xl font-bold text-primary">{percent}%</div>
                                <div className="text-xs text-gray-500 mt-1">Confident</div>
                            </div>
                        </div>
                    </div>

                    <p className={`text-2xl font-bold bg-gradient-to-r ${getConfidenceColor(percent)} bg-clip-text text-transparent mb-2`}>
                        {getConfidenceLevel(percent)}
                    </p>
                    <p className="text-gray-600 text-sm">
                        {items.filter(i => i.is_completed).length} of {items.length} skills mastered
                    </p>
                </div>
            </div>

            {/* Skills Checklist */}
            <h3 className="font-bold text-lg text-primary mb-4">✅ Skills Checklist</h3>
            <div className="space-y-3 mb-8">
                {loading ? (
                    <p className="text-center text-gray-500 py-4">Loading your progress...</p>
                ) : items.length === 0 ? (
                    <p className="text-center text-gray-500 py-4">No skills tracked yet. Your instructor will add them soon!</p>
                ) : (
                    items.map(item => (
                        <button
                            key={item.id}
                            onClick={() => toggle(item)}
                            className={`w-full text-left p-4 rounded-xl shadow-md transition transform hover:scale-105 flex items-center justify-between ${
                                item.is_completed 
                                    ? "bg-gradient-to-r from-green-400 to-emerald-500 text-white" 
                                    : "bg-white hover:bg-gray-50 text-gray-800 border border-gray-200"
                            }`}
                        >
                            <div className="flex items-center space-x-3">
                                <span className="text-3xl">{SKILL_EMOJIS[item.skill_name] || "🎯"}</span>
                                <span className="font-semibold">{item.skill_name}</span>
                            </div>
                            <span className={`text-2xl ${item.is_completed ? "text-white" : "text-gray-400"}`}>
                                {item.is_completed ? "✓" : "○"}
                            </span>
                        </button>
                    ))
                )}
            </div>

            {/* Progress Stats */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 border border-primary/30 rounded-xl p-4 text-center">
                    <div className="text-3xl font-bold text-primary">
                        {items.filter(i => i.is_completed).length}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Skills Completed</p>
                </div>
                <div className="bg-orange-50 border border-secondary/30 rounded-xl p-4 text-center">
                    <div className="text-3xl font-bold text-secondary">
                        {items.length - items.filter(i => i.is_completed).length}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Skills Remaining</p>
                </div>
            </div>

            <div className="mt-6 bg-green-50 border-l-4 border-success rounded-lg p-4">
                <p className="text-sm text-gray-700">
                    <span className="font-semibold">💡 Tip:</span> Click on each skill to mark them as complete as you master them. Your confidence level updates in real-time!
                </p>
            </div>
        </Layout>
    );
}