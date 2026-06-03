// src/components/PickupMap.jsx
import React from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { useState } from 'react';

const PickupMap = ({ students = [], bookings = [] }) => {
    const [selectedMarker, setSelectedMarker] = useState(null);

    // Default map center (Lagos, Nigeria)
    const defaultCenter = {
        lat: 6.5244,
        lng: 3.3792
    };

    // Map container style
    const containerStyle = {
        width: '100%',
        height: '500px',
        borderRadius: '12px'
    };

    // Convert address to approximate coordinates (demo purposes)
    const getCoordinates = (address) => {
        // This is a simple demo - in production, you'd use Google Geocoding API
        const coordMap = {
            'ikeja': { lat: 6.5904, lng: 3.3519 },
            'vi': { lat: 6.4298, lng: 3.4289 },
            'lekki': { lat: 6.4674, lng: 3.5808 },
            'ikoyi': { lat: 6.4545, lng: 3.4299 },
            'ajah': { lat: 6.5090, lng: 3.7022 },
            'surulere': { lat: 6.5040, lng: 3.3531 },
            'bariga': { lat: 6.5290, lng: 3.3847 },
            'yaba': { lat: 6.5244, lng: 3.3792 }
        };

        const addressLower = address?.toLowerCase() || '';
        for (const [key, coords] of Object.entries(coordMap)) {
            if (addressLower.includes(key)) {
                return coords;
            }
        }

        // Random coordinates near Lagos if not found
        return {
            lat: defaultCenter.lat + (Math.random() - 0.5) * 0.2,
            lng: defaultCenter.lng + (Math.random() - 0.5) * 0.2
        };
    };

    // Prepare markers from bookings with pickup addresses
    const markers = bookings
        .filter(b => b.pickup_address && b.status !== 'cancelled')
        .map(booking => ({
            id: booking.id,
            position: getCoordinates(booking.pickup_address),
            title: booking.student?.full_name,
            address: booking.pickup_address,
            time: booking.start_time,
            date: booking.booking_date,
            status: booking.status,
            phone: booking.student?.phone
        }));

    if (!process.env.REACT_APP_GOOGLE_MAPS_API_KEY) {
        return (
            <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
                <div className="text-center">
                    <p className="mb-2">🗺️ Google Maps Integration</p>
                    <p className="text-sm">Add REACT_APP_GOOGLE_MAPS_API_KEY to .env.local to enable live map</p>
                    <div className="mt-4 text-xs bg-gray-300 p-3 rounded max-w-md mx-auto">
                        <p className="mb-2">Setup instructions:</p>
                        <ol className="text-left space-y-1">
                            <li>1. Get API key from Google Cloud Console</li>
                            <li>2. Add to .env.local file</li>
                            <li>3. Restart the app</li>
                        </ol>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={defaultCenter}
                zoom={12}
            >
                {/* Markers for each pickup location */}
                {markers.map((marker) => (
                    <Marker
                        key={marker.id}
                        position={marker.position}
                        title={marker.title}
                        onClick={() => setSelectedMarker(marker)}
                        icon={{
                            path: 'M0 -48c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48zm0 84c-19.88 0-36-16.12-36-36s16.12-36 36-36 36 16.12 36 36-16.12 36-36 36z',
                            fillColor: marker.status === 'confirmed' ? '#2ECC71' : '#E53935',
                            fillOpacity: 1,
                            strokeWeight: 2,
                            strokeColor: 'white',
                            scale: 0.5
                        }}
                    />
                ))}

                {/* Info window for selected marker */}
                {selectedMarker && (
                    <InfoWindow
                        position={selectedMarker.position}
                        onCloseClick={() => setSelectedMarker(null)}
                    >
                        <div className="p-3 bg-white rounded shadow-lg max-w-xs">
                            <h3 className="font-bold text-primary mb-2">{selectedMarker.title}</h3>
                            <div className="space-y-1 text-sm">
                                <p><strong>📍 Location:</strong> {selectedMarker.address}</p>
                                <p><strong>📅 Date:</strong> {new Date(selectedMarker.date).toLocaleDateString()}</p>
                                <p><strong>⏰ Time:</strong> {selectedMarker.time}</p>
                                <p><strong>📞 Phone:</strong> {selectedMarker.phone}</p>
                                <p>
                                    <strong>Status:</strong>{' '}
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                                        selectedMarker.status === 'confirmed'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {selectedMarker.status.toUpperCase()}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </InfoWindow>
                )}
            </GoogleMap>
        </LoadScript>
    );
};

export default PickupMap;

