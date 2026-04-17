'use client'

import React, { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
   MapPin, ArrowRight, ArrowUpRight, Zap,
   Home, Bus, UtensilsCrossed, Heart, Wrench, GraduationCap,
   ShoppingBag, ChevronDown, Search, Star
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import type { ServiceCategory, CityData } from '@/data/seo-data';

// --- Palette (white premium) ---
const C = {
   bg: '#f8faf8',
   surface: '#ffffff',
   text: '#051f20',
   primary: '#163832',
   secondary: '#235347',
   mint: '#daf1de',
   muted: 'rgba(5, 31, 32, 0.4)',
   border: 'rgba(22, 56, 50, 0.08)',
};

// --- Category meta ---
const CATEGORY_META: Record<ServiceCategory, { label: string; icon: React.ReactNode }> = {
   alojamiento: { label: 'Alojamiento', icon: <Home size={13} /> },
   transporte: { label: 'Transporte', icon: <Bus size={13} /> },
   gastronomia: { label: 'Gastronomia', icon: <UtensilsCrossed size={13} /> },
   salud: { label: 'Salud', icon: <Heart size={13} /> },
   servicios: { label: 'Servicios', icon: <Wrench size={13} /> },
   educacion: { label: 'Educacion', icon: <GraduationCap size={13} /> },
   comercio: { label: 'Comercio', icon: <ShoppingBag size={13} /> },
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
         style={{ background: 'rgba(35, 83, 71, 0.08)', color: C.secondary }}
      >
         <Zap size={9} className="fill-current" /> Mas buscado
      </span>
   );
}

// --- ServiceCard ---
function ServiceCard({
   slug, service, citySlug, index
}: {
   slug: string;
   service: any;
   citySlug: string;
   index: number;
}) {
   const catMeta = service.category ? CATEGORY_META[service.category as ServiceCategory] : null;

   return (
      <motion.a
         href={`/${citySlug}/${slug}`}
         initial={{ opacity: 0, y: 24 }}
         whileInView={{ opacity: 1, y: 0 }}
         viewport={{ once: true }}
         transition={{ delay: (index % 6) * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
         className="group relative rounded-2xl p-7 flex flex-col justify-between min-h-[240px] transition-all duration-300 hover:-translate-y-1"
         style={{ background: 'white', border: `1px solid ${C.border}` }}
      >
         <div className="relative space-y-3">
            {/* Badges */}
            <div className="flex flex-wrap gap-2 items-center">
               {catMeta && (
                  <span
                     className="inline-flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-wider rounded-full px-2.5 py-1"
                     style={{ background: C.mint, color: C.primary }}
                  >
                     {catMeta.icon} {catMeta.label}
                  </span>
               )}
               <UrgencyBadge urgency={service.urgency} />
            </div>

            {/* Title */}
            <h3
               className="text-lg font-extrabold tracking-tight leading-snug group-hover:text-[#235347] transition-colors"
               style={{ color: C.text }}
            >
               {(service.title || '').split(' en ')[0]}
            </h3>

            {/* Description */}
            <p className="text-xs leading-relaxed line-clamp-2" style={{ color: C.muted }}>
               {(service.intro || '').substring(0, 90)}...
            </p>

            {/* Price */}
            {service.priceRange && (
               <p className="text-[11px] font-semibold" style={{ color: C.secondary }}>
                  {service.priceRange}
               </p>
            )}
         </div>

         {/* CTA */}
         <div className="relative mt-5 flex items-center justify-between">
            <span className="text-[10px] font-medium" style={{ color: C.muted }}>
               Ver guia completa
            </span>
            <div
               className="w-8 h-8 rounded-full flex items-center justify-center transition-all group-hover:scale-105"
               style={{ background: C.mint }}
            >
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
            <span
               className="text-sm font-bold tracking-tight group-hover:opacity-70 transition-opacity"
               style={{ color: open ? C.primary : C.text }}
            >
               {q}
            </span>
            <ChevronDown
               size={14}
               className={`shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
               style={{ color: C.secondary }}
            />
         </button>
         {open && (
            <p className="pb-5 text-sm leading-relaxed" style={{ color: C.muted }}>
               {a}
            </p>
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
   const totalBarrios = city.details.barrios.length;

   const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: city.hero.title,
      description: city.hero.subtitle,
      url: `https://recienlleguee.com.ar/${citySlug}`,
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
            url: `https://recienlleguee.com.ar/${citySlug}/${slug}`,
         })),
      },
   };

   return (
      <>
         <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
         />

         <div className="min-h-screen overflow-x-hidden" style={{ background: C.bg, color: C.text }}>
            <Navbar />

            {/* == HERO ============================== */}
            <section className="relative pt-32 pb-24 px-6 max-w-7xl mx-auto">
               <div
                  className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full pointer-events-none"
                  style={{
                     background: `radial-gradient(circle, ${C.secondary} 0%, transparent 70%)`,
                     opacity: 0.05,
                     filter: 'blur(80px)',
                  }}
               />

               <div className="relative flex flex-col lg:flex-row gap-14 items-start lg:items-end">
                  <motion.div
                     initial={{ opacity: 0, y: 40 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                     className="flex-1 space-y-6"
                  >
                     {/* Breadcrumb */}
                     <nav aria-label="breadcrumb">
                        <ol className="flex items-center gap-2 text-[10px] font-medium" style={{ color: C.muted }}>
                           <li><a href="/" className="hover:opacity-70 transition-opacity">Inicio</a></li>
                           <li>/</li>
                           <li style={{ color: C.primary }}>{city.name}</li>
                        </ol>
                     </nav>

                     {/* Pill */}
                     <span
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-semibold uppercase tracking-wider"
                        style={{ background: 'white', color: C.primary, border: `1px solid ${C.border}` }}
                     >
                        <Zap size={10} className="fill-current" />
                        Portal Estudiantes - {city.institution} - {city.name}
                     </span>

                     {/* H1 */}
                     <h1
                        className="font-extrabold tracking-tight leading-[1.05]"
                        style={{ fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', color: C.text }}
                     >
                        Vivir en
                        <br />
                        <span style={{ color: C.secondary }}>{city.name}</span>
                        <span style={{ color: C.muted }}>.</span>
                     </h1>

                     <p className="text-base md:text-lg leading-relaxed max-w-xl" style={{ color: C.muted }}>
                        {city.hero.subtitle}
                     </p>

                     {/* Stats inline */}
                     <div className="flex flex-wrap gap-6 pt-2">
                        {[
                           { label: 'Servicios', value: totalServices, suffix: '' },
                           { label: 'Barrios', value: totalBarrios, suffix: '' },
                           { label: 'Alquiler promedio', value: city.details.precioPromedio, isString: true },
                        ].map((stat, i) => (
                           <div key={i} className="space-y-1">
                              <p className="text-2xl md:text-3xl font-extrabold tracking-tight" style={{ color: C.text }}>
                                 {stat.isString ? stat.value : (
                                    <CountUp to={stat.value as number} />
                                 )}
                              </p>
                              <p className="text-[10px] font-medium uppercase tracking-wider" style={{ color: C.muted }}>
                                 {stat.label}
                              </p>
                           </div>
                        ))}
                     </div>
                  </motion.div>

                  {/* Card — Zonas clave */}
                  <motion.div
                     initial={{ opacity: 0, x: 40 }}
                     animate={{ opacity: 1, x: 0 }}
                     transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                     className="w-full lg:w-[320px] shrink-0 rounded-2xl p-7 relative overflow-hidden"
                     style={{ background: 'white', border: `1px solid ${C.border}` }}
                  >
                     <div className="relative z-10 space-y-5">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: C.mint }}>
                           <MapPin size={18} style={{ color: C.primary }} />
                        </div>
                        <div>
                           <h2 className="text-xl font-extrabold tracking-tight leading-snug mb-1" style={{ color: C.text }}>
                              Zonas clave
                           </h2>
                           <p className="text-[11px] font-medium" style={{ color: C.muted }}>
                              Cerca de {city.institution}
                           </p>
                        </div>
                        <ul className="space-y-2.5">
                           {city.details.barrios.map((b) => (
                              <li key={b} className="flex items-center gap-3">
                                 <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: C.secondary }} />
                                 <span className="text-xs font-medium" style={{ color: C.muted }}>{b}</span>
                              </li>
                           ))}
                        </ul>
                        {city.details.zonasClave?.length > 0 && (
                           <div className="pt-3 mt-3 space-y-1.5" style={{ borderTop: `1px solid ${C.border}` }}>
                              <p className="text-[10px] font-medium uppercase tracking-wider" style={{ color: C.muted }}>
                                 Puntos de referencia
                              </p>
                              {city.details.zonasClave.map((z) => (
                                 <p key={z} className="text-[11px] font-medium" style={{ color: C.muted, opacity: 0.7 }}>
                                    {z}
                                 </p>
                              ))}
                           </div>
                        )}
                     </div>
                  </motion.div>
               </div>
            </section>

            {/* == FEATURED ============================== */}
            {featuredServices.length > 0 && (
               <section className="py-12 px-6">
                  <div className="max-w-7xl mx-auto">
                     <div className="flex items-center gap-3 mb-8">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: C.mint }}>
                           <Star size={13} style={{ color: C.primary }} />
                        </div>
                        <h2 className="text-sm font-bold uppercase tracking-wider" style={{ color: C.primary }}>
                           Lo mas buscado en {city.name}
                        </h2>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {featuredServices.map(([slug, service]: [string, any], i) => (
                           <motion.a
                              key={slug}
                              href={`/${citySlug}/${slug}`}
                              initial={{ opacity: 0, y: 20 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true }}
                              transition={{ delay: i * 0.1 }}
                              className="group flex items-center justify-between p-5 rounded-2xl transition-all hover:-translate-y-0.5"
                              style={{ background: 'white', border: `1px solid ${C.border}` }}
                           >
                              <div>
                                 <p className="text-base font-bold tracking-tight group-hover:text-[#235347] transition-colors" style={{ color: C.text }}>
                                    {(service.title || '').split(' en ')[0]}
                                 </p>
                                 {service.priceRange && (
                                    <p className="text-[11px] font-medium mt-0.5" style={{ color: C.muted }}>
                                       {service.priceRange}
                                    </p>
                                 )}
                              </div>
                              <ArrowUpRight
                                 size={16}
                                 className="shrink-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                                 style={{ color: C.secondary }}
                              />
                           </motion.a>
                        ))}
                     </div>
                  </div>
               </section>
            )}

            {/* == DIRECTORY ============================== */}
            <section className="py-20 px-6">
               <div className="max-w-7xl mx-auto">

                  <div className="flex flex-col md:flex-row gap-6 items-start md:items-end justify-between mb-10">
                     <div>
                        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight" style={{ color: C.text }}>
                           Directorio
                           <br />
                           <span style={{ color: C.muted }}>Local</span>
                        </h2>
                        <p className="text-xs font-medium mt-2" style={{ color: C.muted }}>
                           {filteredServices.length} recursos encontrados
                        </p>
                     </div>

                     {/* Search */}
                     <div
                        className="flex items-center gap-3 rounded-xl px-5 py-3 w-full md:w-72"
                        style={{ background: 'white', border: `1px solid ${C.border}` }}
                     >
                        <Search size={14} style={{ color: C.muted }} />
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

                  {/* Category filter */}
                  <div className="flex flex-wrap gap-2 mb-10">
                     {ALL_CATEGORIES.map((cat) => {
                        const isActive = activeCategory === cat;
                        const meta = cat !== 'all' ? CATEGORY_META[cat] : null;
                        return (
                           <button
                              key={cat}
                              onClick={() => setActiveCategory(cat)}
                              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[10px] font-semibold uppercase tracking-wider transition-all"
                              style={{
                                 background: isActive ? C.primary : 'white',
                                 color: isActive ? C.bg : C.primary,
                                 border: `1px solid ${isActive ? C.primary : C.border}`,
                              }}
                           >
                              {meta?.icon}
                              {cat === 'all' ? 'Todo' : meta?.label}
                           </button>
                        );
                     })}
                  </div>

                  {/* Grid */}
                  {filteredServices.length > 0 ? (
                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {filteredServices.map(([slug, service]: [string, any], i) => (
                           <ServiceCard key={slug} slug={slug} service={service} citySlug={citySlug} index={i} />
                        ))}
                     </div>
                  ) : (
                     <div className="text-center py-20 rounded-2xl" style={{ background: 'white', border: `1px solid ${C.border}` }}>
                        <p className="text-xl font-bold" style={{ color: C.muted }}>Sin resultados</p>
                        <p className="text-sm mt-1" style={{ color: C.muted, opacity: 0.6 }}>Proba con otro termino de busqueda</p>
                     </div>
                  )}
               </div>
            </section>

            {/* == STATS BAR ============================== */}
            <section className="py-6 px-6">
               <div
                  className="max-w-7xl mx-auto rounded-2xl p-8 grid grid-cols-2 md:grid-cols-4 gap-5"
                  style={{ background: 'white', border: `1px solid ${C.border}` }}
               >
                  {[
                     { label: 'Promedio alquiler', value: city.details.precioPromedio },
                     { label: 'Transporte', value: 'SUBE activa' },
                     { label: 'Institucion', value: city.institution },
                     { label: 'Actualizado', value: 'Marzo 2026' },
                  ].map((item, i) => (
                     <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.08 }}
                        className="rounded-xl p-5"
                        style={{ background: C.mint }}
                     >
                        <span className="text-[10px] font-medium uppercase tracking-wider block mb-1.5" style={{ color: C.muted }}>
                           {item.label}
                        </span>
                        <p className="text-base font-bold tracking-tight" style={{ color: C.text }}>
                           {item.value}
                        </p>
                     </motion.div>
                  ))}
               </div>
            </section>

            {/* == BARRIOS ============================== */}
            <section className="py-20 px-6">
               <div className="max-w-7xl mx-auto">
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
                     <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight" style={{ color: C.text }}>
                        Barrios de <span style={{ color: C.secondary }}>{city.name}</span>
                     </h2>
                     <p className="text-[11px] font-medium max-w-xs text-right" style={{ color: C.muted }}>
                        Todas las zonas con oferta de alojamiento para estudiantes
                     </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                     {city.details.barrios.map((barrio, i) => {
                        const barrioSlug = barrio.toLowerCase().replace(/\s+/g, '-').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
                        return (
                        <motion.a
                           key={barrio}
                           href={`/${citySlug}/alojamiento-estudiantes/${barrioSlug}`}
                           initial={{ opacity: 0, scale: 0.95 }}
                           whileInView={{ opacity: 1, scale: 1 }}
                           viewport={{ once: true }}
                           transition={{ delay: i * 0.05 }}
                           className="group rounded-2xl p-5 flex flex-col gap-2 transition-all hover:-translate-y-0.5"
                           style={{ background: 'white', border: `1px solid ${C.border}` }}
                        >
                           <MapPin size={14} style={{ color: C.secondary }} />
                           <p className="font-bold tracking-tight text-sm group-hover:text-[#235347] transition-colors" style={{ color: C.text }}>{barrio}</p>
                           <p className="text-[10px] font-medium" style={{ color: C.muted }}>{city.name}</p>
                        </motion.a>
                        )
                     })}
                  </div>
               </div>
            </section>

            {/* == FAQ ============================== */}
            {globalFaqs.length > 0 && (
               <section className="py-20 px-6">
                  <div className="max-w-3xl mx-auto">
                     <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3" style={{ color: C.text }}>
                        Preguntas
                        <br />
                        <span style={{ color: C.muted }}>Frecuentes</span>
                     </h2>
                     <p className="text-xs font-medium mb-10" style={{ color: C.muted }}>
                        Todo lo que necesitas saber antes de llegar a {city.name}
                     </p>

                     <div style={{ borderTop: `1px solid ${C.border}` }}>
                        {globalFaqs.map((faq: { q: string; a: string }, i: number) => (
                           <FaqItem key={i} q={faq.q} a={faq.a} index={i} />
                        ))}
                     </div>
                  </div>
               </section>
            )}

            {/* == CTA FINAL ============================== */}
            <section className="py-12 px-6 pb-24">
               <div className="max-w-7xl mx-auto">
                  <motion.div
                     initial={{ opacity: 0, y: 30 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true }}
                     className="rounded-3xl p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden"
                     style={{ background: C.primary, color: C.bg }}
                  >
                     <div className="space-y-3 max-w-lg">
                        <span
                           className="inline-block text-[10px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full"
                           style={{ background: 'rgba(218,241,222,0.1)' }}
                        >
                           Recien llegaste?
                        </span>
                        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight leading-snug">
                           Tu guia completa
                           <br />
                           para instalarte en
                           <br />
                           {city.name}.
                        </h2>
                        <p className="text-sm" style={{ opacity: 0.5 }}>
                           Desde el primer dia hasta el final del anio.
                        </p>
                     </div>

                     <a
                        href="/registro"
                        className="shrink-0 flex items-center gap-2.5 px-7 py-4 rounded-xl font-bold text-sm transition-all hover:scale-[1.02]"
                        style={{ background: C.bg, color: C.primary }}
                     >
                        Registrate gratis <ArrowRight size={16} />
                     </a>
                  </motion.div>
               </div>
            </section>

            <Footer />
         </div>
      </>
   );
}
