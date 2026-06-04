// src/components/Layout.jsx - Enhanced Layout
import { useNavigate, useLocation } from "react-router-dom";
import { signOut } from "../services/authService";
import { useEffect } from "react";
import BrandMark from "./BrandMark";

export default function Layout({
    children,
    title,
    showBottomNav = false,
    showPublicNav = false,
    navRole = "student",
    contentClassName = "flex-1 p-4 overflow-y-auto",
}) {
    const navigate = useNavigate();
    const location = useLocation();

    // Update document title if provided
    useEffect(() => {
        if (title) {
            document.title = `${title} | NAMU Driving School`;
        } else {
            document.title = "NAMU Driving School";
        }
    }, [title]);

    async function handleLogout() {
        await signOut();
        navigate("/");
    }

    const studentNavItems = [
        { label: "Home", icon: "🏠", path: "/dashboard" },
        { label: "Book", icon: "📅", path: "/book-lesson" },
        { label: "Learn", icon: "📚", path: "/learn" },
        { label: "Progress", icon: "📊", path: "/progress" },
        { label: "My Package", icon: "💼", path: "/catalog" },
    ];

    const staffNavItems = [
        { label: "Dashboard", icon: "📅", path: "/instructor-dashboard" },
    ];

    const publicNavItems = [
        { label: "Home", path: "/" },
        { label: "Catalog", path: "/catalog" },
        { label: "Login", path: "/login" },
    ];

    const navItems = navRole === "student" ? studentNavItems : staffNavItems;
    const homePath = showBottomNav
        ? (navRole === "student" ? "/dashboard" : "/instructor-dashboard")
        : "/";

    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-amber-50 flex flex-col">
            {/* Header */}
            <div className="sticky top-0 z-40 border-b border-white/20 bg-gradient-to-r from-[#061943] via-primary to-secondary text-white shadow-xl">
                <div className="max-w-6xl mx-auto px-4 py-4">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <button
                            onClick={() => navigate(homePath)}
                            className="text-left"
                        >
                            <BrandMark compact light />
                        </button>

                        {showBottomNav && (
                            <div className={`${navRole === "student" ? "hidden md:flex" : "flex"} items-center gap-2 overflow-x-auto pb-1 md:pb-0`}>
                                {navItems.map((item) => {
                                    const isActive = location.pathname === item.path;
                                    return (
                                        <button
                                            key={item.path}
                                            onClick={() => navigate(item.path)}
                                            className={`flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition ${
                                                isActive
                                                    ? "bg-white text-primary shadow-lg"
                                                    : "bg-white/15 text-white hover:bg-white/25"
                                            }`}
                                        >
                                            <span>{item.icon}</span>
                                            <span>{item.label}</span>
                                        </button>
                                    );
                                })}
                                <button
                                    onClick={handleLogout}
                                    className="whitespace-nowrap rounded-full bg-sunshine px-4 py-2 text-sm font-black text-slate-950 shadow transition hover:bg-gold"
                                >
                                    Logout
                                </button>
                            </div>
                        )}

                        {showPublicNav && (
                            <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
                                {publicNavItems.map((item) => {
                                    const isActive = location.pathname === item.path;
                                    return (
                                        <button
                                            key={item.path}
                                            onClick={() => navigate(item.path)}
                                            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition ${
                                                isActive
                                                    ? "bg-white text-primary shadow-lg"
                                                    : "bg-white/15 text-white hover:bg-white/25"
                                            }`}
                                        >
                                            {item.label}
                                        </button>
                                    );
                                })}
                                <button
                                    onClick={() => navigate("/register")}
                                    className="whitespace-nowrap rounded-full bg-sunshine px-4 py-2 text-sm font-black text-slate-950 shadow transition hover:bg-gold"
                                >
                                    Start Training
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className={`${contentClassName} ${showBottomNav && navRole === "student" ? "pb-24 md:pb-4" : ""}`}>{children}</div>

            {showBottomNav && navRole === "student" && (
                <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/70 bg-white/90 px-2 py-2 shadow-[0_-10px_30px_rgba(13,71,161,0.18)] backdrop-blur md:hidden">
                    <div className="mx-auto grid max-w-md grid-cols-5 gap-1">
                        {studentNavItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <button
                                    key={item.path}
                                    onClick={() => navigate(item.path)}
                                    className={`rounded-2xl px-2 py-2 text-center text-[11px] font-bold transition ${
                                        isActive ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg" : "text-slate-500 hover:bg-sky-50"
                                    }`}
                                >
                                    <span className="block text-lg leading-none">{item.icon}</span>
                                    <span className="mt-1 block">{item.label.replace("My Package", "Package")}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
