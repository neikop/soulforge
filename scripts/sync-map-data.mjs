import { createHash } from 'node:crypto'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { format, resolveConfig } from 'prettier'

const SOURCE = 'https://senseos.gg'
const PAGE = `${SOURCE}/wiki/aion-2/interactive-map/`
const ART = '/art/games/aion-2/map'
const OUTPUT = fileURLToPath(new URL('../public/map/', import.meta.url))
const SNAPSHOT_DATE =
  process.argv.find((argument) => argument.startsWith('--date='))?.slice(7) || new Date().toISOString().slice(0, 10)
if (!/^\d{4}-\d{2}-\d{2}$/.test(SNAPSHOT_DATE)) throw new Error('Use --date=YYYY-MM-DD')
const CONCURRENCY = 8
const RETRIES = 3
const REFRESH_IMAGES = process.argv.includes('--refresh')
const FORMAT = await resolveConfig(fileURLToPath(import.meta.url))
const ZONES = [
  { key: 'verteron', name: 'Verteron', faction: 'Elyos', canvas: 8192, background: 2048 },
  { key: 'poeta', name: 'Poeta', faction: 'Elyos', canvas: 4096, background: null },
  { key: 'altgard', name: 'Altgard', faction: 'Asmodian', canvas: 8192, background: 2048 },
  { key: 'ishalgen', name: 'Ishalgen', faction: 'Asmodian', canvas: 5120, background: null },
  { key: 'reshanta-lower', name: 'Chaotic Lower Reshanta', faction: 'Abyss', canvas: 4096, background: 1125 },
]
const ICONS = [
  'pin',
  'pin-temporary',
  'kibelisk-light',
  'kibelisk-dark',
  'rift',
  'dungeon',
  'dungeon-party',
  'dungeon-quest',
  'village',
  'boss',
  'elite',
  'cube',
  'trace',
  'trace-done',
  'seal',
  'seal-done',
  'stronghold',
  'stronghold-done',
  'battlefield',
  'gather',
  'quest-hero',
  'quest-district',
  'gather-odyle',
  'gather-ore',
  'gather-gems',
  'gather-logs',
  'gather-herbs',
  'gather-vegetables',
  'gather-shellfish',
  'gather-berries',
]
const MATERIALS = [
  'icon_item_gather_herb_l_c_001',
  'icon_item_gather_wood_a_c_001',
  'icon_item_gather_herb_d_c_001',
  'icon_item_gather_herb_d_c_002',
  'icon_gather_food_l_lv1_01c',
  'icon_item_gather_food_l_c_001',
  'icon_item_gather_food_l_c_006',
  'icon_item_gather_gemstone_a_c_003',
  'icon_gather_fruit_l_lv2_01a',
  'icon_item_gather_food_d_c_003',
  'icon_item_gather_od_l_lv2_02a',
  'icon_item_gather_ore_a_c_002',
  'icon_item_gather_food_l_c_003',
  'icon_item_gather_gemstone_a_c_004',
  'icon_item_gather_gemstone_a_c_002',
]

function destination(relative) {
  const target = path.resolve(OUTPUT, relative)
  if (!target.startsWith(path.resolve(OUTPUT) + path.sep)) throw new Error('Invalid map asset path')
  return target
}

function filename(value) {
  if (typeof value !== 'string' || !/^(?:[a-zA-Z0-9_-]+\/)*[a-zA-Z0-9_-]+(?:\.webp)?$/.test(value)) {
    throw new Error(`Invalid asset filename: ${String(value)}`)
  }
  return value
}

function hash(bytes) {
  return createHash('sha256').update(bytes).digest('hex')
}

async function save(relative, bytes) {
  const target = destination(relative)
  await mkdir(path.dirname(target), { recursive: true })
  await writeFile(target, bytes)
  return { file: relative.replaceAll('\\', '/'), bytes: bytes.length, sha256: hash(bytes) }
}

async function saveJson(relative, value) {
  return save(relative, Buffer.from(await format(JSON.stringify(value), { ...FORMAT, parser: 'json' })))
}

async function request(relative, optional = false) {
  const url = new URL(relative, SOURCE).href
  let lastError
  for (let attempt = 0; attempt < RETRIES; attempt++) {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(25_000) })
      if (response.status === 404 && optional) return null
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${url}`)
      return { url, bytes: Buffer.from(await response.arrayBuffer()), type: response.headers.get('content-type') }
    } catch (error) {
      lastError = error
      if (attempt + 1 < RETRIES) await new Promise((resolve) => setTimeout(resolve, 400 * 2 ** attempt))
    }
  }
  throw lastError
}

async function pool(items, run) {
  const result = new Array(items.length)
  let next = 0
  await Promise.all(
    Array.from({ length: Math.min(CONCURRENCY, items.length) }, async () => {
      while (next < items.length) {
        const index = next++
        result[index] = await run(items[index], index)
      }
    }),
  )
  return result
}

async function syncImage(relative) {
  let bytes
  let cached = false
  if (!REFRESH_IMAGES) {
    try {
      bytes = await readFile(destination(relative))
      cached = true
    } catch {
      /* New asset. */
    }
  }
  if (!bytes) {
    const response = await request(`${ART}/${relative}`, true)
    if (!response) return { file: relative, url: `${SOURCE}${ART}/${relative}`, missing: true }
    bytes = response.bytes
  }
  if (bytes.toString('ascii', 0, 4) !== 'RIFF' || bytes.toString('ascii', 8, 12) !== 'WEBP') {
    throw new Error(`Not a WebP image: ${relative}`)
  }
  const record = cached ? { file: relative, bytes: bytes.length, sha256: hash(bytes) } : await save(relative, bytes)
  return { ...record, url: `${SOURCE}${ART}/${relative}` }
}

const records = []
const zoneData = new Map()
await mkdir(OUTPUT, { recursive: true })

for (const zone of ZONES) {
  const response = await request(`/data/aion-2/map/${zone.key}.json`)
  const data = JSON.parse(response.bytes.toString('utf8'))
  if (
    data.zone !== zone.key ||
    !Array.isArray(data.rows) ||
    !Array.isArray(data.regions) ||
    !Array.isArray(data.areas)
  ) {
    throw new Error(`Unexpected map data for ${zone.key}`)
  }
  zoneData.set(zone.key, data)
  records.push({ ...(await saveJson(`data/${zone.key}.json`, data)), url: response.url })
  console.log(`${zone.key}: ${data.rows.length} places, ${data.rows.filter((row) => row.k === 'pets').length} pet rows`)
}

const page = await request(PAGE)
const bootMatch = page.bytes
  .toString('utf8')
  .match(/<script\b[^>]*\bdata-am-boot(?:="[^"]*")?[^>]*>([\s\S]*?)<\/script>/i)
if (!bootMatch) throw new Error('Map boot data was not found')
const boot = JSON.parse(bootMatch[1])
if (!Array.isArray(boot.timers) || !boot.clocks || !boot.tasks) throw new Error('Unexpected map boot data')
records.push({ ...(await saveJson('data/boot.json', boot)), url: `${PAGE}#data-am-boot` })
const drops = await request('/data/aion-2/map/drops.json')
records.push({ ...(await saveJson('data/drops.json', JSON.parse(drops.bytes.toString('utf8')))), url: drops.url })

const assets = new Set([
  ...ICONS.map((name) => `icons/${name}.webp`),
  ...MATERIALS.map((name) => `materials/${name}.webp`),
])
for (const zone of ZONES) {
  if (zone.background) {
    assets.add(`bg/${zone.key}.webp`)
    for (let x = 0; x < 16; x++) for (let y = 0; y < 16; y++) assets.add(`tiles/${zone.key}/4/${x}_${y}.webp`)
  }
  for (const row of zoneData.get(zone.key).rows) {
    if (row.f?.p?.i) assets.add(`pets/${filename(row.f.p.i)}`)
    if (row.mo) assets.add(`monsters/${filename(String(row.mo))}.webp`)
  }
}
console.log(`Syncing ${assets.size} images with ${CONCURRENCY} workers...`)
const images = await pool([...assets].sort(), async (asset, index) => {
  const record = await syncImage(asset)
  if ((index + 1) % 100 === 0) console.log(`${index + 1}/${assets.size} checked`)
  return record
})
records.push(...images.filter((record) => !record.missing))

const missing = images.filter((record) => record.missing)
const manifest = {
  version: 1,
  snapshotDate: SNAPSHOT_DATE,
  source: PAGE,
  description:
    'Static snapshot of SenseOS public AION 2 map data and images. Soulforge implements its own renderer; no SenseOS JavaScript is included.',
  refreshCommand: 'node scripts/sync-map-data.mjs [--refresh] [--date=YYYY-MM-DD]',
  rights: {
    data: 'Places attributed by SenseOS to Yihao Liu (tc-imba) and jonboy648 under CC BY-NC 4.0; preserve attribution, indicate adaptations, non-commercial use only.',
    art: "Map markers, maps, pets and material pictures are NC's. Sharp tiles, monster portraits and drop rates are sourced by SenseOS from MetaBot.GG. No independent license grant for this artwork was verified; not affiliated with NC or MetaBot.GG.",
    software:
      'No SenseOS or upstream application source code is distributed by this snapshot. Upstream aion2-interactive-map /src is separately GPL-3.0.',
    changes:
      'Original map coordinates, identifiers, names and fields retained. JSON formatting changed; data served locally. Soulforge progress is separate from source data.',
  },
  attribution: [
    { name: 'SenseOS AION 2 Interactive Map', url: PAGE },
    {
      name: 'aion2-interactive-map by Yihao Liu (tc-imba)',
      url: 'https://github.com/aion2-interactive-map/aion2-interactive-map',
    },
    { name: 'aion2-companion by jonboy648', url: 'https://github.com/jonboy648/aion2-companion' },
    {
      name: "SkeeveAN's Aion-DPS-Meter (bosses, pet spawns and gates)",
      url: 'https://github.com/SkeeveAN/Aion-DPS-Meter',
    },
    { name: 'MetaBot.GG (tiles, portraits and drop rates)', url: 'https://metabot.gg/en/aion-2/monsters' },
    { name: 'Creative Commons Attribution-NonCommercial 4.0', url: 'https://creativecommons.org/licenses/by-nc/4.0/' },
  ],
  zones: ZONES.map((zone) => ({
    ...zone,
    data: `data/${zone.key}.json`,
    background: zone.background
      ? { file: `bg/${zone.key}.webp`, width: zone.background, height: zone.background }
      : null,
    tiles: zone.background
      ? {
          level: 4,
          grid: 16,
          px: 256,
          base: `tiles/${zone.key}/4`,
          absent: missing
            .filter((asset) => asset.file.startsWith(`tiles/${zone.key}/4/`))
            .map((asset) => asset.file.split('/').at(-1).replace('.webp', '')),
        }
      : null,
    rows: zoneData.get(zone.key).rows.length,
    petRows: zoneData.get(zone.key).rows.filter((row) => row.k === 'pets').length,
  })),
  counts: {
    files: records.length,
    bytes: records.reduce((sum, file) => sum + file.bytes, 0),
    backgrounds: records.filter((file) => file.file.startsWith('bg/')).length,
    tiles: records.filter((file) => file.file.startsWith('tiles/')).length,
    pets: records.filter((file) => file.file.startsWith('pets/')).length,
    monsters: records.filter((file) => file.file.startsWith('monsters/')).length,
    icons: records.filter((file) => file.file.startsWith('icons/')).length,
    materials: records.filter((file) => file.file.startsWith('materials/')).length,
  },
  missing,
  files: records.sort((a, b) => a.file.localeCompare(b.file)),
}
await saveJson('source.json', manifest)
console.log(JSON.stringify({ ...manifest.counts, missing: missing.map((file) => file.file) }, null, 2))
if (missing.some((file) => file.file.startsWith('bg/') || file.file.startsWith('pets/'))) process.exitCode = 1
