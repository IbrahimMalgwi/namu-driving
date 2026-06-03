//src/pages/BookLesson.jsx - Enhanced Booking Form
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

    async function handleInstructorChange(e) {
        const instructorId = e.target.value;
        setSelectedInstructor(instructorId);
        setPickupAddress("");
        setMessage("");
        if (instructorId) {
            setStep(4);
        }
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
            // reset form
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

    return (
        <Layout showBottomNav={true}>
            <div className="space-y-6">
                {/* Header */}
                <div className="bg-gradient-to-r from-primary to-blue-900 text-white rounded-2xl p-6 shadow-lg">
                    <h2 className="text-3xl font-bold mb-2">📅 Book a Lesson</h2>
                    <p className="text-blue-100">Reserve your lesson in just 4 simple steps</p>
                </div>

                {/* Progress Steps */}
                <div className="flex justify-between mb-8">
                    {[1, 2, 3, 4].map(s => (
                        <div key={s} className="flex items-center flex-1">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                                step >= s ? "bg-secondary text-white" : "bg-gray-200 text-gray-600"
                            }`}>
                                {s}
                            </div>
                            {s < 4 && <div className={`h-1 flex-1 mx-2 ${step > s ? "bg-secondary" : "bg-gray-200"}`}></div>}
                        </div>
                    ))}
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Step 1: Select Date */}
                    {step >= 1 && (
                        <div className="bg-white p-6 rounded-2xl shadow-lg">
                            <h3 className="font-bold text-lg text-primary mb-4 flex items-center">
                                <span className="bg-secondary text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">1</span>
                                Select Date
                            </h3>
                            <input
                                type="date"
                                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition"
                                value={selectedDate}
                                onChange={handleDateChange}
                                min={new Date().toISOString().split("T")[0]}
                                required
                            />
                        </div>
                    )}

                    {/* Step 2: Select Time */}
                    {selectedDate && step >= 2 && (
                        <div className="bg-white p-6 rounded-2xl shadow-lg">
                            <h3 className="font-bold text-lg text-primary mb-4 flex items-center">
                                <span className="bg-secondary text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">2</span>
                                Select Time
                            </h3>
                            {loading ? (
                                <p className="text-gray-600 text-center py-4">Loading available times...</p>
                            ) : (
                                <div className="grid grid-cols-3 gap-2">
                                    {timeSlots.length > 0 ? (
                                        timeSlots.map((slot) => (
                                            <button
                                                key={slot}
                                                type="button"
                                                onClick={() => {setSelectedTime(slot); setStep(3);}}
                                                className={`py-3 rounded-xl border-2 font-semibold transition ${
                                                    selectedTime === slot
                                                        ? "bg-primary text-white border-primary"
                                                        : "bg-gray-50 text-gray-800 border-gray-200 hover:border-primary"
                                                }`}
                                            >
                                                {slot}
                                            </button>
                                        ))
                                    ) : (
                                        <p className="col-span-3 text-gray-500 text-center">No available slots for this date.</p>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Step 3: Choose Instructor */}
                    {selectedTime && step >= 3 && (
                        <div className="bg-white p-6 rounded-2xl shadow-lg">
                            <h3 className="font-bold text-lg text-primary mb-4 flex items-center">
                                <span className="bg-secondary text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">3</span>
                                Choose Instructor
                            </h3>
                            <select
                                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition"
                                value={selectedInstructor}
                                onChange={handleInstructorChange}
                                required
                            >
                                <option value="">Select your preferred instructor</option>
                                {instructors.map((inst) => (
                                    <option key={inst.id} value={inst.id}>
                                        👩‍🏫 {inst.full_name} {inst.phone && `(${inst.phone})`}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Step 4: Pickup Location */}
                    {selectedInstructor && step >= 4 && (
                        <div className="bg-white p-6 rounded-2xl shadow-lg">
                            <h3 className="font-bold text-lg text-primary mb-4 flex items-center">
                                <span className="bg-secondary text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">4</span>
                                Pickup Location
                            </h3>
                            <input
                                type="text"
                                placeholder="e.g., Ikeja, Lagos or your home address"
                                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition mb-3"
                                value={pickupAddress}
                                onChange={(e) => setPickupAddress(e.target.value)}
                                required
                            />
                            <p className="text-sm text-gray-600">
                                📍 Please provide a detailed location for pickup
                            </p>
                        </div>
                    )}

                    {/* Message Alert */}
                    {message && (
                        <div className={`p-4 rounded-xl text-center font-semibold ${
                            message.includes("✓") 
                                ? "bg-green-100 text-green-800" 
                                : "bg-red-100 text-red-800"
                        }`}>
                            {message}
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        {step > 1 && (
                            <button
                                type="button"
                                onClick={() => setStep(step - 1)}
                                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-3 rounded-xl font-bold transition"
                            >
                                ← Back
                            </button>
                        )}
                        {step < 4 && selectedDate && selectedTime && selectedInstructor && (
                            <button
                                type="button"
                                onClick={() => setStep(step + 1)}
                                className="flex-1 bg-primary hover:bg-blue-900 text-white py-3 rounded-xl font-bold transition"
                            >
                                Next →
                            </button>
                        )}
                        {step === 4 && pickupAddress && (
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 bg-secondary hover:bg-red-700 text-white py-4 rounded-xl font-bold transition disabled:opacity-50 text-lg"
                            >
                                {loading ? "Booking..." : "✓ Confirm Booking"}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </Layout>
    );
}
