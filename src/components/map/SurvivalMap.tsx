"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default Leaflet marker icons in Next.js
const fixLeafletIcon = () => {
    // @ts-expect-error - Leaflet internals
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    });
};

// Bus Route Definitions (Approximate paths for Pergamino)
const busRoutes: Record<string, { color: string, path: [number, number][] }> = {
    "A": {
        color: "#10b981",
        path: [
            [-33.9103, -60.5693],
            [-33.905, -60.57],
            [-33.8908, -60.5689],
            [-33.882, -60.575],
            [-33.875, -60.58],
        ]
    },
    "B": {
        color: "#6366f1",
        path: [
            [-33.9137, -60.5868],
            [-33.905, -60.58],
            [-33.8908, -60.5689],
            [-33.895, -60.575],
            [-33.90076, -60.58988],
        ]
    },
    "C": {
        color: "#f43f5e",
        path: [
            [-33.885, -60.55],
            [-33.8908, -60.5689],
            [-33.9137, -60.5868],
        ]
    }
};

export interface MapPOI {
    id: string;
    name: string;
    description: string;
    position: [number, number];
    category: 'university' | 'health' | 'housing' | 'food' | 'transport' | 'other';
}

const categoryColors: Record<string, string> = {
    university: '#10b981',
    health: '#f43f5e',
    housing: '#6366f1',
    food: '#f59e0b',
    transport: '#06b6d4',
    other: '#64748b'
};

const createColorIcon = (color: string) => {
    return new L.Icon({
        iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${getColorName(color)}.png`,
        shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });
};

function getColorName(hex: string): string {
    const map: Record<string, string> = {
        '#10b981': 'green',
        '#f43f5e': 'red',
        '#6366f1': 'violet',
        '#f59e0b': 'gold',
        '#06b6d4': 'blue',
        '#64748b': 'grey'
    };
    return map[hex] || 'blue';
}

const categoryLabels: Record<string, string> = {
    university: '🎓 Universidad',
    health: '🏥 Salud',
    housing: '🏠 Hospedaje',
    food: '🍕 Comida',
    transport: '🚌 Transporte',
    other: '📍 Otro'
};

const SurvivalMap = ({ activeLine, pois = [] }: { activeLine?: string; pois?: MapPOI[] }) => {
    useEffect(() => {
        fixLeafletIcon();
    }, []);

    return (
        <MapContainer
            center={[-33.8908, -60.57]}
            zoom={14}
            style={{ height: '100%', width: '100%', borderRadius: '1rem', zIndex: 0 }}
            zoomControl={false}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            />

            {activeLine && busRoutes[activeLine] && (
                <Polyline
                    positions={busRoutes[activeLine].path}
                    pathOptions={{ color: busRoutes[activeLine].color, weight: 6, opacity: 0.7 }}
                />
            )}

            {pois.map((poi) => (
                <Marker
                    key={poi.id}
                    position={poi.position}
                    icon={createColorIcon(categoryColors[poi.category] || '#64748b')}
                >
                    <Popup>
                        <div style={{ padding: '4px', minWidth: '150px' }}>
                            <span style={{ fontSize: '0.7rem', fontWeight: 600, color: categoryColors[poi.category], textTransform: 'uppercase' }}>
                                {categoryLabels[poi.category] || poi.category}
                            </span>
                            <strong style={{ display: 'block', fontSize: '1rem', marginTop: '2px', marginBottom: '4px' }}>{poi.name}</strong>
                            <p style={{ margin: 0, fontSize: '0.85rem', color: '#666' }}>{poi.description}</p>
                        </div>
                    </Popup>
                </Marker>
            ))}

            {pois.length === 0 && !activeLine && (
                <Marker position={[-33.8908, -60.5689]}>
                    <Popup>
                        <div style={{ padding: '4px' }}>
                            <strong>Pergamino Centro</strong>
                            <p style={{ margin: 0, fontSize: '0.85rem', color: '#666' }}>Cargá POIs desde el panel de admin.</p>
                        </div>
                    </Popup>
                </Marker>
            )}
        </MapContainer>
    );
};

export default SurvivalMap;
