// src/pages/Dashboard.jsx
import Layout from "../components/Layout";

export default function Dashboard() {
    return (
        <Layout showBottomNav={false}>
            <h2 className="font-bold text-xl text-primary mb-4">Instructor Dashboard</h2>
            <div className="bg-white p-4 rounded-xl shadow mb-4">
                <p className="font-semibold">Today's Schedule</p>
                <p className="text-sm text-gray-600">10:00 AM - Student Pickup (Ikeja)</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow mb-4">
                <p className="font-semibold">Map View</p>
                <div className="h-40 bg-gray-200 rounded mt-2 flex items-center justify-center text-gray-500">
                    🗺️ Map placeholder
                </div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow">
                <p className="font-semibold mb-2">Upload Documents</p>
                <input type="file" className="w-full mb-3" />
                <button className="bg-primary text-white px-4 py-2 rounded-xl w-full">Upload</button>
            </div>
        </Layout>
    );
}