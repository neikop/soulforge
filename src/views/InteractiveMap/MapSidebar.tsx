import type { MapRow } from 'services/map'

import { Badge, Box, Button, chakra, Flex, HStack, Input, Stack, Text } from '@chakra-ui/react'
import { ChakraSelect } from 'components/select'
import { FileUploadField, Switch, toaster } from 'components/ui'
import { useForm } from 'react-hook-form'
import { FiDownload, FiEye, FiEyeOff, FiSearch, FiX } from 'react-icons/fi'

import type { useMapProgress } from './useMapProgress'

import { KIND_LABELS, MAP_GROUPS, MAP_ZONES, PET_LAYERS, rowLayer, rowName, type ZoneKey } from './data'

type MapSidebarProps = {
  canJump: boolean
  layers: string[]
  onJump: () => void
  onLayers: (layers: string[]) => void
  onQuery: (query: string) => void
  onSelect: (row: MapRow) => void
  onZone: (zone: string) => void
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
  progress,
  onZone,
  onLayers,
  onQuery,
  onSelect,
  onJump,
}: MapSidebarProps) {
  const { preferences, updatePreferences } = progress
  const form = useForm({ defaultValues: { profileName: '', presetName: '' } })
  const layerCounts = new Map<string, number>()
  for (const row of rows) layerCounts.set(rowLayer(row), (layerCounts.get(rowLayer(row)) || 0) + 1)
  const allLayers = [...layerCounts.keys()]
  const completed = Object.entries(progress.completed).sort((a, b) => a[1].localeCompare(b[1]))
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

  return (
    <Stack aria-label="Map controls" as="aside" gap={4} height="full" minH={0} overflowY="auto" p={3}>
      <Stack gap={2}>
        <Text as="h2" textStyle="meta">
          Zone
        </Text>
        <ChakraSelect
          aria-label="Map zone"
          onChange={onZone}
          options={MAP_ZONES.map((zone) => ({ value: zone.key, label: `${zone.name} · ${zone.faction}` }))}
          placeholder="Choose a zone"
          size="sm"
          value={zone}
        />
      </Stack>
      <Stack gap={2}>
        <chakra.label htmlFor="map-search" textStyle="meta">
          Search
        </chakra.label>
        <HStack gap={1}>
          <Input
            id="map-search"
            onChange={(event) => onQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && canJump) {
                event.preventDefault()
                onJump()
              }
            }}
            placeholder="Name, pet type, or x, y"
            size="sm"
            value={query}
          />
          {query && (
            <Button aria-label="Clear map search" onClick={() => onQuery('')} size="xs" variant="ghost">
              <FiX />
            </Button>
          )}
        </HStack>
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
      <Stack gap={2}>
        <Text as="h2" textStyle="meta">
          Presets
        </Text>
        <Flex flexWrap="wrap" gap={1}>
          {presets.map((preset) => (
            <Button key={preset.name} onClick={() => onLayers(preset.layers)} size="xs" variant="outline">
              {preset.name}
            </Button>
          ))}
        </Flex>
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
      </Stack>
      <Stack borderTopWidth="1px" gap={2} pt={3}>
        {(
          [
            { key: 'hideDone', label: 'Hide done' },
            { key: 'hidePetsDone', label: 'Hide pets done' },
            { key: 'names', label: 'Names on map' },
            { key: 'areaNames', label: 'Area names' },
            { key: 'borders', label: 'Area borders' },
          ] as const
        ).map((option) => (
          <Flex align="center" gap={2} justify="space-between" key={option.key}>
            <Text textStyle="actionCompact">{option.label}</Text>
            <Switch
              checked={preferences[option.key]}
              hiddenInputProps={{ 'aria-label': option.label }}
              onCheckedChange={({ checked }) =>
                updatePreferences((previous) => ({ ...previous, [option.key]: checked }))
              }
              size="sm"
            />
          </Flex>
        ))}
      </Stack>
      <chakra.details borderTopWidth="1px" pt={3}>
        <chakra.summary
          _focusVisible={{ outline: '2px solid', outlineColor: 'primary.focusRing' }}
          cursor="pointer"
          textStyle="actionCompact"
        >
          Completed: {completed.length} pet {completed.length === 1 ? 'type' : 'types'}
        </chakra.summary>
        <Stack gap={1} maxH="260px" mt={2} overflowY="auto">
          {completed.length ? (
            completed.map(([key, name]) => (
              <Flex align="center" gap={2} justify="space-between" key={key}>
                <Text textStyle="bodyCompact">{name}</Text>
                <Button
                  disabled={progress.isBlocked}
                  onClick={() => progress.togglePet(name, false)}
                  size="xs"
                  variant="ghost"
                >
                  Undo
                </Button>
              </Flex>
            ))
          ) : (
            <Text color="fg.muted" textStyle="bodyCompact">
              Open a pet marker to mark its type complete.
            </Text>
          )}
        </Stack>
      </chakra.details>
      <Stack borderTopWidth="1px" gap={2} pt={3}>
        {MAP_GROUPS.map((group) => {
          const groupRows = rows.filter((row) => (group.kinds as readonly string[]).includes(row.k))
          if (!groupRows.length) return null
          const groupLayers = [...new Set(groupRows.map(rowLayer))]
          const isOn = groupLayers.every((layer) => layers.includes(layer))
          return (
            <chakra.details key={group.key} open={group.key === 'pets'}>
              <chakra.summary
                _focusVisible={{ outline: '2px solid', outlineColor: 'primary.focusRing' }}
                alignItems="center"
                cursor="pointer"
                display="flex"
                gap={2}
                py={1}
              >
                <Text as="span" flex={1} textStyle="titleCompact">
                  {group.label}
                </Text>
                <Badge colorPalette={group.tone}>{groupRows.length.toLocaleString()}</Badge>
                <Button
                  aria-label={`${isOn ? 'Hide' : 'Show'} all ${group.label}`}
                  onClick={(event) => {
                    event.preventDefault()
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
              </chakra.summary>
              <Stack gap={2} px={1} py={2}>
                {groupLayers.map((layer) => (
                  <Flex align="center" gap={2} justify="space-between" key={layer}>
                    <Text flex={1} textStyle="bodyCompact">
                      {layer.includes(':') ? layer.slice(layer.indexOf(':') + 1) : KIND_LABELS[layer]}
                    </Text>
                    <Text color="fg.muted" textStyle="bodyCompact">
                      {layerCounts.get(layer)}
                    </Text>
                    <Switch
                      checked={layers.includes(layer)}
                      hiddenInputProps={{ 'aria-label': `Show ${layer}` }}
                      onCheckedChange={({ checked }) =>
                        onLayers(checked ? [...layers, layer] : layers.filter((value) => value !== layer))
                      }
                      size="sm"
                    />
                  </Flex>
                ))}
              </Stack>
            </chakra.details>
          )
        })}
      </Stack>
      <chakra.details borderTopWidth="1px" pt={3}>
        <chakra.summary cursor="pointer" textStyle="actionCompact">
          Character, presets & backups
        </chakra.summary>
        <Stack gap={3} mt={3}>
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
      </chakra.details>
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
