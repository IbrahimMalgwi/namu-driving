// src/components/Layout.jsx
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
        { label: "Home", icon: "🏠", path: "/" },
        { label: "Bookings", icon: "📅", path: "/book-lesson" }, // changed to existing route
        { label: "Learn", icon: "📘", path: "/learn" },
        { label: "Payments", icon: "💳", path: "/payments" }, // placeholder
        { label: "Profile", icon: "👤", path: "/progress" },
    ];

    return (
        <div className="min-h-screen bg-muted flex flex-col">
            {/* Header */}
            <div className="bg-primary text-white p-5 text-center shadow-md relative">
                <h1 className="font-bold text-xl">NAMU DRIVING SCHOOL</h1>
                <p className="text-xs text-gray-200 mt-1">
                    Giving you confidence on the wheel.
                </p>
                <button
                    onClick={handleLogout}
                    className="absolute top-5 right-5 text-sm bg-white/20 px-3 py-1 rounded-full hover:bg-white/30 transition"
                >
                    Logout
                </button>
            </div>

            {/* Main content */}
            <div className="flex-1 p-4 pb-20">{children}</div>

            {/* Bottom Navigation (only when logged in) */}
            {showBottomNav && (
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-2 shadow-lg z-10">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <button
                                key={item.path}
                                onClick={() => navigate(item.path)}
                                className={`flex flex-col items-center transition ${
                                    isActive ? "text-primary font-semibold" : "text-gray-500"
                                }`}
                            >
                                <span className="text-xl">{item.icon}</span>
                                <span className="text-xs mt-1">{item.label}</span>
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}