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
        <div className="min-h-screen bg-slate-100 flex flex-col">
            {/* Header */}
            <div className="sticky top-0 z-40 bg-gradient-to-r from-[#061943] via-primary to-[#061943] text-white shadow-xl">
                <div className="max-w-6xl mx-auto px-4 py-4">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <button
                            onClick={() => navigate(homePath)}
                            className="text-left"
                        >
                            <BrandMark compact light />
                        </button>

                        {showBottomNav && (
                            <div className="hidden items-center gap-2 overflow-x-auto pb-1 md:flex md:pb-0">
                                {navItems.map((item) => {
                                    const isActive = location.pathname === item.path;
                                    return (
                                        <button
                                            key={item.path}
                                            onClick={() => navigate(item.path)}
                                            className={`flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition ${
                                                isActive
                                                    ? "bg-white text-secondary shadow"
                                                    : "bg-white/10 text-white hover:bg-white/20"
                                            }`}
                                        >
                                            <span>{item.icon}</span>
                                            <span>{item.label}</span>
                                        </button>
                                    );
                                })}
                                <button
                                    onClick={handleLogout}
                                    className="whitespace-nowrap rounded-full bg-secondary px-4 py-2 text-sm font-semibold transition hover:bg-red-600"
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
                                                    ? "bg-white text-secondary shadow"
                                                    : "bg-white/10 text-white hover:bg-white/20"
                                            }`}
                                        >
                                            {item.label}
                                        </button>
                                    );
                                })}
                                <button
                                    onClick={() => navigate("/register")}
                                    className="whitespace-nowrap rounded-full bg-secondary px-4 py-2 text-sm font-bold text-white shadow transition hover:bg-red-600"
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
                <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/95 px-2 py-2 shadow-[0_-10px_30px_rgba(15,23,42,0.12)] backdrop-blur md:hidden">
                    <div className="mx-auto grid max-w-md grid-cols-5 gap-1">
                        {studentNavItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <button
                                    key={item.path}
                                    onClick={() => navigate(item.path)}
                                    className={`rounded-2xl px-2 py-2 text-center text-[11px] font-bold transition ${
                                        isActive ? "bg-primary text-white shadow" : "text-slate-500"
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
