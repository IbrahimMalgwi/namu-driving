// src/pages/Home.jsx
import NavCard from "../components/NavCard";

export default function Home() {
    return (
        <div className="min-h-screen bg-primary text-white">
            <div className="p-6 text-center">
                <h1 className="text-2xl font-bold">NAMU DRIVING SCHOOL</h1>
                <p className="text-sm mt-2">
                    Giving you confidence on the wheel.
                </p>
            </div>

            <div className="bg-muted rounded-t-3xl p-6 grid grid-cols-2 gap-4">
                <NavCard title="Service Catalog" route="/catalog" />
                <NavCard title="My Progress" route="/progress" />
                <NavCard title="Dashboard" route="/dashboard" />
            </div>
        </div>
    );
}