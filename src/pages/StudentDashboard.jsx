// src/pages/StudentDashboard.jsx - Mobile-first app dashboard
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import BrandMark from "../components/BrandMark";
import { getCurrentUserProfile } from "../services/authService";
import { getNextLesson } from "../services/bookingService";
import { getLatestAnnouncement } from "../services/announcementService";
import { supabase } from "../lib/supabase";

const packageDetails = {
    regular: { label: "Regular Training", price: "₦90,000", icon: "🚗", description: "Essential driving fundamentals" },
    special: { label: "Special Training", price: "₦300,000", icon: "🏠", description: "Home pick-up/drop-off training package" },
    premium_certificate: { label: "Premium + Certificate", price: "₦330,000", icon: "🎓", description: "Complete training with NAMU certificate" },
    premium_license: { label: "Premium + 3-Year License", price: "₦370,000", icon: "📋", description: "Complete training with license support" },
};

const actions = [
    { title: "Book Lesson", icon: "📅", path: "/book-lesson", color: "bg-primary" },
    { title: "Learn Driving", icon: "🎓", path: "/learn", color: "bg-secondary" },
    { title: "My Progress", icon: "📈", path: "/progress", color: "bg-green-500" },
    { title: "My Package", icon: "💼", path: "/catalog", color: "bg-purple-500" },
];

export default function StudentDashboard() {
    const [userName, setUserName] = useState("");
    const [nextLesson, setNextLesson] = useState(null);
    const [announcement, setAnnouncement] = useState({ title: "Road sign of the week", content: "Check road signs in Learn Driving and test your knowledge before your next lesson." });
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
        <Layout showBottomNav={true} contentClassName="flex-1 overflow-y-auto bg-gradient-to-br from-sky-50 via-white to-amber-50">
            <div className="mx-auto max-w-5xl md:px-4 md:py-6">
                <section className="relative overflow-hidden rounded-b-[2rem] bg-gradient-to-br from-primary via-sky to-secondary px-5 pb-8 pt-5 text-white shadow-2xl md:rounded-[2rem]">
                    <div className="absolute -right-20 -top-20 h-52 w-52 rounded-full bg-white/20 blur-3xl" />
                    <div className="absolute -bottom-16 left-8 h-44 w-44 rounded-full bg-sunshine/30 blur-3xl" />
                    <div className="relative flex items-start justify-between gap-4">
                        <div>
                            <BrandMark compact light />
                            <p className="mt-8 text-blue-100">Welcome back,</p>
                            <h1 className="text-3xl font-black md:text-5xl">{userName || "Student"} 👋</h1>
                        </div>
                        <div className="flex h-14 w-14 items-center justify-center rounded-full border-4 border-white bg-gold text-2xl shadow-lg">
                            👤
                        </div>
                    </div>
                </section>

                <div className="space-y-5 px-4 py-5 md:px-0">
                    <div className="-mt-12 rounded-[2rem] bg-white p-5 shadow-2xl ring-1 ring-sky-100 md:mt-0">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <p className="text-sm font-black text-slate-500">Next Lesson</p>
                                {nextLesson ? (
                                    <>
                                        <h2 className="mt-1 text-lg font-black text-primary">{nextLesson.date}</h2>
                                        <p className="mt-1 text-sm font-semibold text-slate-700">{nextLesson.time}</p>
                                        <p className="text-sm text-slate-500">Instructor: {nextLesson.instructor}</p>
                                    </>
                                ) : (
                                    <>
                                        <h2 className="mt-1 text-lg font-black text-primary">No lesson booked yet</h2>
                                        <p className="text-sm text-slate-500">Reserve your next practical session.</p>
                                    </>
                                )}
                            </div>
                            <div className="relative h-20 w-28 shrink-0 rounded-2xl bg-gradient-to-br from-slate-900 to-primary p-2">
                                <div className="absolute bottom-3 left-4 right-4 h-8 rounded-t-2xl bg-blue-950 shadow-lg" />
                                <div className="absolute bottom-6 left-6 h-2 w-7 rounded-full bg-blue-100" />
                                <div className="absolute bottom-6 right-6 h-2 w-7 rounded-full bg-blue-100" />
                            </div>
                        </div>
                        <button
                            onClick={() => navigate("/book-lesson")}
                            className="mt-5 w-full rounded-2xl bg-secondary py-3 font-black text-white shadow-lg transition hover:bg-red-600 md:w-auto md:px-6"
                        >
                            {nextLesson ? "Book Another Lesson" : "Book Lesson"}
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                        {actions.map((action) => (
                            <button
                                key={action.title}
                                onClick={() => navigate(action.path)}
                                className="rounded-[1.5rem] bg-white p-5 text-center shadow-lg ring-1 ring-slate-100 transition hover:-translate-y-1 hover:shadow-xl"
                            >
                                <span className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl ${action.color} text-3xl text-white shadow`}>
                                    {action.icon}
                                </span>
                                <p className="mt-3 text-sm font-black text-slate-800">{action.title}</p>
                            </button>
                        ))}
                    </div>

                    {studentPackage && (
                        <div className="rounded-[1.5rem] bg-gradient-to-br from-white to-amber-50 p-5 shadow ring-1 ring-amber-100">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="text-sm font-black text-secondary">Selected Package</p>
                                    <h2 className="mt-1 text-xl font-black text-primary">{studentPackage.icon} {studentPackage.label}</h2>
                                    <p className="mt-1 text-sm text-slate-500">{studentPackage.description}</p>
                                </div>
                                <p className="text-right text-lg font-black text-primary">{studentPackage.price}</p>
                            </div>
                        </div>
                    )}

                    <div className="rounded-[1.5rem] bg-gradient-to-br from-white to-sky-50 p-5 shadow ring-1 ring-sky-100">
                        <div className="flex items-center justify-between">
                            <h3 className="font-black text-slate-900">Quick Tips</h3>
                            <button onClick={() => navigate("/learn")} className="text-sm font-black text-secondary">View all</button>
                        </div>
                        <div className="mt-4 flex items-center gap-3 rounded-2xl bg-slate-50 p-4">
                            <span className="text-3xl">⚠️</span>
                            <div>
                                <p className="font-bold text-slate-800">{announcement.title}</p>
                                <p className="text-sm text-slate-500">{announcement.content}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
