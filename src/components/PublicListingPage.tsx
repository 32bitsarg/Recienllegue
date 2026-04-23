import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import PublicShareButton from '@/components/PublicShareButton'
import ReportListingIssue from '@/components/ReportListingIssue'
import PublicListingMap from '@/components/PublicListingMap'
import { serverDb } from '@/lib/db-server'

function mapsExternalUrl(item: any) {
  if (item.googleMapsUrl) return item.googleMapsUrl
  const lat = item.lat ?? item.latitude
  const lng = item.lng ?? item.longitude
  if (lat != null && lng != null) return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
  const query = [item.name, item.address, 'Pergamino'].filter(Boolean).join(', ')
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
}

function DetailRow({ label, value }: { label: string; value?: React.ReactNode }) {
  if (!value) return null
  return (
    <div className="rounded-2xl p-4" style={{ background: '#F8FAFC', border: '1px solid rgba(15,23,42,0.06)' }}>
      <p className="text-[10px] font-bold uppercase tracking-[0.16em]" style={{ color: 'rgba(15,23,42,0.42)' }}>{label}</p>
      <div className="text-sm font-bold mt-1" style={{ color: '#0F172A' }}>{value}</div>
    </div>
  )
}

function relativeDateLabel(value?: string) {
  if (!value) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null
  const diff = Math.max(0, Date.now() - date.getTime())
  const days = Math.floor(diff / 86400000)
  if (days === 0) return 'hoy'
  if (days === 1) return 'hace 1 día'
  if (days < 30) return `hace ${days} días`
  const months = Math.floor(days / 30)
  if (months === 1) return 'hace 1 mes'
  return `hace ${months} meses`
}

function dataStatus(item: any, pendingReports: number) {
  if (pendingReports > 0) return { label: 'Pendiente de revisión', tone: '#92400e', bg: '#FEF3C7' }
  if (item.isVerified) return { label: 'Dato confirmado', tone: '#166534', bg: '#DCFCE7' }
  return { label: 'Dato publicado', tone: '#1E3A5F', bg: '#DBEAFE' }
}

export default async function PublicListingPage({
  item,
  kind,
  backHref,
  chrome = 'public',
}: {
  item: any
  kind: 'comercio' | 'hospedaje'
  backHref: string
  chrome?: 'public' | 'app'
}) {
  const images = Array.isArray(item.images) ? item.images : []
  const title = item.name ?? (kind === 'comercio' ? 'Comercio' : 'Hospedaje')
  const publicPath = `/${kind === 'comercio' ? 'comercios' : 'hospedajes'}/${item.id}`
  const phoneDigits = item.phone ? String(item.phone).replace(/\D/g, '') : ''
  const price = [item.price, item.priceMax].filter(Boolean).join(' - ')
  const mapUrl = mapsExternalUrl(item)
  const lat = item.lat ?? item.latitude
  const lng = item.lng ?? item.longitude
  const rating = Number(item.rating ?? 0)
  const reviewsCount = Number(item.reviewsCount ?? 0)
  const reportCollection = kind === 'comercio' ? 'comercios' : 'hospedajes'
  const reports = await serverDb.from('reports').eq('collection', reportCollection).eq('recordId', item.id).limit(100).find().catch(() => []) as any[]
  const pendingReports = reports.filter((report) => report.status === 'pending').length
  const resolvedReports = reports.filter((report) => report.status === 'resolved' || report.status === 'approved').length
  const lastUpdated = item.lastAvailabilityUpdate || item.updatedAt || item.reviewedAt || item.createdAt || ''
  const freshness = relativeDateLabel(lastUpdated)
  const statusPill = dataStatus(item, pendingReports)
  const ownershipHref = kind === 'comercio'
    ? `/app/propietario?claim=${encodeURIComponent(item.id)}&name=${encodeURIComponent(title)}`
    : '/soy-propietario'
  const listingSchema = {
    '@context': 'https://schema.org',
    '@type': kind === 'comercio' ? 'LocalBusiness' : 'LodgingBusiness',
    name: title,
    address: item.address || undefined,
    telephone: item.phone || undefined,
    image: images[0] || undefined,
    url: `https://recienllegue.com${publicPath}`,
    aggregateRating: rating > 0 && reviewsCount > 0 ? {
      '@type': 'AggregateRating',
      ratingValue: rating.toFixed(1),
      reviewCount: reviewsCount,
    } : undefined,
  }

  return (
    <main style={{ background: '#F8FAFC', color: '#0F172A' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(listingSchema) }} />
      {chrome === 'public' && <Navbar />}
      <section className={chrome === 'app' ? 'px-4 lg:px-8 pt-6 pb-28 lg:pb-10' : 'px-4 pt-8 pb-14'}>
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="rounded-[28px] overflow-hidden" style={{ background: '#0F172A' }}>
            <div className="grid lg:grid-cols-[minmax(0,1fr)_420px]">
              <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-between gap-8">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] mb-3" style={{ color: '#CBD5E1' }}>
                    {kind === 'comercio' ? item.category ?? 'Comercio' : item.type ?? 'Hospedaje'}
                  </p>
                  <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight" style={{ color: '#E2E8F0' }}>{title}</h1>
                  {item.address && <p className="text-base mt-4 max-w-2xl" style={{ color: '#94A3B8' }}>{item.address}</p>}
                </div>
                <div className="flex flex-wrap gap-2">
                  {kind === 'hospedaje' && price && <span className="px-4 py-2 rounded-full text-sm font-black" style={{ background: '#E2E8F0', color: '#0F172A' }}>{price}</span>}
                  {kind === 'comercio' && rating > 0 && <span className="px-4 py-2 rounded-full text-sm font-black" style={{ background: '#FEF3C7', color: '#92400e' }}>★ {rating.toFixed(1)}{reviewsCount > 0 ? ` · ${reviewsCount.toLocaleString('es-AR')} reseñas` : ''}</span>}
                  {item.isVerified && <span className="px-4 py-2 rounded-full text-sm font-black" style={{ background: '#DCFCE7', color: '#166534' }}>Verificado</span>}
                  {item.walkTime && <span className="px-4 py-2 rounded-full text-sm font-black" style={{ background: 'rgba(226,232,240,0.12)', color: '#E2E8F0' }}>{item.walkTime} desde UNNOBA</span>}
                  <span className="px-4 py-2 rounded-full text-sm font-black" style={{ background: statusPill.bg, color: statusPill.tone }}>{statusPill.label}</span>
                  {freshness && <span className="px-4 py-2 rounded-full text-sm font-black" style={{ background: 'rgba(226,232,240,0.12)', color: '#E2E8F0' }}>Actualizado {freshness}</span>}
                </div>
              </div>
              <div className="min-h-[260px] lg:min-h-[420px]" style={{ background: 'rgba(226,232,240,0.08)' }}>
                {images[0] ? (
                  <img src={images[0]} alt={title} className="w-full h-full object-cover" />
                ) : (
                  <PublicListingMap lat={lat} lng={lng} title={title} subtitle={item.address} />
                )}
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-[minmax(0,1fr)_340px] gap-6 items-start">
            <div className="space-y-6">
              <section className="rounded-[24px] p-5 sm:p-6" style={{ background: '#fff', border: '1px solid rgba(15,23,42,0.08)' }}>
                <h2 className="text-xl font-black mb-4">Información</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  <DetailRow label="Dirección" value={item.address} />
                  <DetailRow label="Categoría" value={kind === 'comercio' ? item.category ?? 'Comercio' : item.type ?? 'Hospedaje'} />
                  <DetailRow label="Teléfono" value={item.phone} />
                  {kind === 'hospedaje' && <DetailRow label="Precio" value={price} />}
                  {kind === 'hospedaje' && <DetailRow label="Capacidad" value={item.capacity} />}
                  {kind === 'comercio' && rating > 0 && <DetailRow label="Calificación" value={`${rating.toFixed(1)}${reviewsCount > 0 ? ` sobre ${reviewsCount.toLocaleString('es-AR')} reseñas` : ''}`} />}
                  <DetailRow label="Estado del dato" value={statusPill.label} />
                  <DetailRow label="Última actualización" value={freshness ?? 'Sin fecha visible'} />
                  <DetailRow label="Reportes públicos" value={`${pendingReports} pendientes${resolvedReports ? ` · ${resolvedReports} resueltos` : ''}`} />
                </div>
                {item.description ? (
                  <p className="text-base leading-relaxed mt-5" style={{ color: 'rgba(15,23,42,0.68)' }}>{item.description}</p>
                ) : (
                  <p className="text-sm leading-relaxed mt-5" style={{ color: 'rgba(15,23,42,0.55)' }}>
                    Esta ficha reúne los datos disponibles para contactar o ubicar el lugar. Si encontrás información desactualizada, podés reportarla para que la revisemos.
                  </p>
                )}
              </section>

              <section className="rounded-[24px] overflow-hidden" style={{ background: '#fff', border: '1px solid rgba(15,23,42,0.08)' }}>
                <div className="p-5 sm:p-6 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: 'rgba(15,23,42,0.42)' }}>Ubicación</p>
                    <h2 className="text-xl font-black">Mapa</h2>
                  </div>
                  <a href={mapUrl} target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-xl text-xs font-bold" style={{ background: '#0F172A', color: '#fff' }}>Abrir en Maps</a>
                </div>
                <div className="h-[320px]">
                  <PublicListingMap lat={lat} lng={lng} title={title} subtitle={item.address} />
                </div>
              </section>

              {images.length > 1 && (
                <section className="rounded-[24px] p-5 sm:p-6" style={{ background: '#fff', border: '1px solid rgba(15,23,42,0.08)' }}>
                  <h2 className="text-xl font-black mb-4">Fotos</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {images.slice(1).map((url: string) => <img key={url} src={url} alt="" className="aspect-video object-cover rounded-2xl" />)}
                  </div>
                </section>
              )}

              <section className="rounded-[24px] p-5 sm:p-6" style={{ background: '#fff', border: '1px solid rgba(15,23,42,0.08)' }}>
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] mb-2" style={{ color: 'rgba(15,23,42,0.42)' }}>Seguí explorando</p>
                <div className="grid sm:grid-cols-3 gap-3">
                  <Link href={kind === 'comercio' ? '/app/comercios' : '/app/hospedajes'} className="rounded-2xl p-4 text-sm font-bold" style={{ background: '#F8FAFC', color: '#0F172A', textDecoration: 'none' }}>
                    Más {kind === 'comercio' ? 'comercios' : 'hospedajes'}
                  </Link>
                  <Link href="/app/mapa" className="rounded-2xl p-4 text-sm font-bold" style={{ background: '#F8FAFC', color: '#0F172A', textDecoration: 'none' }}>
                    Ver en mapa
                  </Link>
                  <Link href="/pergamino/comercios-cerca-unnoba" className="rounded-2xl p-4 text-sm font-bold" style={{ background: '#F8FAFC', color: '#0F172A', textDecoration: 'none' }}>
                    Guías de Pergamino
                  </Link>
                </div>
              </section>
            </div>

            <aside className="rounded-[24px] p-5 h-fit space-y-3 sticky top-20" style={{ background: '#fff', border: '1px solid rgba(15,23,42,0.08)' }}>
              {phoneDigits && <a href={`tel:${phoneDigits}`} className="block text-center rounded-xl px-4 py-3 text-sm font-bold" style={{ background: '#0F172A', color: '#FFFFFF' }}>Llamar</a>}
              {kind === 'hospedaje' && phoneDigits && <a href={`https://wa.me/${phoneDigits.startsWith('54') ? phoneDigits : `54${phoneDigits}`}?text=${encodeURIComponent('Hola, vi tu hospedaje en Recién Llegué. Quería consultar disponibilidad, precio y requisitos.')}`} target="_blank" rel="noopener noreferrer" className="block text-center rounded-xl px-4 py-3 text-sm font-bold" style={{ background: '#DCFCE7', color: '#166534' }}>WhatsApp</a>}
              <a href={mapUrl} target="_blank" rel="noopener noreferrer" className="block text-center rounded-xl px-4 py-3 text-sm font-bold" style={{ background: 'rgba(15,23,42,0.06)', color: '#0F172A' }}>Ver ubicación</a>
              <a href={ownershipHref} className="block text-center rounded-xl px-4 py-3 text-sm font-bold" style={{ background: '#FEF3C7', color: '#92400e' }}>{kind === 'comercio' ? '¿Es tu comercio? Reclamalo' : '¿Ofrecés hospedaje? Sumalo'}</a>
              <PublicShareButton title={title} text="Mirá este detalle en Recién Llegué" url={publicPath} />
              <Link href={backHref} className="block text-center rounded-xl px-4 py-3 text-sm font-bold" style={{ color: 'rgba(15,23,42,0.62)' }}>Ver más en la app</Link>
              <ReportListingIssue collection={kind === 'comercio' ? 'comercios' : 'hospedajes'} recordId={item.id} />
            </aside>
          </div>
        </div>
      </section>
      {chrome === 'public' && <Footer />}
    </main>
  )
}
