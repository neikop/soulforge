import type { MapRow } from 'services/map'

export type Camera = { x: number; y: number; zoom: number }
export type Viewport = { height: number; width: number }
export type MapCluster = { id: string; rows: MapRow[]; x: number; y: number }
export type MapMarkerState = 'active' | 'done' | 'highlight' | 'idle'
export const MIN_ZOOM = 0.5
export const MAX_ZOOM = 10
export const MAP_RENDER_MARGIN = 256
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
  maxZoom = MAX_ZOOM,
): Camera {
  const anchor = toCanvas(x, y, camera, viewport, canvas)
  const zoom = clamp(camera.zoom * factor, MIN_ZOOM, maxZoom)
  const scale = cameraScale({ ...camera, zoom }, viewport, canvas)
  return {
    x: clamp(anchor.x - (x - viewport.width / 2) / scale, 0, canvas),
    y: clamp(anchor.y - (y - viewport.height / 2) / scale, 0, canvas),
    zoom,
  }
}

export function clusterRows(
  rows: MapRow[],
  scale: number,
  selected = '',
  states?: ReadonlyMap<string, MapMarkerState>,
): MapCluster[] {
  const groups = new Map<string, MapRow[]>()
  for (const row of rows) {
    const id =
      row.i === selected
        ? `selected:${row.i}`
        : `${Math.floor((row.x * scale) / 38)}:${Math.floor((row.y * scale) / 38)}:${states?.get(row.i) || 'idle'}`
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

export function isPointVisible(
  x: number,
  y: number,
  camera: Camera,
  viewport: Viewport,
  canvas: number,
  margin = MAP_RENDER_MARGIN,
) {
  const point = toScreen(x, y, camera, viewport, canvas)
  return (
    point.x >= -margin &&
    point.x <= viewport.width + margin &&
    point.y >= -margin &&
    point.y <= viewport.height + margin
  )
}

// Keep moving the mounted scene until its buffered coverage or cluster scale needs refreshing.
export function needsCameraRender(current: Camera, rendered: Camera, viewport: Viewport, canvas: number) {
  if (current === rendered) return false
  const ratio = current.zoom / rendered.zoom
  if (ratio < 0.875 || ratio > 1.125) return true
  const topLeft = toCanvas(-80, -80, current, viewport, canvas)
  const bottomRight = toCanvas(viewport.width + 80, viewport.height + 80, current, viewport, canvas)
  return (
    !isPointVisible(topLeft.x, topLeft.y, rendered, viewport, canvas) ||
    !isPointVisible(bottomRight.x, bottomRight.y, rendered, viewport, canvas)
  )
}

export function clusterProgress(rows: MapRow[], completed: Record<string, string>) {
  const pets = rows.filter((row) => row.k === 'pets' && row.f?.p)
  const done = pets.filter((row) => Object.hasOwn(completed, petKey(row.f?.p?.n || ''))).length
  return { done, total: pets.length, hidden: pets.length === rows.length && pets.length > 0 && done === pets.length }
}

export function isPetHighlighted(row: MapRow, highlighted: ReadonlySet<string>) {
  return row.k === 'pets' && Boolean(row.f?.p && highlighted.has(petKey(row.f.p.n)))
}

type MarkerContext = {
  completed: Record<string, string>
  done: ReadonlySet<string>
  highlighted: ReadonlySet<string>
  selected: ReadonlySet<string>
}

export function markerState(row: MapRow, context: MarkerContext): MapMarkerState {
  if (isPetHighlighted(row, context.highlighted)) return 'highlight'
  const pet = row.k === 'pets' ? row.f?.p : undefined
  if (pet ? Object.hasOwn(context.completed, petKey(pet.n)) : context.done.has(row.i)) return 'done'
  if (context.selected.has(row.i)) return 'active'
  return 'idle'
}

export function parseCoordinates(query: string, canvas: number) {
  const match = query.trim().match(/^(\d+(?:\.\d+)?)\s*[, ]\s*(\d+(?:\.\d+)?)$/)
  if (!match) return null
  const x = Number(match[1]),
    y = Number(match[2])
  return x <= canvas && y <= canvas ? { x, y } : null
}

export function visibleSpawns(rows: MapRow[], selected: MapRow[], highlighted: ReadonlySet<string>) {
  const points = new Map<string, { state: 'active' | 'highlight'; x: number; y: number }>()
  for (const row of [...selected, ...rows.filter((row) => isPetHighlighted(row, highlighted))]) {
    const state = isPetHighlighted(row, highlighted) ? 'highlight' : 'active'
    for (const point of row.f?.pts || []) {
      if (Number.isFinite(point[0]) && Number.isFinite(point[1])) {
        const key = `${point[0]}:${point[1]}`
        if (points.get(key)?.state !== 'highlight') points.set(key, { x: point[0], y: point[1], state })
      }
    }
  }
  return [...points.values()]
}
