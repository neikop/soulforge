import { apiClient } from './client'

export type MapRow = {
  a?: number
  c?: string[]
  ev?: { text: string; until?: string }[]
  f?: {
    e?: string
    h?: string
    mon?: string
    no?: number
    npc?: number
    p?: { c: string; i: string; n: string }
    pts?: [number, number][]
    q?: string
    s?: string
    t?: string
    ti?: string
  }
  i: string
  k: string
  l?: number
  mo?: string
  n?: string
  t?: string
  x: number
  y: number
}

export type MapRegion = {
  instance?: boolean
  key: string
  label: [number, number]
  name: string
  outline?: boolean
  rings: [number, number][][]
}

export type MapZoneData = { areas: string[]; regions: MapRegion[]; rows: MapRow[]; zone: string }
export type MapTimer = {
  id: string
  minutes: number
  name: string
  portal?: number
  rule: { at: string[]; clock: string; days?: number[]; type: 'daily' | 'weekly' }
}
export type MapBoot = {
  clocks: { reset: string; server: Record<string, string> }
  tasks: Record<string, string>
  timers: MapTimer[]
}
export type MapDrops = { items: Record<string, [string, string]>; npcs: Record<string, [number, number][]> }

function isMapRow(value: unknown): value is MapRow {
  if (!value || typeof value !== 'object') return false
  const row = value as Record<string, unknown>
  return typeof row.i === 'string' && typeof row.k === 'string' && Number.isFinite(row.x) && Number.isFinite(row.y)
}

export async function fetchMapZone(zone: string, signal?: AbortSignal): Promise<MapZoneData> {
  if (!/^[a-z-]+$/.test(zone)) throw new Error('Unknown map zone')
  const { data } = await apiClient.get<unknown>(`/map/data/${zone}.json`, { baseURL: '/', signal })
  if (!data || typeof data !== 'object') throw new Error('Invalid map data.')
  const map = data as Record<string, unknown>
  if (
    map.zone !== zone ||
    !Array.isArray(map.rows) ||
    !map.rows.every(isMapRow) ||
    !Array.isArray(map.regions) ||
    !Array.isArray(map.areas)
  ) {
    throw new Error('Invalid map data.')
  }
  return map as MapZoneData
}

export async function fetchMapBoot(signal?: AbortSignal): Promise<MapBoot> {
  const { data } = await apiClient.get<MapBoot>('/map/data/boot.json', { baseURL: '/', signal })
  return data
}

export async function fetchMapDrops(signal?: AbortSignal): Promise<MapDrops> {
  const { data } = await apiClient.get<MapDrops>('/map/data/drops.json', { baseURL: '/', signal })
  return data
}
