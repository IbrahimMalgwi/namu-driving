// src/components/Layout.jsx
import { useNavigate } from "react-router-dom";
import { logout } from "../services/authService";

export default function Layout({ children, title, showBottomNav = false }) {
    const navigate = useNavigate();

    async function handleLogout() {
        await logout();
        navigate("/login");
    }

    return (
        <div className="min-h-screen bg-muted flex flex-col">
            {/* Header */}
            <div className="bg-primary text-white p-5 text-center shadow-md">
                <h1 className="font-bold text-xl">NAMU DRIVING SCHOOL</h1>
                <p className="text-xs text-gray-200 mt-1">
                    Giving you confidence on the wheel.
                </p>
                <button
                    onClick={handleLogout}
                    className="absolute top-5 right-5 text-sm bg-white/20 px-3 py-1 rounded-full"
                >
                    Logout
                </button>
            </div>

            {/* Main content */}
            <div className="flex-1 p-4 pb-20">{children}</div>

            {/* Bottom Navigation (only when logged in) */}
            {showBottomNav && (
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-2 shadow-lg">
                    <NavIcon label="Home" icon="🏠" path="/" />
                    <NavIcon label="Bookings" icon="📅" path="/bookings" />
                    <NavIcon label="Learn" icon="📘" path="/learn" />
                    <NavIcon label="Payments" icon="💳" path="/payments" />
                    <NavIcon label="Profile" icon="👤" path="/progress" />
                </div>
            )}
        </div>
    );
}

function NavIcon({ label, icon, path }) {
    const navigate = useNavigate();
    return (
        <button
            onClick={() => navigate(path)}
            className="flex flex-col items-center text-gray-600 hover:text-primary"
        >
            <span className="text-xl">{icon}</span>
            <span className="text-xs mt-1">{label}</span>
        </button>
    );
}