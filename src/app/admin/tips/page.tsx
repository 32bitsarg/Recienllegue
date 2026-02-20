"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft,
    Plus,
    Trash2,
    Edit3,
    Save,
    X,
    ToggleLeft,
    ToggleRight,
    Lightbulb,
    Loader2
} from "lucide-react";
import styles from "../AdminForm.module.css";
import tipStyles from "./Tips.module.css";
import { getAllTips, createTip, updateTip, deleteTip } from "@/app/actions/data";

interface Tip {
    id: string;
    title: string;
    text: string;
    emoji: string;
    active: boolean;
    createdAt: string;
}

const EMOJI_OPTIONS = ["💡", "📌", "🎓", "🚌", "🏠", "🍕", "💰", "📚", "⚡", "🔔", "🗓️", "❤️", "🧠", "🎯", "🌟"];

export default function AdminTipsPage() {
    const [tips, setTips] = useState<Tip[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({ title: "", text: "", emoji: "💡" });
    const [success, setSuccess] = useState("");

    const fetchTips = async () => {
        setLoading(true);
        const data = await getAllTips();
        setTips(data as any);
        setLoading(false);
    };

    useEffect(() => {
        fetchTips();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title.trim() || !formData.text.trim()) return;

        setSaving(true);
        try {
            if (editingId) {
                await updateTip(editingId, formData);
                setSuccess("Tip actualizado ✅");
            } else {
                await createTip(formData);
                setSuccess("Tip creado ✅");
            }
            setFormData({ title: "", text: "", emoji: "💡" });
            setShowForm(false);
            setEditingId(null);
            await fetchTips();
            setTimeout(() => setSuccess(""), 3000);
        } catch (err) {
            alert("Error al guardar el tip");
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (tip: Tip) => {
        setFormData({ title: tip.title, text: tip.text, emoji: tip.emoji });
        setEditingId(tip.id);
        setShowForm(true);
    };

    const handleToggle = async (tip: Tip) => {
        try {
            await updateTip(tip.id, { active: !tip.active });
            await fetchTips();
        } catch (err) {
            alert("Error al cambiar estado");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("¿Seguro querés eliminar este tip?")) return;
        try {
            await deleteTip(id);
            await fetchTips();
            setSuccess("Tip eliminado");
            setTimeout(() => setSuccess(""), 3000);
        } catch (err) {
            alert("Error al eliminar");
        }
    };

    const cancelForm = () => {
        setShowForm(false);
        setEditingId(null);
        setFormData({ title: "", text: "", emoji: "💡" });
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Link href="/admin" className={styles.backBtn}>
                    <ArrowLeft size={24} />
                </Link>
                <h1>Tips del Día</h1>
            </div>

            {success && <div className={styles.successMsg}>{success}</div>}

            <div className={tipStyles.topBar}>
                <p className={tipStyles.subtitle}>
                    Los tips activos se muestran de forma rotativa en la pantalla principal.
                </p>
                <button
                    className={tipStyles.addBtn}
                    onClick={() => { cancelForm(); setShowForm(true); }}
                >
                    <Plus size={18} />
                    Nuevo Tip
                </button>
            </div>

            <AnimatePresence>
                {showForm && (
                    <motion.form
                        className={styles.form}
                        onSubmit={handleSubmit}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        style={{ overflow: "hidden", marginBottom: "1.5rem" }}
                    >
                        <div className={tipStyles.formTitle}>
                            <Lightbulb size={18} />
                            {editingId ? "Editar Tip" : "Nuevo Tip"}
                        </div>

                        <div className={styles.field}>
                            <label>Emoji</label>
                            <div className={tipStyles.emojiGrid}>
                                {EMOJI_OPTIONS.map(em => (
                                    <button
                                        key={em}
                                        type="button"
                                        className={`${tipStyles.emojiBtn} ${formData.emoji === em ? tipStyles.emojiActive : ""}`}
                                        onClick={() => setFormData(prev => ({ ...prev, emoji: em }))}
                                    >
                                        {em}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className={styles.field}>
                            <label>Título</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                placeholder="Ej: Dato del día"
                                required
                            />
                        </div>

                        <div className={styles.field}>
                            <label>Contenido del Tip</label>
                            <textarea
                                value={formData.text}
                                onChange={e => setFormData(prev => ({ ...prev, text: e.target.value }))}
                                placeholder="Ej: Si sos ingresante, podés sacar la SUBE local con descuento..."
                                rows={3}
                                required
                            />
                        </div>

                        <div className={tipStyles.formActions}>
                            <button type="button" className={tipStyles.cancelBtn} onClick={cancelForm}>
                                <X size={16} /> Cancelar
                            </button>
                            <button type="submit" className={styles.submitBtn} disabled={saving}>
                                {saving ? <Loader2 size={18} className={tipStyles.spin} /> : <Save size={18} />}
                                {editingId ? "Guardar Cambios" : "Crear Tip"}
                            </button>
                        </div>
                    </motion.form>
                )}
            </AnimatePresence>

            {loading ? (
                <div className={tipStyles.loadingState}>Cargando tips...</div>
            ) : tips.length === 0 ? (
                <div className={tipStyles.emptyState}>
                    <Lightbulb size={40} />
                    <h3>No hay tips todavía</h3>
                    <p>Creá tu primer tip para los estudiantes.</p>
                </div>
            ) : (
                <div className={tipStyles.tipsList}>
                    {tips.map((tip, i) => (
                        <motion.div
                            key={tip.id}
                            className={`${tipStyles.tipItem} ${!tip.active ? tipStyles.inactive : ""}`}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.06 }}
                        >
                            <div className={tipStyles.tipEmoji}>{tip.emoji}</div>
                            <div className={tipStyles.tipBody}>
                                <h4>{tip.title}</h4>
                                <p>{tip.text}</p>
                                <span className={tipStyles.tipDate}>
                                    {new Date(tip.createdAt).toLocaleDateString("es-AR")}
                                    {!tip.active && <span className={tipStyles.badgeInactive}>Inactivo</span>}
                                </span>
                            </div>
                            <div className={tipStyles.tipActions}>
                                <button
                                    onClick={() => handleToggle(tip)}
                                    title={tip.active ? "Desactivar" : "Activar"}
                                    className={tipStyles.toggleBtn}
                                >
                                    {tip.active ? <ToggleRight size={22} color="#10b981" /> : <ToggleLeft size={22} />}
                                </button>
                                <button onClick={() => handleEdit(tip)} className={tipStyles.editBtn} title="Editar">
                                    <Edit3 size={16} />
                                </button>
                                <button onClick={() => handleDelete(tip.id)} className={tipStyles.deleteBtn} title="Eliminar">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
