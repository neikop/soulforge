import type { MapRow, MapZoneData } from 'services/map'

import { Box, Button, chakra, HStack, Image, Popover, Stack, Text } from '@chakra-ui/react'
import { forwardRef, type ReactNode, useImperativeHandle, useMemo } from 'react'
import { FiCheck, FiMaximize, FiMinimize, FiMinus, FiPlus, FiStar, FiTarget } from 'react-icons/fi'

import { type MAP_VIEWS, rowImage, rowName, WORLD_SURFACES } from './data'
import {
  cameraScale,
  clusterProgress,
  clusterRows,
  isPointVisible,
  MAP_RENDER_MARGIN,
  markerState,
  MAX_ZOOM,
  MIN_ZOOM,
  toCanvas,
  visibleSpawns,
} from './mapLogic'
import { useMapCamera } from './useMapCamera'

export type MapCanvasHandle = { fit: () => void; jump: (point: { x: number; y: number }) => void }
type MapCanvasProps = {
  areaNames: boolean
  borders: boolean
  children?: ReactNode
  completed: Record<string, string>
  data: MapZoneData
  done: string[]
  hidePetsDone: boolean
  highlightedPets: string[]
  isExpanded: boolean
  names: boolean
  onClose: () => void
  onCluster: (rows: MapRow[]) => void
  onExpand: () => void
  onSpot: (point: { x: number; y: number }) => void
  rows: MapRow[]
  selected: MapRow[]
  zone: (typeof MAP_VIEWS)[number]
}

const MapCanvas = forwardRef<MapCanvasHandle, MapCanvasProps>(function MapCanvas(
  {
    zone,
    data,
    done,
    rows,
    selected,
    completed,
    hidePetsDone,
    highlightedPets,
    names,
    areaNames,
    borders,
    isExpanded,
    children,
    onExpand,
    onCluster,
    onSpot,
    onClose,
  },
  ref,
) {
  const maxZoom = 'maxZoom' in zone ? zone.maxZoom : MAX_ZOOM
  const view = useMapCamera(zone.canvas, selected[0], maxZoom)
  const { camera, viewport } = view
  useImperativeHandle(ref, () => ({ jump: view.jump, fit: view.fit }))
  const scale = cameraScale(camera, viewport, zone.canvas)
  const selectedId = selected.length === 1 ? selected[0]?.i || '' : ''
  const anchor = selected.length
    ? {
        x: selected.reduce((sum, row) => sum + row.x, 0) / selected.length,
        y: selected.reduce((sum, row) => sum + row.y, 0) / selected.length,
      }
    : null
  const highlighted = useMemo(() => new Set(highlightedPets), [highlightedPets])
  const markerStates = useMemo(() => {
    const context = {
      completed,
      done: new Set(done),
      highlighted,
      selected: new Set(selected.map((row) => row.i)),
    }
    return new Map(rows.map((row) => [row.i, markerState(row, context)]))
  }, [rows, selected, completed, done, highlighted])
  const clusters = useMemo(
    () => clusterRows(rows, scale, selectedId, markerStates),
    [rows, scale, selectedId, markerStates],
  )
  const spawns = useMemo(() => visibleSpawns(data.rows, selected, highlighted), [data.rows, selected, highlighted])
  const surfaces =
    zone.key === 'world'
      ? WORLD_SURFACES
      : zone.image
        ? [{ key: zone.key, label: zone.name, x: 0, y: 0, size: zone.canvas }]
        : []
  const tiles: { key: string; left: number; size: number; top: number; x: number; y: number }[] = []
  const corner = toCanvas(-MAP_RENDER_MARGIN, -MAP_RENDER_MARGIN, camera, viewport, zone.canvas)
  const end = toCanvas(
    viewport.width + MAP_RENDER_MARGIN,
    viewport.height + MAP_RENDER_MARGIN,
    camera,
    viewport,
    zone.canvas,
  )
  if (camera.zoom > 1.4)
    for (const surface of surfaces) {
      const size = surface.size / 16
      for (
        let y = Math.max(0, Math.floor((corner.y - surface.y) / size));
        y <= Math.min(15, Math.floor((end.y - surface.y) / size));
        y++
      )
        for (
          let x = Math.max(0, Math.floor((corner.x - surface.x) / size));
          x <= Math.min(15, Math.floor((end.x - surface.x) / size));
          x++
        )
          tiles.push({ key: surface.key, left: surface.x + x * size, top: surface.y + y * size, size, x, y })
    }

  return (
    <Popover.Root
      autoFocus={false}
      closeOnEscape={false}
      closeOnInteractOutside={false}
      open={Boolean(anchor)}
      portalled={false}
      positioning={{
        placement: 'top',
        boundary: () => view.stageRef.current || [],
        gutter: 10,
        overflowPadding: 12,
        hideWhenDetached: true,
        listeners: { animationFrame: true },
      }}
      restoreFocus={false}
    >
      <Box
        aria-describedby="map-instructions"
        aria-label={`Interactive map of ${zone.name}`}
        data-testid="map-stage"
        layerStyle="mapStage"
        minH={0}
        onClick={(event) => {
          if (view.canClick() && event.target === event.currentTarget) onClose()
        }}
        onContextMenu={(event) => {
          if (event.target instanceof Element && event.target.closest('[data-map-control]')) return
          event.preventDefault()
          const rect = event.currentTarget.getBoundingClientRect()
          const point = view.toCanvas(event.clientX - rect.left, event.clientY - rect.top)
          if (point.x >= 0 && point.y >= 0 && point.x <= zone.canvas && point.y <= zone.canvas) onSpot(point)
        }}
        onDoubleClick={(event) => {
          if (!(event.target instanceof Element && event.target.closest('[data-map-control]')))
            view.zoom(event.shiftKey ? 0.5 : 2)
        }}
        ref={view.stageRef}
        role="region"
        tabIndex={0}
        {...view.handlers}
      >
        <Box
          height={`${zone.canvas}px`}
          layerStyle="mapWorld"
          left={0}
          pointerEvents="none"
          position="absolute"
          ref={view.worldRef}
          top={0}
          transformOrigin="0 0"
          width={`${zone.canvas}px`}
        >
          {anchor && (
            <Popover.Anchor asChild>
              <Box
                aria-hidden="true"
                boxSize="36px"
                left={`${anchor.x}px`}
                pointerEvents="none"
                position="absolute"
                top={`${anchor.y}px`}
                transform="translate(-50%, -50%) scale(var(--map-inverse-scale, 1))"
              />
            </Popover.Anchor>
          )}
          {surfaces.map((surface) => (
            <Image
              alt=""
              data-map-zone={surface.key}
              decoding="async"
              draggable={false}
              height={`${surface.size}px`}
              key={surface.key}
              left={`${surface.x}px`}
              position="absolute"
              src={`/map/bg/${surface.key}.webp`}
              top={`${surface.y}px`}
              width={`${surface.size}px`}
            />
          ))}
          {tiles.map((tile) => (
            <Image
              alt=""
              decoding="async"
              draggable={false}
              height={`${tile.size}px`}
              key={`${tile.key}:${tile.x}:${tile.y}`}
              left={`${tile.left}px`}
              position="absolute"
              src={`/map/tiles/${tile.key}/4/${tile.x}_${tile.y}.webp`}
              top={`${tile.top}px`}
              width={`${tile.size}px`}
            />
          ))}
          {zone.key === 'world' &&
            WORLD_SURFACES.map((surface) => (
              <Box
                as="h2"
                key={surface.key}
                layerStyle="mapAreaLabel"
                left={`${surface.x + surface.size / 2}px`}
                top={`${surface.y - surface.size / 20}px`}
              >
                {surface.label}
              </Box>
            ))}
          {(borders || !zone.image) && (
            <chakra.svg
              height="full"
              left={0}
              position="absolute"
              top={0}
              viewBox={`0 0 ${zone.canvas} ${zone.canvas}`}
              width="full"
            >
              {data.regions
                .filter((region) => !region.instance && !region.outline)
                .map((region) => (
                  <chakra.path
                    d={region.rings.map((ring) => `M${ring.map((p) => p.join(' ')).join('L')}Z`).join('')}
                    fill={zone.image ? 'none' : 'primary.subtle'}
                    fillOpacity={0.7}
                    key={region.key}
                    stroke="primary.fg"
                    strokeOpacity={0.6}
                    strokeWidth={1}
                    vectorEffect="non-scaling-stroke"
                  />
                ))}
            </chakra.svg>
          )}
          {areaNames &&
            (zone.key !== 'world' || camera.zoom >= 2) &&
            data.regions
              .filter((region) => !region.outline && !region.instance)
              .map((region) => {
                if (!isPointVisible(region.label[0], region.label[1], camera, viewport, zone.canvas)) return null
                return (
                  <Box
                    aria-hidden="true"
                    key={region.key}
                    layerStyle="mapAreaLabel"
                    left={`${region.label[0]}px`}
                    top={`${region.label[1]}px`}
                  >
                    {region.name}
                  </Box>
                )
              })}
          {spawns.map(({ x, y, state }) => {
            if (!isPointVisible(x, y, camera, viewport, zone.canvas)) return null
            return (
              <Box
                aria-hidden="true"
                data-marker-state={state}
                data-testid="spawn-point"
                key={`${x}:${y}`}
                layerStyle="mapSpawn"
                left={`${x}px`}
                top={`${y}px`}
              />
            )
          })}
          {clusters.map((cluster) => {
            if (!isPointVisible(cluster.x, cluster.y, camera, viewport, zone.canvas)) return null
            const progress = clusterProgress(cluster.rows, completed)
            const isSelected = cluster.rows.some((row) => selected.some((value) => value.i === row.i))
            const first = cluster.rows[0]
            if (!first) return null
            const state = markerStates.get(first.i) || 'idle'
            if (hidePetsDone && progress.hidden && !isSelected && state !== 'highlight') return null
            const label = cluster.rows.length > 1 ? `${cluster.rows.length} places · ${rowName(first)}` : rowName(first)
            return (
              <chakra.button
                aria-label={`${label} · ${state}`}
                aria-pressed={isSelected}
                data-cluster-size={cluster.rows.length}
                data-map-control=""
                data-marker-state={state}
                data-pet-progress={progress.total ? `${progress.done}/${progress.total}` : undefined}
                data-row={first.i}
                key={first.i}
                layerStyle="mapMarker"
                left={`${cluster.x}px`}
                onClick={() => {
                  if (view.canClick()) onCluster(cluster.rows)
                }}
                tabIndex={isPointVisible(cluster.x, cluster.y, camera, viewport, zone.canvas, 0) ? 0 : -1}
                title={`${label} · ${state}`}
                top={`${cluster.y}px`}
                type="button"
                zIndex={isSelected ? 4 : state === 'highlight' ? 3 : 1}
              >
                <Image
                  alt=""
                  borderRadius="full"
                  boxSize="full"
                  draggable={false}
                  objectFit="contain"
                  src={rowImage(first)}
                />
                {(state === 'highlight' || state === 'done' || progress.hidden) && (
                  <Box
                    aria-hidden="true"
                    data-marker-state={state === 'highlight' ? 'highlight' : 'done'}
                    layerStyle="mapMarkerStatus"
                  >
                    {state === 'highlight' ? <FiStar size={10} /> : <FiCheck size={10} />}
                  </Box>
                )}
                {cluster.rows.length > 1 && (
                  <Box as="span" layerStyle="mapGroupBadge">
                    {cluster.rows.length}
                  </Box>
                )}
                {names && (
                  <Box
                    as="span"
                    bg="bg.elevated/80"
                    borderRadius="sm"
                    color="fg.default"
                    left="50%"
                    maxW="180px"
                    overflow="hidden"
                    pointerEvents="none"
                    position="absolute"
                    px={1}
                    textOverflow="ellipsis"
                    textStyle="actionCompact"
                    top="calc(100% + 4px)"
                    transform="translateX(-50%)"
                    whiteSpace="nowrap"
                  >
                    {cluster.rows.length > 1 ? `${cluster.rows.length} places` : rowName(first)}
                  </Box>
                )}
              </chakra.button>
            )
          })}
        </Box>
        <Button
          aria-label={isExpanded ? 'Exit full size' : 'Full size'}
          aria-pressed={isExpanded}
          data-map-control=""
          layerStyle="mapControl"
          left={3}
          onClick={onExpand}
          position="absolute"
          size="sm"
          top={3}
          variant="outline"
          zIndex={5}
        >
          {isExpanded ? <FiMinimize /> : <FiMaximize />}
          <Box as="span" display={{ base: 'none', sm: 'inline' }}>
            {isExpanded ? 'Exit full size' : 'Full size'}
          </Box>
        </Button>
        <HStack data-map-control="" gap={1} position="absolute" right={3} top={3} zIndex={5}>
          <Button
            aria-label="Zoom in"
            disabled={camera.zoom >= maxZoom}
            layerStyle="mapControl"
            onClick={() => view.zoom(Math.SQRT2)}
            size="sm"
            variant="outline"
          >
            <FiPlus />
          </Button>
          <Button
            aria-label="Zoom out"
            disabled={camera.zoom <= MIN_ZOOM}
            layerStyle="mapControl"
            onClick={() => view.zoom(1 / Math.SQRT2)}
            size="sm"
            variant="outline"
          >
            <FiMinus />
          </Button>
          <Button aria-label="Fit whole zone" layerStyle="mapControl" onClick={view.fit} size="sm" variant="outline">
            <FiTarget />
          </Button>
          <Text
            aria-label="Map zoom"
            bg="bg.elevated"
            borderRadius="sm"
            minW={12}
            px={2}
            py={1}
            textAlign="center"
            textStyle="actionCompact"
          >
            {Math.round(camera.zoom * 10) / 10}×
          </Text>
        </HStack>
        {!zone.image && (
          <Text
            bg="bg.elevated/80"
            bottom={10}
            color="fg.muted"
            left={3}
            maxW="calc(100% - 24px)"
            p={2}
            pointerEvents="none"
            position="absolute"
            textStyle="bodyCompact"
          >
            Regional outline: the source does not provide a map image for this zone.
          </Text>
        )}
        <Stack
          aria-hidden="true"
          bg="bg.elevated/80"
          borderRadius="sm"
          bottom={3}
          color="fg.default"
          gap={0}
          left={3}
          p={1}
          pointerEvents="none"
          position="absolute"
          textStyle="bodyCompact"
        >
          <Text>
            {rows.length.toLocaleString()} places · {spawns.length} spawn points
          </Text>
        </Stack>
        <Text
          _empty={{ display: 'none' }}
          aria-hidden="true"
          bg="bg.elevated/80"
          borderRadius="sm"
          bottom={3}
          color="fg.default"
          p={1}
          pointerEvents="none"
          position="absolute"
          ref={view.coordinatesRef}
          right={3}
          textStyle="bodyCompact"
        />
        <Popover.Positioner>{children}</Popover.Positioner>
      </Box>
    </Popover.Root>
  )
})

export default MapCanvas
