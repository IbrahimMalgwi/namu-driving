// src/components/Layout.jsx - Enhanced Layout
import { useNavigate, useLocation } from "react-router-dom";
import { signOut } from "../services/authService";
import { useEffect } from "react";

export default function Layout({ children, title, showBottomNav = false, navRole = "student" }) {
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

    const navItems = navRole === "student" ? studentNavItems : staffNavItems;

    return (
        <div className="min-h-screen bg-muted flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-blue-900 text-white shadow-md">
                <div className="max-w-6xl mx-auto px-4 py-4">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <button
                            onClick={() => navigate(showBottomNav ? (navRole === "student" ? "/dashboard" : "/instructor-dashboard") : "/")}
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
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="flex-1 p-4 overflow-y-auto">{children}</div>
        </div>
    );
}
