"use client";

import { useState, useRef } from "react";
import { Image as ImageIcon, X, UploadCloud, Loader2, Plus } from "lucide-react";
import styles from "./ImageUpload.module.css";

interface ImageUploadProps {
    onUpload: (url: string) => void;
    label?: string;
    description?: string;
    previewUrl?: string | null;
    multiple?: boolean;
    urls?: string[];
    onMultiUpload?: (urls: string[]) => void;
}

import imageCompression from 'browser-image-compression';

const MAX_SIZE = 5 * 1024 * 1024; // 5MB limit for Appwrite free tier just in case

export default function ImageUpload({
    onUpload,
    label,
    description,
    previewUrl,
    multiple = false,
    urls = [],
    onMultiUpload
}: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(previewUrl || null);
    const [multiPreviews, setMultiPreviews] = useState<string[]>(urls);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const uploadFile = async (file: File): Promise<string | null> => {
        if (!file.type.startsWith("image/")) {
            alert("Por favor subí un archivo de imagen");
            return null;
        }

        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", {
            method: "POST",
            body: formData,
        });

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || "Error al subir");
        }

        const data = await res.json();
        return data.url;
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploading(true);

        try {
            const options = {
                maxSizeMB: 0.8,
                maxWidthOrHeight: 1200,
                useWebWorker: true,
                fileType: "image/webp" as any
            };

            if (multiple && onMultiUpload) {
                const newUrls: string[] = [];
                for (const file of Array.from(files)) {
                    const compressedFile = await imageCompression(file, options);
                    const url = await uploadFile(compressedFile);
                    if (url) newUrls.push(url);
                }
                const updatedUrls = [...multiPreviews, ...newUrls];
                setMultiPreviews(updatedUrls);
                onMultiUpload(updatedUrls);
            } else {
                const compressedFile = await imageCompression(files[0], options);
                const url = await uploadFile(compressedFile);
                if (url) {
                    setPreview(url);
                    onUpload(url);
                }
            }
        } catch (error) {
            console.error("Upload error:", error);
            alert("No se pudo subir la imagen");
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const removeImage = () => {
        setPreview(null);
        onUpload("");
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const removeMultiImage = (index: number) => {
        const updated = multiPreviews.filter((_, i) => i !== index);
        setMultiPreviews(updated);
        onMultiUpload?.(updated);
    };

    if (multiple) {
        return (
            <div className={styles.container}>
                {label && <label className={styles.label}>{label}</label>}
                {description && <p className={styles.description}>{description}</p>}

                <div className={styles.multiGrid}>
                    {multiPreviews.map((url, i) => (
                        <div key={i} className={styles.multiThumb}>
                            <img src={url} alt={`Imagen ${i + 1}`} />
                            <button
                                type="button"
                                className={styles.removeBtn}
                                onClick={() => removeMultiImage(i)}
                            >
                                <X size={12} />
                            </button>
                        </div>
                    ))}
                    <div
                        className={styles.addMore}
                        onClick={() => !uploading && fileInputRef.current?.click()}
                    >
                        {uploading ? (
                            <Loader2 className={styles.animateSpin} size={20} />
                        ) : (
                            <>
                                <Plus size={20} />
                                <span>Agregar</span>
                            </>
                        )}
                    </div>
                </div>

                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    multiple
                    className={styles.hiddenInput}
                />
            </div>
        );
    }

    return (
        <div className={styles.container}>
            {label && <label className={styles.label}>{label}</label>}
            {description && <p className={styles.description}>{description}</p>}

            <div
                className={`${styles.uploadBox} ${preview ? styles.hasPreview : ""}`}
                onClick={() => !preview && !uploading && fileInputRef.current?.click()}
            >
                {uploading ? (
                    <div className={styles.loading}>
                        <Loader2 className={styles.animateSpin} size={24} />
                        <span>Subiendo...</span>
                    </div>
                ) : preview ? (
                    <div className={styles.previewContainer}>
                        <img src={preview} alt="Vista previa" className={styles.previewImg} />
                        <button type="button" className={styles.removeBtn} onClick={removeImage}>
                            <X size={16} />
                        </button>
                    </div>
                ) : (
                    <div className={styles.placeholder}>
                        <UploadCloud size={32} />
                        <div className={styles.textGroup}>
                            <span className={styles.mainText}>Hacé click para subir</span>
                            <span className={styles.subText}>PNG, JPG o WEBP (máx. 5MB)</span>
                        </div>
                    </div>
                )}

                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className={styles.hiddenInput}
                />
            </div>
        </div>
    );
}
