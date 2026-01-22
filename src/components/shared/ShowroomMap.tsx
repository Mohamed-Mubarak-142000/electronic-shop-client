'use client';

import { useEffect, useState, useMemo } from 'react';
import Map, { Marker, Popup, NavigationControl, FullscreenControl } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

interface ShowroomMapProps {
    location: { lat: number, lng: number };
    name: string;
}

export default function ShowroomMap({ location, name }: ShowroomMapProps) {
    const [isMounted, setIsMounted] = useState(false);
    const [showPopup, setShowPopup] = useState(true);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsMounted(true);
    }, []);

    const initialViewState = useMemo(() => ({
        latitude: location.lat,
        longitude: location.lng,
        zoom: 14
    }), [location]);

    if (!isMounted) {
        return <div className="h-full w-full bg-slate-800 animate-pulse rounded-2xl" />;
    }

    return (
        <div className="h-full w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative">
            <Map
                initialViewState={initialViewState}
                style={{ width: '100%', height: '100%' }}
                mapStyle="mapbox://styles/mapbox/streets-v12" // Sleek dark style to match the theme
                mapboxAccessToken={MAPBOX_TOKEN}
                scrollZoom={false}
            >
                <NavigationControl position="top-right" />
                <FullscreenControl position="top-right" />

                <Marker
                    latitude={location.lat}
                    longitude={location.lng}
                    anchor="bottom"
                    onClick={(e) => {
                        e.originalEvent.stopPropagation();
                        setShowPopup(true);
                    }}
                >
                    <div className="text-primary animate-bounce cursor-pointer">
                        <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                            location_on
                        </span>
                    </div>
                </Marker>

                {showPopup && (
                    <Popup
                        latitude={location.lat}
                        longitude={location.lng}
                        anchor="top"
                        onClose={() => setShowPopup(false)}
                        closeButton={true}
                        closeOnClick={false}
                        className="custom-popup"
                    >
                        <div className="p-1">
                            <h3 className="text-slate-900 font-bold text-sm">{name}</h3>
                            <p className="text-slate-600 text-xs mt-1">Our Premium Showroom</p>
                        </div>
                    </Popup>
                )}
            </Map>

            {/* Map is ready with token from env */}

            <style jsx global>{`
                .mapboxgl-popup-content {
                    border-radius: 12px !important;
                    padding: 8px !important;
                    background: white !important;
                    box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1) !important;
                }
                .mapboxgl-popup-tip {
                    border-top-color: white !important;
                    border-bottom-color: white !important;
                }
            `}</style>
        </div>
    );
}
