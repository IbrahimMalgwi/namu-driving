// src/pages/StudentDashboard.jsx - Enhanced Dashboard
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { getCurrentUserProfile } from "../services/authService";
import { getNextLesson } from "../services/bookingService";
import { getLatestAnnouncement } from "../services/announcementService";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

const packageDetails = {
    regular: {
        label: "Regular Training",
        price: "₦90,000",
        icon: "🚗",
        description: "Essential driving fundamentals",
    },
    special: {
        label: "Special Training",
        price: "₦300,000",
        icon: "🏠",
        description: "Home pick-up/drop-off training package",
    },
    premium_certificate: {
        label: "Premium + Certificate",
        price: "₦330,000",
        icon: "🎓",
        description: "Complete training with NAMU certificate",
    },
    premium_license: {
        label: "Premium + 3-Year License",
        price: "₦370,000",
        icon: "📋",
        description: "Complete training with license support",
    },
};

export default function StudentDashboard() {
    const [userName, setUserName] = useState("");
    const [nextLesson, setNextLesson] = useState(null);
    const [announcement, setAnnouncement] = useState({ title: "Welcome!", content: "Your journey to confident driving starts here!" });
    const [studentPackage, setStudentPackage] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        async function loadDashboard() {
            try {
                const profile = await getCurrentUserProfile();
                if (profile) {
                    setUserName(profile.full_name?.split(" ")[0] || "Student");

                    const { data: student } = await supabase
                        .from("students")
                        .select("training_package")
                        .eq("user_id", profile.id)
                        .maybeSingle();

                    setStudentPackage(packageDetails[student?.training_package] || packageDetails.regular);
                }

                const lesson = await getNextLesson().catch(() => null);
                setNextLesson(lesson);

                const ann = await getLatestAnnouncement().catch(() => null);
                if (ann) setAnnouncement(ann);
            } catch (err) {
                console.error(err);
            }
        }
        loadDashboard();
    }, []);

    return (
        <Layout showBottomNav={true}>
            <div className="space-y-6 pb-10">
                {/* Welcome Banner */}
                <div className="bg-gradient-to-r from-primary to-blue-900 text-white rounded-3xl p-8 shadow-lg">
                    <h1 className="text-4xl font-bold mb-2">Welcome, {userName}! 👋</h1>
                    <p className="text-blue-100 text-lg">You're on your way to becoming a confident driver</p>
                </div>

                {/* Next Lesson Card */}
                <div className="bg-gradient-to-br from-secondary/20 to-red-50 rounded-2xl shadow-lg p-6 border-l-8 border-secondary">
                    <h2 className="text-lg font-bold text-secondary mb-4">📅 Your Next Lesson</h2>
                    {nextLesson ? (
                        <div className="space-y-3">
                            <div className="flex items-center space-x-4">
                                <div className="bg-white rounded-xl p-4 flex-1">
                                    <p className="text-gray-600 text-xs mb-1">Date & Time</p>
                                    <p className="font-bold text-gray-800">{nextLesson.date}</p>
                                    <p className="text-secondary font-bold text-lg">{nextLesson.time}</p>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl p-4">
                                <p className="text-gray-600 text-xs mb-1">Instructor</p>
                                <p className="font-bold text-lg text-primary">👨‍🏫 {nextLesson.instructor}</p>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl p-6 text-center">
                            <p className="text-gray-600 mb-3">No lessons scheduled yet</p>
                            <button
                                onClick={() => navigate("/book-lesson")}
                                className="bg-secondary hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition"
                            >
                                📅 Book Your First Lesson
                            </button>
                        </div>
                    )}
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 border border-primary/30 rounded-xl p-5 text-center hover:shadow-lg transition">
                        <div className="text-3xl mb-2">📊</div>
                        <p className="text-gray-600 text-sm mb-2">Track Progress</p>
                        <button
                            onClick={() => navigate("/progress")}
                            className="text-primary font-bold hover:underline text-sm"
                        >
                            View Now →
                        </button>
                    </div>
                    <div className="bg-green-50 border border-success/30 rounded-xl p-5 text-center hover:shadow-lg transition">
                        <div className="text-3xl mb-2">📚</div>
                        <p className="text-gray-600 text-sm mb-2">Learn Driving</p>
                        <button
                            onClick={() => navigate("/learn")}
                            className="text-success font-bold hover:underline text-sm"
                        >
                            Start Now →
                        </button>
                    </div>
                </div>

                {/* Quick Actions Grid */}
                <div className="space-y-3">
                    <h2 className="text-lg font-bold text-primary">⚡ Quick Actions</h2>
                    <div className="grid grid-cols-2 gap-3">
                        <ActionCard
                            title="Book Lesson"
                            icon="📅"
                            color="from-blue-400 to-blue-600"
                            onClick={() => navigate("/book-lesson")}
                        />
                        <ActionCard
                            title="View Lessons"
                            icon="🎓"
                            color="from-green-400 to-green-600"
                            onClick={() => navigate("/learn")}
                        />
                        <ActionCard
                            title="My Package"
                            icon={studentPackage?.icon || "💼"}
                            color="from-purple-400 to-purple-600"
                            onClick={() => navigate("/catalog")}
                        />
                        <ActionCard
                            title="Profile"
                            icon="👤"
                            color="from-orange-400 to-orange-600"
                            onClick={() => navigate("/progress")}
                        />
                    </div>
                </div>

                {/* Selected Package */}
                {studentPackage && (
                    <div className="bg-white rounded-2xl p-6 shadow border border-primary/10">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-sm font-bold text-secondary mb-2">Your Selected Package</p>
                                <h2 className="text-2xl font-bold text-primary">
                                    {studentPackage.icon} {studentPackage.label}
                                </h2>
                                <p className="text-gray-600 mt-2">{studentPackage.description}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-bold text-primary">{studentPackage.price}</p>
                                <button
                                    onClick={() => navigate("/catalog")}
                                    className="mt-3 text-secondary font-bold text-sm hover:underline"
                                >
                                    View Details →
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Announcement */}
                <div className="bg-gradient-to-br from-primary/10 to-blue-50 border-l-4 border-primary rounded-2xl p-6 shadow">
                    <h3 className="font-bold text-primary mb-2 text-lg">📢 {announcement.title}</h3>
                    <p className="text-gray-700 text-sm leading-relaxed">{announcement.content}</p>
                </div>

                {/* Trust Section */}
                <div className="bg-white rounded-xl p-5 shadow text-center space-y-2">
                    <p className="text-sm text-gray-600">✓ Female-led Academy | ✓ Safe & Certified | ✓ Track Your Progress</p>
                </div>
            </div>
        </Layout>
    );
}

function ActionCard({ title, icon, color, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`bg-gradient-to-br ${color} text-white rounded-2xl shadow-lg p-5 text-center hover:shadow-xl hover:scale-105 transition transform`}
        >
            <div className="text-3xl mb-2">{icon}</div>
            <p className="font-bold text-sm">{title}</p>
        </button>
    );
}
