'use client'

import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
   ArrowRight, ChevronDown, MapPin, CheckCircle2,
   Home, Bus, UtensilsCrossed, Heart, Wrench,
   GraduationCap, ShoppingBag, ArrowLeft, ExternalLink,
   Zap, Users, Clock, ShieldCheck,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageTracker from '@/components/PageTracker';
import HeroParticles from '@/components/HeroParticles';
import type { ServiceCategory, CityData, ServiceBase } from '@/data/seo-data';
import type { FeaturedBusiness } from '@/lib/featured';

// --- Palette (white premium) ---
const C = {
   bg: '#F1F5F9',
   surface: '#ffffff',
   text: '#0F172A',
   primary: '#0F172A',
   secondary: '#1E3A5F',
   mint: '#E2E8F0',
   muted: 'rgba(5, 31, 32, 0.4)',
   border: 'rgba(22, 56, 50, 0.08)',
};

// --- CTA contextual por categoria ---
const CATEGORY_CTA: Record<ServiceCategory, { label: string; verb: string; icon: React.ReactNode }> = {
   alojamiento: { label: 'Buscar alojamiento', verb: 'Buscar', icon: <Home size={16} /> },
   transporte: { label: 'Ver opciones de viaje', verb: 'Explorar', icon: <Bus size={16} /> },
   gastronomia: { label: 'Explorar locales', verb: 'Explorar', icon: <UtensilsCrossed size={16} /> },
   salud: { label: 'Encontrar ayuda', verb: 'Acceder', icon: <Heart size={16} /> },
   servicios: { label: 'Ver directorio', verb: 'Ver', icon: <Wrench size={16} /> },
   educacion: { label: 'Acceder a recursos', verb: 'Acceder', icon: <GraduationCap size={16} /> },
   comercio: { label: 'Ver opciones', verb: 'Ver', icon: <ShoppingBag size={16} /> },
};

const DEFAULT_CTA = { label: 'Abrir Recién Llegué', verb: 'Abrir', icon: <ExternalLink size={16} /> };

const APP_HREF = '/registro';
const REGISTER_HREF = '/registro';

// --- Trust stats ---
const TRUST_STATS = [
   { icon: <Users size={18} />, value: '+2.400', label: 'Estudiantes activos' },
   { icon: <CheckCircle2 size={18} />, value: '98%', label: 'Satisfaccion' },
   { icon: <Clock size={18} />, value: '<24hs', label: 'Tiempo de respuesta' },
   { icon: <ShieldCheck size={18} />, value: 'Gratis', label: 'Sin costo para vos' },
];

// --- FAQ Accordion ---
function FaqItem({ q, a, index }: { q: string; a: string; index: number }) {
   const [open, setOpen] = useState(index === 0);
   return (
      <div style={{ borderBottom: `1px solid ${C.border}` }}>
         <button
            onClick={() => setOpen(!open)}
            className="w-full flex items-center justify-between py-5 text-left gap-6 group"
            aria-expanded={open}
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
         <motion.div
            initial={false}
            animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
            transition={{ duration: 0.25 }}
            style={{ overflow: 'hidden' }}
         >
            <p className="pb-5 text-sm leading-relaxed" style={{ color: C.muted }}>{a}</p>
         </motion.div>
      </div>
   );
}

// --- CTA Button ---
function CtaButton({
   category, citySlug, serviceSlug, size = 'md', full = false
}: {
   category?: ServiceCategory;
   citySlug: string;
   serviceSlug: string;
   size?: 'sm' | 'md' | 'lg';
   full?: boolean;
}) {
   const meta = category ? CATEGORY_CTA[category] : DEFAULT_CTA;
   const pad = size === 'lg' ? 'px-8 py-4 text-sm' : size === 'sm' ? 'px-5 py-3 text-[11px]' : 'px-6 py-3.5 text-xs';

   return (
      <a
         href={APP_HREF}
         className={`group inline-flex items-center gap-2 rounded-xl font-bold transition-all hover:scale-[1.02] hover:shadow-lg ${pad} ${full ? 'w-full justify-center' : ''}`}
         style={{ background: '#F59E0B', color: C.primary }}
      >
         {meta.icon}
         {meta.label}
         <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
      </a>
   );
}

// --- Sticky CTA bar ---
function StickyCta({
   serviceTitle, category, citySlug, serviceSlug, cityName
}: {
   serviceTitle: string;
   category?: ServiceCategory;
   citySlug: string;
   serviceSlug: string;
   cityName: string;
}) {
   const [visible, setVisible] = useState(false);

   useEffect(() => {
      const onScroll = () => setVisible(window.scrollY > 400);
      window.addEventListener('scroll', onScroll, { passive: true });
      return () => window.removeEventListener('scroll', onScroll);
   }, []);

   return (
      <motion.div
         initial={{ y: 80, opacity: 0 }}
         animate={{ y: visible ? 0 : 80, opacity: visible ? 1 : 0 }}
         transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
         className="fixed bottom-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none"
      >
         <div
            className="pointer-events-auto flex items-center gap-4 rounded-2xl px-6 py-4 shadow-2xl"
            style={{ background: C.surface, border: `1px solid ${C.border}`, maxWidth: 560, width: '100%' }}
         >
            <div className="flex-1 min-w-0">
               <p className="text-[10px] font-medium uppercase tracking-wider truncate" style={{ color: C.muted }}>
                  {serviceTitle.split(' en ')[0]} &middot; {cityName}
               </p>
               <p className="text-xs font-bold" style={{ color: C.text }}>
                  Encontrá todo en Recién Llegué
               </p>
            </div>
            <CtaButton category={category} citySlug={citySlug} serviceSlug={serviceSlug} size="sm" />
         </div>
      </motion.div>
   );
}

// --- Related card ---
function RelatedCard({ slug, service, citySlug }: { slug: string; service: any; citySlug: string }) {
   return (
      <a
         href={`/${citySlug}/${slug}`}
         className="group flex items-center justify-between p-5 rounded-2xl transition-all hover:-translate-y-0.5"
         style={{ background: C.surface, border: `1px solid ${C.border}` }}
      >
         <div>
            <p className="text-sm font-bold tracking-tight group-hover:text-[#1E3A5F] transition-colors" style={{ color: C.text }}>
               {(service.title || '').split(' en ')[0]}
            </p>
            {service.priceRange && (
               <p className="text-[10px] font-medium mt-0.5" style={{ color: C.muted }}>
                  {service.priceRange}
               </p>
            )}
         </div>
         <ArrowRight size={14} className="shrink-0 group-hover:translate-x-0.5 transition-transform" style={{ color: C.secondary }} />
      </a>
   );
}

const SCHEMA_TYPES: Record<ServiceCategory, string> = {
   alojamiento:  'Accommodation',
   transporte:   'Service',
   gastronomia:  'FoodEstablishment',
   salud:        'MedicalBusiness',
   servicios:    'LocalBusiness',
   educacion:    'EducationalOrganization',
   comercio:     'Store',
}

// --- PAGE ---
export default function LandingClient({
   citySlug,
   serviceSlug,
   city,
   service,
   featuredBusiness,
}: {
   citySlug: string
   serviceSlug: string
   city: CityData
   service: ServiceBase
   featuredBusiness: FeaturedBusiness | null
}) {
   const category: ServiceCategory | undefined = service.category;

   const relatedServices = Object.entries(city.services)
      .filter(([slug]) => slug !== serviceSlug)
      .sort(([, a]: any, [, b]: any) => {
         if (a.category === category && b.category !== category) return -1;
         if (b.category === category && a.category !== category) return 1;
         return 0;
      })
      .slice(0, 4);

   const serviceSchema = {
      '@context': 'https://schema.org',
      '@type': service.schemaType ?? (category ? SCHEMA_TYPES[category] : 'Service'),
      name: service.h1,
      description: service.intro,
      areaServed: {
         '@type': 'City',
         name: city.name,
         containedInPlace: { '@type': 'State', name: 'Buenos Aires, Argentina' },
      },
      ...(service.priceRange ? { priceRange: service.priceRange } : {}),
   }

   const jsonLd = [
      serviceSchema,
      {
         '@context': 'https://schema.org',
         '@type': 'FAQPage',
         mainEntity: service.faqs.map((faq: any) => ({
            '@type': 'Question',
            name: faq.q,
            acceptedAnswer: { '@type': 'Answer', text: faq.a },
         })),
      },
      {
         '@context': 'https://schema.org',
         '@type': 'BreadcrumbList',
         itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://recienlleguee.com.ar' },
            { '@type': 'ListItem', position: 2, name: city.name, item: `https://recienlleguee.com.ar/${citySlug}` },
            { '@type': 'ListItem', position: 3, name: service.title, item: `https://recienlleguee.com.ar/${citySlug}/${serviceSlug}` },
         ],
      },
   ];

   const heroRef = useRef(null);

   return (
      <>
         <PageTracker page={`/${citySlug}/${serviceSlug}`} extra={{ city: citySlug, service: serviceSlug }} />
         {jsonLd.map((schema, i) => (
            <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
         ))}

         <StickyCta
            serviceTitle={service.title}
            category={category}
            citySlug={citySlug}
            serviceSlug={serviceSlug}
            cityName={city.name}
         />

         <div className="min-h-screen overflow-x-hidden" style={{ background: C.bg, color: C.text }}>
            <Navbar />

            {/* == HERO ============================== */}
            <section ref={heroRef} className="relative pt-36 pb-20 px-6 max-w-5xl mx-auto">
               <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[400px] pointer-events-none"
                  style={{ background: `radial-gradient(circle, ${C.secondary} 0%, transparent 70%)`, opacity: 0.06, filter: 'blur(80px)' }} />

               <div className="relative">
                  {/* Breadcrumb */}
                  <nav aria-label="breadcrumb" className="mb-8">
                     <ol className="flex flex-wrap items-center gap-2 text-[10px] font-medium" style={{ color: C.muted }}>
                        <li><a href="/" className="hover:opacity-70 transition-opacity">Inicio</a></li>
                        <li>/</li>
                        <li><a href={`/${citySlug}`} className="hover:opacity-70 transition-opacity">{city.name}</a></li>
                        <li>/</li>
                        <li style={{ color: C.primary }}>{service.title.split(' en ')[0]}</li>
                     </ol>
                  </nav>

                  {/* Badge */}
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                     <div className="flex flex-wrap items-center gap-3 mb-8">
                        <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-semibold uppercase tracking-wider"
                           style={{ background: C.mint, color: C.primary }}>
                           <Zap size={9} className="fill-current" />
                           Guía Local &middot; {city.institution} &middot; {city.name}
                        </span>
                        {service.urgency === 'alta' && (
                           <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[10px] font-semibold uppercase tracking-wider"
                              style={{ background: 'rgba(35,83,71,0.08)', color: C.secondary }}>
                              Más buscado
                           </span>
                        )}
                     </div>
                  </motion.div>

                  {/* H1 */}
                  <motion.h1
                     initial={{ opacity: 0, y: 30 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                     className="font-extrabold tracking-tight leading-[1.05] mb-6"
                     style={{ fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', color: C.text }}
                  >
                     {service.title.split(' en ')[0]}
                     <br />
                     <span style={{ color: C.secondary }}>en {city.name}</span>
                     <span style={{ color: C.muted }}>.</span>
                  </motion.h1>

                  {/* Intro */}
                  <motion.p
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ duration: 0.5, delay: 0.15 }}
                     className="text-base md:text-lg leading-relaxed max-w-2xl mb-10"
                     style={{ color: C.muted }}
                  >
                     {service.intro} Usá esta guía para comparar referencias, zonas y datos útiles antes de decidir.
                  </motion.p>

                  {/* CTA hero */}
                  <motion.div
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ duration: 0.5, delay: 0.25 }}
                     className="flex flex-wrap items-center gap-4"
                  >
                     <CtaButton category={category} citySlug={citySlug} serviceSlug={serviceSlug} size="lg" />
                     <a href={`/${citySlug}`}
                        className="inline-flex items-center gap-2 text-xs font-semibold transition-colors hover:opacity-70"
                        style={{ color: C.muted }}>
                        <ArrowLeft size={13} /> Ver todo {city.name}
                     </a>
                  </motion.div>

                  {/* Price range */}
                  {service.priceRange && (
                     <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="mt-8 inline-flex items-center gap-3 rounded-xl px-5 py-3"
                        style={{ background: C.surface, border: `1px solid ${C.border}` }}
                     >
                        <span className="text-[10px] font-medium uppercase tracking-wider" style={{ color: C.muted }}>
                           Referencia
                        </span>
                        <span className="w-px h-4" style={{ background: C.border }} />
                        <span className="text-sm font-bold" style={{ color: C.secondary }}>
                           {service.priceRange}
                        </span>
                     </motion.div>
                  )}
               </div>
            </section>

            {/* == DATOS + ZONAS ============================== */}
            <section className="py-16 px-6">
               <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-5">

                  {/* Card datos */}
                  <motion.div
                     initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                     className="lg:col-span-2 rounded-2xl p-8 md:p-10 flex flex-col justify-between gap-8"
                     style={{ background: C.surface, border: `1px solid ${C.border}` }}
                  >
                     <div>
                        <p className="text-[10px] font-medium uppercase tracking-wider mb-4" style={{ color: C.muted }}>
                           Datos clave &middot; {city.name}
                        </p>
                        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight" style={{ color: C.text }}>
                           Lo que necesitás saber
                        </h2>
                     </div>

                     <div style={{ borderTop: `1px solid ${C.border}` }}>
                        {[
                           { label: 'Barrio principal', value: city.details.barrios[0] },
                           { label: 'Precio promedio', value: city.details.precioPromedio },
                           { label: 'Universidad', value: city.institution },
                           { label: 'Zona más buscada', value: city.details.zonasClave?.[0] || city.details.barrios[1] },
                        ].map((row, i) => (
                           <div key={i} className="flex justify-between items-center py-4 gap-4"
                              style={{ borderBottom: `1px solid ${C.border}` }}>
                              <span className="text-[10px] font-medium uppercase tracking-wider" style={{ color: C.muted }}>
                                 {row.label}
                              </span>
                              <span className="text-sm font-bold text-right" style={{ color: C.primary }}>
                                 {row.value}
                              </span>
                           </div>
                        ))}
                     </div>

                     <div className="pt-2">
                        <CtaButton category={category} citySlug={citySlug} serviceSlug={serviceSlug} />
                     </div>
                  </motion.div>

                  {/* Card zonas */}
                  <motion.div
                     initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                     transition={{ delay: 0.1 }}
                     className="rounded-2xl p-7 flex flex-col gap-5 relative overflow-hidden"
                     style={{ background: C.primary }}
                  >
                     <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: C.mint, opacity: 0.6 }}>
                           Zonas recomendadas
                        </p>
                        <h3 className="text-xl font-extrabold tracking-tight leading-snug" style={{ color: '#fff' }}>
                           Donde buscar en {city.name}
                        </h3>
                     </div>

                     <ul className="space-y-3 flex-1">
                        {city.details.barrios.slice(0, 5).map((barrio, i) => (
                           <li key={barrio} className="flex items-center gap-3">
                              <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[9px] font-bold"
                                 style={{ background: C.secondary, color: C.mint }}>
                                 {i + 1}
                              </div>
                              <span className="text-xs font-medium"
                                 style={{ color: '#fff', opacity: 0.8 }}>
                                 {barrio}
                              </span>
                           </li>
                        ))}
                     </ul>

                     <a href={`/${citySlug}`}
                        className="inline-flex items-center gap-2 text-xs font-semibold transition-colors hover:opacity-80"
                        style={{ color: C.mint }}>
                        Ver todos los barrios <ArrowRight size={11} />
                     </a>

                     <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full pointer-events-none"
                        style={{ background: C.secondary, opacity: 0.2 }} />
                  </motion.div>
               </div>
            </section>

            {/* == COMO TE AYUDAMOS ============================== */}
            <section className="py-20 px-6">
               <div className="max-w-7xl mx-auto">
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                     <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wider mb-3" style={{ color: C.muted }}>
                           Recién Llegué · Tu app
                        </p>
                        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight" style={{ color: C.text }}>
                           Cómo te
                           <br />
                           <span style={{ color: C.secondary }}>ayudamos</span>
                        </h2>
                     </div>
                     <CtaButton category={category} citySlug={citySlug} serviceSlug={serviceSlug} />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                     {[
                        { step: '01', title: 'Buscás', desc: `Ingresás qué necesitás — en este caso, ${(service.title || '').split(' en ')[0].toLowerCase()}.` },
                        { step: '02', title: 'Filtrás', desc: `Elegís zona, presupuesto y preferencias. Solo ves lo que aplica a vos.` },
                        { step: '03', title: 'Contactás', desc: 'Te conectamos directo con el proveedor. Sin intermediarios.' },
                        { step: '04', title: 'Llegás', desc: `Te instalás en ${city.name} con todo resuelto desde el día uno.` },
                     ].map(({ step, title, desc }, i) => (
                        <motion.div
                           key={step}
                           initial={{ opacity: 0, y: 20 }}
                           whileInView={{ opacity: 1, y: 0 }}
                           viewport={{ once: true }}
                           transition={{ delay: i * 0.08 }}
                           className="rounded-2xl p-7 flex flex-col gap-4"
                           style={{ background: C.surface, border: `1px solid ${C.border}` }}
                        >
                           <span className="text-[10px] font-medium" style={{ color: C.muted }}>{step}</span>
                           <h3 className="text-2xl font-extrabold tracking-tight" style={{ color: C.text }}>
                              {title}
                           </h3>
                           <p className="text-xs leading-relaxed" style={{ color: C.muted }}>
                              {desc}
                           </p>
                        </motion.div>
                     ))}
                  </div>
               </div>
            </section>

            {/* == TRUST STATS ============================== */}
            <section className="py-8 px-6">
               <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
                  {TRUST_STATS.map(({ icon, value, label }, i) => (
                     <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.07 }}
                        className="rounded-2xl p-6 flex flex-col gap-3"
                        style={{ background: C.surface, border: `1px solid ${C.border}` }}
                     >
                        <div style={{ color: C.secondary }}>{icon}</div>
                        <p className="text-2xl font-extrabold tracking-tight" style={{ color: C.text }}>{value}</p>
                        <p className="text-[10px] font-medium uppercase tracking-wider" style={{ color: C.muted }}>{label}</p>
                     </motion.div>
                  ))}
               </div>
            </section>

            {/* == COMERCIO DESTACADO ============================== */}
            {featuredBusiness && (
               <section className="py-10 px-6">
                  <div className="max-w-3xl mx-auto">
                     <div
                        className="rounded-2xl p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
                        style={{ background: C.mint, border: `1px solid rgba(15,23,42,0.12)` }}
                     >
                        <div className="space-y-2">
                           <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: C.secondary }}>
                              Destacado en Recién Llegué
                           </span>
                           <h3 className="text-lg font-extrabold tracking-tight" style={{ color: C.primary }}>
                              {featuredBusiness.name}
                           </h3>
                           <p className="text-sm leading-relaxed" style={{ color: C.secondary }}>
                              {featuredBusiness.tagline}
                           </p>
                           <div className="flex flex-wrap gap-4 pt-1 text-xs font-medium" style={{ color: C.primary, opacity: 0.7 }}>
                              {featuredBusiness.address && <span>📍 {featuredBusiness.address}</span>}
                              {featuredBusiness.phone && <span>📞 {featuredBusiness.phone}</span>}
                           </div>
                        </div>
                        <div className="flex flex-col gap-2 shrink-0">
                           {featuredBusiness.website ? (
                              <a
                                 href={featuredBusiness.website}
                                 target="_blank"
                                 rel="noopener noreferrer"
                                 className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs transition-all hover:scale-[1.02]"
                                 style={{ background: C.primary, color: '#fff' }}
                              >
                                 Ver sitio web <ArrowRight size={13} />
                              </a>
                           ) : null}
                           <a
                              href={APP_HREF}
                              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-xs transition-all"
                              style={{ background: 'white', color: C.primary, border: `1px solid rgba(15,23,42,0.15)` }}
                           >
                              Ver más en la app
                           </a>
                        </div>
                     </div>
                  </div>
               </section>
            )}

            {/* == FAQ ============================== */}
            <section className="py-20 px-6">
               <div className="max-w-3xl mx-auto">
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
                     <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wider mb-3" style={{ color: C.muted }}>
                           Preguntas frecuentes
                        </p>
                        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight" style={{ color: C.text }}>
                           Todo lo que
                           <br />
                           <span style={{ color: C.secondary }}>querés saber</span>
                        </h2>
                     </div>
                     <span className="text-[10px] font-medium uppercase tracking-wider" style={{ color: C.muted }}>
                        {service.faqs.length} respuestas
                     </span>
                  </div>

                  <div style={{ borderTop: `1px solid ${C.border}` }}>
                     {service.faqs.map((faq: any, i: number) => (
                        <FaqItem key={i} q={faq.q} a={faq.a} index={i} />
                     ))}
                  </div>

                  {/* CTA post FAQ */}
                  <div
                     className="mt-10 rounded-2xl p-7 flex flex-col sm:flex-row items-center justify-between gap-6"
                     style={{ background: C.surface, border: `1px solid ${C.border}` }}
                  >
                     <div>
                        <p className="text-base font-bold tracking-tight" style={{ color: C.text }}>
                           ¿Todavía tenés dudas?
                        </p>
                        <p className="text-xs font-medium mt-1" style={{ color: C.muted }}>
                           En la app podés chatear con otros estudiantes de {city.name}.
                        </p>
                     </div>
                     <CtaButton category={category} citySlug={citySlug} serviceSlug={serviceSlug} size="sm" />
                  </div>
               </div>
            </section>

            {/* == RELACIONADOS ============================== */}
            {relatedServices.length > 0 && (
               <section className="py-16 px-6">
                  <div className="max-w-7xl mx-auto">
                     <div className="flex items-end justify-between gap-4 mb-10">
                        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight" style={{ color: C.text }}>
                           Más en <span style={{ color: C.secondary }}>{city.name}</span>
                        </h2>
                        <a href={`/${citySlug}`}
                           className="text-xs font-semibold hover:opacity-70 transition-opacity flex items-center gap-1"
                           style={{ color: C.primary }}>
                           Ver todo <ArrowRight size={11} />
                        </a>
                     </div>

                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {relatedServices.map(([slug, s]: [string, any]) => (
                           <RelatedCard key={slug} slug={slug} service={s} citySlug={citySlug} />
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
                     className="rounded-3xl overflow-hidden relative"
                     style={{ background: C.primary }}
                  >
                     <HeroParticles />
                     <div className="relative z-10 p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-10">
                        <div className="space-y-3 max-w-md">
                           <span className="inline-block text-[10px] font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full"
                              style={{ background: 'rgba(226,232,240,0.12)', color: C.mint, border: '1px solid rgba(226,232,240,0.18)' }}>
                              Recién Llegué · {city.name} 2026
                           </span>
                           <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight leading-snug" style={{ color: C.mint }}>
                              Dejá de googlear.
                              <br />
                              <span style={{ color: '#fff' }}>Encontrá {(service.title || '').split(' en ')[0].toLowerCase()}</span>
                              <br />
                              en un solo lugar.
                           </h2>
                           <p className="text-sm" style={{ color: 'rgba(226,232,240,0.5)' }}>
                              Gratis para estudiantes de {city.institution}.
                           </p>
                        </div>

                        <div className="flex flex-col gap-3 shrink-0 w-full md:w-auto">
                           <a
                              href={APP_HREF}
                              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-sm transition-all hover:scale-[1.02]"
                              style={{ background: '#F59E0B', color: C.primary }}
                           >
                              Registrate gratis <ArrowRight size={16} />
                           </a>
                           <a
                              href="/login"
                              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-xs transition-all"
                              style={{ color: C.mint, border: '1px solid rgba(226,232,240,0.22)' }}
                           >
                              Ya tengo cuenta
                           </a>
                        </div>
                     </div>
                  </motion.div>
               </div>
            </section>

            <Footer />
         </div>
      </>
   );
}
