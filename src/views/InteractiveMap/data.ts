import type { MapRow } from 'services/map'

export const MAP_ZONES = [
  { key: 'verteron', name: 'Verteron', faction: 'Elyos', canvas: 8192, image: true },
  { key: 'poeta', name: 'Poeta', faction: 'Elyos', canvas: 4096, image: false },
  { key: 'altgard', name: 'Altgard', faction: 'Asmodian', canvas: 8192, image: true },
  { key: 'ishalgen', name: 'Ishalgen', faction: 'Asmodian', canvas: 5120, image: false },
  { key: 'reshanta-lower', name: 'Chaotic Lower Reshanta', faction: 'Abyss', canvas: 4096, image: true },
] as const

export const WORLD_MAP = {
  key: 'world',
  name: 'World map',
  faction: 'Atreia',
  canvas: 5120,
  image: true,
  maxZoom: 20,
} as const
export const MAP_VIEWS = [WORLD_MAP, ...MAP_ZONES] as const
export type ZoneKey = (typeof MAP_VIEWS)[number]['key']

const WORLD_MAP_SIZE = 2048
const WORLD_SIDE = 2560
const WORLD_HEIGHT = (WORLD_SIDE * Math.sqrt(3)) / 2
const WORLD_TOP = (WORLD_MAP.canvas - WORLD_MAP_SIZE - WORLD_HEIGHT) / 2
const WORLD_LEFT = (WORLD_MAP.canvas - WORLD_MAP_SIZE - WORLD_SIDE) / 2

export const WORLD_SURFACES = [
  { key: 'reshanta-lower', label: 'Chaotic Abyss', x: WORLD_LEFT + WORLD_SIDE / 2, y: WORLD_TOP },
  { key: 'verteron', label: 'Verteron', x: WORLD_LEFT, y: WORLD_TOP + WORLD_HEIGHT },
  { key: 'altgard', label: 'Altgard', x: WORLD_LEFT + WORLD_SIDE, y: WORLD_TOP + WORLD_HEIGHT },
].map((surface) => ({ ...surface, size: WORLD_MAP_SIZE }))
export const PET_LAYERS = ['pets:Feral', 'pets:Nature', 'pets:Trans', 'pets:Intellect']
export const MAP_GROUPS = [
  { key: 'travel', label: 'Travel', kinds: ['kibelisk', 'rift', 'dungeon', 'village'], tone: 'info' },
  { key: 'bosses', label: 'Bosses', kinds: ['fieldBoss', 'abyssBoss', 'elite'], tone: 'error' },
  { key: 'collectibles', label: 'Collectibles', kinds: ['cube', 'trace'], tone: 'warning' },
  { key: 'exploration', label: 'Exploration', kinds: ['seal', 'stronghold', 'battlefield'], tone: 'primary' },
  { key: 'gathering', label: 'Gathering', kinds: ['gather'], tone: 'success' },
  { key: 'pets', label: 'Pets', kinds: ['pets'], tone: 'warning' },
  { key: 'quests', label: 'Quests', kinds: ['quest'], tone: 'primary' },
  { key: 'pins', label: 'My pins', kinds: ['pin'], tone: 'info' },
] as const

export const KIND_LABELS: Record<string, string> = {
  kibelisk: 'Kibelisks',
  rift: 'Spacetime rifts',
  dungeon: 'Dungeon entrances',
  village: 'Villages',
  fieldBoss: 'Field bosses',
  abyssBoss: 'Abyss bosses',
  elite: 'Elite monsters',
  cube: 'Hidden cubes',
  trace: 'Empyrean traces',
  seal: 'Sealed dungeons',
  stronghold: 'Strongholds',
  battlefield: 'Battlefields',
  gather: 'Gathering',
  pets: 'Pets',
  quest: 'Quests',
  pin: 'My pins',
}

export function isZoneKey(key: null | string): key is ZoneKey {
  return MAP_VIEWS.some((zone) => zone.key === key)
}

export function rowName(row: MapRow) {
  return row.n || (row.k === 'trace' && row.f?.no ? `Empyrean trace ${row.f.no}` : KIND_LABELS[row.k] || row.k)
}

export function rowLayer(row: MapRow) {
  return row.k === 'pets' ? `pets:${row.f?.p?.c || 'Feral'}` : row.k === 'gather' ? `gather:${row.n}` : row.k
}

export function rowImage(row: MapRow) {
  if (row.k === 'pets' && row.f?.p) return `/map/pets/${row.f.p.i}`
  if (row.mo) return `/map/monsters/${row.mo}.webp`
  const icon =
    row.k === 'fieldBoss' || row.k === 'abyssBoss'
      ? 'boss'
      : row.k === 'kibelisk'
        ? 'kibelisk-light'
        : row.k === 'gather'
          ? 'gather'
          : row.k === 'quest'
            ? 'quest-hero'
            : row.k === 'pin'
              ? 'pin'
              : row.k
  return `/map/icons/${icon}.webp`
}
