// src/pages/Progress.jsx
import { useEffect, useMemo, useState } from "react";
import Layout from "../components/Layout";
import {
    getMyProgress,
    updateProgress,
} from "../services/progressService";

export default function Progress() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorText, setErrorText] = useState("");

    async function loadProgress() {
        try {
            setLoading(true);
            const data = await getMyProgress();
            setItems(data);
        } catch (error) {
            setErrorText(error.message || "Unable to load progress.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadProgress();
    }, []);

    async function handleToggle(item) {
        const nextValue = !item.is_completed;

        const previousItems = items;

        setItems((current) =>
            current.map((row) =>
                row.id === item.id
                    ? { ...row, is_completed: nextValue }
                    : row
            )
        );

        try {
            const updated = await updateProgress(item.id, nextValue);

            setItems((current) =>
                current.map((row) =>
                    row.id === item.id ? updated : row
                )
            );
        } catch (error) {
            setItems(previousItems);
            setErrorText(error.message || "Unable to update progress.");
        }
    }

    const percentage = useMemo(() => {
        if (items.length === 0) return 0;

        const completed = items.filter((item) => item.is_completed).length;

        return Math.round((completed / items.length) * 100);
    }, [items]);

    return (
        <Layout>
            <h2 className="font-bold text-xl mb-4">Student Tracking</h2>

            {loading && <p>Loading progress...</p>}

            {errorText && (
                <p className="bg-red-50 text-red-600 p-3 rounded-xl mb-4">
                    {errorText}
                </p>
            )}

            {!loading && (
                <>
                    <div className="bg-white p-5 rounded-2xl shadow">
                        <p className="text-sm text-gray-500">Confidence Level</p>

                        <div className="w-full bg-gray-200 h-3 rounded-full mt-3">
                            <div
                                className="bg-secondary h-3 rounded-full transition-all duration-500"
                                style={{ width: `${percentage}%` }}
                            />
                        </div>

                        <p className="mt-3 text-primary font-semibold">
                            {percentage}% confident
                        </p>
                    </div>

                    <div className="mt-6 space-y-3">
                        {items.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => handleToggle(item)}
                                className={`w-full text-left p-4 rounded-xl shadow-sm transition ${
                                    item.is_completed
                                        ? "bg-success text-white"
                                        : "bg-white text-gray-800"
                                }`}
                            >
                                <div className="flex justify-between items-center">
                                    <span>{item.skill_name}</span>
                                    <span>{item.is_completed ? "Completed" : "Pending"}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </>
            )}
        </Layout>
    );
}