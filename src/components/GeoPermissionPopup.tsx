'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { MapPin } from 'lucide-react'

interface Props {
  onAllow: () => void
  onDismiss: () => void
  loading?: boolean
}

export default function GeoPermissionPopup({ onAllow, onDismiss, loading }: Props) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[90] flex items-end sm:items-center justify-center px-4 pb-6 sm:pb-0"
        style={{ background: 'rgba(15,23,42,0.82)', backdropFilter: 'blur(10px)' }}
        onClick={onDismiss}
      >
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.96 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-sm rounded-[32px] p-7 space-y-5"
          style={{ background: '#fff' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Ícono */}
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{ background: '#0F172A' }}
          >
            <MapPin size={24} color="#E2E8F0" />
          </div>

          {/* Texto */}
          <div className="space-y-2">
            <h2 className="text-2xl font-black tracking-tight" style={{ color: '#0F172A' }}>
              ¿Estás en Pergamino?
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(15,23,42,0.55)' }}>
              Usamos tu ubicación para mostrarte hospedajes y comercios ordenados por cercanía. No la compartimos con nadie.
            </p>
          </div>

          {/* Acciones */}
          <div className="space-y-2 pt-1">
            <button
              onClick={onAllow}
              disabled={loading}
              className="w-full py-3.5 rounded-xl text-sm font-bold transition-all hover:opacity-90 disabled:opacity-50"
              style={{ background: '#0F172A', color: '#F59E0B' }}
            >
              {loading ? 'Obteniendo ubicación...' : 'Activar ubicación'}
            </button>
            <button
              onClick={onDismiss}
              className="w-full py-3 text-sm font-semibold transition-opacity hover:opacity-60"
              style={{ color: '#0F172A', opacity: 0.45 }}
            >
              Ahora no
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
