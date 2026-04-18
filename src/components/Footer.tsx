'use client';

import Image from "next/image";
import { Instagram, MessageCircle, Mail, MapPin, ArrowUpRight } from "lucide-react";

export default function Footer() {
  return (
    <footer style={{ background: '#051f20', color: '#daf1de' }}>
      <div className="max-w-7xl mx-auto px-6 pt-20 pb-12">

        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">

          {/* Col 1: Branding */}
          <div className="md:col-span-4 space-y-5">
            <div className="flex items-center gap-2.5">
              <Image
                src="/logo.svg"
                alt="Recién Llegué"
                width={120}
                height={40}
                className="object-contain"
                style={{ filter: 'invert(1)' }}
              />
            </div>
            <p className="text-sm leading-relaxed max-w-sm" style={{ color: 'rgba(218, 241, 222, 0.45)' }}>
              La plataforma que reune todo lo que necesitas para instalarte como estudiante universitario. Alojamiento verificado, transporte y servicios locales.
            </p>
            <div className="flex gap-4 pt-2">
              <a
                href="https://instagram.com/recienlleguee"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-105"
                style={{ border: '1px solid rgba(218, 241, 222, 0.1)' }}
                aria-label="Instagram"
              >
                <Instagram size={15} style={{ color: 'rgba(218, 241, 222, 0.5)' }} />
              </a>
              <a
                href="https://wa.me/5492477000000"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-105"
                style={{ border: '1px solid rgba(218, 241, 222, 0.1)' }}
                aria-label="WhatsApp"
              >
                <MessageCircle size={15} style={{ color: 'rgba(218, 241, 222, 0.5)' }} />
              </a>
              <a
                href="mailto:hola@recienlleguee.com.ar"
                className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-105"
                style={{ border: '1px solid rgba(218, 241, 222, 0.1)' }}
                aria-label="Email"
              >
                <Mail size={15} style={{ color: 'rgba(218, 241, 222, 0.5)' }} />
              </a>
            </div>
          </div>

          {/* Col 2: Alojamiento */}
          <div className="md:col-span-2 space-y-5">
            <h5
              className="text-[10px] font-bold uppercase tracking-[0.2em]"
              style={{ color: 'rgba(218, 241, 222, 0.25)' }}
            >
              Alojamiento
            </h5>
            <ul className="space-y-3">
              {[
                { label: 'Guía de alojamiento', href: '/pergamino/alojamiento-estudiantes' },
                { label: 'Pensiones estudiantiles', href: '/pergamino/pensiones-estudiantiles' },
                { label: 'Habitaciones compartidas', href: '/pergamino/habitaciones-compartidas' },
                { label: 'Departamentos', href: '/pergamino/departamentos-monoambiente' },
                { label: 'Ver todos los hospedajes', href: '/app/hospedajes' },
              ].map(link => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-xs font-medium transition-colors hover:text-white"
                    style={{ color: 'rgba(218, 241, 222, 0.5)' }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Transporte */}
          <div className="md:col-span-2 space-y-5">
            <h5
              className="text-[10px] font-bold uppercase tracking-[0.2em]"
              style={{ color: 'rgba(218, 241, 222, 0.25)' }}
            >
              Transporte y vida
            </h5>
            <ul className="space-y-3">
              {[
                { label: 'Remis 24hs', href: '/pergamino/remis-24hs' },
                { label: 'Colectivos urbanos', href: '/pergamino/colectivos-urbanos' },
                { label: 'Comida universitaria', href: '/pergamino/comida-universitaria' },
                { label: 'Supermercados', href: '/pergamino/supermercado-economico' },
                { label: 'Lavanderías', href: '/pergamino/lavanderia' },
              ].map(link => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-xs font-medium transition-colors hover:text-white"
                    style={{ color: 'rgba(218, 241, 222, 0.5)' }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Recursos */}
          <div className="md:col-span-2 space-y-5">
            <h5
              className="text-[10px] font-bold uppercase tracking-[0.2em]"
              style={{ color: 'rgba(218, 241, 222, 0.25)' }}
            >
              Recursos
            </h5>
            <ul className="space-y-3">
              {[
                { label: 'Farmacia', href: '/pergamino/farmacia' },
                { label: 'Internet y WiFi', href: '/pergamino/internet-wifi' },
                { label: 'Psicología y bienestar', href: '/pergamino/psicologia-bienestar' },
                { label: 'Muro de avisos', href: '/app/muro' },
                { label: 'Todos los comercios', href: '/app/comercios' },
              ].map(link => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-xs font-medium transition-colors hover:text-white"
                    style={{ color: 'rgba(218, 241, 222, 0.5)' }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 5: Ciudad */}
          <div className="md:col-span-2 space-y-5">
            <h5
              className="text-[10px] font-bold uppercase tracking-[0.2em]"
              style={{ color: 'rgba(218, 241, 222, 0.25)' }}
            >
              Ciudad
            </h5>
            <div className="space-y-4">
              <a
                href="/pergamino"
                className="flex items-center gap-2 text-xs font-semibold transition-colors hover:text-white"
                style={{ color: 'rgba(218, 241, 222, 0.7)' }}
              >
                <MapPin size={12} />
                Pergamino (UNNOBA)
                <ArrowUpRight size={10} style={{ opacity: 0.4 }} />
              </a>
              <a
                href="/app/inicio"
                className="flex items-center gap-2 text-xs font-medium transition-colors hover:text-white"
                style={{ color: 'rgba(218, 241, 222, 0.4)' }}
              >
                Abrir la app
                <ArrowUpRight size={10} style={{ opacity: 0.4 }} />
              </a>
              <div className="space-y-2 pt-2" style={{ borderTop: '1px solid rgba(218, 241, 222, 0.06)' }}>
                <p className="text-[10px] font-medium uppercase tracking-wider" style={{ color: 'rgba(218, 241, 222, 0.2)' }}>
                  Proximamente
                </p>
                {['Junin (UNNOBA)', 'Zarate', 'Chivilcoy', 'Lujan (UNLu)'].map(c => (
                  <p key={c} className="text-[11px] font-medium" style={{ color: 'rgba(218, 241, 222, 0.2)' }}>
                    {c}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-medium"
          style={{ borderTop: '1px solid rgba(218, 241, 222, 0.06)', color: 'rgba(218, 241, 222, 0.2)' }}
        >
          <p>&copy; 2026 Recien Llegue. Hecho por estudiantes, para estudiantes.</p>
          <p>Pergamino, Buenos Aires, Argentina</p>
        </div>
      </div>
    </footer>
  );
}
