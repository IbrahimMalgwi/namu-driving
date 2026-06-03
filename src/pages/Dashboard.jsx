// src/pages/Dashboard.jsx - Enhanced Instructor/Owner Dashboard
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { supabase } from "../lib/supabase";
import { getAllBookings, updateBookingStatus } from "../services/bookingService";
import PickupMap from "../components/PickupMap";
import {
    contentTypes,
    createLearningContent,
    getLearningContentForStaff,
    groupLearningContent,
    packageOptions,
} from "../services/learnService";

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState("schedule");
    const [bookings, setBookings] = useState([]);
    const [students, setStudents] = useState([]);
    const [allStudents, setAllStudents] = useState([]);
    const [documents, setDocuments] = useState([]);
    const [learningGroups, setLearningGroups] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uploadedFile, setUploadedFile] = useState(null);
    const [learningFile, setLearningFile] = useState(null);
    const [learningForm, setLearningForm] = useState({
        type: "lesson",
        title: "",
        body: "",
        packageType: "all",
        studentId: "",
    });
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

            // Load students and join profile details manually to avoid depending on DB relationship names.
            const { data: studentsData } = await supabase
                .from("students")
                .select("id, user_id, training_package");

            const userIds = (studentsData || []).map((student) => student.user_id).filter(Boolean);
            let profilesById = {};

            if (userIds.length > 0) {
                const { data: profilesData } = await supabase
                    .from("profiles")
                    .select("id, full_name, phone")
                    .in("id", userIds);

                profilesById = (profilesData || []).reduce((acc, profile) => {
                    acc[profile.id] = profile;
                    return acc;
                }, {});
            }

            const hydratedStudents = (studentsData || []).map((student) => ({
                ...student,
                full_name: profilesById[student.user_id]?.full_name || "Unnamed Student",
                phone: profilesById[student.user_id]?.phone || "",
            }));

            setAllStudents(hydratedStudents);
            setStudents(hydratedStudents.filter((student) => student.training_package === "special"));

            // Load documents
            const { data: docsData } = await supabase
                .from("student_documents")
                .select("*")
                .order("created_at", { ascending: false });

            setDocuments(docsData || []);

            const learningData = await getLearningContentForStaff();
            setLearningGroups(groupLearningContent(learningData));
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

    async function handleCreateLearningContent(e) {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            await createLearningContent({
                type: learningForm.type,
                title: learningForm.title,
                body: learningForm.body,
                packageType: learningForm.packageType,
                studentId: learningForm.studentId,
                file: learningFile,
            });

            setMessage("Learning content added successfully!");
            setLearningForm({
                type: "lesson",
                title: "",
                body: "",
                packageType: "all",
                studentId: "",
            });
            setLearningFile(null);
            setTimeout(() => setMessage(""), 3000);
            loadData();
        } catch (err) {
            setMessage(`Error: ${err.message || "Unable to add learning content"}`);
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
                        { id: "learning", label: "📚 Learning Content", icon: "📚" },
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

                {activeTab === "learning" && (
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-2xl font-bold text-primary">📚 Learning Content</h2>
                            <p className="text-gray-600 text-sm mt-1">
                                Add lessons, road signs, driving tips, and car maintenance content for all students, a package, or one student.
                            </p>
                        </div>

                        <form onSubmit={handleCreateLearningContent} className="bg-white rounded-2xl shadow p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Content Type</label>
                                    <select
                                        value={learningForm.type}
                                        onChange={(e) => setLearningForm({ ...learningForm, type: e.target.value })}
                                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary"
                                    >
                                        {contentTypes.map((type) => (
                                            <option key={type.value} value={type.value}>
                                                {type.icon} {type.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Target Package</label>
                                    <select
                                        value={learningForm.packageType}
                                        onChange={(e) => setLearningForm({ ...learningForm, packageType: e.target.value })}
                                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary"
                                    >
                                        {packageOptions.map((pkg) => (
                                            <option key={pkg.value} value={pkg.value}>
                                                {pkg.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Specific Student (optional)</label>
                                <select
                                    value={learningForm.studentId}
                                    onChange={(e) => setLearningForm({ ...learningForm, studentId: e.target.value })}
                                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary"
                                >
                                    <option value="">All matching students</option>
                                    {allStudents.map((student) => (
                                        <option key={student.id} value={student.id}>
                                            {student.full_name} ({student.training_package?.replaceAll("_", " ") || "no package"})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <input
                                required
                                placeholder="Title"
                                value={learningForm.title}
                                onChange={(e) => setLearningForm({ ...learningForm, title: e.target.value })}
                                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary"
                            />

                            <textarea
                                required
                                placeholder="Write the lesson, tip, sign meaning, or maintenance guidance..."
                                value={learningForm.body}
                                onChange={(e) => setLearningForm({ ...learningForm, body: e.target.value })}
                                rows={5}
                                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary"
                            />

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Upload Image/File (optional)</label>
                                <input
                                    type="file"
                                    onChange={(e) => setLearningFile(e.target.files?.[0] || null)}
                                    accept=".pdf,.jpg,.jpeg,.png,.webp"
                                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3"
                                />
                                <p className="text-xs text-gray-500 mt-2">
                                    Useful for road signs, maintenance photos, or lesson documents.
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-secondary hover:bg-red-700 text-white py-3 rounded-xl font-bold transition disabled:opacity-50"
                            >
                                {loading ? "Saving..." : "Add Learning Content"}
                            </button>
                        </form>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {learningGroups.map((group) => (
                                <div key={group.value} className="bg-white rounded-2xl shadow p-5">
                                    <h3 className="font-bold text-lg text-primary mb-3">
                                        {group.icon} {group.label}
                                    </h3>
                                    <div className="space-y-3">
                                        {group.items.length === 0 ? (
                                            <p className="text-gray-500 text-sm">No content yet.</p>
                                        ) : (
                                            group.items.slice(0, 5).map((item) => (
                                                <div key={item.id} className="border border-gray-100 rounded-xl p-3">
                                                    <div className="flex items-start justify-between gap-3">
                                                        <p className="font-bold text-gray-800">{item.title}</p>
                                                        <span className={`text-xs font-bold rounded-full px-2 py-1 ${
                                                            item.is_fixed ? "bg-blue-50 text-primary" : "bg-green-50 text-success"
                                                        }`}>
                                                            {item.is_fixed ? "Fixed" : "Added"}
                                                        </span>
                                                    </div>
                                                    <p className="text-gray-600 text-sm mt-1 line-clamp-2">{item.body}</p>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
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
