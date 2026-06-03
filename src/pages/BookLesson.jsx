//src/pages/BookLesson.jsx
import { supabase } from "../lib/supabase";
import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { getInstructors, getAvailableTimeSlots, createBooking } from "../services/bookingService";
import { getCurrentUserProfile } from "../services/authService";

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
        const profile = await getCurrentUserProfile();
        if (profile && profile.role === "student") {
            // fetch student's training package from students table
            const { data } = await supabase
                .from("students")
                .select("training_package")
                .eq("user_id", profile.id)
                .single();
            if (data) setStudentPackage(data.training_package);
        }
    }

    async function handleDateChange(e) {
        const date = e.target.value;
        setSelectedDate(date);
        setSelectedTime("");
        if (date) {
            setLoading(true);
            const slots = await getAvailableTimeSlots(date, selectedInstructor);
            setTimeSlots(slots);
            setLoading(false);
        }
    }

    async function handleInstructorChange(e) {
        const instructorId = e.target.value;
        setSelectedInstructor(instructorId);
        setSelectedTime("");
        if (selectedDate) {
            setLoading(true);
            const slots = await getAvailableTimeSlots(selectedDate, instructorId);
            setTimeSlots(slots);
            setLoading(false);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setMessage("");
        try {
            await createBooking({
                bookingDate: selectedDate,
                startTime: selectedTime,
                instructorId: selectedInstructor,
                pickupAddress,
                packageType: studentPackage,
            });
            setMessage("Booking request sent! Awaiting confirmation.");
            // reset form
            setStep(1);
            setSelectedDate("");
            setSelectedTime("");
            setSelectedInstructor("");
            setPickupAddress("");
        } catch (err) {
            setMessage(err.message || "Booking failed");
        }
    }

    return (
        <Layout showBottomNav={true}>
            <h2 className="text-xl font-bold text-primary mb-4">Book a Lesson</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Step 1: Select Date */}
                <div className="bg-white p-5 rounded-2xl shadow">
                    <label className="font-semibold block mb-2">1. Select Date</label>
                    <input
                        type="date"
                        className="w-full border rounded-xl px-4 py-3"
                        value={selectedDate}
                        onChange={handleDateChange}
                        min={new Date().toISOString().split("T")[0]}
                        required
                    />
                </div>

                {/* Step 2: Select Time (only if date selected) */}
                {selectedDate && (
                    <div className="bg-white p-5 rounded-2xl shadow">
                        <label className="font-semibold block mb-2">2. Select Time</label>
                        {loading ? (
                            <p>Loading slots...</p>
                        ) : (
                            <div className="grid grid-cols-3 gap-2">
                                {timeSlots.map((slot) => (
                                    <button
                                        key={slot}
                                        type="button"
                                        onClick={() => setSelectedTime(slot)}
                                        className={`py-2 rounded-xl border ${
                                            selectedTime === slot
                                                ? "bg-primary text-white"
                                                : "bg-gray-100 text-gray-800"
                                        }`}
                                    >
                                        {slot}
                                    </button>
                                ))}
                            </div>
                        )}
                        {timeSlots.length === 0 && !loading && (
                            <p className="text-gray-500">No available slots for this date.</p>
                        )}
                    </div>
                )}

                {/* Step 3: Choose Instructor */}
                <div className="bg-white p-5 rounded-2xl shadow">
                    <label className="font-semibold block mb-2">3. Choose Instructor</label>
                    <select
                        className="w-full border rounded-xl px-4 py-3"
                        value={selectedInstructor}
                        onChange={handleInstructorChange}
                        required
                    >
                        <option value="">Select an instructor</option>
                        {instructors.map((inst) => (
                            <option key={inst.id} value={inst.id}>
                                {inst.full_name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Step 4: Pickup Location */}
                <div className="bg-white p-5 rounded-2xl shadow">
                    <label className="font-semibold block mb-2">4. Pickup Location</label>
                    <input
                        type="text"
                        placeholder="e.g., Ikeja, Lagos"
                        className="w-full border rounded-xl px-4 py-3"
                        value={pickupAddress}
                        onChange={(e) => setPickupAddress(e.target.value)}
                        required
                    />
                </div>

                {message && (
                    <p className={`text-center ${message.includes("success") ? "text-green-600" : "text-red-600"}`}>
                        {message}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={!selectedDate || !selectedTime || !selectedInstructor || !pickupAddress}
                    className="w-full bg-secondary text-white py-3 rounded-xl font-semibold disabled:opacity-50"
                >
                    Confirm Booking
                </button>
            </form>
        </Layout>
    );
}