import type { MapBoot, MapDrops, MapRow, MapZoneData } from 'services/map'

import { Box, Button, chakra, Flex, HStack, Image, Input, Link, Stack, Text } from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import { Switch, toaster } from 'components/ui'
import { useEffect, useRef, useState } from 'react'
import { FiArrowLeft, FiCheck, FiCopy, FiEye, FiEyeOff, FiLink, FiMapPin, FiTrash2, FiX } from 'react-icons/fi'
import { fetchMapDrops } from 'services/map'

import type { useMapProgress } from './useMapProgress'

import { KIND_LABELS, rowImage, rowName } from './data'
import { petKey } from './mapLogic'
import { mapTimerStatus } from './timers'

type MapDetailsProps = {
  boot?: MapBoot
  data: MapZoneData
  isHidden: boolean
  members: MapRow[]
  onBack: () => void
  onClose: () => void
  onHide: (hidden: boolean) => void
  onRemovePin: (row: MapRow) => void
  onSavePin: (row: MapRow) => void
  onSelect: (row: MapRow) => void
  progress: ReturnType<typeof useMapProgress>
  row: MapRow | null
}

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    toaster.create({ type: 'success', title: 'Copied.' })
  } catch {
    toaster.create({
      type: 'error',
      title: 'Clipboard unavailable.',
      description: 'Select and copy the coordinates or address bar manually.',
    })
  }
}

export default function MapDetails({
  members,
  row,
  isHidden,
  data,
  boot,
  progress,
  onClose,
  onHide,
  onBack,
  onSelect,
  onSavePin,
  onRemovePin,
}: MapDetailsProps) {
  const panel = useRef<HTMLDivElement>(null)
  const reveal = useRef<HTMLButtonElement>(null)
  const selection = row?.i || members.map((member) => member.i).join(',')
  useEffect(() => {
    if (!selection) return
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const target = isHidden ? reveal.current : panel.current
    target?.focus({ preventScroll: true })
    return () => {
      if (previous?.isConnected) previous.focus({ preventScroll: true })
    }
  }, [selection, isHidden])
  const [now, setNow] = useState(Date.now)
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 10000)
    return () => window.clearInterval(timer)
  }, [])
  const npc = row?.f?.npc
  const drops = useQuery({
    queryKey: ['map', 'drops'],
    queryFn: ({ signal }) => fetchMapDrops(signal),
    enabled: Boolean(npc),
    staleTime: Infinity,
  })
  const items = npc ? drops.data?.npcs[String(npc)] || [] : []
  if (!members.length && !row) return null
  if (isHidden && row)
    return (
      <Button
        bg="bg.elevated"
        data-map-control=""
        onClick={() => onHide(false)}
        position="absolute"
        ref={reveal}
        right={3}
        size="sm"
        top={16}
        variant="outline"
        zIndex={6}
      >
        <FiEye />
        Show details
      </Button>
    )
  const timer = boot?.timers.find((timer) => timer.id === row?.t)
  const status = timer && boot ? mapTimerStatus(timer, boot, progress.preferences.region, now) : null
  const pet = row?.f?.p
  const isComplete = pet ? Object.hasOwn(progress.completed, petKey(pet.n)) : false
  const isDone = row ? progress.profile.done.includes(row.i) : false

  return (
    <Box
      aria-label={row ? rowName(row) : `${members.length} places`}
      data-map-control=""
      data-testid="map-details"
      layerStyle="mapCard"
      maxH="calc(100% - 100px)"
      overflowY="auto"
      p={3}
      position="absolute"
      ref={panel}
      right={3}
      role="region"
      tabIndex={-1}
      top={16}
      width="min(340px, calc(100% - 24px))"
      zIndex={6}
    >
      <HStack align="start" gap={2} justify="space-between">
        <HStack minW={0}>
          {row && (
            <Image
              alt=""
              borderColor={isComplete ? 'warning.solid' : 'border.default'}
              borderRadius="md"
              borderWidth="2px"
              boxSize={11}
              objectFit="contain"
              src={rowImage(row)}
            />
          )}
          <Stack gap={0} minW={0}>
            <Text as="h2" textStyle="titleCompact">
              {row ? rowName(row) : `${members.length} places`}
            </Text>
            <Text color="fg.muted" textStyle="bodyCompact">
              {row
                ? `${KIND_LABELS[row.k] || row.k}${row.l ? ` · Lv. ${row.l}` : ''}`
                : 'Choose a place to view its details'}
            </Text>
          </Stack>
        </HStack>
        <HStack gap={0}>
          {row && (
            <Button aria-label="Hide details, keep spawn points" onClick={() => onHide(true)} size="xs" variant="ghost">
              <FiEyeOff />
            </Button>
          )}
          <Button aria-label="Close map details" onClick={onClose} size="xs" variant="ghost">
            <FiX />
          </Button>
        </HStack>
      </HStack>
      {!row ? (
        <Stack gap={1} mt={3}>
          {members.map((member) => {
            const done = member.f?.p && Object.hasOwn(progress.completed, petKey(member.f.p.n))
            return (
              <chakra.button
                _focusVisible={{ outline: '2px solid', outlineColor: 'primary.focusRing' }}
                _hover={{ bg: 'bg.hover' }}
                alignItems="center"
                borderRadius="md"
                display="flex"
                gap={2}
                key={member.i}
                onClick={() => onSelect(member)}
                p={2}
                textAlign="left"
                type="button"
              >
                <Box flexShrink={0} position="relative">
                  <Image
                    alt=""
                    borderColor={done ? 'warning.solid' : 'border.default'}
                    borderRadius="md"
                    borderWidth="2px"
                    boxSize={10}
                    objectFit="contain"
                    src={rowImage(member)}
                  />
                  {done && (
                    <Box
                      aria-label="Completed"
                      bg="warning.solid"
                      borderRadius="full"
                      bottom={-1}
                      color="warning.contrast"
                      position="absolute"
                      right={-1}
                    >
                      <FiCheck size={12} />
                    </Box>
                  )}
                </Box>
                <Stack gap={0}>
                  <Text textStyle="actionCompact">{rowName(member)}</Text>
                  <Text color="fg.muted" textStyle="bodyCompact">
                    {member.f?.p ? `${member.f.p.n} · ${member.f.p.c}` : KIND_LABELS[member.k]}
                  </Text>
                </Stack>
              </chakra.button>
            )
          })}
        </Stack>
      ) : (
        <Stack gap={3} mt={3}>
          {pet && (
            <Stack gap={1}>
              <Flex align="center" gap={2} justify="space-between">
                <Text color="fg.muted" textStyle="bodyCompact">
                  Pet
                </Text>
                <Switch
                  checked={isComplete}
                  colorPalette="warning"
                  disabled={progress.isBlocked}
                  onCheckedChange={({ checked }) => progress.togglePet(pet.n, checked)}
                  size="sm"
                >
                  {pet.n}
                </Switch>
              </Flex>
              <Flex justify="space-between">
                <Text color="fg.muted" textStyle="bodyCompact">
                  Genus
                </Text>
                <Text textStyle="actionCompact">{pet.c}</Text>
              </Flex>
            </Stack>
          )}
          {row.a !== undefined && data.areas[row.a] && (
            <Text color="fg.muted" textStyle="bodyCompact">
              {data.areas[row.a]}
            </Text>
          )}
          <Text textStyle="bodyCompact">
            Position: {Math.round(row.x)}, {Math.round(row.y)}
            {row.f?.pts ? ` · ${row.f.pts.length} spawn points` : ''}
          </Text>
          {row.f?.h && (
            <Text color="fg.muted" textStyle="bodyCompact">
              Location: {row.f.h}
            </Text>
          )}
          {row.f?.ti && (
            <Text color="fg.muted" textStyle="bodyCompact">
              {row.f.ti}
            </Text>
          )}
          {status && (
            <Stack gap={1}>
              <Text color={status.isLive ? 'success.fg' : 'info.fg'} textStyle="actionCompact">
                {status.label}
              </Text>
              <Text color="fg.muted" textStyle="bodyCompact">
                {status.schedule}
              </Text>
              <Text color="fg.muted" textStyle="bodyCompact">
                Source schedule; server events can change.
              </Text>
            </Stack>
          )}
          {row.c?.length && boot ? (
            <Stack gap={1}>
              {row.c.map((task) => (
                <Text color="fg.muted" key={task} textStyle="bodyCompact">
                  {boot.tasks[task] || task}
                </Text>
              ))}
            </Stack>
          ) : null}
          {row.ev
            ?.filter((event) => !event.until || Date.parse(event.until) > now)
            .map((event) => (
              <Text color="info.fg" key={event.text} textStyle="bodyCompact">
                {event.text}
              </Text>
            ))}
          {row.k !== 'pets' && row.k !== 'pin' && (
            <Switch checked={isDone} onCheckedChange={({ checked }) => progress.toggleDone(row.i, checked)} size="sm">
              Done for {progress.profile.name}
            </Switch>
          )}
          {row.k === 'pin' && row.i.startsWith('pin:') && (
            <Input
              aria-label="Pin name"
              defaultValue={row.n}
              key={row.i}
              maxLength={80}
              onBlur={(event) => {
                const name = event.target.value.trim() || 'My pin'
                progress.updatePreferences((previous) => ({
                  ...previous,
                  pins: previous.pins.map((pin) => (pin.i === row.i ? { ...pin, n: name } : pin)),
                }))
              }}
            />
          )}
          {npc && (
            <Stack gap={1}>
              <Text textStyle="actionCompact">Drops</Text>
              {drops.isPending ? (
                <Text color="fg.muted" textStyle="bodyCompact">
                  Loading drops…
                </Text>
              ) : drops.isError ? (
                <Button onClick={() => void drops.refetch()} size="xs" variant="ghost">
                  Retry drops
                </Button>
              ) : items.length ? (
                items.map(([id, rate]) => <DropLine data={drops.data} id={id} key={id} rate={rate} />)
              ) : (
                <Text color="fg.muted" textStyle="bodyCompact">
                  No drops recorded in this snapshot.
                </Text>
              )}
            </Stack>
          )}
          <HStack borderTopWidth="1px" gap={1} pt={2}>
            {members.length > 1 && (
              <Button aria-label="Back to group" onClick={onBack} size="xs" variant="ghost">
                <FiArrowLeft />
              </Button>
            )}
            <Button
              aria-label="Copy position"
              onClick={() => void copyText(`${Math.round(row.x)}, ${Math.round(row.y)}`)}
              size="xs"
              variant="ghost"
            >
              <FiCopy />
            </Button>
            <Button aria-label="Copy map link" onClick={() => void copyText(location.href)} size="xs" variant="ghost">
              <FiLink />
            </Button>
            {row.k === 'pin' && (
              <Button
                aria-label={row.i.startsWith('pin:') ? 'Remove pin' : 'Save pin'}
                onClick={() => (row.i.startsWith('pin:') ? onRemovePin(row) : onSavePin(row))}
                size="xs"
                variant="ghost"
              >
                {row.i.startsWith('pin:') ? <FiTrash2 /> : <FiMapPin />}
              </Button>
            )}
          </HStack>
        </Stack>
      )}
    </Box>
  )
}

type DropLineProps = { data?: MapDrops; id: number; rate: number }

function DropLine({ data, id, rate }: DropLineProps) {
  const item = data?.items[String(id)]
  return (
    <Flex gap={2} justify="space-between">
      <Link
        color="primary.fg"
        href={`https://metabot.gg/en/aion-2/items/${id}`}
        rel="noreferrer"
        target="_blank"
        textStyle="bodyCompact"
      >
        {item?.[0] || `Item ${id}`}
        {item?.[1] ? ` · ${item[1]}` : ''}
      </Link>
      <Text flexShrink={0} textStyle="bodyCompact">
        {rate}%
      </Text>
    </Flex>
  )
}
