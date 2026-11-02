import type { MapBoot, MapRow, MapZoneData } from 'services/map'

import {
  Box,
  Button,
  chakra,
  Clipboard,
  Flex,
  HStack,
  IconButton,
  Image,
  Input,
  Popover,
  Stack,
  Text,
} from '@chakra-ui/react'
import { Switch } from 'components/ui'
import { useEffect, useRef, useState } from 'react'
import { FiArrowLeft, FiCheck, FiCopy, FiMapPin, FiStar, FiTrash2, FiX } from 'react-icons/fi'

import type { useMapProgress } from './useMapProgress'

import { KIND_LABELS, MAP_ZONES, rowImage, rowName } from './data'
import { markerState, petKey } from './mapLogic'
import { mapTimerStatus } from './timers'

type MapDetailsProps = {
  boot?: MapBoot
  data: MapZoneData
  members: MapRow[]
  onBack: () => void
  onClose: () => void
  onRemovePin: (row: MapRow) => void
  onSavePin: (row: MapRow) => void
  onSelect: (row: MapRow) => void
  progress: ReturnType<typeof useMapProgress>
  row: MapRow | null
}

export default function MapDetails({
  members,
  row,
  data,
  boot,
  progress,
  onClose,
  onBack,
  onSelect,
  onSavePin,
  onRemovePin,
}: MapDetailsProps) {
  const panel = useRef<HTMLDivElement>(null)
  const selection = row?.i || members.map((member) => member.i).join(',')
  const isOpen = Boolean(selection)
  useEffect(() => {
    if (!isOpen) return
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const stage = panel.current?.closest<HTMLElement>('[data-testid="map-stage"]')
    const markerId = previous?.dataset.row
    return () => {
      const marker = markerId ? stage?.querySelector<HTMLElement>(`[data-row="${CSS.escape(markerId)}"]`) : null
      const target = previous?.isConnected && previous !== document.body ? previous : marker || stage
      target?.focus({ preventScroll: true })
    }
  }, [isOpen])
  useEffect(() => {
    if (selection) panel.current?.focus({ preventScroll: true })
  }, [selection])
  const [now, setNow] = useState(Date.now)
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 10000)
    return () => window.clearInterval(timer)
  }, [])
  if (!members.length && !row) return null
  const timer = boot?.timers.find((timer) => timer.id === row?.t)
  const status = timer && boot ? mapTimerStatus(timer, boot, progress.preferences.region, now) : null
  const pet = row?.f?.p
  const sourceZone = MAP_ZONES.find((zone) => zone.key === row?.zone)
  const isComplete = pet ? Object.hasOwn(progress.completed, petKey(pet.n)) : false
  const isHighlighted = pet ? progress.preferences.highlightedPets.includes(petKey(pet.n)) : false
  const isDone = row ? progress.profile.done.includes(row.i) : false
  const context = {
    completed: progress.completed,
    done: new Set(progress.profile.done),
    highlighted: new Set(progress.preferences.highlightedPets),
    selected: new Set(row ? [row.i] : []),
  }

  return (
    <Popover.Content
      aria-label={row ? rowName(row) : `${members.length} places`}
      data-map-control=""
      data-testid="map-details"
      layerStyle="mapPopup"
      ref={panel}
      role="region"
      tabIndex={-1}
    >
      <Popover.Arrow>
        <Popover.ArrowTip />
      </Popover.Arrow>
      <Box minH={0} minW={0} overflowY="auto" overscrollBehavior="contain">
        <HStack align="start" gap={2} justify="space-between" pt={4} px={4}>
          <HStack minW={0}>
            {row && (
              <Image
                alt=""
                boxSize={11}
                data-marker-state={markerState(row, context)}
                flexShrink={0}
                layerStyle="mapPortrait"
                src={rowImage(row)}
              />
            )}
            <Stack gap={0} minW={0}>
              <Text as="h2" textStyle="titleCompact">
                {row ? rowName(row) : `${members.length} places`}
              </Text>
              <Text color="fg.muted" textStyle="bodyCompact">
                {row
                  ? `${KIND_LABELS[row.k] || row.k}${row.l ? ` · Lv. ${row.l}` : ''}${pet ? ` · ${row.f?.pts?.length || 0} spawn points` : ''}${sourceZone ? ` · ${sourceZone.name}` : ''}`
                  : 'Choose a place to view its details'}
              </Text>
            </Stack>
          </HStack>
          <HStack flexShrink={0} gap={0}>
            {row && members.length > 1 && (
              <Button aria-label="Back to group" onClick={onBack} size="xs" variant="ghost">
                <FiArrowLeft />
              </Button>
            )}
            <Button aria-label="Close map details" onClick={onClose} size="xs" variant="ghost">
              <FiX />
            </Button>
          </HStack>
        </HStack>
        {!row ? (
          <Stack gap={1} p={4} pt={3}>
            {members.map((member) => {
              const done = member.f?.p && Object.hasOwn(progress.completed, petKey(member.f.p.n))
              const state = markerState(member, context)
              return (
                <chakra.button
                  _focusVisible={{ outline: '2px solid', outlineColor: 'primary.focusRing' }}
                  _hover={{ bg: 'bg.hover' }}
                  alignItems="center"
                  borderRadius="md"
                  cursor="pointer"
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
                      boxSize={10}
                      data-marker-state={state}
                      layerStyle="mapPortrait"
                      src={rowImage(member)}
                    />
                    {(done || state === 'highlight') && (
                      <Box
                        aria-label={state === 'highlight' ? 'Highlighted' : 'Done'}
                        data-marker-state={state === 'highlight' ? 'highlight' : 'done'}
                        layerStyle="mapMarkerStatus"
                      >
                        {state === 'highlight' ? <FiStar size={10} /> : <FiCheck size={10} />}
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
          <Stack gap={3} p={4} pt={3}>
            {pet && (
              <Stack gap={2}>
                <Flex align="center" gap={2} justify="space-between">
                  <Text color="fg.muted" textStyle="bodyCompact">
                    Pet
                  </Text>
                  <Clipboard.Root
                    asChild
                    key={pet.n}
                    timeout={2000}
                    translations={{ triggerLabel: (copied) => (copied ? 'Pet name copied' : 'Copy pet type name') }}
                    value={pet.n}
                  >
                    <HStack gap={1} minW={0}>
                      <Clipboard.Trigger asChild>
                        <IconButton flexShrink={0} size="xs" title="Copy pet type name" variant="ghost">
                          <Clipboard.Indicator copied={<FiCheck />}>
                            <FiCopy />
                          </Clipboard.Indicator>
                        </IconButton>
                      </Clipboard.Trigger>
                      <Text textStyle="actionCompact">{pet.n}</Text>
                    </HStack>
                  </Clipboard.Root>
                </Flex>
                <Flex justify="space-between">
                  <Text color="fg.muted" textStyle="bodyCompact">
                    Genus
                  </Text>
                  <Text textStyle="actionCompact">{pet.c}</Text>
                </Flex>
                <Stack gap={2} mt={2}>
                  <Switch
                    checked={isComplete}
                    colorPalette="success"
                    disabled={progress.isBlocked}
                    hiddenInputProps={{ 'aria-label': `Done: ${pet.n}` }}
                    layerStyle="mapOption"
                    onCheckedChange={({ checked }) => progress.togglePet(pet.n, checked)}
                    size="md"
                  >
                    Done
                  </Switch>
                  <Switch
                    checked={isHighlighted}
                    colorPalette="warning"
                    hiddenInputProps={{ 'aria-label': `Highlight: ${pet.n}` }}
                    layerStyle="mapOption"
                    onCheckedChange={({ checked }) => progress.toggleHighlight(pet.n, checked)}
                    size="md"
                  >
                    Highlight
                  </Switch>
                </Stack>
              </Stack>
            )}
            {row.a !== undefined && data.areas[row.a] && (
              <Text color="fg.muted" textStyle="bodyCompact">
                {data.areas[row.a]}
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
          </Stack>
        )}
        {row?.k === 'pin' && (
          <HStack borderTopWidth="1px" gap={1} p={4}>
            <Button
              aria-label={row.i.startsWith('pin:') ? 'Remove pin' : 'Save pin'}
              onClick={() => (row.i.startsWith('pin:') ? onRemovePin(row) : onSavePin(row))}
              size="xs"
              variant="ghost"
            >
              {row.i.startsWith('pin:') ? <FiTrash2 /> : <FiMapPin />}
            </Button>
          </HStack>
        )}
      </Box>
    </Popover.Content>
  )
}
