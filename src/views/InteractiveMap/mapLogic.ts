import type { MapRow } from 'services/map'

export type Camera = { x: number; y: number; zoom: number }
export type Viewport = { height: number; width: number }
export type MapCluster = { id: string; rows: MapRow[]; x: number; y: number }
export const MIN_ZOOM = 0.5
export const MAX_ZOOM = 10
export const petKey = (name: string) => name.normalize('NFKC').trim().replace(/\s+/gu, ' ').toLocaleLowerCase('en-US')
export const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

export function cameraScale(camera: Camera, viewport: Viewport, canvas: number) {
  return Math.max(0.001, Math.min((viewport.width - 48) / canvas, (viewport.height - 48) / canvas)) * camera.zoom
}

export function toScreen(x: number, y: number, camera: Camera, viewport: Viewport, canvas: number) {
  const scale = cameraScale(camera, viewport, canvas)
  return { x: viewport.width / 2 + (x - camera.x) * scale, y: viewport.height / 2 + (y - camera.y) * scale }
}

export function toCanvas(x: number, y: number, camera: Camera, viewport: Viewport, canvas: number) {
  const scale = cameraScale(camera, viewport, canvas)
  return { x: camera.x + (x - viewport.width / 2) / scale, y: camera.y + (y - viewport.height / 2) / scale }
}

export function zoomCamera(
  camera: Camera,
  factor: number,
  x: number,
  y: number,
  viewport: Viewport,
  canvas: number,
): Camera {
  const anchor = toCanvas(x, y, camera, viewport, canvas)
  const zoom = clamp(camera.zoom * factor, MIN_ZOOM, MAX_ZOOM)
  const scale = cameraScale({ ...camera, zoom }, viewport, canvas)
  return {
    x: clamp(anchor.x - (x - viewport.width / 2) / scale, 0, canvas),
    y: clamp(anchor.y - (y - viewport.height / 2) / scale, 0, canvas),
    zoom,
  }
}

export function clusterRows(
  rows: MapRow[],
  camera: Camera,
  viewport: Viewport,
  canvas: number,
  selected = '',
): MapCluster[] {
  const scale = cameraScale(camera, viewport, canvas)
  const margin = 80 / scale
  const worldLeft = camera.x - viewport.width / 2 / scale - margin
  const worldRight = camera.x + viewport.width / 2 / scale + margin
  const worldTop = camera.y - viewport.height / 2 / scale - margin
  const worldBottom = camera.y + viewport.height / 2 / scale + margin
  const groups = new Map<string, MapRow[]>()
  for (const row of rows) {
    if (row.x < worldLeft || row.x > worldRight || row.y < worldTop || row.y > worldBottom) continue
    const id =
      row.i === selected
        ? `selected:${row.i}`
        : `${Math.floor((row.x * scale) / 38)}:${Math.floor((row.y * scale) / 38)}`
    const members = groups.get(id)
    if (members) members.push(row)
    else groups.set(id, [row])
  }
  return [...groups].map(([id, members]) => ({
    id,
    rows: members,
    x: members.reduce((sum, row) => sum + row.x, 0) / members.length,
    y: members.reduce((sum, row) => sum + row.y, 0) / members.length,
  }))
}

export function clusterProgress(rows: MapRow[], completed: Record<string, string>) {
  const pets = rows.filter((row) => row.k === 'pets' && row.f?.p)
  const done = pets.filter((row) => Object.hasOwn(completed, petKey(row.f?.p?.n || ''))).length
  return { done, total: pets.length, hidden: pets.length === rows.length && pets.length > 0 && done === pets.length }
}

export function parseCoordinates(query: string, canvas: number) {
  const match = query.trim().match(/^(\d+(?:\.\d+)?)\s*[, ]\s*(\d+(?:\.\d+)?)$/)
  if (!match) return null
  const x = Number(match[1]),
    y = Number(match[2])
  return x <= canvas && y <= canvas ? { x, y } : null
}

export function selectedSpawns(rows: MapRow[]) {
  const points = new Map<string, [number, number]>()
  for (const row of rows)
    for (const point of row.f?.pts || []) {
      if (Number.isFinite(point[0]) && Number.isFinite(point[1])) points.set(`${point[0]}:${point[1]}`, point)
    }
  return [...points.values()]
}
