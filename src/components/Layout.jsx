// src/components/Layout.jsx - Enhanced Layout
import { useNavigate, useLocation } from "react-router-dom";
import { signOut } from "../services/authService";
import { useEffect } from "react";

export default function Layout({ children, title, showBottomNav = false }) {
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

    // Define bottom nav items with their paths and icons
    const navItems = [
        { label: "Home", icon: "🏠", path: "/dashboard" },
        { label: "Book", icon: "📅", path: "/book-lesson" },
        { label: "Learn", icon: "📚", path: "/learn" },
        { label: "Progress", icon: "📊", path: "/progress" },
        { label: "Catalog", icon: "💼", path: "/catalog" },
    ];

    return (
        <div className="min-h-screen bg-muted flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-blue-900 text-white p-5 text-center shadow-md relative">
                <h1 className="font-bold text-xl">NAMU DRIVING SCHOOL</h1>
                <p className="text-xs text-blue-100 mt-1">
                    Giving you confidence on the wheel.
                </p>
                <button
                    onClick={handleLogout}
                    className="absolute top-5 right-5 text-sm bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full transition font-semibold"
                >
                    Logout
                </button>
            </div>

            {/* Main content */}
            <div className="flex-1 p-4 pb-24 overflow-y-auto">{children}</div>

            {/* Bottom Navigation (only when logged in) */}
            {showBottomNav && (
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 flex justify-around py-3 shadow-2xl z-50">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <button
                                key={item.path}
                                onClick={() => navigate(item.path)}
                                className={`flex flex-col items-center gap-1 transition transform hover:scale-110 ${
                                    isActive 
                                        ? "text-secondary scale-110" 
                                        : "text-gray-500 hover:text-primary"
                                }`}
                            >
                                <span className="text-2xl">{item.icon}</span>
                                <span className={`text-xs font-bold ${isActive ? "text-secondary" : "text-gray-600"}`}>
                                    {item.label}
                                </span>
                                {isActive && <div className="w-1 h-1 bg-secondary rounded-full"></div>}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}