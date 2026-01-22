'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import Map, { Marker, NavigationControl, FullscreenControl, GeolocateControl, Popup } from 'react-map-gl/mapbox';
import type { MapRef, MapMouseEvent, MarkerDragEvent } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { mapService, SearchResult } from '@/services/mapService';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

// Simple debounce utility
function debounce<T extends unknown[]>(func: (...args: T) => void, waitFor: number) {
    let timeout: ReturnType<typeof setTimeout> | null = null;

    return (...args: T): void => {
        if (timeout !== null) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(() => func(...args), waitFor);
    };
}

interface MapSelectorProps {
    value: { lat: number, lng: number };
    onChange: (v: { lat: number, lng: number }) => void;
    readOnly?: boolean;
}


export default function MapSelector({ value, onChange, readOnly = false }: MapSelectorProps) {
    const mapRef = useRef<MapRef>(null);
    const [isMounted, setIsMounted] = useState(false);
    const [mapError, setMapError] = useState<string | null>(null);
    const [popupInfo, setPopupInfo] = useState<{ longitude: number, latitude: number, placeName: string } | null>(null);
    const [viewState, setViewState] = useState({
        latitude: 30.0444,
        longitude: 31.2357,
        zoom: 13
    });

    // Search State
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [showResults, setShowResults] = useState(false);
    const [searching, setSearching] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        if (value.lat && value.lng) {
            setViewState(prev => ({
                ...prev,
                latitude: value.lat,
                longitude: value.lng
            }));
        }
    }, []);

    const performSearch = async (query: string) => {
        if (!query.trim()) {
            setSearchResults([]);
            return;
        }

        setSearching(true);
        try {
            const results = await mapService.searchPlaces(query);
            setSearchResults(results);
            setShowResults(true);
        } catch (error) {
            console.error('Search failed:', error);
        } finally {
            setSearching(false);
        }
    };

    const debouncedSearch = useCallback(
        debounce((q: string) => performSearch(q), 500),
        []
    );

    const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);
        debouncedSearch(query);
    };

    const handleSelectResult = (result: SearchResult) => {
        const [lng, lat] = result.center;

        mapRef.current?.flyTo({
            center: [lng, lat],
            zoom: 15,
            duration: 2000
        });

        onChange({ lat, lng });
        setSearchQuery(result.place_name);
        setPopupInfo({
            longitude: lng,
            latitude: lat,
            placeName: result.place_name
        });
        setShowResults(false);
    };

    const handleMapClick = (e: MapMouseEvent) => {
        if (readOnly) return;
        const { lng, lat } = e.lngLat;
        onChange({ lat, lng });
        setPopupInfo(null);
    };

    if (!isMounted) {
        return <div className="h-[400px] w-full bg-slate-100 dark:bg-slate-800 animate-pulse rounded-xl" />;
    }

    if (!MAPBOX_TOKEN) {
        return (
            <div className="h-[400px] w-full rounded-xl border border-red-200 bg-red-50 dark:bg-red-900/10 dark:border-red-900/30 flex flex-col items-center justify-center p-6 text-center">
                <span className="material-symbols-outlined text-4xl text-red-500 mb-2">map</span>
                <p className="text-red-700 dark:text-red-400 font-bold mb-1">Map Cannot Be Loaded</p>
                <p className="text-sm text-red-600 dark:text-red-300">
                    Mapbox configuration is missing.
                </p>
            </div>
        );
    }

    return (
        <div className="h-[600px] w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl relative group">
            {!readOnly && (
            <div className="absolute top-4 left-4 right-12 z-20 max-w-md">
                <div className="relative shadow-lg rounded-xl bg-white dark:bg-slate-900 ring-1 ring-slate-900/5">
                    <div className="flex items-center px-4 py-3">
                        <span className="material-symbols-outlined text-slate-400 mr-2">search</span>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={handleSearchInput}
                            placeholder="Search for a location..."
                            className="flex-1 bg-transparent border-none outline-none text-slate-900 dark:text-white placeholder:text-slate-400 text-sm"
                            onFocus={() => setShowResults(true)}
                        />
                        {searching && <span className="material-symbols-outlined animate-spin text-primary text-sm">progress_activity</span>}
                        {searchQuery && !searching && (
                            <button onClick={() => { setSearchQuery(''); setSearchResults([]); }} className="text-slate-400 hover:text-slate-600">
                                <span className="material-symbols-outlined text-sm">close</span>
                            </button>
                        )}
                    </div>

                    {showResults && searchResults.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden max-h-60 overflow-y-auto">
                            <ul>
                                {searchResults.map((result) => (
                                    <li
                                        key={result.id}
                                        onClick={() => handleSelectResult(result)}
                                        className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer text-sm text-slate-700 dark:text-slate-300 border-b border-slate-50 dark:border-slate-800 last:border-none flex items-start gap-2"
                                    >
                                        <span className="material-symbols-outlined text-lg text-slate-400 mt-0.5">location_on</span>
                                        <span>{result.place_name}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
            )}

            <Map
                ref={mapRef}
                {...viewState}
                onMove={evt => setViewState(evt.viewState)}
                style={{ width: '100%', height: '100%' }}
                mapStyle="mapbox://styles/mapbox/streets-v12"
                mapboxAccessToken={MAPBOX_TOKEN}
                onClick={handleMapClick}
                onError={(e) => {
                    console.error("Mapbox Error:", e);
                    setMapError(e.error?.message || "Failed to load map");
                }}
            >
                <NavigationControl position="top-right" />
                <FullscreenControl position="top-right" />
                <GeolocateControl position="top-right" />

                {value.lat !== 0 && (
                    <Marker
                        latitude={value.lat}
                        longitude={value.lng}
                        anchor="bottom"
                        draggable={!readOnly}
                        onDragEnd={(e: MarkerDragEvent) => {
                            onChange({ lat: e.lngLat.lat, lng: e.lngLat.lng });
                            setPopupInfo(null);
                        }}
                    >
                        <div className={`text-red-600 transform transition-transform ${!readOnly ? 'hover:scale-110 cursor-move' : ''} drop-shadow-lg`}>
                            <span className="material-symbols-outlined text-6xl filled" style={{ fontVariationSettings: "'FILL' 1" }}>
                                location_on
                            </span>
                        </div>
                    </Marker>
                )}

                {popupInfo && (
                    <Popup
                        anchor="top"
                        longitude={popupInfo.longitude}
                        latitude={popupInfo.latitude}
                        onClose={() => setPopupInfo(null)}
                        className="rounded-xl overflow-hidden shadow-lg"
                    >
                        <div className="p-2 text-sm font-medium text-slate-800">
                            {popupInfo.placeName}
                        </div>
                    </Popup>
                )}
            </Map>

            {mapError && (
                <div className="absolute inset-0 z-50 bg-white/80 dark:bg-slate-900/80 flex items-center justify-center">
                    <div className="text-center p-4">
                        <p className="text-red-500 font-bold">Map Error</p>
                        <p className="text-sm">{mapError}</p>
                    </div>
                </div>
            )}

         
            </div>
        // </div>
    );
}
