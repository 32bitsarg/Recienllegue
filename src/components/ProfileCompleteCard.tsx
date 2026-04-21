'use client'

import { ChevronRight } from 'lucide-react'

const FIELD_LABELS: Record<string, string> = {
  career:        'Carrera',
  city_origin:   'Ciudad de origen',
  year_of_study: 'Año de cursada',
  contact:       'Teléfono de contacto',
}

interface ProfileCompleteCardProps {
  missingFields: string[]
  variant?: 'dueno'
}

export default function ProfileCompleteCard({ missingFields, variant }: ProfileCompleteCardProps) {
  if (missingFields.length === 0) return null

  const isDueno = variant === 'dueno'

  return (
    <div
      className="app-card px-5 py-4 flex items-center justify-between gap-4"
      style={{ borderLeft: `3px solid ${isDueno ? '#F59E0B' : '#0F172A'}` }}
    >
      <div className="space-y-1.5 min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'rgba(15,23,42,0.45)' }}>
          {isDueno ? 'Comercio incompleto' : 'Perfil incompleto'}
        </p>
        <p className="text-sm font-bold" style={{ color: '#0F172A' }}>
          {isDueno ? 'Completá los datos de tu negocio' : 'Completá tu perfil para una mejor experiencia'}
        </p>
        <div className="flex flex-wrap gap-1.5 pt-0.5">
          {missingFields.map(field => (
            <span
              key={field}
              className="text-[10px] font-semibold px-2.5 py-1 rounded-full"
              style={{ background: '#E2E8F0', color: '#0F172A' }}
            >
              {FIELD_LABELS[field] ?? field}
            </span>
          ))}
        </div>
      </div>
      <a
        href="/app/perfil"
        className="shrink-0 flex items-center gap-1 px-4 py-2.5 rounded-xl text-xs font-bold transition-all hover:opacity-80"
        style={{ background: '#0F172A', color: '#F59E0B' }}
      >
        Completar
        <ChevronRight size={13} />
      </a>
    </div>
  )
}
