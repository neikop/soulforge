import type { MapRegion, MapRow, MapZoneData } from 'services/map'

import { MAP_ZONES, WORLD_SURFACES } from './data.ts'

export function projectWorldRow(row: MapRow, zone: string): MapRow {
  const surface = WORLD_SURFACES.find((surface) => surface.key === zone)
  const source = MAP_ZONES.find((source) => source.key === zone)
  if (!surface || !source) return row
  const scale = surface.size / source.canvas
  return {
    ...row,
    zone,
    x: surface.x + row.x * scale,
    y: surface.y + row.y * scale,
    f: row.f && {
      ...row.f,
      pts: row.f.pts?.map(([x, y]) => [surface.x + x * scale, surface.y + y * scale]),
    },
  }
}

export function worldLocation(point: { x: number; y: number }) {
  const surface = WORLD_SURFACES.find(
    (surface) =>
      point.x >= surface.x &&
      point.x <= surface.x + surface.size &&
      point.y >= surface.y &&
      point.y <= surface.y + surface.size,
  )
  const source = MAP_ZONES.find((source) => source.key === surface?.key)
  if (!surface || !source) return null
  const scale = source.canvas / surface.size
  return { x: (point.x - surface.x) * scale, y: (point.y - surface.y) * scale, zone: source.key }
}

export function composeWorldMap(zones: MapZoneData[]): MapZoneData {
  const world: MapZoneData = { zone: 'world', areas: [], regions: [], rows: [] }
  for (const surface of WORLD_SURFACES) {
    const data = zones.find((data) => data.zone === surface.key)
    const source = MAP_ZONES.find((source) => source.key === surface.key)
    if (!data || !source) throw new Error(`Missing map data for ${surface.label}.`)
    const scale = surface.size / source.canvas
    const areaOffset = world.areas.length
    world.areas.push(...data.areas.map((area) => `${surface.label} · ${area}`))
    world.rows.push(
      ...data.rows.map((row) => ({
        ...projectWorldRow(row, data.zone),
        a: row.a === undefined ? undefined : row.a + areaOffset,
      })),
    )
    world.regions.push(
      ...data.regions.map((region): MapRegion => ({
        ...region,
        key: `${data.zone}:${region.key}`,
        label: [surface.x + region.label[0] * scale, surface.y + region.label[1] * scale],
        rings: region.rings.map((ring) =>
          ring.map(([x, y]): [number, number] => [surface.x + x * scale, surface.y + y * scale]),
        ),
      })),
    )
  }
  return world
}
