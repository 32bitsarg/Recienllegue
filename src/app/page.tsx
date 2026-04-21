'use client'

import React, { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  ArrowRight, Users, Zap,
  Home, Bus, UtensilsCrossed, CheckCircle2,
  ChevronDown, Star, Mail,
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import HeroParticles from '@/components/HeroParticles'
import GlobalParticles from '@/components/GlobalParticles'
import PageTracker from '@/components/PageTracker'

const SIGNUP = '/registro'

const C = {
  bg: '#F1F5F9',
  surface: '#ffffff',
  text: '#0F172A',
  primary: '#0F172A',
  secondary: '#1E3A5F',
  mint: '#E2E8F0',
  muted: 'rgba(15,23,42,0.42)',
  border: 'rgba(15,23,42,0.10)',
}

// ── CountUp ──────────────────────────────────────────────────
function CountUp({ to, suffix = '' }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!inView) return
    let n = 0
    const step = Math.max(1, Math.ceil(to / 50))
    const t = setInterval(() => {
      n += step
      if (n >= to) { setVal(to); clearInterval(t) } else setVal(n)
    }, 25)
    return () => clearInterval(t)
  }, [inView, to])
  return <span ref={ref}>{val.toLocaleString('es-AR')}{suffix}</span>
}

// ── Feature Card ─────────────────────────────────────────────
function FeatureCard({ icon, title, desc, delay = 0 }: {
  icon: React.ReactNode; title: string; desc: string; delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl p-7 flex flex-col gap-4"
      style={{ background: C.surface, border: `1px solid ${C.border}`, boxShadow: '0 2px 16px rgba(15,23,42,0.06)' }}
    >
      <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
        style={{ background: C.mint, color: C.primary }}>
        {icon}
      </div>
      <h3 className="text-base font-extrabold tracking-tight leading-snug" style={{ color: C.text }}>
        {title}
      </h3>
      <p className="text-sm leading-relaxed" style={{ color: C.muted }}>
        {desc}
      </p>
    </motion.div>
  )
}

// ── Step ─────────────────────────────────────────────────────
function Step({ n, title, desc, delay = 0 }: {
  n: string; title: string; desc: string; delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="flex gap-5 items-start"
    >
      <span className="text-xs font-bold shrink-0 mt-1 w-6 text-right" style={{ color: C.muted }}>{n}</span>
      <div className="flex-1 pb-7" style={{ borderBottom: `1px solid ${C.border}` }}>
        <p className="font-bold text-base leading-snug mb-1.5" style={{ color: C.text }}>{title}</p>
        <p className="text-sm leading-relaxed" style={{ color: C.muted }}>{desc}</p>
      </div>
    </motion.div>
  )
}

// ── Testimonial ───────────────────────────────────────────────
function Testimonial({ quote, name, career, delay = 0 }: {
  quote: string; name: string; career: string; delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      className="rounded-2xl p-7 flex flex-col gap-5"
      style={{ background: C.surface, border: `1px solid ${C.border}`, boxShadow: '0 2px 16px rgba(15,23,42,0.06)' }}
    >
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={12} className="fill-current" style={{ color: C.secondary }} />
        ))}
      </div>
      <p className="text-sm leading-relaxed flex-1" style={{ color: C.text, opacity: 0.72 }}>
        &ldquo;{quote}&rdquo;
      </p>
      <div>
        <p className="text-xs font-bold" style={{ color: C.text }}>{name}</p>
        <p className="text-[11px] font-medium mt-0.5" style={{ color: C.muted }}>{career}</p>
      </div>
    </motion.div>
  )
}

// ── FAQ ───────────────────────────────────────────────────────
function FaqItem({ q, a, i }: { q: string; a: string; i: number }) {
  const [open, setOpen] = useState(i === 0)
  return (
    <div style={{ borderBottom: `1px solid ${C.border}` }}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left gap-6 group"
        aria-expanded={open}
      >
        <span className="text-sm font-bold tracking-tight group-hover:opacity-70 transition-opacity"
          style={{ color: open ? C.primary : C.text }}>
          {q}
        </span>
        <ChevronDown size={14}
          className={`shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          style={{ color: C.secondary }} />
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.25 }}
        style={{ overflow: 'hidden' }}
      >
        <p className="pb-5 text-sm leading-relaxed" style={{ color: C.muted }}>{a}</p>
      </motion.div>
    </div>
  )
}

// ── Newsletter ────────────────────────────────────────────────
function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  return (
    <section id="newsletter" className="py-20 px-6">
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl p-10 md:p-14 relative overflow-hidden"
          style={{ background: C.primary }}
        >
          <HeroParticles />
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-6"
              style={{ background: 'rgba(226,232,240,0.15)', color: C.mint }}>
              <Mail size={20} />
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-3" style={{ color: C.mint }}>
              Próximamente en tu ciudad
            </h2>
            <p className="text-sm leading-relaxed mb-8 max-w-md mx-auto" style={{ color: '#94A3B8' }}>
              Estamos llegando a Junín, Zárate, Chivilcoy y más ciudades. Dejanos tu email y te avisamos cuando Recién Llegué esté disponible donde estudiás.
            </p>
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center justify-center gap-2 py-4"
              >
                <CheckCircle2 size={18} style={{ color: C.mint }} />
                <p className="text-sm font-semibold" style={{ color: C.mint }}>
                  Listo, te vamos a avisar cuando lleguemos.
                </p>
              </motion.div>
            ) : (
              <form
                onSubmit={(e) => { e.preventDefault(); if (email) setSubmitted(true) }}
                className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  required
                  className="flex-1 px-5 py-3 rounded-xl text-sm font-medium outline-none"
                  style={{ background: 'rgba(255,255,255,0.1)', color: C.mint, border: '1px solid rgba(226,232,240,0.2)' }}
                />
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl text-sm font-bold transition-all hover:scale-[1.02] shrink-0"
                  style={{ background: C.mint, color: C.primary }}
                >
                  Avisarme
                </button>
              </form>
            )}
            <p className="text-[11px] mt-6" style={{ color: 'rgba(226,232,240,0.4)' }}>
              Sin spam — solo te escribimos cuando estemos en tu ciudad.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// ── PAGE ──────────────────────────────────────────────────────
export default function GlobalHomePage() {
  return (
    <>
      <PageTracker page="/" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'Recién Llegué',
          url: 'https://recienllegue.com',
          description: 'Portal de recursos para estudiantes universitarios en Argentina.',
          areaServed: 'Argentina',
        })
      }} />

      <div className="min-h-screen overflow-x-hidden" style={{ background: C.bg, color: C.text, position: 'relative' }}>
        <GlobalParticles />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <Navbar />

          {/* ══ HERO ══════════════════════════════════════ */}
          <section className="relative pt-0" style={{ background: C.primary, overflow: 'hidden' }}>
            <HeroParticles />

            {/* Mobile hero — centered */}
            <div className="relative z-10 lg:hidden max-w-xl mx-auto px-6 pt-36 pb-20 text-center space-y-6">
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.05 }}>
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                  style={{ background: 'rgba(226,232,240,0.14)', color: C.mint, border: '1px solid rgba(226,232,240,0.22)' }}>
                  <Zap size={10} className="fill-current" /> Disponible en Pergamino
                </span>
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                className="font-black tracking-tight leading-[1.06]"
                style={{ fontSize: 'clamp(2.6rem, 11vw, 3.4rem)', color: C.mint }}
              >
                Tu guía para llegar<br />
                <span style={{ color: '#fff' }}>y quedarte</span>
                <span style={{ color: 'rgba(226,232,240,0.4)' }}>.</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-sm leading-relaxed"
                style={{ color: '#94A3B8' }}
              >
                Alojamiento, transporte, servicios y comunidad — referencias útiles en un solo lugar, gratis.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-col gap-3"
              >
                <a href="/pergamino"
                  className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl font-bold text-sm transition-all hover:scale-[1.02]"
                  style={{ background: C.mint, color: C.primary }}>
                  Explorar Pergamino <ArrowRight size={15} />
                </a>
                <a href={SIGNUP}
                  className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl font-bold text-sm transition-all hover:opacity-80"
                  style={{ color: C.mint, border: '1px solid rgba(226,232,240,0.25)', background: 'rgba(226,232,240,0.08)' }}>
                  Crear cuenta gratis
                </a>
              </motion.div>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}
                className="text-[11px] font-medium uppercase tracking-widest"
                style={{ color: 'rgba(226,232,240,0.3)' }}>
                Sin tarjeta · Sin costo · Para estudiantes
              </motion.p>
            </div>

            {/* Desktop hero — 2-col */}
            <div className="relative z-10 hidden lg:grid max-w-7xl mx-auto px-8 pt-36 pb-20"
              style={{ gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
              {/* Left: text */}
              <div className="space-y-7">
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                  <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                    style={{ background: 'rgba(226,232,240,0.14)', color: C.mint, border: '1px solid rgba(226,232,240,0.22)' }}>
                    <Zap size={10} className="fill-current" /> Disponible en Pergamino
                  </span>
                </motion.div>
                <motion.h1
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
                  className="font-black tracking-tight leading-[1.04]"
                  style={{ fontSize: 'clamp(3rem, 5vw, 4rem)', color: C.mint }}
                >
                  Tu guía para<br />
                  <span style={{ color: '#fff' }}>llegar</span> y{' '}
                  <span style={{ color: '#fff' }}>quedarte</span>
                  <span style={{ color: 'rgba(226,232,240,0.4)' }}>.</span>
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.18 }}
                  className="text-base leading-relaxed max-w-md"
                  style={{ color: '#94A3B8' }}
                >
                  Recién Llegué reúne todo lo que necesitás para instalarte como estudiante universitario en una ciudad nueva.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.28 }}
                  className="flex gap-3"
                >
                  <a href="/pergamino"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm transition-all hover:scale-[1.02]"
                    style={{ background: C.mint, color: C.primary }}>
                    Explorar Pergamino <ArrowRight size={14} />
                  </a>
                  <a href={SIGNUP}
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm transition-all hover:opacity-80"
                    style={{ color: C.mint, border: '1px solid rgba(226,232,240,0.22)', background: 'rgba(226,232,240,0.08)' }}>
                    Crear cuenta gratis
                  </a>
                </motion.div>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                  className="text-[10px] font-medium uppercase tracking-widest"
                  style={{ color: 'rgba(226,232,240,0.28)' }}>
                  Sin tarjeta · Sin costo · Para estudiantes
                </motion.p>
              </div>

              {/* Right: feature cards grid */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: <Home size={15} />, title: 'Alojamiento', desc: 'Pensiones, departamentos y habitaciones con datos útiles para comparar antes de decidir.' },
                  { icon: <Bus size={15} />, title: 'Transporte', desc: 'Colectivos y remises con llamada directa. Movete desde el primer día.' },
                  { icon: <UtensilsCrossed size={15} />, title: 'Vida diaria', desc: 'Dónde comer, comprar y resolver lo cotidiano cerca de la universidad.' },
                  { icon: <Users size={15} />, title: 'Comunidad', desc: 'El muro conecta estudiantes para vender, buscar y ofrecer servicios.' },
                ].map(({ icon, title, desc }, i) => (
                  <motion.div
                    key={title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + i * 0.07, duration: 0.5 }}
                    className="rounded-2xl p-5 flex flex-col gap-3"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(226,232,240,0.10)' }}
                  >
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: 'rgba(226,232,240,0.12)', color: C.mint }}>
                      {icon}
                    </div>
                    <p className="text-sm font-extrabold tracking-tight" style={{ color: '#E2E8F0' }}>{title}</p>
                    <p className="text-xs leading-relaxed" style={{ color: 'rgba(226,232,240,0.5)' }}>{desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Wave separator */}
            <div className="relative z-10" style={{ marginTop: -2 }}>
              <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', width: '100%' }}>
                <path d="M0 60V30C360 0 720 60 1080 30C1260 15 1380 40 1440 30V60H0Z" fill={C.bg} />
              </svg>
            </div>
          </section>

          {/* ══ STATS BAR ══════════════════════════════════ */}
          <section className="py-10 px-6">
            <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { n: 1, suf: '', label: 'Ciudad disponible' },
                { n: 5, suf: '+', label: 'Secciones útiles' },
                { n: 0, suf: '$', label: 'Costo para vos' },
                { n: 100, suf: '%', label: 'Hecho por estudiantes' },
              ].map(({ n, suf, label }, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  className="rounded-2xl p-5 text-center"
                  style={{ background: C.surface, border: `1px solid ${C.border}`, boxShadow: '0 2px 16px rgba(15,23,42,0.06)' }}>
                  <p className="text-2xl font-black tracking-tight" style={{ color: C.text }}>
                    {suf === '$' ? '$' : ''}<CountUp to={n} suffix={suf === '$' ? '' : suf} />
                  </p>
                  <p className="text-[10px] font-medium uppercase tracking-wider mt-1" style={{ color: C.muted }}>{label}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ══ FEATURES (mobile-only — desktop sees them in hero) ══ */}
          <section className="lg:hidden py-6 px-6">
            <div className="space-y-4">
              <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: C.muted }}>Todo en un lugar</p>
              <div className="grid grid-cols-2 gap-3">
                <FeatureCard icon={<Home size={15} />} title="Alojamiento"
                  desc="Pensiones, departamentos y habitaciones con referencias, ubicación y contacto para comparar antes de decidir." delay={0} />
                <FeatureCard icon={<Bus size={15} />} title="Transporte"
                  desc="Colectivos con mapa de recorridos y remises con llamada directa. Todo para moverte desde el primer día." delay={0.07} />
                <FeatureCard icon={<UtensilsCrossed size={15} />} title="Vida diaria"
                  desc="Dónde comer, kioscos, farmacias y supermercados cerca de la zona universitaria." delay={0.14} />
                <FeatureCard icon={<Users size={15} />} title="Comunidad"
                  desc="El muro de avisos conecta estudiantes para vender, buscar, ofrecer y más." delay={0.21} />
              </div>
            </div>
          </section>

          {/* ══ BENTO PERGAMINO ══════════════════════════════ */}
          <section className="py-8 px-6">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-5">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="md:col-span-8 rounded-2xl overflow-hidden relative min-h-[300px] flex flex-col justify-between"
                style={{ background: C.primary }}
              >
                <HeroParticles />
                <div className="relative z-10 p-10 md:p-12 flex flex-col justify-between h-full" style={{ minHeight: 300 }}>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider mb-4" style={{ color: 'rgba(226,232,240,0.5)' }}>
                      Ciudad disponible
                    </p>
                    <h3 className="font-black tracking-tight leading-[1.08]"
                      style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', color: '#fff' }}>
                      Pergamino<br /><span style={{ color: C.mint }}>Sede UNNOBA</span>
                    </h3>
                    <p className="text-sm mt-4 max-w-md leading-relaxed" style={{ color: 'rgba(226,232,240,0.55)' }}>
                      La primera ciudad en nuestra red. Alojamiento, transporte, comercios y comunidad para estudiantes de la UNNOBA.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3 mt-8">
                    <a href="/pergamino"
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all hover:scale-[1.02]"
                      style={{ background: C.mint, color: C.primary }}>
                      Guía completa Pergamino <ArrowRight size={13} />
                    </a>
                    <a href="/pergamino/alojamiento-estudiantes"
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all hover:opacity-80"
                      style={{ color: '#fff', border: '1px solid rgba(255,255,255,0.15)' }}>
                      Buscar alojamiento
                    </a>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="md:col-span-4 rounded-2xl p-7 flex flex-col gap-5"
                style={{ background: C.surface, border: `1px solid ${C.border}`, boxShadow: '0 2px 16px rgba(15,23,42,0.06)' }}
              >
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: C.muted }}>Próximamente</p>
                  <h4 className="text-xl font-extrabold tracking-tight leading-snug" style={{ color: C.text }}>
                    Más ciudades<br /><span style={{ color: C.muted }}>en camino</span>
                  </h4>
                </div>
                <ul className="space-y-1 flex-1">
                  {['Junín (UNNOBA)', 'Zárate (UNLZ)', 'Chivilcoy (UNNOBA)', 'Luján (UNLu)'].map((city, i) => (
                    <li key={i} className="flex items-center gap-2.5 py-2.5" style={{ borderBottom: `1px solid ${C.border}` }}>
                      <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: C.secondary }} />
                      <span className="text-xs font-medium" style={{ color: C.muted }}>{city}</span>
                    </li>
                  ))}
                </ul>
                <a href="#newsletter"
                  className="inline-flex items-center gap-2 text-xs font-bold transition-opacity hover:opacity-60"
                  style={{ color: C.primary }}>
                  Avisarme cuando llegue <ArrowRight size={11} />
                </a>
              </motion.div>
            </div>
          </section>

          {/* ══ GUÍAS PERGAMINO ══════════════════════════════ */}
          <section className="py-8 px-6">
            <div className="max-w-7xl mx-auto space-y-5">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: C.muted }}>
                  Guías para estudiantes · Pergamino
                </p>
                <h2 className="text-xl font-extrabold tracking-tight" style={{ color: C.text }}>
                  Todo lo que necesitás saber antes de llegar
                </h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {[
                  { label: 'Alojamiento para estudiantes', href: '/pergamino/alojamiento-estudiantes', emoji: '🏠' },
                  { label: 'Pensiones estudiantiles', href: '/pergamino/pensiones-estudiantiles', emoji: '🛏️' },
                  { label: 'Habitaciones compartidas', href: '/pergamino/habitaciones-compartidas', emoji: '🤝' },
                  { label: 'Departamentos monoambiente', href: '/pergamino/departamentos-monoambiente', emoji: '🏢' },
                  { label: 'Remis 24hs', href: '/pergamino/remis-24hs', emoji: '🚖' },
                  { label: 'Colectivos urbanos', href: '/pergamino/colectivos-urbanos', emoji: '🚌' },
                  { label: 'Comida universitaria', href: '/pergamino/comida-universitaria', emoji: '🍽️' },
                  { label: 'Supermercados económicos', href: '/pergamino/supermercado-economico', emoji: '🛒' },
                  { label: 'Farmacias', href: '/pergamino/farmacia', emoji: '💊' },
                  { label: 'Lavanderías', href: '/pergamino/lavanderia', emoji: '👕' },
                  { label: 'Internet y WiFi', href: '/pergamino/internet-wifi', emoji: '📶' },
                  { label: 'Psicología y bienestar', href: '/pergamino/psicologia-bienestar', emoji: '🧠' },
                ].map(({ label, href, emoji }) => (
                  <a
                    key={href}
                    href={href}
                    className="flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all hover:scale-[1.02] hover:shadow-sm"
                    style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.text }}
                  >
                    <span className="text-base shrink-0">{emoji}</span>
                    <span className="text-xs leading-tight">{label}</span>
                    <ArrowRight size={11} className="ml-auto shrink-0" style={{ color: C.muted, opacity: 0.5 }} />
                  </a>
                ))}
              </div>
              <div className="pt-1">
                <a
                  href="/pergamino"
                  className="inline-flex items-center gap-1.5 text-xs font-bold transition-opacity hover:opacity-60"
                  style={{ color: C.secondary }}
                >
                  Ver guía completa de Pergamino <ArrowRight size={11} />
                </a>
              </div>
            </div>
          </section>

          {/* ══ CÓMO FUNCIONA ══════════════════════════════════ */}
          <section className="py-24 px-6">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
              <div className="space-y-6">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider mb-3" style={{ color: C.muted }}>
                    Cómo funciona
                  </p>
                  <h2 className="font-black tracking-tight leading-[1.08]"
                    style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', color: C.text }}>
                    Cuatro pasos,<br /><span style={{ color: C.secondary }}>todo listo</span>.
                  </h2>
                </div>
                <div className="pt-4">
                  {[
                    { n: '01', title: 'Elegís tu ciudad', desc: 'Entrás a Recién Llegué y seleccionás dónde vas a estudiar.' },
                    { n: '02', title: 'Buscás lo que necesitás', desc: 'Alojamiento, transporte, servicios. Filtrás por tipo, precio y categoría.' },
                    { n: '03', title: 'Contactás directo', desc: 'Te ponemos en contacto con el proveedor sin intermediarios ni comisiones.' },
                    { n: '04', title: 'Te instalás tranquilo', desc: 'Llegás a tu nueva ciudad con todo resuelto de antemano.' },
                  ].map(({ n, title, desc }, i) => (
                    <Step key={n} n={n} title={title} desc={desc} delay={i * 0.08} />
                  ))}
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="rounded-2xl p-8 space-y-7 sticky top-24"
                style={{ background: C.surface, border: `1px solid ${C.border}`, boxShadow: '0 2px 16px rgba(15,23,42,0.06)' }}
              >
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider mb-3" style={{ color: C.muted }}>
                    Por qué confiar
                  </p>
                  <h3 className="text-xl font-extrabold tracking-tight leading-snug" style={{ color: C.text }}>
                    Hecho por estudiantes,<br />para estudiantes.
                  </h3>
                </div>
                <ul className="space-y-3.5">
                  {[
                    'Revisá ubicación, servicios incluidos y condiciones antes de señar.',
                    'Compará referencias y consultá valores vigentes.',
                    'El servicio es gratuito para estudiantes.',
                    'Sin publicidad ni contenido patrocinado.',
                    'Datos reales de estudiantes que ya vivieron esto.',
                  ].map((item, i) => (
                    <li key={i} className="flex gap-3 items-start">
                      <CheckCircle2 size={15} className="shrink-0 mt-0.5" style={{ color: C.secondary }} />
                      <span className="text-sm leading-relaxed" style={{ color: C.muted }}>{item}</span>
                    </li>
                  ))}
                </ul>
                <div style={{ borderTop: `1px solid ${C.border}` }} className="pt-5">
                  <a href="/app/hospedajes"
                    className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm transition-all hover:scale-[1.02]"
                    style={{ background: C.primary, color: C.mint }}>
                    Buscar hospedaje <ArrowRight size={14} />
                  </a>
                </div>
              </motion.div>
            </div>
          </section>

          {/* ══ TESTIMONIOS ══════════════════════════════════ */}
          <section className="py-16 px-6">
            <div className="max-w-7xl mx-auto">
              <div className="mb-10">
                <p className="text-[10px] font-bold uppercase tracking-wider mb-3" style={{ color: C.muted }}>Lo que dicen</p>
                <h2 className="text-3xl md:text-4xl font-black tracking-tight" style={{ color: C.text }}>
                  Estudiantes <span style={{ color: C.secondary }}>reales</span>
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <Testimonial
                  quote="Llegué a Pergamino sin conocer a nadie y en 48 horas ya tenía alojamiento. Literal me salvó."
                  name="Martina L." career="Ing. Informática · UNNOBA" delay={0} />
                <Testimonial
                  quote="La sección de remises y colectivos es lo más. La primera semana no sabía cómo ir a la facultad."
                  name="Sebastián G." career="Administración · UNNOBA" delay={0.1} />
                <Testimonial
                  quote="Me ayudó a encontrar habitación compartida con chicos de mi carrera. Ahora somos cuatro."
                  name="Romina C." career="Contador Público · UNNOBA" delay={0.2} />
              </div>
            </div>
          </section>

          {/* ══ FAQ ══════════════════════════════════════════ */}
          <section className="py-20 px-6">
            <div className="max-w-3xl mx-auto">
              <div className="mb-10">
                <p className="text-[10px] font-bold uppercase tracking-wider mb-3" style={{ color: C.muted }}>
                  Preguntas frecuentes
                </p>
                <h2 className="text-3xl md:text-4xl font-black tracking-tight" style={{ color: C.text }}>
                  Todo lo que <span style={{ color: C.secondary }}>querés saber</span>
                </h2>
              </div>
              <div style={{ borderTop: `1px solid ${C.border}` }}>
                {[
                  { q: '¿Es gratuito Recién Llegué?', a: 'Sí, completamente gratis para estudiantes universitarios. Sin planes de pago, sin trampas.' },
                  { q: '¿Solo está disponible en Pergamino?', a: 'Por ahora sí. Pergamino es nuestra ciudad inaugural. Próximamente sumaremos Junín, Zárate y más ciudades universitarias.' },
                  { q: '¿Cómo verifican los alojamientos?', a: 'Cada alojamiento pasa por un proceso de verificación manual. Revisamos los datos, contactamos al propietario y confirmamos que la información sea real.' },
                  { q: '¿Puedo publicar mi alojamiento?', a: 'Si sos propietario, podés escribirnos por WhatsApp para sumarte. Es gratuito y sencillo.' },
                  { q: '¿La app tiene comunidad?', a: 'Sí. El muro de avisos conecta estudiantes para vender, buscar, ofrecer servicios y más, sin intermediarios.' },
                ].map((item, i) => (
                  <FaqItem key={i} q={item.q} a={item.a} i={i} />
                ))}
              </div>
            </div>
          </section>

          {/* ══ NEWSLETTER ══════════════════════════════════ */}
          <NewsletterSection />

          {/* ══ CTA FINAL ══════════════════════════════════ */}
          <section className="py-12 px-6 pb-24">
            <div className="max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="rounded-3xl overflow-hidden relative"
                style={{ background: C.primary }}
              >
                <HeroParticles />
                <div className="relative z-10 p-10 md:p-16 text-center space-y-6 max-w-2xl mx-auto">
                  <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-4 py-1.5 rounded-full"
                    style={{ background: 'rgba(226,232,240,0.12)', color: C.mint, border: '1px solid rgba(226,232,240,0.18)' }}>
                    Recién llegaste?
                  </span>
                  <h2 className="font-black tracking-tight leading-[1.06]"
                    style={{ fontSize: 'clamp(2rem, 6vw, 3.5rem)', color: C.mint }}>
                    Dejá de buscar<br />
                    <span style={{ color: '#fff' }}>en diez lugares.</span>
                  </h2>
                  <p className="text-sm leading-relaxed" style={{ color: 'rgba(226,232,240,0.55)' }}>
                    Alojamiento, transporte y servicios — referencias útiles en un solo lugar, gratis.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                    <a href="/app/hospedajes"
                      className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-sm transition-all hover:scale-[1.02]"
                      style={{ background: C.mint, color: C.primary }}>
                      Buscar hospedaje <ArrowRight size={15} />
                    </a>
                    <a href="/pergamino"
                      className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-sm transition-all hover:opacity-80"
                      style={{ color: '#fff', border: '1px solid rgba(255,255,255,0.18)' }}>
                      Explorar Pergamino
                    </a>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          <Footer />
        </div>
      </div>
    </>
  )
}
