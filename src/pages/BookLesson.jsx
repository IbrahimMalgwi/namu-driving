//src/pages/BookLesson.jsx - Mobile-first booking flow
import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { getInstructors, getAvailableTimeSlots, createBooking } from "../services/bookingService";
import { getCurrentUserProfile } from "../services/authService";
import { supabase } from "../lib/supabase";

export default function BookLesson() {
    const [step, setStep] = useState(1);
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedTime, setSelectedTime] = useState("");
    const [selectedInstructor, setSelectedInstructor] = useState("");
    const [pickupAddress, setPickupAddress] = useState("");
    const [instructors, setInstructors] = useState([]);
    const [timeSlots, setTimeSlots] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [studentPackage, setStudentPackage] = useState("regular");

    function getErrorMessage(error, fallback) {
        if (!error) return fallback;
        if (typeof error === "string") return error;
        if (typeof error.message === "string") return error.message;
        if (typeof error.error_description === "string") return error.error_description;
        if (typeof error.details === "string") return error.details;

        try {
            const serialized = JSON.stringify(error);
            return serialized && serialized !== "{}" ? serialized : fallback;
        } catch {
            return fallback;
        }
    }

    useEffect(() => {
        loadInstructors();
        loadStudentPackage();
    }, []);

    async function loadInstructors() {
        try {
            const data = await getInstructors();
            setInstructors(data);
        } catch (err) {
            console.error(err);
        }
    }

    async function loadStudentPackage() {
        try {
            const profile = await getCurrentUserProfile();
            if (profile && profile.role === "student") {
                const { data, error } = await supabase
                    .from("students")
                    .select("training_package")
                    .eq("user_id", profile.id)
                    .single();
                if (error) throw error;
                if (data) setStudentPackage(data.training_package);
            }
        } catch (err) {
            console.error("Unable to load student package:", err);
        }
    }

    async function handleDateChange(e) {
        const date = e.target.value;
        setSelectedDate(date);
        setSelectedTime("");
        setSelectedInstructor("");
        setPickupAddress("");
        setStep(date ? 2 : 1);
        setMessage("");
        if (date) {
            try {
                setLoading(true);
                const slots = await getAvailableTimeSlots(date);
                setTimeSlots(slots);
            } catch (err) {
                console.error("Unable to load available time slots:", err);
                setTimeSlots([]);
                setMessage("✗ " + getErrorMessage(err, "Unable to load available time slots."));
            } finally {
                setLoading(false);
            }
        } else {
            setTimeSlots([]);
        }
    }

    function handleInstructorChange(instructorId) {
        setSelectedInstructor(instructorId);
        setPickupAddress("");
        setMessage("");
        if (instructorId) setStep(4);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setMessage("");
        try {
            setLoading(true);
            await createBooking({
                bookingDate: selectedDate,
                startTime: selectedTime,
                instructorId: selectedInstructor,
                pickupAddress,
                packageType: studentPackage,
            });
            setMessage("✓ Booking request sent! We'll confirm within 24 hours.");
            setSelectedDate("");
            setSelectedTime("");
            setSelectedInstructor("");
            setPickupAddress("");
            setStep(1);
        } catch (err) {
            console.error("Booking failed:", err);
            setMessage("✗ " + getErrorMessage(err, "Booking failed. Please try again."));
        } finally {
            setLoading(false);
        }
    }

    const selectedInstructorData = instructors.find((inst) => inst.id === selectedInstructor);

    return (
        <Layout showBottomNav={true} title="Book Lesson" contentClassName="flex-1 overflow-y-auto bg-slate-100">
            <div className="mx-auto max-w-3xl md:px-4 md:py-6">
                <div className="bg-primary px-5 py-5 text-white shadow-lg md:rounded-t-[2rem]">
                    <h1 className="text-center text-xl font-black">Book Lesson</h1>
                    <p className="mt-1 text-center text-sm text-blue-100">Reserve a lesson in four quick steps</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5 px-4 py-5 md:rounded-b-[2rem] md:bg-white md:p-6 md:shadow-xl">
                    <StepCard number="1" title="Select Date" active>
                        <input
                            type="date"
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 font-bold text-slate-800 focus:border-primary focus:outline-none"
                            value={selectedDate}
                            onChange={handleDateChange}
                            min={new Date().toISOString().split("T")[0]}
                            required
                        />
                    </StepCard>

                    {selectedDate && (
                        <StepCard number="2" title="Select Time" active={step >= 2}>
                            {loading ? (
                                <p className="py-4 text-center text-sm text-slate-500">Loading available times...</p>
                            ) : (
                                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                                    {timeSlots.length > 0 ? (
                                        timeSlots.map((slot) => (
                                            <button
                                                key={slot}
                                                type="button"
                                                onClick={() => { setSelectedTime(slot); setStep(3); }}
                                                className={`rounded-2xl border px-4 py-3 text-sm font-black transition ${
                                                    selectedTime === slot
                                                        ? "border-primary bg-primary text-white shadow"
                                                        : "border-slate-200 bg-white text-slate-700 hover:border-primary"
                                                }`}
                                            >
                                                {slot}
                                            </button>
                                        ))
                                    ) : (
                                        <p className="col-span-full text-center text-sm text-slate-500">No available slots for this date.</p>
                                    )}
                                </div>
                            )}
                        </StepCard>
                    )}

                    {selectedTime && (
                        <StepCard number="3" title="Choose Instructor" active={step >= 3}>
                            <div className="space-y-3">
                                {instructors.map((inst) => (
                                    <button
                                        key={inst.id}
                                        type="button"
                                        onClick={() => handleInstructorChange(inst.id)}
                                        className={`flex w-full items-center justify-between rounded-2xl border p-4 text-left transition ${
                                            selectedInstructor === inst.id
                                                ? "border-primary bg-blue-50"
                                                : "border-slate-200 bg-white hover:border-primary"
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gold text-xl">👩‍🏫</span>
                                            <div>
                                                <p className="font-black text-slate-900">{inst.full_name}</p>
                                                <p className="text-xs text-slate-500">{inst.phone || "Certified instructor"}</p>
                                            </div>
                                        </div>
                                        <span className="text-xl text-primary">{selectedInstructor === inst.id ? "✓" : "›"}</span>
                                    </button>
                                ))}
                            </div>
                        </StepCard>
                    )}

                    {selectedInstructor && (
                        <StepCard number="4" title="Pickup Location" active={step >= 4}>
                            {selectedInstructorData && (
                                <p className="mb-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-600">
                                    Instructor: {selectedInstructorData.full_name}
                                </p>
                            )}
                            <input
                                type="text"
                                placeholder="Ikeja, Lagos or your home address"
                                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 focus:border-primary focus:outline-none"
                                value={pickupAddress}
                                onChange={(e) => setPickupAddress(e.target.value)}
                                required
                            />
                        </StepCard>
                    )}

                    {message && (
                        <div className={`rounded-2xl p-4 text-center text-sm font-black ${
                            message.includes("✓") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}>
                            {message}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading || !selectedDate || !selectedTime || !selectedInstructor || !pickupAddress}
                        className="w-full rounded-2xl bg-secondary py-4 text-base font-black text-white shadow-xl transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {loading ? "Booking..." : "Confirm Booking"}
                    </button>
                </form>
            </div>
        </Layout>
    );
}

function StepCard({ number, title, active, children }) {
    return (
        <section className={`rounded-[1.5rem] bg-white p-5 shadow ${active ? "border border-slate-100" : "opacity-60"}`}>
            <h2 className="mb-4 flex items-center gap-3 text-base font-black text-slate-900">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm text-white">{number}</span>
                {title}
            </h2>
            {children}
        </section>
    );
}
