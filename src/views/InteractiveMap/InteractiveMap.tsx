import type { MapRow } from 'services/map'

import { Box, Button, Flex, Grid, Link, Skeleton, Stack, Text } from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import { PageHeader } from 'components/layouts'
import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { fetchMapBoot, fetchMapZone } from 'services/map'

import { isZoneKey, MAP_VIEWS, rowLayer, rowName, WORLD_SURFACES } from './data'
import MapCanvas, { type MapCanvasHandle } from './MapCanvas'
import MapDetails from './MapDetails'
import { isPetHighlighted, parseCoordinates, petKey } from './mapLogic'
import MapSidebar from './MapSidebar'
import { useMapProgress } from './useMapProgress'
import { composeWorldMap, projectWorldRow, worldLocation } from './worldMap'

export default function InteractiveMap() {
  const [params, setParams] = useSearchParams()
  const requestedZone = params.get('zone')
  const zoneKey = isZoneKey(requestedZone) ? requestedZone : 'world'
  const zone = MAP_VIEWS.find((zone) => zone.key === zoneKey) || MAP_VIEWS[0]
  const progress = useMapProgress()
  const { preferences } = progress
  const data = useQuery({
    queryKey: ['map', 'zone', zoneKey],
    queryFn: async ({ signal }) =>
      zoneKey === 'world'
        ? composeWorldMap(await Promise.all(WORLD_SURFACES.map((surface) => fetchMapZone(surface.key, signal))))
        : fetchMapZone(zoneKey, signal),
    staleTime: Infinity,
  })
  const boot = useQuery({
    queryKey: ['map', 'boot'],
    queryFn: ({ signal }) => fetchMapBoot(signal),
    staleTime: Infinity,
  })
  const [query, setQuery] = useState('')
  const [selection, setSelection] = useState<{ groupIds: string[]; pin: string; zone: string }>({
    groupIds: [],
    pin: '',
    zone: zoneKey,
  })
  const [isExpanded, setExpanded] = useState(false)
  const canvas = useRef<MapCanvasHandle>(null)
  const expandTrigger = useRef<HTMLElement | null>(null)
  const pin = selection.zone === zoneKey ? selection.pin : ''
  const layers = params.has('show') ? params.get('show')?.split(',').filter(Boolean) || [] : preferences.layers
  const pins =
    zoneKey === 'world'
      ? preferences.pins
          .filter((pin) => WORLD_SURFACES.some((surface) => surface.key === pin.zone))
          .map((pin) => projectWorldRow(pin, pin.zone))
      : preferences.pins.filter((pin) => pin.zone === zoneKey)
  const rows: MapRow[] = [...(data.data?.rows || []), ...pins]
  const spot = parseCoordinates(pin, zone.canvas)
  const row: MapRow | null =
    rows.find((row) => row.i === pin) || (spot ? { i: 'spot', k: 'pin', n: 'Selected location', ...spot } : null)
  const members = (selection.zone === zoneKey ? selection.groupIds : [])
    .map((id) => rows.find((row) => row.i === id))
    .filter((row): row is MapRow => Boolean(row))
  const selected = row ? [row] : members
  const highlighted = new Set(preferences.highlightedPets)
  const filtered = rows.filter(
    (item) =>
      isPetHighlighted(item, highlighted) ||
      (layers.includes(rowLayer(item)) && !(preferences.hideDone && progress.profile.done.includes(item.i))),
  )
  for (const selectedRow of selected) if (!filtered.some((row) => row.i === selectedRow.i)) filtered.push(selectedRow)
  const normalizedQuery = query.trim().toLocaleLowerCase()
  const results = normalizedQuery
    ? rows
        .filter((row) =>
          `${rowName(row)} ${row.f?.p?.n || ''} ${row.f?.p?.c || ''}`.toLocaleLowerCase().includes(normalizedQuery),
        )
        .slice(0, 24)
    : []
  const coordinates = parseCoordinates(query, zone.canvas)
  const jump = coordinates && (zoneKey !== 'world' || worldLocation(coordinates)) ? coordinates : null
  const petTypes = [
    ...new Set(
      data.data?.rows
        .filter((row) => row.k === 'pets')
        .map((row) => row.f?.p?.n)
        .filter((name): name is string => Boolean(name)),
    ),
  ]
  const doneCount = petTypes.filter((name) => Object.hasOwn(progress.completed, petKey(name))).length

  function close() {
    setSelection({ groupIds: [], pin: '', zone: zoneKey })
  }
  function handleLayers(layers: string[]) {
    progress.updatePreferences((previous) => ({ ...previous, layers }))
    setParams(
      (previous) => {
        const next = new URLSearchParams(previous)
        next.set('show', layers.join(','))
        return next
      },
      { replace: true },
    )
  }
  function handleSelect(row: MapRow, shouldJump = false) {
    setSelection((previous) => ({
      groupIds: shouldJump || previous.zone !== zoneKey ? [] : previous.groupIds,
      pin: row.i === 'spot' ? `${Math.round(row.x)},${Math.round(row.y)}` : row.i,
      zone: zoneKey,
    }))
    if (shouldJump) canvas.current?.jump(row)
  }
  function handleZone(key: string) {
    if (!isZoneKey(key)) return
    setSelection({ groupIds: [], pin: '', zone: key })
    setQuery('')
    setParams((previous) => {
      const next = new URLSearchParams(previous)
      next.set('zone', key)
      return next
    })
  }
  function handleSpot(point: { x: number; y: number }) {
    if (zoneKey === 'world' && !worldLocation(point)) return
    setSelection({ groupIds: [], pin: `${Math.round(point.x)},${Math.round(point.y)}`, zone: zoneKey })
  }
  function toggleExpanded() {
    if (!isExpanded)
      expandTrigger.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
    setExpanded(!isExpanded)
  }
  useEffect(() => {
    if (!isExpanded) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const focus = expandTrigger.current
    return () => {
      document.body.style.overflow = previous
      focus?.focus()
    }
  }, [isExpanded])
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      if (row || members.length) close()
      else if (isExpanded) setExpanded(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  })

  return (
    <Stack gap={4}>
      <PageHeader
        context={zone.name}
        progress={{ label: 'pet types completed', total: petTypes.length, value: doneCount }}
        title="Interactive Map"
      />
      <Grid
        bg="bg.canvas"
        data-testid="map-shell"
        height={isExpanded ? '100dvh' : { base: '940px', lg: 'min(80vh, 960px)' }}
        inset={isExpanded ? 0 : undefined}
        layerStyle="mapShell"
        minH={isExpanded ? 0 : '600px'}
        position={isExpanded ? 'fixed' : 'relative'}
        templateColumns={{ base: 'minmax(0, 1fr)', lg: '304px minmax(0, 1fr)' }}
        templateRows={{ base: 'minmax(0, 1fr) auto', lg: 'minmax(0, 1fr)' }}
        width={isExpanded ? '100vw' : 'full'}
        zIndex={isExpanded ? 'modal' : undefined}
      >
        <Box
          borderRightWidth={{ base: 0, lg: '1px' }}
          borderTopWidth={{ base: '1px', lg: 0 }}
          gridColumn={1}
          gridRow={{ base: 2, lg: 1 }}
          maxH={{ base: isExpanded ? '28dvh' : '340px', lg: 'none' }}
          minH={0}
        >
          <MapSidebar
            canJump={Boolean(jump)}
            layers={layers}
            onJump={() => {
              if (jump) {
                handleSpot(jump)
                canvas.current?.jump(jump)
              }
            }}
            onLayers={handleLayers}
            onQuery={setQuery}
            onSelect={(row) => {
              handleSelect(row, true)
              if (!layers.includes(rowLayer(row))) handleLayers([...layers, rowLayer(row)])
            }}
            onZone={handleZone}
            pets={boot.data?.pets}
            progress={progress}
            query={query}
            results={results}
            rows={rows}
            zone={zoneKey}
          />
        </Box>
        <Box display="grid" gridColumn={{ base: 1, lg: 2 }} gridRow={1} minH={0} minW={0}>
          {data.isPending ? (
            <Skeleton aria-label="Loading map" height="full" minH="360px" />
          ) : data.isError ? (
            <Stack align="center" justify="center" p={6} role="alert">
              <Text>Map could not be loaded.</Text>
              <Button onClick={() => void data.refetch()}>Try again</Button>
            </Stack>
          ) : (
            <MapCanvas
              areaNames={preferences.areaNames}
              borders={preferences.borders}
              completed={progress.completed}
              data={data.data}
              done={progress.profile.done}
              hidePetsDone={preferences.hidePetsDone}
              highlightedPets={preferences.highlightedPets}
              isExpanded={isExpanded}
              key={zoneKey}
              names={preferences.names}
              onClose={close}
              onCluster={(rows) => {
                setSelection({
                  groupIds: rows.length > 1 ? rows.map((row) => row.i) : [],
                  pin: rows.length === 1 ? rows[0]?.i || '' : '',
                  zone: zoneKey,
                })
              }}
              onExpand={toggleExpanded}
              onSpot={handleSpot}
              ref={canvas}
              rows={filtered}
              selected={selected}
              zone={zone}
            >
              <MapDetails
                boot={boot.data}
                data={data.data}
                members={members}
                onBack={() => setSelection((previous) => ({ ...previous, pin: '' }))}
                onClose={close}
                onRemovePin={(row) => {
                  progress.updatePreferences((previous) => ({
                    ...previous,
                    pins: previous.pins.filter((pin) => pin.i !== row.i),
                  }))
                  close()
                }}
                onSavePin={(row) => {
                  const location = zoneKey === 'world' ? worldLocation(row) : { x: row.x, y: row.y, zone: zoneKey }
                  if (!location) return
                  const saved = {
                    ...row,
                    ...location,
                    i: `pin:${crypto.randomUUID()}`,
                    k: 'pin' as const,
                    n: 'My pin',
                  }
                  progress.updatePreferences((previous) => ({ ...previous, pins: [...previous.pins, saved] }))
                  handleLayers([...new Set([...layers, 'pin'])])
                  handleSelect(saved)
                }}
                onSelect={handleSelect}
                progress={progress}
                row={row}
              />
            </MapCanvas>
          )}
        </Box>
      </Grid>
      <Flex flexWrap="wrap" gap={2} justify="space-between">
        <Text color="fg.muted" textStyle="bodyCompact">
          Snapshot: 1 Nov 2026 · Saved in this browser · Game content may change.
        </Text>
        <Link color="primary.fg" href="/map/source.json" rel="noreferrer" target="_blank" textStyle="bodyCompact">
          Data & asset sources ↗
        </Link>
      </Flex>
      <Text color="fg.muted" textStyle="bodyCompact">
        Map data adapted from{' '}
        <Link
          color="primary.fg"
          href="https://senseos.gg/wiki/aion-2/interactive-map/"
          rel="noreferrer"
          target="_blank"
        >
          SenseOS
        </Link>
        ,{' '}
        <Link
          color="primary.fg"
          href="https://github.com/aion2-interactive-map/aion2-interactive-map"
          rel="noreferrer"
          target="_blank"
        >
          Yihao Liu / aion2-interactive-map
        </Link>{' '}
        and{' '}
        <Link color="primary.fg" href="https://github.com/jonboy648/aion2-companion" rel="noreferrer" target="_blank">
          aion2-companion
        </Link>{' '}
        (CC BY-NC 4.0). Boss/spawn data: SkeeveAN. Tiles/portraits: MetaBot.GG; game art © NC. Independent map renderer;
        not affiliated with NC.
      </Text>
    </Stack>
  )
}
