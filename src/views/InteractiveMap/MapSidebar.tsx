import type { MapPet, MapRow } from 'services/map'

import {
  Accordion,
  Badge,
  Box,
  Button,
  chakra,
  HStack,
  IconButton,
  Image,
  Input,
  InputGroup,
  SimpleGrid,
  Stack,
  Text,
} from '@chakra-ui/react'
import { ChakraSelect } from 'components/select'
import { FileUploadField, Switch, toaster } from 'components/ui'
import { type KeyboardEvent, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { FiCheck, FiCompass, FiDownload, FiEye, FiEyeOff, FiGlobe, FiMoon, FiSearch, FiSun, FiX } from 'react-icons/fi'

import type { useMapProgress } from './useMapProgress'

import { KIND_LABELS, MAP_GROUPS, MAP_VIEWS, PET_LAYERS, rowLayer, rowName, type ZoneKey } from './data'
import { petKey } from './mapLogic'

const ZONE_ICONS = { Abyss: FiCompass, Asmodian: FiMoon, Atreia: FiGlobe, Elyos: FiSun } as const
const ZONE_TONES = {
  Abyss: { bg: 'info.subtle', border: 'info.border', fg: 'info.fg' },
  Asmodian: { bg: 'error.subtle', border: 'error.border', fg: 'error.fg' },
  Atreia: { bg: 'primary.subtle', border: 'primary.border', fg: 'primary.fg' },
  Elyos: { bg: 'primary.subtle', border: 'primary.border', fg: 'primary.fg' },
} as const

type MapSidebarProps = {
  canJump: boolean
  layers: string[]
  onJump: () => void
  onLayers: (layers: string[]) => void
  onQuery: (query: string) => void
  onSelect: (row: MapRow) => void
  onZone: (zone: string) => void
  pets?: MapPet[]
  progress: ReturnType<typeof useMapProgress>
  query: string
  results: MapRow[]
  rows: MapRow[]
  zone: ZoneKey
}

export default function MapSidebar({
  zone,
  rows,
  layers,
  query,
  results,
  canJump,
  pets = [],
  progress,
  onZone,
  onLayers,
  onQuery,
  onSelect,
  onJump,
}: MapSidebarProps) {
  const { preferences, updatePreferences } = progress
  const zoneButtonRefs = useRef<Array<HTMLButtonElement | null>>([])
  const searchRef = useRef<HTMLInputElement>(null)
  const form = useForm({ defaultValues: { profileName: '', presetName: '' } })
  const layerCounts = new Map<string, number>()
  for (const row of rows) layerCounts.set(rowLayer(row), (layerCounts.get(rowLayer(row)) || 0) + 1)
  const allLayers = [...layerCounts.keys()]
  const completed = Object.entries(progress.completed).sort((a, b) => a[1].localeCompare(b[1]))
  const petsByType = new Map(pets.map((pet) => [petKey(pet.n), pet]))
  const presets = [
    { name: 'Pets', layers: PET_LAYERS },
    {
      name: 'Default',
      layers: allLayers.filter(
        (layer) => !layer.startsWith('pets:') && !layer.startsWith('gather:') && layer !== 'quest',
      ),
    },
    { name: 'All', layers: allLayers },
    { name: 'None', layers: [] },
  ]

  function handleZoneKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let nextIndex: number | undefined
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      nextIndex = (index + 1) % MAP_VIEWS.length
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      nextIndex = (index - 1 + MAP_VIEWS.length) % MAP_VIEWS.length
    } else if (event.key === 'Home') {
      nextIndex = 0
    } else if (event.key === 'End') {
      nextIndex = MAP_VIEWS.length - 1
    }
    if (nextIndex === undefined) return
    event.preventDefault()
    const nextZone = MAP_VIEWS[nextIndex]
    if (!nextZone) return
    onZone(nextZone.key)
    zoneButtonRefs.current[nextIndex]?.focus()
  }

  return (
    <Stack aria-label="Map controls" as="aside" bg="bg.subtle" gap={3} height="full" minH={0} overflowY="auto" p={3}>
      <Stack aria-labelledby="map-zone-heading" as="section" gap={3} layerStyle="mapSidebarSection" p={3}>
        <Text as="h2" color="fg.muted" id="map-zone-heading" textStyle="meta">
          Zone
        </Text>
        <Box
          aria-label="Map zone"
          display="grid"
          gap={2}
          gridTemplateColumns="repeat(2, minmax(0, 1fr))"
          role="radiogroup"
        >
          {MAP_VIEWS.map((item, index) => {
            const isSelected = item.key === zone
            const Icon = ZONE_ICONS[item.faction]
            const tone = ZONE_TONES[item.faction]
            return (
              <Button
                aria-checked={isSelected}
                aria-label={`${item.name}, ${item.faction}`}
                gridColumn={item.key === 'world' || item.faction === 'Abyss' ? 'span 2' : undefined}
                key={item.key}
                layerStyle="mapZoneOption"
                onClick={() => onZone(item.key)}
                onKeyDown={(event) => handleZoneKeyDown(event, index)}
                ref={(element) => {
                  zoneButtonRefs.current[index] = element
                }}
                role="radio"
                tabIndex={isSelected ? 0 : -1}
              >
                <HStack align="center" gap={2} minW={0} width="full">
                  <Box
                    aria-hidden="true"
                    bg={tone.bg}
                    borderColor={tone.border}
                    borderRadius="full"
                    borderWidth="1px"
                    color={tone.fg}
                    flexShrink={0}
                    layerStyle="mapZoneIcon"
                  >
                    <Icon />
                  </Box>
                  <Stack gap={0} minW={0}>
                    <Text overflow="hidden" textOverflow="ellipsis" textStyle="actionCompact" whiteSpace="nowrap">
                      {item.name}
                    </Text>
                    <Text color="fg.muted" textStyle="bodyCompact">
                      {item.key === 'world' ? 'Verteron · Altgard · Abyss' : item.faction}
                    </Text>
                  </Stack>
                </HStack>
              </Button>
            )
          })}
        </Box>
      </Stack>
      <Stack aria-labelledby="map-search-heading" as="section" gap={3} layerStyle="mapSidebarSection" p={3}>
        <Text as="h2" color="fg.muted" id="map-search-heading" textStyle="meta">
          Search
        </Text>
        <InputGroup
          endElement={
            <IconButton
              aria-label="Clear map search"
              onClick={() => {
                onQuery('')
                searchRef.current?.focus()
              }}
              size="xs"
              variant="ghost"
              visibility={query ? 'visible' : 'hidden'}
            >
              <FiX />
            </IconButton>
          }
          endElementProps={{ pointerEvents: 'auto', px: 1.5 }}
          startElement={<FiSearch aria-hidden="true" size={16} />}
          startElementProps={{ color: 'fg.muted', ps: 3 }}
        >
          <Input
            aria-labelledby="map-search-heading"
            autoComplete="off"
            id="map-search"
            layerStyle="mapSearchInput"
            onChange={(event) => onQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && canJump) {
                event.preventDefault()
                onJump()
              }
            }}
            placeholder="Search pets or places"
            ref={searchRef}
            size="lg"
            value={query}
          />
        </InputGroup>
        {query.trim() && (
          <Stack aria-label="Search results" gap={1} maxH="220px" overflowY="auto">
            {canJump && (
              <Button justifyContent="start" onClick={onJump} size="sm" variant="ghost">
                <FiSearch />
                Go to {query}
              </Button>
            )}
            {results.map((row) => (
              <Button
                height="auto"
                justifyContent="start"
                key={row.i}
                onClick={() => onSelect(row)}
                py={2}
                size="sm"
                textAlign="left"
                variant="ghost"
                whiteSpace="normal"
              >
                <Stack gap={0}>
                  <Text>{rowName(row)}</Text>
                  <Text color="fg.muted" textStyle="bodyCompact">
                    {row.f?.p?.n || KIND_LABELS[row.k]}
                    {row.zone ? ` · ${MAP_VIEWS.find((zone) => zone.key === row.zone)?.name || row.zone}` : ''}
                  </Text>
                </Stack>
              </Button>
            ))}
            {!canJump && !results.length && (
              <Text color="fg.muted" role="status" textStyle="bodyCompact">
                No results in this zone.
              </Text>
            )}
          </Stack>
        )}
      </Stack>
      <Stack aria-labelledby="map-settings-heading" as="section" gap={3} layerStyle="mapSidebarSection" p={3}>
        <Text as="h2" color="fg.muted" id="map-settings-heading" textStyle="meta">
          Settings & progress
        </Text>
        <Accordion.Root collapsible multiple>
          <Accordion.Item value="display">
            <Box as="h3">
              <Accordion.ItemTrigger>
                <Accordion.ItemIndicator />
                <Text as="span" flex={1}>
                  Map display
                </Text>
              </Accordion.ItemTrigger>
            </Box>
            <Accordion.ItemContent>
              <Accordion.ItemBody>
                <Stack gap={1}>
                  {(
                    [
                      { key: 'hideDone', label: 'Hide done' },
                      { key: 'hidePetsDone', label: 'Hide pets done' },
                      { key: 'names', label: 'Names on map' },
                      { key: 'areaNames', label: 'Area names' },
                      { key: 'borders', label: 'Area borders' },
                    ] as const
                  ).map((option) => (
                    <Switch
                      checked={preferences[option.key]}
                      key={option.key}
                      layerStyle="mapOption"
                      onCheckedChange={({ checked }) =>
                        updatePreferences((previous) => ({ ...previous, [option.key]: checked }))
                      }
                      size="sm"
                    >
                      {option.label}
                    </Switch>
                  ))}
                </Stack>
              </Accordion.ItemBody>
            </Accordion.ItemContent>
          </Accordion.Item>
          <Accordion.Item value="completed">
            <Box as="h3">
              <Accordion.ItemTrigger>
                <Accordion.ItemIndicator />
                <Text as="span" flex={1}>
                  Completed pets
                </Text>
                <Badge colorPalette="success">{completed.length}</Badge>
              </Accordion.ItemTrigger>
            </Box>
            <Accordion.ItemContent>
              <Accordion.ItemBody>
                <Stack as="ul" gap={2} listStyleType="none" maxH="260px" overflowY="auto">
                  {completed.length ? (
                    completed.map(([key, name]) => {
                      const pet = petsByType.get(key)
                      return (
                        <HStack as="li" gap={2} key={key} layerStyle="mapCompletedPet" p={2}>
                          {pet ? (
                            <Image
                              alt=""
                              bg="bg.canvas"
                              boxSize={10}
                              data-marker-state="done"
                              flexShrink={0}
                              layerStyle="mapPortrait"
                              loading="lazy"
                              src={`/map/pets/${pet.i}`}
                            />
                          ) : (
                            <Box
                              alignItems="center"
                              boxSize={10}
                              color="success.fg"
                              data-marker-state="done"
                              display="flex"
                              flexShrink={0}
                              justifyContent="center"
                              layerStyle="mapPortrait"
                            >
                              <FiCheck aria-hidden="true" />
                            </Box>
                          )}
                          <Stack flex={1} gap={0} minW={0}>
                            <Text overflowWrap="anywhere" textStyle="actionCompact">
                              {name}
                            </Text>
                            <Text color="fg.muted" textStyle="bodyCompact">
                              {pet?.c || 'Completed'}
                            </Text>
                          </Stack>
                          <IconButton
                            aria-label={`Mark ${name} incomplete`}
                            colorPalette="gray"
                            disabled={progress.isBlocked}
                            flexShrink={0}
                            onClick={() => progress.togglePet(name, false)}
                            size="xs"
                            title={`Mark ${name} incomplete`}
                            variant="ghost"
                          >
                            <FiX />
                          </IconButton>
                        </HStack>
                      )
                    })
                  ) : (
                    <Text as="li" color="fg.muted" textStyle="bodyCompact">
                      Open a pet marker to mark its type complete.
                    </Text>
                  )}
                </Stack>
              </Accordion.ItemBody>
            </Accordion.ItemContent>
          </Accordion.Item>
          <Accordion.Item value="backups">
            <Box as="h3">
              <Accordion.ItemTrigger>
                <Accordion.ItemIndicator />
                <Text as="span" flex={1}>
                  Character & backups
                </Text>
              </Accordion.ItemTrigger>
            </Box>
            <Accordion.ItemContent>
              <Accordion.ItemBody>
                <Stack gap={3}>
                  <ChakraSelect
                    aria-label="Character"
                    onChange={(profile) => updatePreferences((previous) => ({ ...previous, profile }))}
                    options={preferences.profiles.map((p) => ({ value: p.id, label: p.name }))}
                    placeholder="Character"
                    size="sm"
                    value={preferences.profile}
                  />
                  <chakra.form
                    onSubmit={form.handleSubmit((values) => {
                      const name = values.profileName.trim()
                      if (!name) return
                      const id = crypto.randomUUID()
                      updatePreferences((previous) => ({
                        ...previous,
                        profile: id,
                        profiles: [...previous.profiles, { id, name, done: [] }],
                      }))
                      form.resetField('profileName')
                    })}
                  >
                    <HStack gap={1}>
                      <Input
                        aria-label="New character name"
                        maxLength={40}
                        placeholder="New character"
                        size="sm"
                        {...form.register('profileName')}
                      />
                      <Button size="xs" type="submit" variant="outline">
                        Add
                      </Button>
                    </HStack>
                  </chakra.form>
                  <Text color="fg.muted" textStyle="bodyCompact">
                    Place completion is per character. Pet type completion is shared across characters and zones.
                  </Text>
                  <ChakraSelect
                    aria-label="Server region"
                    onChange={(region) => updatePreferences((previous) => ({ ...previous, region }))}
                    options={[
                      { value: 'as', label: 'Asia' },
                      { value: 'eu', label: 'Europe' },
                      { value: 'nae', label: 'NA East' },
                      { value: 'naw', label: 'NA West' },
                      { value: 'la', label: 'Latin America' },
                    ]}
                    placeholder="Server region"
                    size="sm"
                    value={preferences.region}
                  />
                  <chakra.form
                    onSubmit={form.handleSubmit((values) => {
                      const name = values.presetName.trim()
                      if (!name) return
                      updatePreferences((previous) => ({
                        ...previous,
                        presets: [...previous.presets.filter((p) => p.name !== name), { name, layers: [...layers] }],
                      }))
                      form.resetField('presetName')
                    })}
                  >
                    <HStack gap={1}>
                      <Input
                        aria-label="Preset name"
                        maxLength={40}
                        placeholder="Save these layers"
                        size="sm"
                        {...form.register('presetName')}
                      />
                      <Button size="xs" type="submit" variant="outline">
                        Save
                      </Button>
                    </HStack>
                  </chakra.form>
                  <HStack gap={2}>
                    <Button onClick={progress.exportProgress} size="sm" variant="outline">
                      <FiDownload />
                      Export
                    </Button>
                  </HStack>
                  <FileUploadField
                    accept={{ 'application/json': ['.json'] }}
                    chooseLabel="Import backup"
                    dropzoneLabel="Drop progress JSON here"
                    inputProps={{ 'aria-label': 'Import map progress' }}
                    maxFiles={1}
                    maxFileSize={2 * 1024 * 1024}
                    onChange={async (files) => {
                      const file = files[0]
                      if (!file) return
                      try {
                        progress.importProgress(await file.text())
                      } catch (error) {
                        toaster.create({
                          type: 'error',
                          title: 'Import failed.',
                          description: error instanceof Error ? error.message : 'Invalid file.',
                        })
                      }
                    }}
                  />
                  <Text color="fg.muted" textStyle="bodyCompact">
                    Import also accepts the Console tracker’s pet progress JSON. Saved in this browser.
                  </Text>
                </Stack>
              </Accordion.ItemBody>
            </Accordion.ItemContent>
          </Accordion.Item>
        </Accordion.Root>
      </Stack>
      <Stack aria-labelledby="map-layers-heading" as="section" gap={3} layerStyle="mapSidebarSection" p={3}>
        <HStack justify="space-between">
          <Text as="h2" color="fg.muted" id="map-layers-heading" textStyle="meta">
            Layers
          </Text>
          <Text color="fg.muted" textStyle="bodyCompact">
            {allLayers.filter((layer) => layers.includes(layer)).length} selected
          </Text>
        </HStack>
        <SimpleGrid aria-label="Layer presets" columns={2} gap={2}>
          {presets.map((preset) => {
            const isSelected =
              preset.layers.length === layers.length && preset.layers.every((layer) => layers.includes(layer))
            return (
              <Button
                aria-pressed={isSelected}
                key={preset.name}
                onClick={() => onLayers(preset.layers)}
                size="sm"
                variant={isSelected ? 'solid' : 'outline'}
              >
                {preset.name}
              </Button>
            )
          })}
        </SimpleGrid>
        {preferences.presets.map((preset) => (
          <HStack gap={1} key={preset.name}>
            <Button flex={1} justifyContent="start" onClick={() => onLayers(preset.layers)} size="xs" variant="ghost">
              {preset.name}
            </Button>
            <Button
              aria-label={`Remove preset ${preset.name}`}
              onClick={() =>
                updatePreferences((previous) => ({
                  ...previous,
                  presets: previous.presets.filter((p) => p.name !== preset.name),
                }))
              }
              size="xs"
              variant="ghost"
            >
              <FiX />
            </Button>
          </HStack>
        ))}
        <Accordion.Root collapsible defaultValue={['pets']} multiple>
          {MAP_GROUPS.map((group) => {
            const groupRows = rows.filter((row) => (group.kinds as readonly string[]).includes(row.k))
            if (!groupRows.length) return null
            const groupLayers = [...new Set(groupRows.map(rowLayer))]
            const isOn = groupLayers.every((layer) => layers.includes(layer))
            return (
              <Accordion.Item key={group.key} value={group.key}>
                <HStack gap={0}>
                  <Box as="h3" flex={1} minW={0}>
                    <Accordion.ItemTrigger>
                      <Accordion.ItemIndicator />
                      <Text as="span" flex={1}>
                        {group.label}
                      </Text>
                      <Badge colorPalette={group.tone}>{groupRows.length.toLocaleString()}</Badge>
                    </Accordion.ItemTrigger>
                  </Box>
                  <Button
                    aria-label={`${isOn ? 'Hide' : 'Show'} all ${group.label}`}
                    aria-pressed={isOn}
                    flexShrink={0}
                    mx={1}
                    onClick={() => {
                      onLayers(
                        isOn
                          ? layers.filter((layer) => !groupLayers.includes(layer))
                          : [...new Set([...layers, ...groupLayers])],
                      )
                    }}
                    size="xs"
                    variant="ghost"
                  >
                    {isOn ? <FiEye /> : <FiEyeOff />}
                  </Button>
                </HStack>
                <Accordion.ItemContent>
                  <Accordion.ItemBody>
                    <Stack gap={1}>
                      {groupLayers.map((layer) => (
                        <Switch
                          checked={layers.includes(layer)}
                          hiddenInputProps={{ 'aria-label': `Show ${layer}` }}
                          key={layer}
                          layerStyle="mapOption"
                          onCheckedChange={({ checked }) =>
                            onLayers(checked ? [...layers, layer] : layers.filter((value) => value !== layer))
                          }
                          size="sm"
                        >
                          <Text as="span" flex={1}>
                            {layer.includes(':') ? layer.slice(layer.indexOf(':') + 1) : KIND_LABELS[layer]}
                          </Text>
                          <Text as="span" color="fg.muted" flexShrink={0}>
                            {layerCounts.get(layer)}
                          </Text>
                        </Switch>
                      ))}
                    </Stack>
                  </Accordion.ItemBody>
                </Accordion.ItemContent>
              </Accordion.Item>
            )
          })}
        </Accordion.Root>
      </Stack>
      {progress.error && (
        <Text color="warning.fg" role="alert" textStyle="bodyCompact">
          {progress.error}
        </Text>
      )}
      <Box id="map-instructions">
        <Text color="fg.muted" textStyle="bodyCompact">
          Drag to move. Wheel, pinch or +/− to zoom. Arrow keys pan; Home fits the zone. Right-click a spot to save a
          pin.
        </Text>
      </Box>
    </Stack>
  )
}
