import Link from 'next/link'
import { ArrowRight, CheckCircle2, Clock, MapPin, ShieldCheck, Users, Zap } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import PublicShareButton from '@/components/PublicShareButton'
import HeroParticles from '@/components/HeroParticles'
import { getRelatedGrowthPages, type GrowthPage } from '@/data/public-growth-pages'

const C = {
  bg: '#F1F5F9',
  surface: '#ffffff',
  text: '#0F172A',
  primary: '#0F172A',
  secondary: '#1E3A5F',
  accent: '#FFFFFF',
  muted: 'rgba(15,23,42,0.56)',
  border: 'rgba(15,23,42,0.08)',
}

export default function GrowthPageLayout({ page, canonicalPath }: { page: GrowthPage; canonicalPath: string }) {
  const relatedPages = getRelatedGrowthPages(page.slug)
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: page.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: { '@type': 'Answer', text: faq.a },
    })),
  }
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Recién Llegué', item: 'https://recienllegue.com' },
      { '@type': 'ListItem', position: 2, name: 'Pergamino', item: 'https://recienllegue.com/pergamino' },
      { '@type': 'ListItem', position: 3, name: page.h1, item: `https://recienllegue.com${canonicalPath}` },
    ],
  }
  return (
    <main style={{ background: C.bg, color: C.text }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Navbar />

      <section className="px-4 pt-28 sm:pt-32 pb-12">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[minmax(0,1fr)_360px] gap-5 items-stretch">
          <div className="rounded-3xl p-7 sm:p-10 relative overflow-hidden min-h-[430px] flex flex-col justify-between" style={{ background: C.primary }}>
            <HeroParticles />
            <div className="relative z-10">
              <div className="flex flex-wrap gap-3 mb-8">
                <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider" style={{ background: '#E2E8F0', color: C.primary }}>
                  <Zap size={10} /> Guía local · Pergamino
                </span>
                <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider" style={{ background: 'rgba(255,255,255,0.14)', color: '#FFFFFF' }}>
                  Revisión 2026
                </span>
              </div>
              <h1 className="font-black tracking-tight leading-[1.04] max-w-4xl" style={{ color: '#fff', fontSize: 'clamp(2.4rem, 7vw, 4.7rem)' }}>{page.h1}</h1>
              <p className="text-base sm:text-lg leading-relaxed mt-6 max-w-2xl" style={{ color: 'rgba(226,232,240,0.76)' }}>{page.intro}</p>
            </div>
            <div className="relative z-10 flex flex-wrap gap-3 mt-10">
              <Link href={page.appHref} className="inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold transition-transform hover:scale-[1.02]" style={{ background: C.accent, color: C.primary }}>
                Abrir guía <ArrowRight size={15} />
              </Link>
              <Link href="/pergamino" className="inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold" style={{ background: 'rgba(226,232,240,0.12)', color: '#E2E8F0' }}>
                Ver Pergamino
              </Link>
            </div>
          </div>

          <aside className="rounded-3xl p-6 flex flex-col justify-between gap-6" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] mb-3" style={{ color: C.muted }}>Datos rápidos</p>
              <div className="space-y-3">
                {page.stats.map((stat) => (
                  <div key={stat.label} className="rounded-2xl p-4" style={{ background: '#F8FAFC', border: `1px solid ${C.border}` }}>
                    <p className="text-2xl font-black" style={{ color: C.secondary }}>{stat.value}</p>
                    <p className="text-xs font-semibold" style={{ color: C.muted }}>{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <PublicShareButton title={page.title} text={page.description} url={canonicalPath} />
              <p className="text-xs leading-relaxed" style={{ color: C.muted }}>Compartí esta guía con alguien que esté llegando a Pergamino o esté comparando opciones antes de mudarse.</p>
            </div>
          </aside>
        </div>
      </section>

      <section className="px-4 py-10">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-5">
          <article className="lg:col-span-2 rounded-2xl p-7 sm:p-9" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] mb-3" style={{ color: C.muted }}>Datos clave · Pergamino</p>
            <h2 className="text-3xl font-black tracking-tight mb-6">Lo que necesitás saber antes de decidir</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {page.sections.map((section) => (
                <div key={section.title} className="rounded-2xl p-5" style={{ background: '#F8FAFC' }}>
                  <h3 className="font-black text-lg mb-2">{section.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: C.muted }}>{section.body}</p>
                </div>
              ))}
            </div>
          </article>
          <article className="rounded-2xl p-7" style={{ background: C.primary, color: '#fff' }}>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] mb-3" style={{ color: '#CBD5E1' }}>Por qué Recién Llegué</p>
            {[
              { icon: Users, text: 'Pensado para estudiantes e ingresantes' },
              { icon: MapPin, text: 'Información organizada por zona y necesidad' },
              { icon: ShieldCheck, text: 'Contactos directos y revisión del equipo' },
              { icon: Clock, text: 'Acceso rápido desde web o PWA' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3 py-3" style={{ borderBottom: '1px solid rgba(226,232,240,0.14)' }}>
                <Icon size={16} style={{ color: C.accent }} />
                <p className="text-sm font-semibold" style={{ color: '#E2E8F0' }}>{text}</p>
              </div>
            ))}
          </article>
        </div>
      </section>

      <section className="px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-7">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] mb-2" style={{ color: C.muted }}>Cómo usarlo</p>
              <h2 className="text-3xl font-black tracking-tight">Resolvelo en tres pasos</h2>
            </div>
            <Link href={page.appHref} className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold w-fit" style={{ background: C.primary, color: C.accent }}>Empezar <ArrowRight size={14} /></Link>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {page.steps.map((step, index) => (
              <article key={step.title} className="rounded-2xl p-6" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                <p className="text-[11px] font-black mb-4" style={{ color: C.accent }}>0{index + 1}</p>
                <h3 className="font-black text-xl mb-2">{step.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: C.muted }}>{step.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-5">
          {page.seoBlocks.map((block) => (
            <article key={block.title} className="rounded-2xl p-7 sm:p-8" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
              <h2 className="font-black text-2xl mb-3">{block.title}</h2>
              <p className="text-base leading-relaxed" style={{ color: C.muted }}>{block.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-7">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] mb-2" style={{ color: C.muted }}>Seguí explorando</p>
              <h2 className="text-3xl font-black tracking-tight">Guías relacionadas</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href="/app/mapa" className="inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-bold" style={{ background: '#fff', color: C.primary, border: `1px solid ${C.border}` }}>Mapa</Link>
              <Link href="/app/comercios" className="inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-bold" style={{ background: '#fff', color: C.primary, border: `1px solid ${C.border}` }}>Comercios</Link>
              <Link href="/app/hospedajes" className="inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-bold" style={{ background: '#fff', color: C.primary, border: `1px solid ${C.border}` }}>Hospedajes</Link>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {relatedPages.map((related) => (
              <Link key={related.slug} href={`/pergamino/${related.slug}`} className="rounded-2xl p-6 block" style={{ background: C.surface, border: `1px solid ${C.border}`, textDecoration: 'none' }}>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em]" style={{ color: C.muted }}>Pergamino</p>
                <h3 className="font-black text-xl mt-2 mb-2" style={{ color: C.text }}>{related.h1}</h3>
                <p className="text-sm leading-relaxed" style={{ color: C.muted }}>{related.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-12">
        <div className="max-w-5xl mx-auto rounded-2xl p-7 sm:p-9" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] mb-2" style={{ color: C.muted }}>FAQ</p>
          <h2 className="font-black text-3xl mb-6">Preguntas frecuentes</h2>
          <div className="grid md:grid-cols-2 gap-5">
            {page.faqs.map((faq) => (
              <div key={faq.q} className="rounded-2xl p-5" style={{ background: '#F8FAFC' }}>
                <h3 className="font-black text-sm mb-2">{faq.q}</h3>
                <p className="text-sm leading-relaxed" style={{ color: C.muted }}>{faq.a}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4" style={{ background: '#F8FAFC' }}>
            <div>
              <h3 className="font-black text-lg">Abrí la guía completa</h3>
              <p className="text-sm" style={{ color: C.muted }}>Entrá a la app para ver datos, mapa, contactos y opciones actualizadas.</p>
            </div>
            <Link href={page.appHref} className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold" style={{ background: C.primary, color: C.accent }}>Abrir Recién Llegué <ArrowRight size={14} /></Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
