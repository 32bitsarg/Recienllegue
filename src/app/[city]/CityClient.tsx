'use client'

import React, { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
   ArrowRight, ArrowUpRight, Zap,
   Home, Bus, UtensilsCrossed, Heart, Wrench, GraduationCap,
   ShoppingBag, ChevronDown, Search, Star, MapPin, Users
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageTracker from '@/components/PageTracker';
import HeroParticles from '@/components/HeroParticles';
import type { ServiceCategory, CityData } from '@/data/seo-data';

// --- Palette ---
const C = {
   bg: '#F1F5F9',
   surface: '#ffffff',
   text: '#0F172A',
   primary: '#0F172A',
   secondary: '#1E3A5F',
   mint: '#E2E8F0',
   muted: 'rgba(15,23,42,0.42)',
   border: 'rgba(15,23,42,0.09)',
};

// --- Category meta ---
const CATEGORY_META: Record<ServiceCategory, { label: string; icon: React.ReactNode }> = {
   alojamiento: { label: 'Alojamiento', icon: <Home size={13} /> },
   transporte:  { label: 'Transporte',  icon: <Bus size={13} /> },
   gastronomia: { label: 'Gastronomía', icon: <UtensilsCrossed size={13} /> },
   salud:       { label: 'Salud',       icon: <Heart size={13} /> },
   servicios:   { label: 'Servicios',   icon: <Wrench size={13} /> },
   educacion:   { label: 'Educación',   icon: <GraduationCap size={13} /> },
   comercio:    { label: 'Comercio',    icon: <ShoppingBag size={13} /> },
};

const ALL_CATEGORIES: (ServiceCategory | 'all')[] = [
   'all', 'alojamiento', 'transporte', 'gastronomia',
   'salud', 'servicios', 'educacion', 'comercio',
];

// --- CountUp ---
function CountUp({ to, suffix = '' }: { to: number; suffix?: string }) {
   const ref = useRef<HTMLSpanElement>(null);
   const inView = useInView(ref, { once: true });
   const [val, setVal] = React.useState(0);
   React.useEffect(() => {
      if (!inView) return;
      let start = 0;
      const step = Math.ceil(to / 40);
      const timer = setInterval(() => {
         start += step;
         if (start >= to) { setVal(to); clearInterval(timer); }
         else setVal(start);
      }, 30);
      return () => clearInterval(timer);
   }, [inView, to]);
   return <span ref={ref}>{val}{suffix}</span>;
}

// --- UrgencyBadge ---
function UrgencyBadge({ urgency }: { urgency?: 'alta' | 'media' | 'baja' }) {
   if (urgency !== 'alta') return null;
   return (
      <span
         className="inline-flex items-center gap-1 text-[9px] font-semibold uppercase tracking-wider rounded-full px-2.5 py-1"
         style={{ background: 'rgba(15,23,42,0.07)', color: C.secondary }}
      >
         <Zap size={9} className="fill-current" /> Más buscado
      </span>
   );
}

// --- ServiceCard ---
function ServiceCard({ slug, service, citySlug, index }: { slug: string; service: any; citySlug: string; index: number }) {
   const catMeta = service.category ? CATEGORY_META[service.category as ServiceCategory] : null;
   return (
      <motion.a
         href={`/${citySlug}/${slug}`}
         initial={{ opacity: 0, y: 20 }}
         whileInView={{ opacity: 1, y: 0 }}
         viewport={{ once: true }}
         transition={{ delay: (index % 6) * 0.06, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
         className="group rounded-2xl p-6 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1"
         style={{ background: C.surface, border: `1px solid ${C.border}`, minHeight: 200 }}
      >
         <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
               {catMeta && (
                  <span className="inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider rounded-full px-2.5 py-1"
                     style={{ background: C.mint, color: C.primary }}>
                     {catMeta.icon} {catMeta.label}
                  </span>
               )}
               <UrgencyBadge urgency={service.urgency} />
            </div>
            <h3 className="text-base font-extrabold tracking-tight leading-snug group-hover:text-[#1E3A5F] transition-colors"
               style={{ color: C.text }}>
               {(service.title || '').split(' en ')[0]}
            </h3>
            <p className="text-xs leading-relaxed line-clamp-2" style={{ color: C.muted }}>
               {(service.intro || '').substring(0, 90)}...
            </p>
            {service.priceRange && (
               <p className="text-[11px] font-semibold" style={{ color: C.secondary }}>
                  {service.priceRange}
               </p>
            )}
         </div>
         <div className="mt-5 flex items-center justify-between">
            <span className="text-[10px] font-medium" style={{ color: C.muted }}>Ver guía completa</span>
            <div className="w-8 h-8 rounded-full flex items-center justify-center transition-all group-hover:scale-105"
               style={{ background: C.mint }}>
               <ArrowRight size={13} style={{ color: C.primary }} />
            </div>
         </div>
      </motion.a>
   );
}

// --- FAQ ---
function FaqItem({ q, a, index }: { q: string; a: string; index: number }) {
   const [open, setOpen] = useState(false);
   return (
      <motion.div
         initial={{ opacity: 0, y: 12 }}
         whileInView={{ opacity: 1, y: 0 }}
         viewport={{ once: true }}
         transition={{ delay: index * 0.06 }}
         style={{ borderBottom: `1px solid ${C.border}` }}
      >
         <button
            onClick={() => setOpen(!open)}
            className="w-full flex items-center justify-between py-5 text-left gap-6 group"
         >
            <span className="text-sm font-bold tracking-tight group-hover:opacity-70 transition-opacity"
               style={{ color: open ? C.primary : C.text }}>
               {q}
            </span>
            <ChevronDown size={14}
               className={`shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
               style={{ color: C.secondary }} />
         </button>
         {open && (
            <p className="pb-5 text-sm leading-relaxed" style={{ color: C.muted }}>{a}</p>
         )}
      </motion.div>
   );
}

// ─── PAGE ────────────────────────────────────────
export default function CityClient({ citySlug, city }: { citySlug: string; city: CityData }) {
   const [activeCategory, setActiveCategory] = useState<ServiceCategory | 'all'>('all');
   const [searchQuery, setSearchQuery] = useState('');

   const allServices = Object.entries(city.services);

   const filteredServices = allServices.filter(([, service]: [string, any]) => {
      const matchCat = activeCategory === 'all' || service.category === activeCategory;
      const q = searchQuery.toLowerCase();
      const matchSearch = !q || (service.title || '').toLowerCase().includes(q) ||
         (service.intro || '').toLowerCase().includes(q);
      return matchCat && matchSearch;
   });

   const featuredServices = allServices
      .filter(([, s]: [string, any]) => s.urgency === 'alta')
      .slice(0, 3);

   const globalFaqs = allServices
      .flatMap(([, s]: [string, any]) => s.faqs || [])
      .slice(0, 6);

   const totalServices = allServices.length;

   const BASE = 'https://recienllegue.com';

   const jsonLd = [
      {
         '@context': 'https://schema.org',
         '@type': 'BreadcrumbList',
         itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Inicio', item: BASE },
            { '@type': 'ListItem', position: 2, name: city.name, item: `${BASE}/${citySlug}` },
         ],
      },
      {
         '@context': 'https://schema.org',
         '@type': 'WebPage',
         name: city.hero.title,
         description: city.hero.subtitle,
         url: `${BASE}/${citySlug}`,
         about: {
            '@type': 'City',
            name: city.name,
            containedInPlace: { '@type': 'State', name: 'Buenos Aires, Argentina' },
         },
         mainEntity: {
            '@type': 'ItemList',
            name: `Servicios estudiantiles en ${city.name}`,
            numberOfItems: totalServices,
            itemListElement: allServices.map(([slug, service]: [string, any], i) => ({
               '@type': 'ListItem',
               position: i + 1,
               name: service.title,
               url: `${BASE}/${citySlug}/${slug}`,
            })),
         },
      },
   ];

   return (
      <>
         <PageTracker page={`/${citySlug}`} extra={{ city: citySlug }} />
         {jsonLd.map((schema, i) => (
            <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
         ))}

         <div className="min-h-screen overflow-x-hidden" style={{ background: C.bg, color: C.text }}>
            <Navbar />

            {/* ══ HERO CARD (navy) ══════════════════════════════ */}
            <section className="pt-24 pb-0 px-6">
               <div className="max-w-7xl mx-auto">

                  {/* Breadcrumb */}
                  <nav aria-label="breadcrumb" className="mb-5">
                     <ol className="flex items-center gap-2 text-[10px] font-medium" style={{ color: C.muted }}>
                        <li><a href="/" className="hover:opacity-70 transition-opacity">Inicio</a></li>
                        <li>/</li>
                        <li style={{ color: C.primary }}>{city.name}</li>
                     </ol>
                  </nav>

                  <motion.div
                     initial={{ opacity: 0, y: 32 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                     className="rounded-[28px] overflow-hidden relative"
                     style={{ background: C.primary }}
                  >
                     <HeroParticles />
                     {/* Amber radial glow */}
                     <div className="absolute inset-0 pointer-events-none"
                        style={{ background: 'radial-gradient(circle at 80% 50%, rgba(245,158,11,0.08), transparent 55%)' }} />

                     <div className="relative z-10 p-8 sm:p-10 lg:p-12 grid lg:grid-cols-[1fr_auto] gap-8 lg:gap-12 items-center">
                        {/* Left: text */}
                        <div>
                           <p className="text-[10px] font-bold uppercase tracking-[0.15em] mb-3"
                              style={{ color: 'rgba(226,232,240,0.45)' }}>
                              Guía de ciudad · {city.institution}
                           </p>
                           <h1 className="font-black tracking-tight leading-[1.04] mb-4"
                              style={{ fontSize: 'clamp(2.4rem, 6vw, 3.8rem)', color: '#fff' }}>
                              {city.name}
                              <br />
                              <span style={{ color: C.mint }}>{city.institution}</span>
                           </h1>
                           <p className="text-sm leading-relaxed mb-6 max-w-lg"
                              style={{ color: 'rgba(226,232,240,0.6)' }}>
                              {city.hero.subtitle}
                           </p>

                           {/* Stats row */}
                           <div className="flex flex-wrap gap-6 mb-8">
                              <div>
                                 <p className="text-2xl font-black" style={{ color: C.mint }}>
                                    <CountUp to={totalServices} />
                                 </p>
                                 <p className="text-[10px] font-medium uppercase tracking-wider mt-0.5"
                                    style={{ color: 'rgba(226,232,240,0.4)' }}>Recursos</p>
                              </div>
                              <div>
                                 <p className="text-2xl font-black" style={{ color: C.mint }}>
                                    {city.details.precioPromedio}
                                 </p>
                                 <p className="text-[10px] font-medium uppercase tracking-wider mt-0.5"
                                    style={{ color: 'rgba(226,232,240,0.4)' }}>Alquiler prom.</p>
                              </div>
                              <div>
                                 <p className="text-2xl font-black" style={{ color: C.mint }}>
                                    <CountUp to={city.details.barrios.length} />
                                 </p>
                                 <p className="text-[10px] font-medium uppercase tracking-wider mt-0.5"
                                    style={{ color: 'rgba(226,232,240,0.4)' }}>Barrios</p>
                              </div>
                           </div>

                           <div className="flex flex-wrap gap-3">
                              <a href="/app/inicio"
                                 className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm transition-all hover:scale-[1.02]"
                                 style={{ background: '#F59E0B', color: C.primary }}>
                                 Abrir app <ArrowRight size={14} />
                              </a>
                              <a href={`/${citySlug}/alojamiento-estudiantes`}
                                 className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm transition-all hover:opacity-80"
                                 style={{ color: C.mint, border: '1px solid rgba(226,232,240,0.22)', background: 'rgba(226,232,240,0.08)' }}>
                                 Buscar alojamiento
                              </a>
                           </div>
                        </div>

                        {/* Right: zonas clave card */}
                        <div
                           className="hidden lg:block w-[220px] shrink-0 rounded-2xl p-5"
                           style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(226,232,240,0.12)' }}
                        >
                           <div className="flex items-center gap-2 mb-4">
                              <MapPin size={14} style={{ color: '#F59E0B' }} />
                              <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'rgba(226,232,240,0.5)' }}>
                                 Zonas clave
                              </p>
                           </div>
                           <ul className="space-y-2">
                              {city.details.barrios.slice(0, 6).map((b) => (
                                 <li key={b} className="flex items-center gap-2.5">
                                    <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: '#F59E0B' }} />
                                    <span className="text-xs font-medium" style={{ color: 'rgba(226,232,240,0.65)' }}>{b}</span>
                                 </li>
                              ))}
                           </ul>
                           {city.details.zonasClave?.length > 0 && (
                              <div className="mt-4 pt-4 space-y-1.5" style={{ borderTop: '1px solid rgba(226,232,240,0.1)' }}>
                                 {city.details.zonasClave.map((z) => (
                                    <p key={z} className="text-[10px]" style={{ color: 'rgba(226,232,240,0.35)' }}>{z}</p>
                                 ))}
                              </div>
                           )}
                        </div>
                     </div>
                  </motion.div>
               </div>
            </section>

            {/* ══ DESTACADOS ══════════════════════════════════ */}
            {featuredServices.length > 0 && (
               <section className="py-10 px-6">
                  <div className="max-w-7xl mx-auto">
                     <div className="flex items-center gap-3 mb-6">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center"
                           style={{ background: C.mint }}>
                           <Star size={12} style={{ color: C.primary }} />
                        </div>
                        <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: C.muted }}>
                           Lo más buscado en {city.name}
                        </p>
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {featuredServices.map(([slug, service]: [string, any], i) => (
                           <motion.a
                              key={slug}
                              href={`/${citySlug}/${slug}`}
                              initial={{ opacity: 0, y: 16 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true }}
                              transition={{ delay: i * 0.08 }}
                              className="group flex items-center justify-between p-5 rounded-2xl transition-all hover:-translate-y-0.5"
                              style={{ background: C.surface, border: `1px solid ${C.border}` }}
                           >
                              <div>
                                 <p className="text-sm font-bold tracking-tight group-hover:text-[#1E3A5F] transition-colors"
                                    style={{ color: C.text }}>
                                    {(service.title || '').split(' en ')[0]}
                                 </p>
                                 {service.priceRange && (
                                    <p className="text-[11px] font-medium mt-0.5" style={{ color: C.muted }}>
                                       {service.priceRange}
                                    </p>
                                 )}
                              </div>
                              <ArrowUpRight size={15} className="shrink-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                                 style={{ color: C.secondary }} />
                           </motion.a>
                        ))}
                     </div>
                  </div>
               </section>
            )}

            {/* ══ DIRECTORIO ══════════════════════════════════ */}
            <section className="py-8 px-6">
               <div className="max-w-7xl mx-auto">

                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-8">
                     <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: C.muted }}>
                           Directorio
                        </p>
                        <h2 className="text-2xl font-black tracking-tight" style={{ color: C.text }}>
                           Guías para estudiantes
                        </h2>
                     </div>
                     <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl w-full sm:w-64"
                        style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                        <Search size={13} style={{ color: C.muted }} />
                        <input
                           type="search"
                           placeholder="Buscar servicio..."
                           value={searchQuery}
                           onChange={e => setSearchQuery(e.target.value)}
                           className="bg-transparent flex-1 text-sm font-medium outline-none placeholder:opacity-40"
                           style={{ color: C.text }}
                        />
                     </div>
                  </div>

                  {/* Category pills */}
                  <div className="flex flex-wrap gap-2 mb-8">
                     {ALL_CATEGORIES.map((cat) => {
                        const isActive = activeCategory === cat;
                        const meta = cat !== 'all' ? CATEGORY_META[cat] : null;
                        return (
                           <button
                              key={cat}
                              onClick={() => setActiveCategory(cat)}
                              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all"
                              style={{
                                 background: isActive ? C.primary : C.surface,
                                 color: isActive ? C.mint : C.muted,
                                 border: `1px solid ${isActive ? C.primary : C.border}`,
                              }}
                           >
                              {meta?.icon}
                              {cat === 'all' ? 'Todo' : meta?.label}
                           </button>
                        );
                     })}
                     <span className="ml-auto text-xs font-medium self-center" style={{ color: C.muted }}>
                        {filteredServices.length} resultado{filteredServices.length !== 1 ? 's' : ''}
                     </span>
                  </div>

                  {filteredServices.length > 0 ? (
                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filteredServices.map(([slug, service]: [string, any], i) => (
                           <ServiceCard key={slug} slug={slug} service={service} citySlug={citySlug} index={i} />
                        ))}
                     </div>
                  ) : (
                     <div className="text-center py-20 rounded-2xl"
                        style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                        <p className="text-lg font-bold" style={{ color: C.muted }}>Sin resultados</p>
                        <p className="text-sm mt-1" style={{ color: C.muted, opacity: 0.6 }}>
                           Probá con otro término de búsqueda
                        </p>
                     </div>
                  )}
               </div>
            </section>

            {/* ══ BARRIOS ══════════════════════════════════════ */}
            <section className="py-12 px-6">
               <div className="max-w-7xl mx-auto">
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                     <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: C.muted }}>Zonas</p>
                        <h2 className="text-2xl font-black tracking-tight" style={{ color: C.text }}>
                           Barrios de <span style={{ color: C.secondary }}>{city.name}</span>
                        </h2>
                     </div>
                     <p className="text-xs font-medium max-w-xs" style={{ color: C.muted }}>
                        Zonas útiles para comparar cercanía, transporte y servicios
                     </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                     {city.details.barrios.map((barrio, i) => (
                           <motion.div
                              key={barrio}
                              initial={{ opacity: 0, scale: 0.96 }}
                              whileInView={{ opacity: 1, scale: 1 }}
                              viewport={{ once: true }}
                              transition={{ delay: i * 0.04 }}
                              className="rounded-2xl p-4 flex flex-col gap-2"
                              style={{ background: C.surface, border: `1px solid ${C.border}` }}
                           >
                              <MapPin size={13} style={{ color: C.secondary }} />
                              <p className="font-bold text-sm leading-tight"
                                 style={{ color: C.text }}>{barrio}</p>
                              <p className="text-[10px] font-medium" style={{ color: C.muted }}>{city.name}</p>
                           </motion.div>
                     ))}
                  </div>
               </div>
            </section>

            {/* ══ FAQ ══════════════════════════════════════════ */}
            {globalFaqs.length > 0 && (
               <section className="py-12 px-6">
                  <div className="max-w-3xl mx-auto">
                     <div className="mb-8">
                        <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: C.muted }}>
                           Preguntas frecuentes
                        </p>
                        <h2 className="text-2xl font-black tracking-tight" style={{ color: C.text }}>
                           Todo lo que necesitás saber<br />
                           <span style={{ color: C.muted }}>antes de llegar a {city.name}</span>
                        </h2>
                     </div>
                     <div style={{ borderTop: `1px solid ${C.border}` }}>
                        {globalFaqs.map((faq: { q: string; a: string }, i: number) => (
                           <FaqItem key={i} q={faq.q} a={faq.a} index={i} />
                        ))}
                     </div>
                  </div>
               </section>
            )}

            {/* ══ CTA FINAL ════════════════════════════════════ */}
            <section className="py-12 px-6 pb-24">
               <div className="max-w-7xl mx-auto">
                  <motion.div
                     initial={{ opacity: 0, y: 30 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true }}
                     className="rounded-3xl overflow-hidden relative"
                     style={{ background: C.primary }}
                  >
                     <HeroParticles />
                     <div className="relative z-10 p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="space-y-3 max-w-lg">
                           <span
                              className="inline-block text-[10px] font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full"
                              style={{ background: 'rgba(226,232,240,0.12)', color: C.mint, border: '1px solid rgba(226,232,240,0.18)' }}
                           >
                              Recién llegaste?
                           </span>
                           <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight leading-snug" style={{ color: C.mint }}>
                              Tu guía completa
                              <br />
                              para instalarte en
                              <br />
                              <span style={{ color: '#fff' }}>{city.name}.</span>
                           </h2>
                           <p className="text-sm" style={{ color: 'rgba(226,232,240,0.5)' }}>
                              Desde el primer día hasta el final del año.
                           </p>
                        </div>
                        <a
                           href="/registro"
                           className="shrink-0 flex items-center gap-2.5 px-7 py-4 rounded-xl font-bold text-sm transition-all hover:scale-[1.02]"
                           style={{ background: '#F59E0B', color: C.primary }}
                        >
                           Registrate gratis <ArrowRight size={16} />
                        </a>
                     </div>
                  </motion.div>
               </div>
            </section>

            <Footer />
         </div>
      </>
   );
}
