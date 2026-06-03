// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import Progress from "./pages/Progress";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";

import BookLesson from "./pages/BookLesson";
import Learn from "./pages/Learn";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />

                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route
                    path="/catalog"
                    element={
                        <ProtectedRoute allowedRoles={["student", "owner"]}>
                            <Catalog />
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
                    path="/dashboard"
                    element={
                        <ProtectedRoute allowedRoles={["instructor", "owner"]}>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />

                <Route path="/book-lesson" element={
                    <ProtectedRoute allowedRoles={["student"]}>
                        <BookLesson />
                    </ProtectedRoute>
                } />
                <Route path="/learn" element={
                    <ProtectedRoute allowedRoles={["student"]}>
                        <Learn />
                    </ProtectedRoute>
                } />
            </Routes>
        </BrowserRouter>
    );
}