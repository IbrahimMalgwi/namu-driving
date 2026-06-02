// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { getInstructorBookings } from "../services/bookingService";

export default function Dashboard() {
    const [bookings, setBookings] = useState([]);
    const [errorText, setErrorText] = useState("");

    useEffect(() => {
        async function load() {
            try {
                const data = await getInstructorBookings();
                setBookings(data);
            } catch (error) {
                setErrorText(error.message || "Unable to load bookings.");
            }
        }

        load();
    }, []);

    return (
        <Layout>
            <h2 className="font-bold text-xl mb-4">
                Owner / Instructor Dashboard
            </h2>

            {errorText && (
                <p className="bg-red-50 text-red-600 p-3 rounded-xl mb-4">
                    {errorText}
                </p>
            )}

            <div className="bg-white p-5 rounded-2xl shadow mb-5">
                <h3 className="font-bold text-primary mb-3">Booking Schedule</h3>

                <div className="space-y-3">
                    {bookings.map((booking) => (
                        <div
                            key={booking.id}
                            className="border rounded-xl p-3"
                        >
                            <p className="font-semibold">
                                {booking.students?.full_name}
                            </p>

                            <p className="text-sm text-gray-500">
                                {booking.booking_date} • {booking.start_time}
                            </p>

                            <p className="text-sm">
                                Package: {booking.package_type}
                            </p>

                            {booking.pickup_address && (
                                <p className="text-sm text-gray-600">
                                    Pickup: {booking.pickup_address}
                                </p>
                            )}
                        </div>
                    ))}

                    {bookings.length === 0 && (
                        <p className="text-sm text-gray-500">
                            No bookings found.
                        </p>
                    )}
                </div>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow mb-5">
                <h3 className="font-bold text-primary mb-3">
                    Special Training Pickups
                </h3>

                <div className="h-52 bg-gray-100 rounded-xl flex items-center justify-center text-gray-500">
                    Map integration goes here
                </div>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow">
                <h3 className="font-bold text-primary mb-3">
                    Secure Student Documents
                </h3>

                <p className="text-sm text-gray-500">
                    Upload and view student IDs and Learner Permits from the documents module.
                </p>
            </div>
        </Layout>
    );
}