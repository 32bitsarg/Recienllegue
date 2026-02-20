"use client";

import { useEffect, useState } from "react";
import {
    getAdminReports,
    updateReportStatus,
    deleteNotice,
    deleteComment
} from "@/app/actions/data";
import { ChevronLeft, ShieldAlert, Trash2, CheckCircle, Eye, AlertTriangle } from "lucide-react";
import Link from "next/link";
import styles from "./Moderacion.module.css";

export default function ModeracionPage() {
    const [reports, setReports] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState<string | null>(null);

    const loadReports = async () => {
        setLoading(true);
        const data = await getAdminReports();
        setReports(data);
        setLoading(false);
    };

    useEffect(() => {
        loadReports();
    }, []);

    const handleDismiss = async (reportId: string) => {
        if (!confirm("¿Desestimar este reporte? El contenido seguirá visible.")) return;

        setProcessing(reportId);
        try {
            await updateReportStatus(reportId, 'DESESTIMADO');
            await loadReports();
        } catch (error) {
            alert("Error al actualizar el reporte");
        } finally {
            setProcessing(null);
        }
    };

    const handleDeleteContent = async (reportId: string, type: 'NOTICE' | 'COMMENT', targetId: string) => {
        const msg = type === 'NOTICE'
            ? "¿Estás SEGURO de eliminar este AVISO? Esta acción no se puede deshacer."
            : "¿Estás SEGURO de eliminar este COMENTARIO?";

        if (!confirm(msg)) return;

        setProcessing(reportId);
        try {
            if (type === 'NOTICE') {
                await deleteNotice(targetId);
            } else {
                await deleteComment(targetId);
            }
            await updateReportStatus(reportId, 'REVISADO');
            await loadReports();
        } catch (error) {
            alert("Error al eliminar el contenido");
        } finally {
            setProcessing(null);
        }
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <Link href="/admin" className={styles.backBtn}>
                    <ChevronLeft size={24} />
                </Link>
                <h1>Moderación de Contenido</h1>
            </header>

            {loading ? (
                <div className={styles.empty}>Cargando reportes...</div>
            ) : reports.length === 0 ? (
                <div className={styles.empty}>
                    <CheckCircle size={48} style={{ marginBottom: '1rem', opacity: 0.3 }} />
                    <p>No hay reportes pendientes. ¡Todo limpio!</p>
                </div>
            ) : (
                <div className={styles.reportList}>
                    {reports.map((report) => (
                        <div
                            key={report.id}
                            className={`${styles.reportCard} ${styles['status_' + report.status]}`}
                        >
                            <div className={styles.reportHeader}>
                                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                    <span className={`${styles.badge} ${report.targetNoticeId ? styles.badgeNotice : styles.badgeComment}`}>
                                        {report.targetNoticeId ? "Aviso" : "Comentario"}
                                    </span>
                                    {report.status !== 'PENDIENTE' && (
                                        <span className={styles.badge} style={{ background: 'var(--border)', color: 'var(--text-muted)' }}>
                                            {report.status}
                                        </span>
                                    )}
                                </div>
                                <span className={styles.date}>
                                    {new Date(report.createdAt).toLocaleDateString()}
                                </span>
                            </div>

                            <p className={styles.reason}>
                                <AlertTriangle size={14} style={{ marginRight: '4px', verticalAlign: 'middle', color: '#f59e0b' }} />
                                {report.reason}
                            </p>

                            <div className={styles.targetContent}>
                                <h4>Contenido Reportado:</h4>
                                <p>
                                    {report.targetNoticeId
                                        ? report.targetNotice?.title
                                        : report.targetComment?.content}
                                </p>
                            </div>

                            <p className={styles.reporter}>
                                Reportado por: <strong>@{report.reporter?.username || report.reporter?.name}</strong>
                            </p>

                            {report.status === 'PENDIENTE' && (
                                <div className={styles.actions}>
                                    <button
                                        className={`${styles.actionBtn} ${styles.dismissBtn}`}
                                        onClick={() => handleDismiss(report.id)}
                                        disabled={!!processing}
                                    >
                                        <CheckCircle size={16} />
                                        Desestimar
                                    </button>

                                    <button
                                        className={`${styles.actionBtn} ${styles.deleteBtn}`}
                                        onClick={() => handleDeleteContent(
                                            report.id,
                                            report.targetNoticeId ? 'NOTICE' : 'COMMENT',
                                            report.targetNoticeId || report.targetCommentId
                                        )}
                                        disabled={!!processing}
                                    >
                                        <Trash2 size={16} />
                                        Eliminar
                                    </button>

                                    {report.targetNoticeId && (
                                        <Link
                                            href={`/avisos/${report.targetNoticeId}`}
                                            className={`${styles.actionBtn} ${styles.viewBtn}`}
                                        >
                                            <Eye size={16} />
                                            Ver en Contexto
                                        </Link>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
