// src/services/bookingService.js
import { supabase } from "../lib/supabase";

// Get all instructors (users with role 'instructor')
export async function getInstructors() {
    const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, phone")
        .eq("role", "instructor");

    if (error) throw error;
    return data;
}

// Get available time slots for a given date (excluding already booked slots)
export async function getAvailableTimeSlots(date, instructorId = null) {
    // Define fixed time slots (9 AM to 5 PM, 2-hour intervals)
    const allSlots = ["8:00 AM", "10:00 AM", "12:00 PM", "2:00 PM", "4:00 PM"];

    // Fetch bookings for that date and optional instructor
    let query = supabase
        .from("bookings")
        .select("start_time")
        .eq("booking_date", date)
        .in("status", ["pending", "confirmed"]);

    if (instructorId) {
        query = query.eq("instructor_id", instructorId);
    }

    const { data: bookedSlots, error } = await query;
    if (error) throw error;

    const bookedTimes = bookedSlots.map((b) => b.start_time);
    const available = allSlots.filter((slot) => !bookedTimes.includes(slot));
    return available;
}

// Create a new booking
export async function createBooking({
                                        bookingDate,
                                        startTime,
                                        instructorId,
                                        pickupAddress,
                                        packageType,
                                    }) {
    // Get current student record
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { data: student, error: studentError } = await supabase
        .from("students")
        .select("id, training_package")
        .eq("user_id", user.id)
        .single();
    if (studentError) throw studentError;

    const { data, error } = await supabase
        .from("bookings")
        .insert({
            student_id: student.id,
            instructor_id: instructorId,
            booking_date: bookingDate,
            start_time: startTime,
            pickup_address: pickupAddress,
            package_type: packageType || student.training_package,
            status: "pending",
        })
        .select()
        .single();

    if (error) throw error;
    return data;
}

// Get student's next lesson (for dashboard)
export async function getNextLesson() {
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: student } = await supabase
        .from("students")
        .select("id")
        .eq("user_id", user.id)
        .single();
    if (!student) return null;

    const today = new Date().toISOString().split("T")[0];
    const { data, error } = await supabase
        .from("bookings")
        .select(`
      booking_date,
      start_time,
      instructor:instructor_id (full_name)
    `)
        .eq("student_id", student.id)
        .gte("booking_date", today)
        .in("status", ["confirmed", "pending"])
        .order("booking_date", { ascending: true })
        .order("start_time", { ascending: true })
        .limit(1);

    if (error) throw error;
    if (!data || data.length === 0) return null;

    const booking = data[0];
    return {
        date: new Date(booking.booking_date).toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        }),
        time: booking.start_time,
        instructor: booking.instructor?.full_name || "TBA",
    };
}