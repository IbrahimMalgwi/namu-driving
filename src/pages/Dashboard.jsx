// src/pages/Dashboard.jsx - Instructor/Owner Dashboard
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
import {
    buildProgressChecklist,
    getProgressForStudents,
    getProgressPercent,
    setStudentSkillProgress,
    SKILL_EMOJIS,
} from "../services/progressService";

const dashboardTabs = [
    { id: "schedule", label: "Schedule", icon: "📅", color: "from-sky to-primary" },
    { id: "maps", label: "Pick-up", icon: "🗺️", color: "from-emerald-400 to-success" },
    { id: "progress", label: "Progress", icon: "📊", color: "from-gold to-secondary" },
    { id: "learning", label: "Learning", icon: "📚", color: "from-lilac to-primary" },
    { id: "documents", label: "Documents", icon: "📄", color: "from-secondary to-orange-500" },
];

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState("schedule");
    const [bookings, setBookings] = useState([]);
    const [students, setStudents] = useState([]);
    const [allStudents, setAllStudents] = useState([]);
    const [documents, setDocuments] = useState([]);
    const [learningGroups, setLearningGroups] = useState([]);
    const [progressByStudent, setProgressByStudent] = useState({});
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
            const bookingsData = await getAllBookings();
            setBookings(bookingsData || []);

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

            const studentIds = hydratedStudents.map((student) => student.id);
            const progressData = await getProgressForStudents(studentIds);
            setProgressByStudent(progressData);

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
            const fileName = `${Date.now()}-${uploadedFile.name}`;
            const { data, error } = await supabase.storage
                .from("student_documents")
                .upload(`uploads/${fileName}`, uploadedFile);

            if (error) throw error;

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
            setLearningForm({ type: "lesson", title: "", body: "", packageType: "all", studentId: "" });
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

    async function handleProgressToggle(student, item) {
        const newCompleted = !item.is_completed;

        setProgressByStudent((prev) => ({
            ...prev,
            [student.id]: buildProgressChecklist(prev[student.id]).map((progressItem) =>
                progressItem.skill_name === item.skill_name
                    ? { ...progressItem, is_completed: newCompleted }
                    : progressItem
            ),
        }));

        try {
            const savedItem = await setStudentSkillProgress({
                studentId: student.id,
                skillName: item.skill_name,
                progressId: item.id,
                isCompleted: newCompleted,
            });

            setProgressByStudent((prev) => ({
                ...prev,
                [student.id]: buildProgressChecklist(prev[student.id]).map((progressItem) =>
                    progressItem.skill_name === savedItem.skill_name ? savedItem : progressItem
                ),
            }));

            setMessage(`${student.full_name}'s progress updated successfully!`);
            setTimeout(() => setMessage(""), 3000);
        } catch (err) {
            setMessage(`Error: ${err.message || "Unable to update progress"}`);
            loadData();
        }
    }

    const pendingBookings = bookings.filter((booking) => booking.status === "pending").length;
    const confirmedBookings = bookings.filter((booking) => booking.status === "confirmed").length;
    const activeTabConfig = dashboardTabs.find((tab) => tab.id === activeTab) || dashboardTabs[0];

    return (
        <Layout showBottomNav={true} navRole="staff" title="Instructor Dashboard" contentClassName="flex-1 overflow-y-auto bg-gradient-to-br from-sky-50 via-white to-amber-50">
            <div className="mx-auto max-w-7xl space-y-6 px-4 py-6">
                <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-primary via-sky to-secondary p-6 text-white shadow-2xl md:p-8">
                    <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/20 blur-2xl" />
                    <div className="absolute -bottom-20 left-10 h-56 w-56 rounded-full bg-sunshine/30 blur-3xl" />
                    <div className="relative grid gap-6 md:grid-cols-[1.1fr_0.9fr] md:items-end">
                        <div>
                            <p className="text-sm font-black uppercase tracking-[0.24em] text-sunshine">Instructor workspace</p>
                            <h1 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">Manage every lesson beautifully.</h1>
                            <p className="mt-3 max-w-2xl text-blue-50">Review bookings, update student performance, publish learning content, and manage documents from one consistent dashboard.</p>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                            <StatCard label="Students" value={allStudents.length} icon="🎓" />
                            <StatCard label="Pending" value={pendingBookings} icon="⏳" />
                            <StatCard label="Confirmed" value={confirmedBookings} icon="✅" />
                        </div>
                    </div>
                </section>

                {message && (
                    <div className={`rounded-2xl border p-4 font-bold shadow-sm ${message.includes("successfully") ? "border-green-200 bg-green-50 text-green-800" : "border-red-200 bg-red-50 text-red-800"}`}>
                        {message}
                    </div>
                )}

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                    {dashboardTabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`rounded-[1.35rem] p-4 text-left shadow-lg transition hover:-translate-y-1 ${
                                activeTab === tab.id
                                    ? `bg-gradient-to-br ${tab.color} text-white`
                                    : "bg-white text-slate-700 hover:bg-sky-50"
                            }`}
                        >
                            <span className="text-3xl">{tab.icon}</span>
                            <p className="mt-3 font-black">{tab.label}</p>
                        </button>
                    ))}
                </div>

                <section className="rounded-[2rem] border border-white bg-white/85 p-5 shadow-xl backdrop-blur md:p-6">
                    <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                        <div>
                            <p className="text-sm font-black uppercase tracking-[0.22em] text-secondary">{activeTabConfig.label}</p>
                            <h2 className="mt-1 text-3xl font-black text-slate-950">{activeTabConfig.icon} {activeTabConfig.label}</h2>
                        </div>
                        {loading && <span className="rounded-full bg-sky-50 px-4 py-2 text-sm font-bold text-primary">Loading...</span>}
                    </div>

                    {activeTab === "schedule" && (
                        <div className="space-y-4">
                            {bookings.length === 0 ? (
                                <EmptyState text="No bookings yet" />
                            ) : (
                                <div className="grid gap-4 lg:grid-cols-2">
                                    {bookings.map((booking) => (
                                        <article key={booking.id} className="overflow-hidden rounded-[1.5rem] border border-slate-100 bg-gradient-to-br from-white to-sky-50 shadow-sm">
                                            <div className="flex items-start justify-between gap-4 border-b border-slate-100 p-5">
                                                <div>
                                                    <h3 className="text-xl font-black text-primary">{booking.student?.full_name || "Unknown Student"}</h3>
                                                    <p className="text-sm font-semibold text-slate-500">📞 {booking.student?.phone || "No phone"}</p>
                                                </div>
                                                <StatusBadge status={booking.status} />
                                            </div>
                                            <div className="grid grid-cols-2 gap-3 p-5 text-sm">
                                                <InfoTile label="Date" value={new Date(booking.booking_date).toLocaleDateString()} icon="📅" />
                                                <InfoTile label="Time" value={booking.start_time} icon="⏰" />
                                                <div className="col-span-2">
                                                    <InfoTile label="Pickup Location" value={booking.pickup_address || "Not provided"} icon="📍" />
                                                </div>
                                            </div>
                                            {booking.status === "pending" && (
                                                <div className="grid grid-cols-2 gap-3 px-5 pb-5">
                                                    <button onClick={() => handleUpdateBookingStatus(booking.id, "confirmed")} className="rounded-2xl bg-success py-3 font-black text-white shadow hover:bg-green-600">Confirm</button>
                                                    <button onClick={() => handleUpdateBookingStatus(booking.id, "cancelled")} className="rounded-2xl bg-slate-200 py-3 font-black text-slate-700 hover:bg-slate-300">Cancel</button>
                                                </div>
                                            )}
                                        </article>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "maps" && (
                        <div className="space-y-5">
                            {students.length === 0 ? (
                                <EmptyState text="No special training students at the moment" />
                            ) : (
                                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                                    {students.map((student) => (
                                        <div key={student.id} className="rounded-[1.5rem] bg-gradient-to-br from-amber-50 to-white p-5 shadow-sm ring-1 ring-amber-100">
                                            <div className="flex items-start justify-between gap-4">
                                                <div>
                                                    <h3 className="font-black text-slate-900">{student.full_name}</h3>
                                                    <p className="text-sm text-slate-500">📞 {student.phone || "No phone"}</p>
                                                </div>
                                                <span className="rounded-full bg-secondary px-3 py-1 text-xs font-black text-white">Special</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <div className="overflow-hidden rounded-[1.5rem] shadow-lg ring-1 ring-slate-100">
                                <PickupMap students={students} bookings={bookings} />
                            </div>
                        </div>
                    )}

                    {activeTab === "progress" && (
                        <div className="space-y-5">
                            <p className="text-sm text-slate-600">Update each student's driving skills after lessons. Students can view this checklist but cannot edit it.</p>
                            {allStudents.length === 0 ? (
                                <EmptyState text="No students available yet." />
                            ) : (
                                <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                                    {allStudents.map((student) => {
                                        const progressItems = buildProgressChecklist(progressByStudent[student.id]);
                                        const percent = getProgressPercent(progressItems);
                                        const completedCount = progressItems.filter((item) => item.is_completed).length;

                                        return (
                                            <div key={student.id} className="overflow-hidden rounded-[1.75rem] bg-white shadow-lg ring-1 ring-slate-100">
                                                <div className="bg-gradient-to-r from-primary via-sky to-success p-5 text-white">
                                                    <div className="flex items-start justify-between gap-4">
                                                        <div>
                                                            <h3 className="text-xl font-black">{student.full_name}</h3>
                                                            <p className="text-sm text-white/85">📞 {student.phone || "No phone number"}</p>
                                                            <p className="mt-2 text-xs font-bold text-white/85">{student.training_package?.replaceAll("_", " ") || "No package"}</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-4xl font-black">{percent}%</p>
                                                            <p className="text-xs text-white/85">{completedCount}/{progressItems.length} complete</p>
                                                        </div>
                                                    </div>
                                                    <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/25">
                                                        <div className="h-full rounded-full bg-sunshine" style={{ width: `${percent}%` }} />
                                                    </div>
                                                </div>

                                                <div className="space-y-3 p-5">
                                                    {progressItems.map((item) => (
                                                        <button
                                                            key={item.skill_name}
                                                            type="button"
                                                            onClick={() => handleProgressToggle(student, item)}
                                                            className={`w-full rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 hover:shadow-md ${
                                                                item.is_completed ? "border-green-200 bg-green-50" : "border-slate-200 bg-white hover:border-sky"
                                                            }`}
                                                        >
                                                            <div className="flex items-center justify-between gap-3">
                                                                <div className="flex items-center gap-3">
                                                                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-2xl">{SKILL_EMOJIS[item.skill_name] || "🎯"}</span>
                                                                    <div>
                                                                        <p className="font-black text-slate-800">{item.skill_name}</p>
                                                                        <p className={`text-xs font-bold ${item.is_completed ? "text-green-700" : "text-slate-500"}`}>{item.is_completed ? "Completed" : "Not completed"}</p>
                                                                    </div>
                                                                </div>
                                                                <span className={`flex h-8 w-8 items-center justify-center rounded-full text-lg font-black ${item.is_completed ? "bg-success text-white" : "bg-slate-100 text-slate-400"}`}>{item.is_completed ? "✓" : "○"}</span>
                                                            </div>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "learning" && (
                        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
                            <form onSubmit={handleCreateLearningContent} className="space-y-4 rounded-[1.75rem] bg-gradient-to-br from-sky-50 to-white p-5 shadow-sm ring-1 ring-sky-100">
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <FormSelect label="Content Type" value={learningForm.type} onChange={(value) => setLearningForm({ ...learningForm, type: value })}>
                                        {contentTypes.map((type) => <option key={type.value} value={type.value}>{type.icon} {type.label}</option>)}
                                    </FormSelect>
                                    <FormSelect label="Target Package" value={learningForm.packageType} onChange={(value) => setLearningForm({ ...learningForm, packageType: value })}>
                                        {packageOptions.map((pkg) => <option key={pkg.value} value={pkg.value}>{pkg.label}</option>)}
                                    </FormSelect>
                                </div>
                                <FormSelect label="Specific Student (optional)" value={learningForm.studentId} onChange={(value) => setLearningForm({ ...learningForm, studentId: value })}>
                                    <option value="">All matching students</option>
                                    {allStudents.map((student) => <option key={student.id} value={student.id}>{student.full_name} ({student.training_package?.replaceAll("_", " ") || "no package"})</option>)}
                                </FormSelect>
                                <input required placeholder="Title" value={learningForm.title} onChange={(e) => setLearningForm({ ...learningForm, title: e.target.value })} className="w-full rounded-2xl border border-slate-200 px-4 py-3 focus:border-primary focus:outline-none" />
                                <textarea required placeholder="Write the lesson, tip, sign meaning, or maintenance guidance..." value={learningForm.body} onChange={(e) => setLearningForm({ ...learningForm, body: e.target.value })} rows={5} className="w-full rounded-2xl border border-slate-200 px-4 py-3 focus:border-primary focus:outline-none" />
                                <input type="file" onChange={(e) => setLearningFile(e.target.files?.[0] || null)} accept=".pdf,.jpg,.jpeg,.png,.webp" className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3" />
                                <button type="submit" disabled={loading} className="w-full rounded-2xl bg-gradient-to-r from-secondary to-orange-500 py-3 font-black text-white shadow-lg transition hover:shadow-xl disabled:opacity-50">{loading ? "Saving..." : "Add Learning Content"}</button>
                            </form>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                {learningGroups.map((group) => (
                                    <div key={group.value} className="rounded-[1.5rem] bg-white p-5 shadow-sm ring-1 ring-slate-100">
                                        <h3 className="mb-3 text-lg font-black text-primary">{group.icon} {group.label}</h3>
                                        <div className="space-y-3">
                                            {group.items.length === 0 ? <p className="text-sm text-slate-500">No content yet.</p> : group.items.slice(0, 5).map((item) => (
                                                <div key={item.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
                                                    <div className="flex items-start justify-between gap-3">
                                                        <p className="font-black text-slate-800">{item.title}</p>
                                                        <span className={`rounded-full px-2 py-1 text-xs font-black ${item.is_fixed ? "bg-blue-100 text-primary" : "bg-green-100 text-success"}`}>{item.is_fixed ? "Fixed" : "Added"}</span>
                                                    </div>
                                                    <p className="mt-1 line-clamp-2 text-sm text-slate-600">{item.body}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === "documents" && (
                        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
                            <div className="rounded-[1.75rem] border-2 border-dashed border-sky bg-gradient-to-br from-sky-50 to-white p-6">
                                <h3 className="mb-4 text-lg font-black text-primary">📤 Upload Documentation</h3>
                                <form onSubmit={handleFileUpload} className="space-y-4">
                                    <input type="file" onChange={(e) => setUploadedFile(e.target.files?.[0])} accept=".pdf,.jpg,.jpeg,.png" className="w-full rounded-2xl border border-slate-200 bg-white p-3" />
                                    <p className="text-xs font-semibold text-slate-500">Accepted: PDF, JPG, PNG</p>
                                    <button type="submit" disabled={loading || !uploadedFile} className="w-full rounded-2xl bg-primary py-3 font-black text-white shadow-lg transition hover:bg-blue-900 disabled:opacity-50">{loading ? "Uploading..." : "Upload Document"}</button>
                                </form>
                            </div>

                            <div>
                                {documents.length === 0 ? <EmptyState text="No documents uploaded yet" /> : (
                                    <div className="space-y-3">
                                        {documents.map((doc) => (
                                            <div key={doc.id} className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100 transition hover:shadow-md">
                                                <div className="flex items-center gap-3">
                                                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary/10 text-2xl">{doc.file_name.endsWith(".pdf") ? "📄" : "🖼️"}</span>
                                                    <div>
                                                        <p className="font-black text-slate-800">{doc.file_name}</p>
                                                        <p className="text-xs text-slate-500">{new Date(doc.created_at).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                                <button className="rounded-full bg-sky-50 px-4 py-2 text-sm font-black text-primary">View</button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </section>
            </div>
        </Layout>
    );
}

function StatCard({ label, value, icon }) {
    return (
        <div className="rounded-2xl bg-white/18 p-4 text-center shadow-lg ring-1 ring-white/25 backdrop-blur">
            <p className="text-2xl">{icon}</p>
            <p className="mt-1 text-3xl font-black">{value}</p>
            <p className="text-xs font-bold text-white/85">{label}</p>
        </div>
    );
}

function StatusBadge({ status }) {
    const styles = {
        confirmed: "bg-green-100 text-green-800",
        pending: "bg-amber-100 text-amber-800",
        cancelled: "bg-red-100 text-red-800",
    };

    return <span className={`rounded-full px-3 py-1 text-xs font-black ${styles[status] || "bg-slate-100 text-slate-700"}`}>{status?.toUpperCase()}</span>;
}

function InfoTile({ label, value, icon }) {
    return (
        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
            <p className="text-xs font-black uppercase tracking-wide text-slate-400">{icon} {label}</p>
            <p className="mt-1 font-black text-slate-800">{value}</p>
        </div>
    );
}

function EmptyState({ text }) {
    return (
        <div className="rounded-[1.5rem] border border-dashed border-sky bg-sky-50 p-8 text-center text-slate-600">
            <p className="text-4xl">✨</p>
            <p className="mt-3 font-bold">{text}</p>
        </div>
    );
}

function FormSelect({ label, value, onChange, children }) {
    return (
        <label className="block">
            <span className="mb-2 block text-sm font-black text-slate-700">{label}</span>
            <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 focus:border-primary focus:outline-none">
                {children}
            </select>
        </label>
    );
}
