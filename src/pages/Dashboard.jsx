// src/pages/Dashboard.jsx - Enhanced Instructor/Owner Dashboard
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { supabase } from "../lib/supabase";
import { getAllBookings, updateBookingStatus } from "../services/bookingService";
import PickupMap from "../components/PickupMap";

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState("schedule");
    const [bookings, setBookings] = useState([]);
    const [students, setStudents] = useState([]);
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uploadedFile, setUploadedFile] = useState(null);
    const [message, setMessage] = useState("");

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        setLoading(true);
        try {
            // Load ALL bookings for admin/instructor
            const bookingsData = await getAllBookings();
            setBookings(bookingsData || []);

            // Load students with special training
            const { data: studentsData } = await supabase
                .from("students")
                .select("id, full_name, phone, training_package")
                .eq("training_package", "special");

            setStudents(studentsData || []);

            // Load documents
            const { data: docsData } = await supabase
                .from("student_documents")
                .select("*")
                .order("created_at", { ascending: false });

            setDocuments(docsData || []);
        } catch (err) {
            console.error("Error loading data:", err);
        } finally {
            setLoading(false);
        }
    }

    async function handleFileUpload(e) {
        e.preventDefault();
        if (!uploadedFile) {
            setMessage("Please select a file");
            return;
        }

        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();

            // Upload to storage
            const fileName = `${Date.now()}-${uploadedFile.name}`;
            const { data, error } = await supabase.storage
                .from("student_documents")
                .upload(`uploads/${fileName}`, uploadedFile);

            if (error) throw error;

            // Create document record
            const { error: docError } = await supabase
                .from("student_documents")
                .insert({
                    user_id: user.id,
                    file_name: uploadedFile.name,
                    file_path: data.path,
                    document_type: uploadedFile.type.includes("pdf") ? "pdf" : "image",
                });

            if (docError) throw docError;

            setMessage("Document uploaded successfully!");
            setUploadedFile(null);
            setTimeout(() => setMessage(""), 3000);
            loadData();
        } catch (err) {
            setMessage(`Error: ${err.message}`);
        } finally {
            setLoading(false);
        }
    }

    async function handleUpdateBookingStatus(bookingId, newStatus) {
        try {
            await updateBookingStatus(bookingId, newStatus);
            setMessage(`Booking ${newStatus} successfully!`);
            setTimeout(() => setMessage(""), 3000);
            loadData();
        } catch (err) {
            setMessage(`Error: ${err.message}`);
        }
    }

    return (
        <Layout showBottomNav={true} navRole="staff">
            <div className="space-y-6">
                {/* Header */}
                <div className="bg-gradient-to-r from-primary to-blue-900 text-white rounded-2xl p-6 shadow-lg">
                    <h1 className="text-3xl font-bold mb-1">Instructor Dashboard</h1>
                    <p className="text-blue-100">Manage bookings, students, and documents</p>
                </div>

                {/* Message Alert */}
                {message && (
                    <div className={`p-4 rounded-xl ${message.includes("successfully") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                        {message}
                    </div>
                )}

                {/* Tab Navigation */}
                <div className="flex space-x-3 overflow-x-auto pb-2">
                    {[
                        { id: "schedule", label: "📅 Schedule", icon: "📅" },
                        { id: "maps", label: "🗺️ Pick-up Locations", icon: "🗺️" },
                        { id: "documents", label: "📄 Documents", icon: "📄" }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-6 py-3 rounded-xl font-semibold whitespace-nowrap transition ${
                                activeTab === tab.id
                                    ? "bg-secondary text-white shadow-lg"
                                    : "bg-white text-gray-700 border border-gray-200 hover:border-secondary"
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content Sections */}
                {activeTab === "schedule" && (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-primary">📅 Lesson Schedule</h2>

                        {loading ? (
                            <p className="text-center text-gray-500 py-8">Loading bookings...</p>
                        ) : bookings.length === 0 ? (
                            <div className="bg-blue-50 border border-primary/30 rounded-xl p-6 text-center">
                                <p className="text-gray-600">No bookings yet</p>
                            </div>
                        ) : (
                            bookings.map(booking => (
                                <div
                                    key={booking.id}
                                    className="bg-white border-l-4 border-secondary rounded-lg p-5 shadow hover:shadow-lg transition"
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <h3 className="font-bold text-lg text-primary">
                                                {booking.student?.full_name || "Unknown Student"}
                                            </h3>
                                            <p className="text-gray-600 text-sm">📞 {booking.student?.phone}</p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                            booking.status === "confirmed" ? "bg-green-100 text-green-800" :
                                            booking.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                                            "bg-gray-100 text-gray-800"
                                        }`}>
                                            {booking.status.toUpperCase()}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                                        <div>
                                            <p className="text-gray-500">📅 Date</p>
                                            <p className="font-semibold">{new Date(booking.booking_date).toLocaleDateString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">⏰ Time</p>
                                            <p className="font-semibold">{booking.start_time}</p>
                                        </div>
                                        <div className="col-span-2">
                                            <p className="text-gray-500">📍 Pickup Location</p>
                                            <p className="font-semibold">{booking.pickup_address}</p>
                                        </div>
                                    </div>

                                    {booking.status === "pending" && (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleUpdateBookingStatus(booking.id, "confirmed")}
                                                className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-semibold transition"
                                            >
                                                ✓ Confirm
                                            </button>
                                            <button
                                                onClick={() => handleUpdateBookingStatus(booking.id, "cancelled")}
                                                className="flex-1 bg-gray-400 hover:bg-gray-500 text-white py-2 rounded-lg font-semibold transition"
                                            >
                                                ✕ Cancel
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                )}

                {activeTab === "maps" && (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-primary">🗺️ Special Training Pick-up Locations</h2>

                        {students.length === 0 ? (
                            <div className="bg-blue-50 border border-primary/30 rounded-xl p-6 text-center">
                                <p className="text-gray-600">No special training students at the moment</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {students.map(student => (
                                    <div key={student.id} className="bg-white rounded-xl p-5 shadow hover:shadow-lg transition">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="font-bold text-lg">{student.full_name}</h3>
                                                <p className="text-gray-600 text-sm">📞 {student.phone}</p>
                                            </div>
                                            <span className="bg-secondary/20 text-secondary px-3 py-1 rounded-full text-xs font-bold">
                                                Special Training
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Map Placeholder */}
                        <PickupMap students={students} bookings={bookings} />
                    </div>
                )}

                {activeTab === "documents" && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-primary">📄 Student Documents</h2>

                        {/* Upload Section */}
                        <div className="bg-gradient-to-br from-blue-50 to-primary/10 border-2 border-dashed border-primary/30 rounded-xl p-6">
                            <h3 className="font-bold text-lg mb-4">📤 Upload Documentation</h3>
                            <form onSubmit={handleFileUpload} className="space-y-4">
                                <input
                                    type="file"
                                    onChange={(e) => setUploadedFile(e.target.files?.[0])}
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    className="w-full border-2 border-primary/30 rounded-lg p-3 focus:outline-none focus:border-primary"
                                />
                                <p className="text-xs text-gray-600">
                                    ✓ Accepted: PDF, JPG, PNG (Max 5MB)
                                </p>
                                <button
                                    type="submit"
                                    disabled={loading || !uploadedFile}
                                    className="w-full bg-primary hover:bg-blue-900 text-white py-3 rounded-lg font-bold transition disabled:opacity-50"
                                >
                                    {loading ? "Uploading..." : "Upload Document"}
                                </button>
                            </form>
                        </div>

                        {/* Documents List */}
                        <div>
                            <h3 className="font-bold text-lg mb-4">📚 Uploaded Documents</h3>
                            {documents.length === 0 ? (
                                <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center text-gray-600">
                                    No documents uploaded yet
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {documents.map(doc => (
                                        <div key={doc.id} className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between hover:shadow-lg transition">
                                            <div className="flex items-center space-x-3">
                                                <span className="text-2xl">
                                                    {doc.file_name.endsWith(".pdf") ? "📄" : "🖼️"}
                                                </span>
                                                <div>
                                                    <p className="font-semibold text-gray-800">{doc.file_name}</p>
                                                    <p className="text-xs text-gray-500">
                                                        {new Date(doc.created_at).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <button className="text-primary hover:text-blue-900 font-bold text-sm">
                                                View
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
}
