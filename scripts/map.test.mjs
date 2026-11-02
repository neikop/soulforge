import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'

import { MAP_ZONES, rowImage, WORLD_MAP, WORLD_SURFACES } from '../src/views/InteractiveMap/data.ts'
import {
  cameraScale,
  clusterProgress,
  clusterRows,
  isPointVisible,
  isPetHighlighted,
  markerState,
  needsCameraRender,
  parseCoordinates,
  petKey,
  toCanvas,
  toScreen,
  visibleSpawns,
  zoomCamera,
} from '../src/views/InteractiveMap/mapLogic.ts'
import {
  defaultPreferences,
  parseMapBackup,
  parsePetProgress,
  parsePreferences,
  readMapProgress,
  serializePetProgress,
} from '../src/views/InteractiveMap/progress.ts'
import { mapTimerStatus } from '../src/views/InteractiveMap/timers.ts'
import { composeWorldMap, projectWorldRow, worldLocation } from '../src/views/InteractiveMap/worldMap.ts'

const pet = (id, name, type = 'Sylphen', x = 4000, y = 4000) => ({
  i: id,
  n: name,
  k: 'pets',
  x,
  y,
  f: { p: { n: type, c: 'Feral', i: 'portrait.webp' } },
})
const progress = (names) =>
  parsePetProgress(JSON.stringify({ version: 1, completed: names.map((name) => ({ name, at: 1 })) }))

test('pet completion follows type across named variants; partial and mixed clusters stay visible', () => {
  const a = pet('a', 'Highland Sylphen'),
    b = pet('b', 'Ellun River Sylphen'),
    c = pet('c', 'Forest Tog', 'Tog')
  const completed = progress(['  SYLPHEN  '])
  assert.deepEqual(clusterProgress([a, b], completed), { done: 2, total: 2, hidden: true })
  assert.deepEqual(clusterProgress([a, c], completed), { done: 1, total: 2, hidden: false })
  assert.equal(clusterProgress([a, { i: 'cube', k: 'cube' }], completed).hidden, false)
  assert.deepEqual(clusterProgress([], completed), { done: 0, total: 0, hidden: false })
  assert.equal(petKey('Ｓylphen\u00a0  King'), petKey('sylphen king'))
})

test('legacy JSON roundtrips and inherited property names cannot imply completed pets', () => {
  const completed = progress(['Sylphen', 'Tog', 'sylphen'])
  assert.equal(Object.keys(completed).length, 2)
  assert.deepEqual(parsePetProgress(serializePetProgress(completed)), completed)
  assert.equal(clusterProgress([pet('x', 'X', 'constructor')], {}).done, 0)
  const unusual = progress(['__proto__', 'constructor'])
  assert.equal(Object.getPrototypeOf(unusual), Object.prototype)
  assert.equal(Object.hasOwn(unusual, '__proto__'), true)
  assert.deepEqual(parsePetProgress(serializePetProgress(unusual)), unusual)
  for (const raw of [
    '{',
    'null',
    '[]',
    '{"version":2,"completed":[]}',
    '{"version":1,"completed":[{"name":"X","at":"1"}]}',
  ])
    assert.throws(() => parsePetProgress(raw))
})

test('unavailable storage permits session progress; corrupt pet data is preserved behind recovery', () => {
  const unavailable = readMapProgress(() => {
    throw new Error('Storage denied')
  })
  assert.equal(unavailable.blockedPets, false)
  assert.match(unavailable.error, /session/)
  const corrupt = readMapProgress((key) => (key.includes('pet-types') ? '{broken' : null))
  assert.equal(corrupt.blockedPets, true)
  assert.match(corrupt.error, /preserved/)
  const empty = readMapProgress(() => null)
  assert.equal(empty.blockedPets, false)
  assert.equal(empty.error, '')
})

test('map backups preserve per-character progress, pins and presets; invalid imports are rejected before mutation', () => {
  const preferences = defaultPreferences()
  preferences.profiles.push({ id: 'alt', name: 'Alt', done: ['trace:1'] })
  preferences.profile = 'alt'
  preferences.pins = [{ i: 'pin:one', k: 'pin', n: 'Farm', x: 4000, y: 3200, zone: 'verteron' }]
  preferences.presets = [{ name: 'Farm', layers: ['pets:Feral'] }]
  preferences.highlightedPets = ['sylphen', 'tog']
  const backup = JSON.stringify({
    format: 'soulforge-map',
    version: 1,
    preferences,
    petProgress: JSON.parse(serializePetProgress(progress(['Sylphen']))),
  })
  const restored = parseMapBackup(backup)
  assert.deepEqual(restored.preferences, preferences)
  assert.equal(restored.preferences.profiles[0].done.length, 0)
  assert.equal(restored.completed.sylphen, 'Sylphen')
  assert.equal(parseMapBackup(serializePetProgress(progress(['Tog']))).preferences, null)
  assert.throws(() => parseMapBackup(backup.replace('"version":1', '"version":2')))
  assert.throws(() =>
    parseMapBackup('{"format":"soulforge-map","version":1,"preferences":{"version":1},"petProgress":{}}'),
  )
  const fallback = parsePreferences(
    JSON.stringify({
      version: 1,
      profile: 'missing',
      profiles: [],
      pins: [...preferences.pins, { ...preferences.pins[0], x: 99999 }],
    }),
  )
  assert.equal(fallback.profile, 'default')
  assert.equal(fallback.pins.length, 1)
  assert.equal(defaultPreferences().profiles[0].done.length, 0)
})

test('camera transforms roundtrip, zoom stays anchored and clamps at 10x', () => {
  const viewport = { width: 1000, height: 700 },
    camera = { x: 4096, y: 4096, zoom: 2 }
  const screen = toScreen(4300, 3800, camera, viewport, 8192)
  const world = toCanvas(screen.x, screen.y, camera, viewport, 8192)
  assert.ok(Math.abs(world.x - 4300) < 1e-8 && Math.abs(world.y - 3800) < 1e-8)
  const next = zoomCamera(camera, 3, 650, 400, viewport, 8192)
  const before = toCanvas(650, 400, camera, viewport, 8192),
    after = toCanvas(650, 400, next, viewport, 8192)
  assert.ok(Math.abs(before.x - after.x) < 1e-8 && Math.abs(before.y - after.y) < 1e-8)
  assert.equal(zoomCamera(camera, 100, 500, 350, viewport, 8192).zoom, 10)
  assert.equal(zoomCamera(camera, 0.001, 500, 350, viewport, 8192).zoom, 0.5)
  const scale = cameraScale(camera, viewport, 8192)
  assert.equal(clusterRows([pet('a', 'A'), pet('b', 'B')], scale).length, 1)
  assert.equal(clusterRows([pet('a', 'A'), pet('b', 'B')], scale, 'a').length, 2)
  assert.deepEqual(parseCoordinates('4096, 4096', 8192), { x: 4096, y: 4096 })
  for (const query of ['-1,2', '8193,2', '1,2,3', 'abc']) assert.equal(parseCoordinates(query, 8192), null)
  assert.deepEqual(
    visibleSpawns(
      [],
      [
        {
          f: {
            pts: [
              [1, 2],
              [1, 2],
              [3, 4],
            ],
          },
        },
      ],
      new Set(),
    ),
    [
      { x: 1, y: 2, state: 'active' },
      { x: 3, y: 4, state: 'active' },
    ],
  )
})

test('marker states preserve highlight and selection priority, and clusters never mix border states', () => {
  const a = pet('a', 'Highland Sylphen'),
    b = pet('b', 'River Sylphen'),
    c = pet('c', 'Tog', 'Tog')
  const cube = { i: 'cube', k: 'cube', x: 4000, y: 4000 }
  const context = { completed: {}, done: new Set(), highlighted: new Set(), selected: new Set() }
  assert.equal(markerState(a, context), 'idle')
  context.selected.add(a.i)
  assert.equal(markerState(a, context), 'active')
  context.completed = progress(['Sylphen'])
  assert.equal(markerState(a, context), 'done')
  assert.equal(markerState(b, context), 'done')
  context.highlighted.add(petKey('SYLPHEN'))
  assert.equal(markerState(a, context), 'highlight')
  assert.equal(markerState(b, context), 'highlight')
  assert.equal(markerState(c, context), 'idle')
  context.done.add(cube.i)
  assert.equal(markerState(cube, context), 'done')
  context.selected.clear()
  const rows = [a, b, c, cube]
  const states = new Map(rows.map((row) => [row.i, markerState(row, context)]))
  const clusters = clusterRows(rows, 1, '', states)
  assert.equal(clusters.length, 3)
  for (const cluster of clusters) assert.equal(new Set(cluster.rows.map((row) => states.get(row.i))).size, 1)
  context.highlighted.clear()
  assert.equal(markerState(a, context), 'done')
  context.completed = {}
  assert.equal(markerState(a, context), 'idle')
})

test('highlighted spawns persist without a selection, merge with active spawns and deduplicate coordinates', () => {
  const a = {
    ...pet('a', 'Highland Sylphen'),
    f: {
      ...pet('a', 'Highland Sylphen').f,
      pts: [
        [1, 2],
        [3, 4],
        [NaN, 1],
      ],
    },
  }
  const b = {
    ...pet('b', 'River Sylphen'),
    f: {
      ...pet('b', 'River Sylphen').f,
      pts: [
        [3, 4],
        [5, 6],
      ],
    },
  }
  const c = {
    ...pet('c', 'Tog', 'Tog'),
    f: {
      ...pet('c', 'Tog', 'Tog').f,
      pts: [
        [1, 2],
        [7, 8],
      ],
    },
  }
  const rows = [a, b, c]
  const highlighted = new Set([petKey('Sylphen')])
  assert.equal(isPetHighlighted(a, highlighted), true)
  assert.equal(isPetHighlighted(b, highlighted), true)
  assert.equal(isPetHighlighted(c, highlighted), false)
  assert.deepEqual(visibleSpawns(rows, [], highlighted), [
    { x: 1, y: 2, state: 'highlight' },
    { x: 3, y: 4, state: 'highlight' },
    { x: 5, y: 6, state: 'highlight' },
  ])
  const active = visibleSpawns(rows, [c], highlighted)
  assert.equal(active.length, 4)
  assert.deepEqual(
    active.find((point) => point.x === 1),
    { x: 1, y: 2, state: 'highlight' },
  )
  assert.deepEqual(
    active.find((point) => point.x === 7),
    { x: 7, y: 8, state: 'active' },
  )
  assert.deepEqual(visibleSpawns(rows, [], new Set()), [])
})

test('old preferences keep progress and default highlights off; highlight backups normalize and validate keys', () => {
  const legacy = { version: 1, profiles: [{ id: 'default', name: 'Main', done: ['cube:1'] }] }
  const parsed = parsePreferences(JSON.stringify(legacy))
  assert.deepEqual(parsed.highlightedPets, [])
  assert.deepEqual(parsed.profiles, legacy.profiles)
  const normalized = parsePreferences(JSON.stringify({ ...legacy, highlightedPets: ['  SYLPHEN ', 'Sylphen', 'Ｔog'] }))
  assert.deepEqual(normalized.highlightedPets, ['sylphen', 'tog'])
  assert.deepEqual(parsePreferences(JSON.stringify(normalized)), normalized)
  for (const highlightedPets of [null, {}, [''], [1], ['Sylphen', false]]) {
    const preferences = { ...legacy, highlightedPets }
    assert.throws(() => parsePreferences(JSON.stringify(preferences)))
    assert.throws(() =>
      parseMapBackup(
        JSON.stringify({
          format: 'soulforge-map',
          version: 1,
          preferences,
          petProgress: { version: 1, completed: [] },
        }),
      ),
    )
  }
})

test('buffered scene covers small pans and refreshes before visible markers leave mounted coverage', () => {
  for (const viewport of [
    { width: 390, height: 700 },
    { width: 1200, height: 800 },
    { width: 3840, height: 2160 },
  ]) {
    for (const zoom of [0.5, 1, 4, 10]) {
      const rendered = { x: 4096, y: 4096, zoom }
      const scale = cameraScale(rendered, viewport, 8192)
      assert.equal(needsCameraRender({ ...rendered }, rendered, viewport, 8192), false)
      assert.equal(needsCameraRender({ ...rendered, x: rendered.x + 90 / scale }, rendered, viewport, 8192), false)
      assert.equal(needsCameraRender({ ...rendered, y: rendered.y - 300 / scale }, rendered, viewport, 8192), true)
      assert.equal(needsCameraRender({ ...rendered, zoom: zoom * 1.2 }, rendered, viewport, 8192), true)
      for (const dx of [-150, 0, 150]) {
        for (const dy of [-150, 0, 150]) {
          const current = { x: rendered.x + dx / scale, y: rendered.y + dy / scale, zoom: zoom * 0.95 }
          if (needsCameraRender(current, rendered, viewport, 8192)) continue
          for (const [x, y] of [
            [-80, -80],
            [viewport.width + 80, viewport.height + 80],
          ]) {
            const point = toCanvas(x, y, current, viewport, 8192)
            assert.equal(isPointVisible(point.x, point.y, rendered, viewport, 8192), true)
          }
        }
      }
    }
  }
})

test('panning never changes cluster membership or centroid at a viewport edge', () => {
  const viewport = { width: 1000, height: 700 }
  const camera = { x: 4096, y: 4096, zoom: 4 }
  const scale = cameraScale(camera, viewport, 8192)
  const edge = toCanvas(-250, 350, camera, viewport, 8192)
  const rows = [pet('a', 'A', 'Sylphen', edge.x, edge.y), pet('b', 'B', 'Tog', edge.x + 1, edge.y)]
  const [cluster] = clusterRows(rows, scale)
  assert.equal(cluster.rows.length, 2)
  assert.equal(cluster.x, edge.x + 0.5)
  assert.equal(isPointVisible(cluster.x, cluster.y, camera, viewport, 8192), true)
  assert.equal(isPointVisible(cluster.x, cluster.y, camera, viewport, 8192, 0), false)
  const panned = { ...camera, x: camera.x + 300 / scale }
  assert.equal(isPointVisible(cluster.x, cluster.y, panned, viewport, 8192), false)
  assert.deepEqual(clusterRows(rows, cameraScale(panned, viewport, 8192)), [cluster])
})

test('timers follow server timezone, midnight windows and Sunday weekly rollover', () => {
  const boot = { clocks: { reset: 'Asia/Seoul', server: { as: 'Asia/Tokyo', nae: 'America/New_York' } } }
  const daily = { minutes: 60, rule: { clock: 'server', type: 'daily', at: ['23:30'] } }
  assert.equal(mapTimerStatus(daily, boot, 'as', Date.parse('2026-11-01T15:00:00Z')).label, 'Live · 30m left')
  assert.equal(mapTimerStatus(daily, boot, 'as', Date.parse('2026-11-01T15:30:00Z')).label, 'Starts in 23h 0m')
  const weekly = { minutes: 30, rule: { clock: 'server', type: 'weekly', days: [0], at: ['21:00'] } }
  assert.equal(mapTimerStatus(weekly, boot, 'as', Date.parse('2026-11-01T12:00:00Z')).isLive, true)
  assert.equal(mapTimerStatus(weekly, boot, 'as', Date.parse('2026-11-01T12:30:00Z')).label, 'Starts in 167h 30m')
  assert.equal(mapTimerStatus(weekly, boot, 'missing', Date.now()), null)
})

test('world layout has equilateral centers with Abyss above Verteron and Altgard', () => {
  const [abyss, verteron, altgard] = WORLD_SURFACES.map((surface) => ({
    key: surface.key,
    x: surface.x + surface.size / 2,
    y: surface.y + surface.size / 2,
  }))
  assert.equal(abyss.key, 'reshanta-lower')
  assert.equal(verteron.key, 'verteron')
  assert.equal(altgard.key, 'altgard')
  assert.ok(abyss.y < verteron.y)
  assert.equal(verteron.y, altgard.y)
  assert.ok(verteron.x < abyss.x && abyss.x < altgard.x)
  const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y)
  assert.ok(Math.abs(distance(abyss, verteron) - distance(verteron, altgard)) < 1e-8)
  assert.ok(Math.abs(distance(abyss, altgard) - distance(verteron, altgard)) < 1e-8)
  assert.equal(worldLocation({ x: 0, y: 0 }), null)
  for (const surface of WORLD_SURFACES) {
    assert.ok(surface.x >= 0 && surface.y >= 0)
    assert.ok(surface.x + surface.size <= WORLD_MAP.canvas && surface.y + surface.size <= WORLD_MAP.canvas)
  }
})

test('world zoom stays anchored at 20x while native zones retain their 10x cap', () => {
  const viewport = { width: 1000, height: 700 }
  const camera = { x: WORLD_MAP.canvas / 2, y: WORLD_MAP.canvas / 2, zoom: 4 }
  const before = toCanvas(650, 400, camera, viewport, WORLD_MAP.canvas)
  const zoomed = zoomCamera(camera, 100, 650, 400, viewport, WORLD_MAP.canvas, WORLD_MAP.maxZoom)
  const after = toCanvas(650, 400, zoomed, viewport, WORLD_MAP.canvas)
  assert.equal(zoomed.zoom, 20)
  assert.ok(Math.abs(before.x - after.x) < 1e-8 && Math.abs(before.y - after.y) < 1e-8)
  assert.equal(zoomCamera(zoomed, 2, 650, 400, viewport, WORLD_MAP.canvas, WORLD_MAP.maxZoom).zoom, 20)
  assert.equal(zoomCamera(camera, 0.001, 650, 400, viewport, WORLD_MAP.canvas, WORLD_MAP.maxZoom).zoom, 0.5)
  for (const surface of WORLD_SURFACES) {
    const source = MAP_ZONES.find((zone) => zone.key === surface.key)
    const native = zoomCamera(camera, 100, 500, 350, viewport, source.canvas)
    assert.equal(native.zoom, 10)
    const displayedSize = cameraScale(zoomed, viewport, WORLD_MAP.canvas) * surface.size
    const nativeSize = cameraScale(native, viewport, source.canvas) * source.canvas
    assert.ok(Math.abs(displayedSize / nativeSize - 0.8) < 1e-8)
  }
})

test('world composition projects markers, spawns and regions without changing IDs or source data', async () => {
  const sources = await Promise.all(
    WORLD_SURFACES.map(async ({ key }) =>
      JSON.parse(await readFile(new URL(`../public/map/data/${key}.json`, import.meta.url), 'utf8')),
    ),
  )
  const original = JSON.stringify(sources)
  const world = composeWorldMap(sources)
  assert.equal(world.rows.length, 8786)
  assert.equal(new Set(world.rows.map((row) => row.i)).size, world.rows.length)
  assert.equal(world.rows.filter((row) => row.k === 'pets').length, 428)
  assert.equal(new Set(world.regions.map((region) => region.key)).size, world.regions.length)
  for (const source of sources) {
    const row = source.rows.find((row) => row.f?.pts?.length)
    assert.ok(row)
    const projected = world.rows.find((candidate) => candidate.i === row.i)
    assert.equal(projected.zone, source.zone)
    assert.deepEqual(projected.f.p, row.f.p)
    assert.equal(projected.f.pts.length, row.f.pts.length)
    const areaRow = source.rows.find((row) => row.a !== undefined)
    const projectedAreaRow = world.rows.find((row) => row.i === areaRow.i)
    assert.ok(world.areas[projectedAreaRow.a].endsWith(source.areas[areaRow.a]))
    const region = source.regions[0]
    const projectedRegion = world.regions.find((candidate) => candidate.key === `${source.zone}:${region.key}`)
    const localLabel = worldLocation({ x: projectedRegion.label[0], y: projectedRegion.label[1] })
    assert.ok(Math.abs(localLabel.x - region.label[0]) < 1e-8)
    assert.ok(Math.abs(localLabel.y - region.label[1]) < 1e-8)
    assert.equal(projectedRegion.rings.length, region.rings.length)
    for (const [point, expected] of [
      [projected, row],
      [
        { x: projected.f.pts[0][0], y: projected.f.pts[0][1] },
        { x: row.f.pts[0][0], y: row.f.pts[0][1] },
      ],
    ]) {
      const local = worldLocation(point)
      assert.equal(local.zone, source.zone)
      assert.ok(Math.abs(local.x - expected.x) < 1e-8 && Math.abs(local.y - expected.y) < 1e-8)
    }
  }
  assert.equal(JSON.stringify(sources), original)
  assert.throws(() => composeWorldMap(sources.slice(1)), /Missing map data/)
})

test('pins roundtrip through the world view using their original zone and storage identifiers', () => {
  const preferences = defaultPreferences()
  for (const surface of WORLD_SURFACES) {
    const pin = { i: `pin:${surface.key}`, k: 'pin', n: 'Farm', x: 500, y: 750, zone: surface.key }
    const projected = projectWorldRow(pin, pin.zone)
    const location = worldLocation(projected)
    assert.equal(projected.i, pin.i)
    assert.equal(location.zone, pin.zone)
    assert.ok(Math.abs(location.x - pin.x) < 1e-8 && Math.abs(location.y - pin.y) < 1e-8)
    preferences.pins.push({ ...pin, ...location })
  }
  const restored = parsePreferences(JSON.stringify(preferences))
  assert.equal(restored.pins.length, 3)
  assert.ok(restored.pins.every((pin) => pin.zone !== 'world'))
})

test('all five snapshots parse and every referenced local portrait/icon exists', async () => {
  const boot = JSON.parse(await readFile(new URL('../public/map/data/boot.json', import.meta.url), 'utf8'))
  const catalog = new Map(boot.pets.map((pet) => [petKey(pet.n), pet]))
  const petTypes = new Set()
  let count = 0,
    pets = 0
  for (const zone of MAP_ZONES) {
    const data = JSON.parse(await readFile(new URL(`../public/map/data/${zone.key}.json`, import.meta.url), 'utf8'))
    assert.equal(data.zone, zone.key)
    count += data.rows.length
    pets += data.rows.filter((row) => row.k === 'pets').length
    for (const row of data.rows.filter((row) => row.k === 'pets')) {
      const pet = row.f.p
      petTypes.add(petKey(pet.n))
      assert.deepEqual(catalog.get(petKey(pet.n)), pet, `Portrait catalog: ${pet.n} in ${zone.key}`)
    }
    for (const image of new Set(data.rows.map(rowImage)))
      assert.ok((await readFile(new URL(`../public${image}`, import.meta.url))).length > 0, image)
  }
  assert.equal(count, 8806)
  assert.equal(pets, 428)
  assert.equal(catalog.size, petTypes.size)
  assert.equal(boot.pets.length, petTypes.size)
})
