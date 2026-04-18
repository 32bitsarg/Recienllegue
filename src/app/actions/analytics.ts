'use server'

import { getAdminDb } from '@/lib/db'

export async function getAnalyticsSnapshot() {
  const db = getAdminDb()

  // Use SQL to bypass collection-level read permissions (requires service key)
  const toRows = (res: any): any[] => {
    if (Array.isArray(res)) return res
    if (Array.isArray(res?.data?.rows)) return res.data.rows
    if (Array.isArray(res?.rows)) return res.rows
    return []
  }

  let events: any[] = []
  let pvs: any[]    = []
  let locs: any[]   = []

  const sqlRead = async (collection: string, limit: number) => {
    // Strategy 1: _records table with collection filter
    try {
      const r = await (db as any).sql.query(
        `SELECT id, data, created_at FROM _records WHERE collection = '${collection}' ORDER BY created_at DESC LIMIT ${limit}`
      )
      const rows = toRows(r)
      if (rows.length > 0) return rows.map((row: any) => ({ id: row.id, createdAt: row.created_at, ...row.data }))
    } catch (_) {}

    // Strategy 2: per-collection table
    try {
      const r = await (db as any).sql.query(
        `SELECT id, data, created_at FROM ${collection} ORDER BY created_at DESC LIMIT ${limit}`
      )
      const rows = toRows(r)
      if (rows.length > 0) return rows.map((row: any) => ({ id: row.id, createdAt: row.created_at, ...row.data }))
    } catch (_) {}

    // Strategy 3: collection API
    try {
      const r = await db.from(collection).latest().limit(limit).get()
      return toRows(r)
    } catch (_) {}

    return []
  }

  events = await sqlRead('user_events', 2000)
  pvs    = await sqlRead('page_views', 2000)
  locs   = await sqlRead('user_locations', 500)

  // Resolver nombres de entidades clickeadas
  const entityNames: Record<string, string> = {}
  try {
    const clickEvents = events.filter((e: any) => e.eventType === 'click_item' && e.entityId)
    const uniqueIds = [...new Set(clickEvents.map((e: any) => e.entityId as string))]

    if (uniqueIds.length > 0) {
      const idList = uniqueIds.map(id => `'${id.replace(/'/g, '')}'`).join(',')

      // Intentar hospedajes
      const rH = await (db as any).sql.query(
        `SELECT id, data->>'name' as name FROM _records WHERE collection = 'hospedajes' AND id IN (${idList}) LIMIT 100`
      ).catch(() => null)
      toRows(rH).forEach((row: any) => { if (row.id && row.name) entityNames[row.id] = row.name })

      // Intentar comercios
      const rC = await (db as any).sql.query(
        `SELECT id, data->>'name' as name FROM _records WHERE collection = 'comercios' AND id IN (${idList}) LIMIT 100`
      ).catch(() => null)
      toRows(rC).forEach((row: any) => { if (row.id && row.name) entityNames[row.id] = row.name })
    }
  } catch (_) {}

  return {
    events,
    pvs,
    locs,
    entityNames,
    _debug: {
      eventsCount: events.length,
      pvsCount: pvs.length,
      locsCount: locs.length,
    }
  }
}
