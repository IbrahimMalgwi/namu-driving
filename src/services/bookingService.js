// src/services/bookingService.js
import { supabase } from "../lib/supabase";

export async function getInstructorBookings() {
    const { data, error } = await supabase
        .from("bookings")
        .select(`
      *,
      students (
        id,
        full_name,
        phone,
        pickup_address,
        training_package
      )
    `)
        .order("booking_date", { ascending: true })
        .order("start_time", { ascending: true });

    if (error) throw error;

    return data;
}