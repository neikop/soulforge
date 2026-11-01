import type { MapRow, MapZoneData } from 'services/map'

import { Box, Button, chakra, HStack, Image, Stack, Text } from '@chakra-ui/react'
import { forwardRef, type ReactNode, useImperativeHandle, useMemo } from 'react'
import { FiMaximize, FiMinimize, FiMinus, FiPlus, FiTarget } from 'react-icons/fi'

import { type MAP_ZONES, rowImage, rowName } from './data'
import {
  cameraScale,
  clusterProgress,
  clusterRows,
  MAX_ZOOM,
  MIN_ZOOM,
  selectedSpawns,
  toCanvas,
  toScreen,
} from './mapLogic'
import { useMapCamera } from './useMapCamera'

export type MapCanvasHandle = { fit: () => void; jump: (point: { x: number; y: number }) => void }
type MapCanvasProps = {
  areaNames: boolean
  borders: boolean
  children?: ReactNode
  completed: Record<string, string>
  data: MapZoneData
  hidePetsDone: boolean
  isExpanded: boolean
  names: boolean
  onClose: () => void
  onCluster: (rows: MapRow[]) => void
  onExpand: () => void
  onSpot: (point: { x: number; y: number }) => void
  rows: MapRow[]
  selected: MapRow[]
  zone: (typeof MAP_ZONES)[number]
}

const MapCanvas = forwardRef<MapCanvasHandle, MapCanvasProps>(function MapCanvas(
  {
    zone,
    data,
    rows,
    selected,
    completed,
    hidePetsDone,
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
  const view = useMapCamera(zone.canvas, selected[0])
  const { camera, viewport } = view
  useImperativeHandle(ref, () => ({ jump: view.jump, fit: view.fit }))
  const scale = cameraScale(camera, viewport, zone.canvas)
  const origin = toScreen(0, 0, camera, viewport, zone.canvas)
  const selectedId = selected.length === 1 ? selected[0]?.i || '' : ''
  const clusters = useMemo(
    () => clusterRows(rows, camera, viewport, zone.canvas, selectedId),
    [rows, camera, viewport, zone.canvas, selectedId],
  )
  const spawns = useMemo(() => selectedSpawns(selected), [selected])
  const useTiles = Boolean(zone.image && camera.zoom > 1.4)
  const tiles: { x: number; y: number }[] = []
  const tileSize = zone.canvas / 16
  const corner = toCanvas(0, 0, camera, viewport, zone.canvas)
  const end = toCanvas(viewport.width, viewport.height, camera, viewport, zone.canvas)
  if (useTiles)
    for (let y = Math.max(0, Math.floor(corner.y / tileSize)); y <= Math.min(15, Math.floor(end.y / tileSize)); y++) {
      for (let x = Math.max(0, Math.floor(corner.x / tileSize)); x <= Math.min(15, Math.floor(end.x / tileSize)); x++)
        tiles.push({ x, y })
    }

  return (
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
        const point = toCanvas(event.clientX - rect.left, event.clientY - rect.top, camera, viewport, zone.canvas)
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
        aria-hidden="true"
        height={`${zone.canvas}px`}
        layerStyle="mapWorld"
        left={0}
        pointerEvents="none"
        position="absolute"
        style={{ transform: `translate(${origin.x}px, ${origin.y}px) scale(${scale})`, transformOrigin: '0 0' }}
        top={0}
        width={`${zone.canvas}px`}
      >
        {zone.image && !useTiles && (
          <Image
            alt=""
            decoding="async"
            draggable={false}
            height="full"
            src={`/map/bg/${zone.key}.webp`}
            width="full"
          />
        )}
        {tiles.map((tile) => (
          <Image
            alt=""
            decoding="async"
            draggable={false}
            height={`${tileSize}px`}
            key={`${tile.x}:${tile.y}`}
            left={`${tile.x * tileSize}px`}
            position="absolute"
            src={`/map/tiles/${zone.key}/4/${tile.x}_${tile.y}.webp`}
            top={`${tile.y * tileSize}px`}
            width={`${tileSize}px`}
          />
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
                  strokeWidth={1 / scale}
                />
              ))}
          </chakra.svg>
        )}
      </Box>
      {areaNames &&
        data.regions
          .filter((region) => !region.outline && !region.instance)
          .map((region) => {
            const point = toScreen(region.label[0], region.label[1], camera, viewport, zone.canvas)
            if (point.x < 0 || point.x > viewport.width || point.y < 0 || point.y > viewport.height) return null
            return (
              <Box
                aria-hidden="true"
                key={region.key}
                layerStyle="mapAreaLabel"
                left={`${point.x}px`}
                top={`${point.y}px`}
              >
                {region.name}
              </Box>
            )
          })}
      {spawns.map(([x, y]) => {
        const point = toScreen(x, y, camera, viewport, zone.canvas)
        return (
          <Box
            aria-hidden="true"
            data-testid="spawn-point"
            key={`${x}:${y}`}
            layerStyle="mapSpawn"
            left={`${point.x}px`}
            top={`${point.y}px`}
          />
        )
      })}
      {clusters.map((cluster) => {
        const progress = clusterProgress(cluster.rows, completed)
        const isSelected = cluster.rows.some((row) => selected.some((value) => value.i === row.i))
        if (hidePetsDone && progress.hidden && !isSelected) return null
        const point = toScreen(cluster.x, cluster.y, camera, viewport, zone.canvas)
        const first = cluster.rows[0]
        if (!first) return null
        const label = cluster.rows.length > 1 ? `${cluster.rows.length} places · ${rowName(first)}` : rowName(first)
        return (
          <chakra.button
            aria-label={label}
            aria-pressed={isSelected}
            borderColor={isSelected ? 'primary.fg' : undefined}
            data-cluster-size={cluster.rows.length}
            data-map-control=""
            data-pet-progress={progress.total ? `${progress.done}/${progress.total}` : undefined}
            data-row={first.i}
            key={cluster.id}
            layerStyle="mapMarker"
            left={`${point.x}px`}
            onClick={() => {
              if (view.canClick()) onCluster(cluster.rows)
            }}
            title={label}
            top={`${point.y}px`}
            type="button"
            zIndex={isSelected ? 4 : 1}
          >
            <Image
              alt=""
              borderRadius="full"
              boxSize="full"
              draggable={false}
              objectFit="contain"
              src={rowImage(first)}
            />
            {progress.done > 0 && (
              <chakra.svg
                aria-hidden="true"
                height="40px"
                left="-3px"
                overflow="visible"
                pointerEvents="none"
                position="absolute"
                top="-3px"
                viewBox="0 0 40 40"
                width="40px"
              >
                <chakra.circle
                  cx="20"
                  cy="20"
                  fill="none"
                  pathLength={100}
                  r="18"
                  stroke="warning.solid"
                  strokeDasharray={`${(progress.done / progress.total) * 100} 100`}
                  strokeWidth="3"
                  transform="rotate(-90 20 20)"
                />
              </chakra.svg>
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
      <Button
        aria-label={isExpanded ? 'Exit full size' : 'Full size'}
        aria-pressed={isExpanded}
        bg="bg.elevated"
        data-map-control=""
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
          bg="bg.elevated"
          disabled={camera.zoom >= MAX_ZOOM}
          onClick={() => view.zoom(Math.SQRT2)}
          size="sm"
          variant="outline"
        >
          <FiPlus />
        </Button>
        <Button
          aria-label="Zoom out"
          bg="bg.elevated"
          disabled={camera.zoom <= MIN_ZOOM}
          onClick={() => view.zoom(1 / Math.SQRT2)}
          size="sm"
          variant="outline"
        >
          <FiMinus />
        </Button>
        <Button aria-label="Fit whole zone" bg="bg.elevated" onClick={view.fit} size="sm" variant="outline">
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
      {view.coordinates && (
        <Text
          aria-hidden="true"
          bg="bg.elevated/80"
          borderRadius="sm"
          bottom={3}
          color="fg.default"
          p={1}
          pointerEvents="none"
          position="absolute"
          right={3}
          textStyle="bodyCompact"
        >
          {Math.round(view.coordinates.x)}, {Math.round(view.coordinates.y)}
        </Text>
      )}
      {children}
    </Box>
  )
})

export default MapCanvas
