"use client";

import { useEffect, useState } from "react";
import {
    getUniversitySedes,
    getHealthServices,
    getProperties,
    getRestaurants,
    updateUniversitySede,
    updateHealthService
} from "@/app/actions/data";
import { ChevronLeft, MapPin, Save, CheckCircle, Building, Stethoscope, Home, Utensils, ExternalLink } from "lucide-react";
import Link from "next/link";
import styles from "./MapaAdmin.module.css";

export default function AdminMapaPage() {
    const [sedes, setSedes] = useState<any[]>([]);
    const [health, setHealth] = useState<any[]>([]);
    const [properties, setProperties] = useState<any[]>([]);
    const [restaurants, setRestaurants] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const loadPOIs = async () => {
        setLoading(true);
        const [sedesData, healthData, propData, restData] = await Promise.all([
            getUniversitySedes(),
            getHealthServices(),
            getProperties(),
            getRestaurants()
        ]);
        setSedes(sedesData);
        setHealth(healthData);
        setProperties(propData);
        setRestaurants(restData);
        setLoading(false);
    };

    useEffect(() => {
        loadPOIs();
    }, []);

    const handleUpdateCoords = async (id: string, type: 'SEDE' | 'HEALTH', lat: string, lng: string) => {
        setProcessing(id);
        try {
            if (type === 'SEDE') {
                await updateUniversitySede(id, { lat, lng });
            } else {
                await updateHealthService(id, { lat, lng });
            }
            setSuccess(id);
            setTimeout(() => setSuccess(null), 2000);
        } catch (error) {
            alert("Error al actualizar coordenadas");
        } finally {
            setProcessing(null);
        }
    };

    const totalPOIs = sedes.length + health.length + properties.length + restaurants.length;

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <Link href="/admin" className={styles.backBtn}>
                    <ChevronLeft size={24} />
                </Link>
                <h1>Mapa y Coordenadas</h1>
            </header>

            <div className={styles.infoBox}>
                <p>Ajustá las coordenadas de los Puntos de Interés (POI) para que aparezcan correctamente en el mapa de la app. Las coordenadas de Pergamino son aproximadamente <strong>Lat: -33.89</strong>, <strong>Lng: -60.57</strong>.</p>
            </div>

            {loading ? (
                <div className={styles.loading}>Cargando puntos...</div>
            ) : totalPOIs === 0 ? (
                <div className={styles.emptyState}>
                    <MapPin size={48} strokeWidth={1.5} />
                    <h3>No hay puntos de interés cargados</h3>
                    <p>Para ajustar coordenadas en el mapa, primero necesitás cargar datos desde las otras secciones del admin.</p>
                    <div className={styles.quickLinks}>
                        <Link href="/admin/unnoba" className={styles.quickLink}>
                            <Building size={18} />
                            Cargar Sedes UNNOBA
                        </Link>
                        <Link href="/admin/salud" className={styles.quickLink}>
                            <Stethoscope size={18} />
                            Cargar Centros de Salud
                        </Link>
                        <Link href="/admin/hospedaje" className={styles.quickLink}>
                            <Home size={18} />
                            Cargar Hospedajes
                        </Link>
                        <Link href="/admin/comida" className={styles.quickLink}>
                            <Utensils size={18} />
                            Cargar Lugares de Comida
                        </Link>
                    </div>
                </div>
            ) : (
                <div className={styles.sections}>
                    {sedes.length > 0 && (
                        <section className={styles.section}>
                            <h3><Building size={16} /> Sedes UNNOBA ({sedes.length})</h3>
                            <div className={styles.list}>
                                {sedes.map(sede => (
                                    <POICard
                                        key={sede.id}
                                        item={sede}
                                        type="SEDE"
                                        onSave={handleUpdateCoords}
                                        isProcessing={processing === sede.id}
                                        isSuccess={success === sede.id}
                                    />
                                ))}
                            </div>
                        </section>
                    )}

                    {health.length > 0 && (
                        <section className={styles.section}>
                            <h3><Stethoscope size={16} /> Salud ({health.length})</h3>
                            <div className={styles.list}>
                                {health.map(item => (
                                    <POICard
                                        key={item.id}
                                        item={item}
                                        type="HEALTH"
                                        onSave={handleUpdateCoords}
                                        isProcessing={processing === item.id}
                                        isSuccess={success === item.id}
                                    />
                                ))}
                            </div>
                        </section>
                    )}

                    {properties.length > 0 && (
                        <section className={styles.section}>
                            <h3><Home size={16} /> Hospedajes ({properties.length})</h3>
                            <div className={styles.list}>
                                {properties.map(prop => (
                                    <div key={prop.id} className={styles.poiCard}>
                                        <div className={styles.poiInfo}>
                                            <h4>{prop.title}</h4>
                                            <p>{prop.address}</p>
                                        </div>
                                        <div className={styles.poiTag}>Sin coordenadas editables (usa dirección)</div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {restaurants.length > 0 && (
                        <section className={styles.section}>
                            <h3><Utensils size={16} /> Restaurantes ({restaurants.length})</h3>
                            <div className={styles.list}>
                                {restaurants.map(rest => (
                                    <div key={rest.id} className={styles.poiCard}>
                                        <div className={styles.poiInfo}>
                                            <h4>{rest.name}</h4>
                                            <p>{rest.address}</p>
                                        </div>
                                        <div className={styles.poiTag}>Sin coordenadas editables (usa dirección)</div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {(sedes.length === 0 && health.length === 0) && (
                        <div className={styles.emptyHint}>
                            <p>💡 Cargá sedes UNNOBA o centros de salud desde sus secciones para poder ajustar coordenadas aquí.</p>
                            <div className={styles.quickLinks}>
                                <Link href="/admin/unnoba" className={styles.quickLink}>
                                    <Building size={16} /> Cargar Sedes
                                </Link>
                                <Link href="/admin/salud" className={styles.quickLink}>
                                    <Stethoscope size={16} /> Cargar Salud
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

function POICard({ item, type, onSave, isProcessing, isSuccess }: any) {
    const [coords, setCoords] = useState({
        lat: item.lat || "-33.89",
        lng: item.lng || "-60.57"
    });

    return (
        <div className={styles.poiCard}>
            <div className={styles.poiInfo}>
                <h4>{item.name}</h4>
                <p>{item.address}</p>
            </div>
            <div className={styles.coordsForm}>
                <div className={styles.inputGroup}>
                    <label>Lat</label>
                    <input
                        value={coords.lat}
                        onChange={(e) => setCoords({ ...coords, lat: e.target.value })}
                    />
                </div>
                <div className={styles.inputGroup}>
                    <label>Lng</label>
                    <input
                        value={coords.lng}
                        onChange={(e) => setCoords({ ...coords, lng: e.target.value })}
                    />
                </div>
                <button
                    className={styles.saveBtn}
                    onClick={() => onSave(item.id, type, coords.lat, coords.lng)}
                    disabled={isProcessing}
                >
                    {isSuccess ? <CheckCircle size={18} /> : <Save size={18} />}
                </button>
            </div>
            <a
                href={`https://www.google.com/maps?q=${coords.lat},${coords.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.mapsLink}
            >
                <ExternalLink size={12} /> Ver en Google Maps
            </a>
        </div>
    );
}
