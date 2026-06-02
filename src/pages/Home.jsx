// src/page/Home
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { getCurrentUserProfile } from "../services/authService";
import { getNextLesson } from "../services/bookingService";
import { getLatestAnnouncement } from "../services/announcementService";
import { useNavigate } from "react-router-dom";

export default function Home() {
    const [userName, setUserName] = useState("");
    const [nextLesson, setNextLesson] = useState(null);
    const [announcement, setAnnouncement] = useState({ title: "", content: "" });
    const navigate = useNavigate();

    useEffect(() => {
        async function loadDashboard() {
            try {
                const profile = await getCurrentUserProfile();
                if (profile) setUserName(profile.full_name?.split(" ")[0] || "Student");

                const lesson = await getNextLesson();
                setNextLesson(lesson);

                const ann = await getLatestAnnouncement();
                setAnnouncement(ann);
            } catch (err) {
                console.error(err);
            }
        }
        loadDashboard();
    }, []);

    return (
        <Layout showBottomNav={true}>
            <div className="space-y-5">
                <div>
                    <h2 className="text-2xl font-bold text-primary">Welcome, {userName}!</h2>
                </div>

                {/* Next Lesson Card */}
                <div className="bg-white rounded-2xl shadow p-5 border-l-8 border-secondary">
                    <p className="text-gray-500 text-sm">Next Lesson</p>
                    {nextLesson ? (
                        <>
                            <p className="font-semibold text-lg">{nextLesson.date}</p>
                            <p className="text-gray-700">{nextLesson.time}</p>
                            <p className="text-secondary font-medium">Instructor: {nextLesson.instructor}</p>
                        </>
                    ) : (
                        <p className="text-gray-500">No upcoming lessons. <button onClick={() => navigate("/book-lesson")} className="text-primary">Book now</button></p>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-4">
                    <ActionCard title="Book Lesson" icon="📘" onClick={() => navigate("/book-lesson")} />
                    <ActionCard title="Learn Driving" icon="🚗" onClick={() => navigate("/learn")} />
                    <ActionCard title="My Progress" icon="📊" onClick={() => navigate("/progress")} />
                    <ActionCard title="Messages" icon="💬" onClick={() => alert("Messages coming soon")} />
                </div>

                {/* Announcement */}
                <div className="bg-primary/10 rounded-2xl p-4">
                    <p className="font-semibold text-primary">📢 {announcement.title}</p>
                    <p className="text-gray-700 text-sm">{announcement.content}</p>
                </div>
            </div>
        </Layout>
    );
}

function ActionCard({ title, icon, onClick }) {
    return (
        <button
            onClick={onClick}
            className="bg-white rounded-2xl shadow p-4 text-center hover:shadow-md transition"
        >
            <div className="text-3xl mb-2">{icon}</div>
            <p className="font-medium text-primary">{title}</p>
        </button>
    );
}