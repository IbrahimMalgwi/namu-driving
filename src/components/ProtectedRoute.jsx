// src/components/ProtectedRoute.jsx
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getCurrentUserProfile } from "../services/authService";

export default function ProtectedRoute({
                                           children,
                                           allowedRoles = [],
                                       }) {
    const [loading, setLoading] = useState(true);
    const [denied, setDenied] = useState(false);

    useEffect(() => {
        async function loadProfile() {
            try {
                const userProfile = await getCurrentUserProfile();

                if (!userProfile) {
                    setDenied(true);
                    return;
                }

                if (
                    allowedRoles.length > 0 &&
                    !allowedRoles.includes(userProfile.role)
                ) {
                    setDenied(true);
                    return;
                }

            } catch {
                setDenied(true);
            } finally {
                setLoading(false);
            }
        }

        loadProfile();
    }, [allowedRoles]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                Loading...
            </div>
        );
    }

    if (denied) {
        return <Navigate to="/login" replace />;
    }

    return children;
}
