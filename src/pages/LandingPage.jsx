// src/pages/LandingPage.jsx
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import BrandMark from "../components/BrandMark";

const services = [
    { title: "Professional Training", desc: "Learn from experienced and certified instructors.", icon: "🛡️" },
    { title: "Safe Driving", desc: "We teach defensive driving for safer roads.", icon: "🚘" },
    { title: "Easy Booking", desc: "Book lessons easily anytime, anywhere.", icon: "📅" },
    { title: "Your Success", desc: "Track progress until you are road-ready.", icon: "🏅" },
];

const appCards = [
    { title: "Book Lesson", icon: "📅", color: "bg-primary", path: "/book-lesson" },
    { title: "Learn Driving", icon: "🎓", color: "bg-secondary", path: "/learn" },
    { title: "My Progress", icon: "📈", color: "bg-green-500", path: "/progress" },
    { title: "Catalog", icon: "💼", color: "bg-purple-500", path: "/catalog" },
];

export default function LandingPage() {
    const navigate = useNavigate();

    return (
        <Layout showPublicNav title="Home" contentClassName="flex-1 overflow-y-auto">
            <div className="min-h-screen bg-white">
                <section className="relative overflow-hidden bg-gradient-to-br from-[#041638] via-primary to-[#051d4c] text-white">
                    <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/30 to-transparent" />
                    <div className="absolute -right-24 top-20 h-72 w-72 rounded-full bg-blue-400/20 blur-3xl" />
                    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-[1fr_0.85fr] md:items-center lg:py-20">
                        <div className="relative z-10">
                            <BrandMark light />
                            <p className="mt-6 max-w-xl text-2xl font-semibold leading-snug text-blue-100">
                                Giving you confidence on the wheel.
                            </p>
                            <p className="mt-4 max-w-2xl text-base leading-7 text-blue-100/90">
                                A mobile-first driving school experience for booking lessons, learning road rules, and tracking your performance from your first class to road confidence.
                            </p>
                            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                                <button
                                    onClick={() => navigate("/register")}
                                    className="rounded-2xl bg-secondary px-8 py-4 text-base font-black text-white shadow-xl shadow-red-950/20 transition hover:-translate-y-0.5 hover:bg-red-600"
                                >
                                    Create Account
                                </button>
                                <button
                                    onClick={() => navigate("/catalog")}
                                    className="rounded-2xl border border-white/30 bg-white/10 px-8 py-4 text-base font-black text-white transition hover:bg-white/20"
                                >
                                    View Services
                                </button>
                            </div>
                        </div>

                        <div className="relative z-10 mx-auto w-full max-w-[340px] rounded-[2.5rem] border-[10px] border-slate-950 bg-slate-950 p-3 shadow-2xl">
                            <div className="overflow-hidden rounded-[1.8rem] bg-gradient-to-b from-[#071a44] to-[#020817] px-5 py-8 text-center text-white">
                                <div className="mx-auto mb-8 h-6 w-28 rounded-full bg-black/50" />
                                <div className="flex justify-center">
                                    <BrandMark light />
                                </div>
                                <p className="mt-6 text-lg font-semibold text-blue-100">Giving you confidence<br />on the wheel.</p>
                                <div className="relative mx-auto mt-10 h-36 w-64 overflow-hidden rounded-t-full bg-gradient-to-b from-blue-400/10 to-transparent">
                                    <div className="absolute bottom-4 left-8 right-8 h-20 rounded-t-[4rem] border-t-8 border-blue-300/30" />
                                    <div className="absolute bottom-0 left-12 right-12 h-14 rounded-t-3xl bg-slate-900 shadow-2xl">
                                        <div className="absolute left-5 top-5 h-3 w-10 rounded-full bg-blue-200" />
                                        <div className="absolute right-5 top-5 h-3 w-10 rounded-full bg-blue-200" />
                                    </div>
                                </div>
                                <div className="mt-8 flex justify-center gap-2">
                                    <span className="h-1.5 w-8 rounded-full bg-gold" />
                                    <span className="h-1.5 w-3 rounded-full bg-white/60" />
                                    <span className="h-1.5 w-3 rounded-full bg-white/60" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="mx-auto max-w-6xl px-4 py-12">
                    <div className="grid gap-4 md:grid-cols-4">
                        {services.map((service) => (
                            <div key={service.title} className="rounded-3xl bg-[#061943] p-6 text-white shadow-xl">
                                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-gold/60 text-3xl text-gold">
                                    {service.icon}
                                </div>
                                <h3 className="font-black uppercase tracking-wide">{service.title}</h3>
                                <p className="mt-2 text-sm leading-6 text-blue-100">{service.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="bg-slate-50 px-4 py-12">
                    <div className="mx-auto max-w-6xl">
                        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                            <div>
                                <p className="text-sm font-black uppercase tracking-[0.22em] text-secondary">Mobile services</p>
                                <h2 className="mt-2 text-3xl font-black text-slate-950">Everything students need in one dashboard.</h2>
                            </div>
                            <button onClick={() => navigate("/register")} className="w-fit rounded-2xl bg-primary px-6 py-3 font-black text-white">
                                Start Training
                            </button>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {appCards.map((card) => (
                                <button key={card.title} onClick={() => navigate(card.path)} className="rounded-3xl bg-white p-6 text-left shadow-lg transition hover:-translate-y-1 hover:shadow-2xl">
                                    <span className={`flex h-14 w-14 items-center justify-center rounded-2xl ${card.color} text-3xl text-white`}>{card.icon}</span>
                                    <h3 className="mt-5 text-xl font-black text-slate-900">{card.title}</h3>
                                    <p className="mt-2 text-sm text-slate-500">Open the {card.title.toLowerCase()} service.</p>
                                </button>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </Layout>
    );
}
