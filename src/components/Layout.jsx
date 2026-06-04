// src/components/Layout.jsx - Enhanced Layout
import { useNavigate, useLocation } from "react-router-dom";
import { signOut } from "../services/authService";
import { useEffect } from "react";

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
        navigate("/login");
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
        <div className="min-h-screen bg-muted flex flex-col">
            {/* Header */}
            <div className="sticky top-0 z-40 bg-gradient-to-r from-primary via-blue-900 to-primary text-white shadow-md">
                <div className="max-w-6xl mx-auto px-4 py-4">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <button
                            onClick={() => navigate(homePath)}
                            className="text-left"
                        >
                            <h1 className="font-bold text-xl">NAMU DRIVING SCHOOL</h1>
                            <p className="text-xs text-blue-100 mt-1">
                                Giving you confidence on the wheel.
                            </p>
                        </button>

                        {showBottomNav && (
                            <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
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
                                    className="whitespace-nowrap rounded-full bg-white/20 px-4 py-2 text-sm font-semibold transition hover:bg-white/30"
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
            <div className={contentClassName}>{children}</div>
        </div>
    );
}
