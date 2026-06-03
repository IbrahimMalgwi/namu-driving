import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import StudentDashboard from "./pages/StudentDashboard";
import Catalog from "./pages/Catalog";
import Progress from "./pages/Progress";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import BookLesson from "./pages/BookLesson";
import Learn from "./pages/Learn";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/catalog" element={<Catalog />} />

                {/* Protected student routes */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute allowedRoles={["student"]}>
                            <StudentDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/progress"
                    element={
                        <ProtectedRoute allowedRoles={["student"]}>
                            <Progress />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/book-lesson"
                    element={
                        <ProtectedRoute allowedRoles={["student"]}>
                            <BookLesson />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/learn"
                    element={
                        <ProtectedRoute allowedRoles={["student"]}>
                            <Learn />
                        </ProtectedRoute>
                    }
                />

                {/* Instructor/owner routes */}
                <Route
                    path="/instructor-dashboard"
                    element={
                        <ProtectedRoute allowedRoles={["instructor", "owner", "admin"]}>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}
