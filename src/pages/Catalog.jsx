// src/pages/Catalog.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { getCurrentUserProfile } from "../services/authService";
import { supabase } from "../lib/supabase";

const plans = [
    {
        value: "regular",
        title: "Regular Training",
        duration: "2 Weeks",
        price: "₦90,000",
        highlight: false,
        icon: "🚗",
        tag: "Best starter path",
        description: "Structured driving fundamentals for new learners who want a reliable foundation.",
        bestFor: "First-time drivers who can meet at the training point.",
        features: [
            "Professional instruction",
            "2-week intensive course",
            "Vehicle provided",
            "Safety equipment included",
            "Progress tracking"
        ]
    },
    {
        value: "special",
        title: "Special Training",
        desc: "Home Pick-up/Drop-off",
        duration: "2 Weeks",
        price: "₦300,000",
        highlight: false,
        icon: "🏠",
        tag: "Convenience package",
        description: "A premium training experience with pickup support and more flexible scheduling.",
        bestFor: "Busy learners who want door-to-door convenience.",
        features: [
            "Home pickup and drop-off",
            "2-week intensive course",
            "Premium vehicle",
            "One-on-one instruction",
            "Flexible scheduling"
        ]
    },
    {
        value: "premium_certificate",
        title: "Premium + Certificate",
        price: "₦330,000",
        highlight: true,
        icon: "🎓",
        tag: "Most complete",
        duration: "2 Weeks",
        description: "Training, pickup convenience, exam preparation, and an official NAMU certificate.",
        bestFor: "Learners who want proof of completion after training.",
        features: [
            "All Special Training features",
            "Official NAMU Certificate",
            "Exam preparation",
            "Document assistance",
            "Lifetime support"
        ]
    },
    {
        value: "premium_license",
        title: "Premium + 3-Year License",
        price: "₦370,000",
        highlight: false,
        icon: "📋",
        tag: "License support",
        duration: "2 Weeks",
        description: "The full training package with extra license support and advanced driving guidance.",
        bestFor: "Learners who want training plus license process support.",
        features: [
            "All Premium features",
            "3-Year License support",
            "Advanced defensive driving",
            "Insurance guidance",
            "Lifetime support"
        ]
    },
];

const catalogStats = [
    { label: "Training length", value: "2 weeks" },
    { label: "Instructor style", value: "One-on-one" },
    { label: "Progress", value: "Tracked" },
];

export default function Catalog() {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadSelectedPackage() {
            try {
                const currentProfile = await getCurrentUserProfile();
                setProfile(currentProfile);

                if (currentProfile?.role === "student") {
                    const { data, error } = await supabase
                        .from("students")
                        .select("training_package")
                        .eq("user_id", currentProfile.id)
                        .maybeSingle();

                    if (error) throw error;
                    setSelectedPackage(data?.training_package || "regular");
                }
            } catch (err) {
                console.error("Unable to load selected package:", err);
            } finally {
                setLoading(false);
            }
        }

        loadSelectedPackage();
    }, []);

    const isStudent = profile?.role === "student";
    const visiblePlans = isStudent
        ? plans.filter((plan) => plan.value === selectedPackage)
        : plans;
    const navRole = isStudent ? "student" : "staff";

    return (
        <Layout
            title={isStudent ? "My Training Package" : "Service Catalog"}
            showBottomNav={!!profile}
            showPublicNav={!profile}
            navRole={navRole}
            contentClassName="flex-1 overflow-y-auto bg-slate-50"
        >
            <div className="relative overflow-hidden">
                <div className="absolute -left-28 top-16 h-64 w-64 rounded-full bg-secondary/10 blur-3xl" />
                <div className="absolute -right-28 top-80 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />

                <section className="relative bg-gradient-to-br from-primary via-blue-900 to-slate-950 text-white">
                    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-[1.2fr_0.8fr] md:items-center lg:py-20">
                        <div>
                            <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-blue-50 shadow-sm backdrop-blur">
                                {isStudent ? "Your selected plan" : "NAMU training catalog"}
                            </span>
                            <h1 className="mt-6 max-w-3xl text-4xl font-black leading-tight tracking-tight md:text-6xl">
                                {isStudent ? "Your current driving package" : "Choose the package that matches your week, budget, and goal."}
                            </h1>
                            <p className="mt-5 max-w-2xl text-lg leading-8 text-blue-100">
                                {isStudent
                                    ? "Your dashboard keeps the catalog focused on the package attached to your student profile. Book lessons from here when you are ready."
                                    : "Every package is built around practical driving confidence, structured instructor support, and clear next steps from registration to lesson booking."}
                            </p>
                            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                                <button
                                    onClick={() => navigate(isStudent ? "/book-lesson" : "/register")}
                                    className="rounded-2xl bg-secondary px-7 py-4 text-base font-bold text-white shadow-xl shadow-red-950/20 transition hover:-translate-y-0.5 hover:bg-red-600"
                                >
                                    {isStudent ? "Book a Lesson" : "Start Training"}
                                </button>
                                <button
                                    onClick={() => navigate(isStudent ? "/dashboard" : "/login")}
                                    className="rounded-2xl border border-white/30 bg-white/10 px-7 py-4 text-base font-bold text-white transition hover:bg-white/20"
                                >
                                    {isStudent ? "Back to Dashboard" : "Already Registered? Login"}
                                </button>
                            </div>
                        </div>

                        <div className="rounded-[2rem] border border-white/15 bg-white/10 p-5 shadow-2xl backdrop-blur">
                            <div className="rounded-[1.5rem] bg-white p-6 text-slate-900 shadow-xl">
                                <p className="text-sm font-bold uppercase tracking-[0.2em] text-secondary">At a glance</p>
                                <div className="mt-5 space-y-4">
                                    {catalogStats.map((stat) => (
                                        <div key={stat.label} className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
                                            <span className="text-sm font-semibold text-slate-500">{stat.label}</span>
                                            <span className="text-lg font-black text-primary">{stat.value}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-5 rounded-2xl bg-gradient-to-r from-primary to-blue-900 p-4 text-white">
                                    <p className="text-sm text-blue-100">Recommended</p>
                                    <p className="text-xl font-black">Premium + Certificate</p>
                                    <p className="mt-1 text-sm text-blue-100">Best balance of convenience, completion proof, and training support.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="relative mx-auto max-w-6xl px-4 py-12 lg:py-16">
                    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                        <div>
                            <p className="text-sm font-bold uppercase tracking-[0.24em] text-secondary">
                                {isStudent ? "Package details" : "Compare packages"}
                            </p>
                            <h2 className="mt-3 text-3xl font-black text-slate-950 md:text-4xl">
                                {isStudent ? "What your plan includes" : "Clear options, no hidden maze."}
                            </h2>
                        </div>
                        {!isStudent && (
                            <p className="max-w-xl text-sm leading-6 text-slate-600">
                                Start with regular training if you only need the essentials. Choose a premium plan if pickup, certification, or license support matters.
                            </p>
                        )}
                    </div>

                    {loading ? (
                        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-slate-600 shadow-sm">
                            Loading package details...
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
                            {visiblePlans.map((plan) => (
                                <article
                                    key={plan.value}
                                    className={`group relative flex flex-col overflow-hidden rounded-[1.75rem] border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-2xl ${
                                        plan.highlight
                                            ? "border-secondary ring-4 ring-secondary/10 xl:-mt-4"
                                            : "border-slate-200"
                                    }`}
                                >
                                    {plan.highlight && (
                                        <div className="bg-gradient-to-r from-secondary to-red-600 px-5 py-3 text-center text-sm font-black uppercase tracking-wide text-white">
                                            Most Popular Choice
                                        </div>
                                    )}

                                    <div className="flex flex-1 flex-col p-6">
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-3xl">
                                                    {plan.icon}
                                                </div>
                                                <p className="text-xs font-bold uppercase tracking-[0.18em] text-secondary">{plan.tag}</p>
                                                <h3 className="mt-2 text-2xl font-black leading-tight text-slate-950">{plan.title}</h3>
                                            </div>
                                        </div>

                                        {plan.desc && (
                                            <p className="mt-3 inline-flex w-fit rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-secondary">
                                                {plan.desc}
                                            </p>
                                        )}

                                        <p className="mt-4 min-h-[72px] text-sm leading-6 text-slate-600">{plan.description}</p>

                                        <div className="mt-5 rounded-2xl bg-slate-50 p-4">
                                            <p className="text-4xl font-black tracking-tight text-primary">{plan.price}</p>
                                            <p className="mt-1 text-sm font-semibold text-slate-500">{plan.duration}</p>
                                        </div>

                                        <div className="mt-5 rounded-2xl border border-slate-100 bg-white p-4">
                                            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Best for</p>
                                            <p className="mt-2 text-sm font-semibold leading-6 text-slate-700">{plan.bestFor}</p>
                                        </div>

                                        <div className="mt-5 space-y-3">
                                            {plan.features.map((feature) => (
                                                <div key={feature} className="flex items-start gap-3 text-sm text-slate-700">
                                                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-black text-white">
                                                        ✓
                                                    </span>
                                                    <span>{feature}</span>
                                                </div>
                                            ))}
                                        </div>

                                        <button
                                            onClick={() => navigate(isStudent ? "/book-lesson" : "/register")}
                                            className={`mt-6 w-full rounded-2xl px-5 py-4 text-sm font-black text-white shadow-lg transition group-hover:-translate-y-0.5 ${
                                                plan.highlight
                                                    ? "bg-gradient-to-r from-secondary to-red-600 shadow-red-900/20"
                                                    : "bg-primary shadow-blue-900/20 hover:bg-blue-900"
                                            }`}
                                        >
                                            {isStudent ? "Book a Lesson" : "Choose This Package"}
                                        </button>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}

                    {!isStudent && (
                        <div className="mt-10 overflow-hidden rounded-[2rem] bg-slate-950 text-white shadow-2xl">
                            <div className="grid gap-0 md:grid-cols-[1.2fr_0.8fr]">
                                <div className="p-8 md:p-10">
                                    <p className="text-sm font-bold uppercase tracking-[0.22em] text-red-200">Still comparing?</p>
                                    <h3 className="mt-3 text-3xl font-black">Pick based on the outcome you need.</h3>
                                    <p className="mt-4 max-w-2xl leading-7 text-slate-300">
                                        If price is the main factor, start with Regular Training. If time, pickup, documents, and proof of training matter, the premium options remove more friction.
                                    </p>
                                </div>
                                <div className="bg-gradient-to-br from-secondary to-red-700 p-8 md:p-10">
                                    <p className="text-sm font-semibold text-red-100">Next step</p>
                                    <p className="mt-3 text-2xl font-black">Create your account and select your training package.</p>
                                    <button
                                        onClick={() => navigate("/register")}
                                        className="mt-6 rounded-2xl bg-white px-6 py-4 text-sm font-black text-secondary shadow-lg transition hover:-translate-y-0.5 hover:bg-red-50"
                                    >
                                        Register Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </section>
            </div>
        </Layout>
    );
}
