// src/components/NavCard.jsx
import { useNavigate } from "react-router-dom";

export default function NavCard({ title, route }) {
    const nav = useNavigate();

    return (
        <div
            onClick={() => nav(route)}
            className="bg-white rounded-2xl shadow p-4 cursor-pointer hover:scale-105 transition"
        >
            <p className="text-primary font-semibold">{title}</p>
        </div>
    );
}