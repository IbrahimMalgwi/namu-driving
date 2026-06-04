// src/components/Layout.jsx - Enhanced Layout
import { useNavigate, useLocation } from "react-router-dom";
import { signOut } from "../services/authService";
import { useEffect, useState } from "react";
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
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Update document title if provided
    useEffect(() => {
        if (title) {
            document.title = `${title} | NAMU Driving School`;
        } else {
            document.title = "NAMU Driving School";
        }
    }, [title]);

    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    async function handleLogout() {
        await signOut();
        setIsMobileMenuOpen(false);
        navigate("/");
    }

    function handleNavigation(path) {
        setIsMobileMenuOpen(false);
        navigate(path);
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
    const hasHeaderNav = showBottomNav || showPublicNav;

    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-amber-50 flex flex-col">
            {/* Header */}
            <div className="sticky top-0 z-40 border-b border-white/20 bg-gradient-to-r from-[#061943] via-primary to-secondary text-white shadow-xl">
                <div className="max-w-6xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between gap-4">
                        <button
                            onClick={() => handleNavigation(homePath)}
                            className="text-left"
                        >
                            <BrandMark compact light />
                        </button>

                        {hasHeaderNav && (
                            <button
                                type="button"
                                onClick={() => setIsMobileMenuOpen((isOpen) => !isOpen)}
                                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 text-white shadow-inner ring-1 ring-white/20 transition hover:bg-white/25 focus:outline-none focus:ring-2 focus:ring-sunshine md:hidden"
                                aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                                aria-expanded={isMobileMenuOpen}
                                aria-controls="mobile-navigation"
                            >
                                <span className="sr-only">{isMobileMenuOpen ? "Close menu" : "Open menu"}</span>
                                <span className="flex flex-col gap-1.5">
                                    <span className={`block h-0.5 w-5 rounded-full bg-current transition ${isMobileMenuOpen ? "translate-y-2 rotate-45" : ""}`} />
                                    <span className={`block h-0.5 w-5 rounded-full bg-current transition ${isMobileMenuOpen ? "opacity-0" : ""}`} />
                                    <span className={`block h-0.5 w-5 rounded-full bg-current transition ${isMobileMenuOpen ? "-translate-y-2 -rotate-45" : ""}`} />
                                </span>
                            </button>
                        )}

                        {showBottomNav && (
                            <div className="hidden items-center gap-2 overflow-x-auto pb-1 md:flex md:pb-0">
                                {navItems.map((item) => {
                                    const isActive = location.pathname === item.path;
                                    return (
                                        <button
                                            key={item.path}
                                            onClick={() => handleNavigation(item.path)}
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
                            <div className="hidden items-center gap-2 overflow-x-auto pb-1 md:flex md:pb-0">
                                {publicNavItems.map((item) => {
                                    const isActive = location.pathname === item.path;
                                    return (
                                        <button
                                            key={item.path}
                                            onClick={() => handleNavigation(item.path)}
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
                                    onClick={() => handleNavigation("/register")}
                                    className="whitespace-nowrap rounded-full bg-sunshine px-4 py-2 text-sm font-black text-slate-950 shadow transition hover:bg-gold"
                                >
                                    Start Training
                                </button>
                            </div>
                        )}
                    </div>

                    {hasHeaderNav && (
                        <div
                            id="mobile-navigation"
                            className={`grid transition-all duration-300 md:hidden ${
                                isMobileMenuOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                            }`}
                        >
                            <div className="overflow-hidden">
                                <div className="mt-4 rounded-3xl border border-white/15 bg-white/12 p-3 shadow-2xl backdrop-blur">
                                    {showBottomNav && (
                                        <div className="grid gap-2">
                                            {navItems.map((item) => {
                                                const isActive = location.pathname === item.path;
                                                return (
                                                    <button
                                                        key={item.path}
                                                        onClick={() => handleNavigation(item.path)}
                                                        className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-bold transition ${
                                                            isActive
                                                                ? "bg-white text-primary shadow-lg"
                                                                : "bg-white/10 text-white hover:bg-white/20"
                                                        }`}
                                                    >
                                                        <span className="text-lg">{item.icon}</span>
                                                        <span>{item.label}</span>
                                                    </button>
                                                );
                                            })}
                                            <button
                                                onClick={handleLogout}
                                                className="rounded-2xl bg-sunshine px-4 py-3 text-left text-sm font-black text-slate-950 shadow transition hover:bg-gold"
                                            >
                                                Logout
                                            </button>
                                        </div>
                                    )}

                                    {showPublicNav && (
                                        <div className="grid gap-2">
                                            {publicNavItems.map((item) => {
                                                const isActive = location.pathname === item.path;
                                                return (
                                                    <button
                                                        key={item.path}
                                                        onClick={() => handleNavigation(item.path)}
                                                        className={`rounded-2xl px-4 py-3 text-left text-sm font-bold transition ${
                                                            isActive
                                                                ? "bg-white text-primary shadow-lg"
                                                                : "bg-white/10 text-white hover:bg-white/20"
                                                        }`}
                                                    >
                                                        {item.label}
                                                    </button>
                                                );
                                            })}
                                            <button
                                                onClick={() => handleNavigation("/register")}
                                                className="rounded-2xl bg-sunshine px-4 py-3 text-left text-sm font-black text-slate-950 shadow transition hover:bg-gold"
                                            >
                                                Start Training
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
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
