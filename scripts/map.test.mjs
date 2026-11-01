import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'

import { MAP_ZONES, rowImage } from '../src/views/InteractiveMap/data.ts'
import {
  clusterProgress,
  clusterRows,
  parseCoordinates,
  petKey,
  selectedSpawns,
  toCanvas,
  toScreen,
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
  assert.equal(clusterRows([pet('a', 'A'), pet('b', 'B')], camera, viewport, 8192).length, 1)
  assert.equal(clusterRows([pet('a', 'A'), pet('b', 'B')], camera, viewport, 8192, 'a').length, 2)
  assert.deepEqual(parseCoordinates('4096, 4096', 8192), { x: 4096, y: 4096 })
  for (const query of ['-1,2', '8193,2', '1,2,3', 'abc']) assert.equal(parseCoordinates(query, 8192), null)
  assert.deepEqual(
    selectedSpawns([
      {
        f: {
          pts: [
            [1, 2],
            [1, 2],
            [3, 4],
          ],
        },
      },
    ]),
    [
      [1, 2],
      [3, 4],
    ],
  )
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

test('all five snapshots parse and every referenced local portrait/icon exists', async () => {
  let count = 0,
    pets = 0
  for (const zone of MAP_ZONES) {
    const data = JSON.parse(await readFile(new URL(`../public/map/data/${zone.key}.json`, import.meta.url), 'utf8'))
    assert.equal(data.zone, zone.key)
    count += data.rows.length
    pets += data.rows.filter((row) => row.k === 'pets').length
    for (const image of new Set(data.rows.map(rowImage)))
      assert.ok((await readFile(new URL(`../public${image}`, import.meta.url))).length > 0, image)
  }
  assert.equal(count, 8806)
  assert.equal(pets, 428)
})
