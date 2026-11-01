import { MAP_ZONES, PET_LAYERS } from './data.ts'
import { petKey } from './mapLogic.ts'

export const PET_STORAGE_KEY = 'aion2.senseos.completed-pet-types.v1'
export const MAP_STORAGE_KEY = 'aion2.soulforge.map.v1'
export type MapPreferences = {
  areaNames: boolean
  borders: boolean
  hideDone: boolean
  hidePetsDone: boolean
  layers: string[]
  names: boolean
  pins: { i: string; k: 'pin'; n: string; x: number; y: number; zone: string }[]
  presets: { layers: string[]; name: string }[]
  profile: string
  profiles: { done: string[]; id: string; name: string }[]
  region: string
  version: 1
}

export function defaultPreferences(): MapPreferences {
  return {
    version: 1,
    layers: [...PET_LAYERS],
    hideDone: false,
    hidePetsDone: false,
    names: false,
    areaNames: true,
    borders: false,
    region: 'as',
    profile: 'default',
    profiles: [{ id: 'default', name: 'My character', done: [] }],
    pins: [],
    presets: [],
  }
}

export function readMapProgress(read: (key: string) => null | string) {
  let blockedPets = false,
    completed: Record<string, string> = {},
    error = '',
    preferences = defaultPreferences()
  try {
    preferences = parsePreferences(read(MAP_STORAGE_KEY))
  } catch {
    error = 'Saved map settings could not be read. Existing data is preserved until you make a change.'
  }
  let raw: null | string = null
  try {
    raw = read(PET_STORAGE_KEY)
  } catch {
    error = 'Browser storage is unavailable. Export a backup before leaving; changes last for this session.'
  }
  try {
    completed = parsePetProgress(raw)
  } catch {
    blockedPets = true
    error = 'Saved pet progress could not be read. Import a valid backup to recover it; existing data is preserved.'
  }
  return { preferences, completed, error, blockedPets }
}

export function parsePetProgress(raw: null | string): Record<string, string> {
  if (!raw) return {}
  const data: unknown = JSON.parse(raw)
  if (
    !data ||
    typeof data !== 'object' ||
    !('version' in data) ||
    data.version !== 1 ||
    !('completed' in data) ||
    !Array.isArray(data.completed)
  )
    throw new Error('Invalid pet progress file.')
  const result: Record<string, string> = {}
  for (const entry of data.completed) {
    if (
      !entry ||
      typeof entry !== 'object' ||
      typeof entry.name !== 'string' ||
      !entry.name.trim() ||
      !Number.isFinite(entry.at)
    )
      throw new Error('Invalid pet progress entry.')
    Object.defineProperty(result, petKey(entry.name), {
      value: entry.name.trim(),
      enumerable: true,
      configurable: true,
      writable: true,
    })
  }
  return result
}

export function serializePetProgress(completed: Record<string, string>) {
  return JSON.stringify({ version: 1, completed: Object.values(completed).map((name) => ({ name, at: Date.now() })) })
}

export function parseMapBackup(raw: string) {
  const data: unknown = JSON.parse(raw)
  if (data && typeof data === 'object' && 'format' in data) {
    if (
      data.format !== 'soulforge-map' ||
      !('version' in data) ||
      data.version !== 1 ||
      !('preferences' in data) ||
      !('petProgress' in data)
    )
      throw new Error('Invalid map backup.')
    return {
      preferences: parsePreferences(JSON.stringify(data.preferences)),
      completed: parsePetProgress(JSON.stringify(data.petProgress)),
    }
  }
  return { preferences: null, completed: parsePetProgress(raw) }
}

export function parsePreferences(raw: null | string): MapPreferences {
  const defaults = defaultPreferences()
  if (!raw) return defaults
  const value: unknown = JSON.parse(raw)
  if (!value || typeof value !== 'object' || !('version' in value) || value.version !== 1)
    throw new Error('Invalid map progress file.')
  const data = value as Record<string, unknown>
  for (const key of ['hideDone', 'hidePetsDone', 'names', 'areaNames', 'borders'] as const)
    if (typeof data[key] === 'boolean') defaults[key] = data[key]
  if (Array.isArray(data.layers) && data.layers.every((v) => typeof v === 'string')) defaults.layers = data.layers
  if (typeof data.region === 'string' && ['as', 'eu', 'la', 'nae', 'naw'].includes(data.region))
    defaults.region = data.region
  if (Array.isArray(data.profiles)) {
    const profiles = data.profiles.filter(
      (p): p is MapPreferences['profiles'][number] =>
        p &&
        typeof p === 'object' &&
        typeof p.id === 'string' &&
        Boolean(p.id.trim()) &&
        typeof p.name === 'string' &&
        Boolean(p.name.trim()) &&
        Array.isArray(p.done) &&
        p.done.every((id: unknown) => typeof id === 'string'),
    )
    if (profiles.length) defaults.profiles = profiles
  }
  if (typeof data.profile === 'string' && defaults.profiles.some((p) => p.id === data.profile))
    defaults.profile = data.profile
  if (!defaults.profiles.some((p) => p.id === defaults.profile))
    defaults.profile = defaults.profiles[0]?.id || 'default'
  if (Array.isArray(data.pins))
    defaults.pins = data.pins.filter(
      (p): p is MapPreferences['pins'][number] =>
        p &&
        typeof p === 'object' &&
        typeof p.i === 'string' &&
        p.i.startsWith('pin:') &&
        p.k === 'pin' &&
        typeof p.n === 'string' &&
        typeof p.zone === 'string' &&
        Number.isFinite(p.x) &&
        Number.isFinite(p.y) &&
        p.x >= 0 &&
        p.y >= 0 &&
        MAP_ZONES.some((zone) => zone.key === p.zone && p.x <= zone.canvas && p.y <= zone.canvas),
    )
  if (Array.isArray(data.presets))
    defaults.presets = data.presets.filter(
      (p): p is MapPreferences['presets'][number] =>
        p &&
        typeof p === 'object' &&
        typeof p.name === 'string' &&
        Array.isArray(p.layers) &&
        p.layers.every((l: unknown) => typeof l === 'string'),
    )
  return defaults
}
