import {
  Accordion,
  Badge,
  Box,
  Button,
  chakra,
  Checkbox,
  HStack,
  SimpleGrid,
  Stack,
  Tabs,
  Text,
} from '@chakra-ui/react'
import { Switch } from 'components/ui'
import { useState } from 'react'
import { FiCheck, FiCompass, FiGlobe, FiMapPin, FiMoon, FiStar, FiSun } from 'react-icons/fi'

import { DocsCard, SectionHeading } from '../shared'

const ZONE_CARD_EXAMPLES = [
  { key: 'world', name: 'World map', faction: 'Atreia', icon: FiGlobe, tone: 'primary' },
  { key: 'verteron', name: 'Verteron', faction: 'Elyos', icon: FiSun, tone: 'primary' },
  { key: 'poeta', name: 'Poeta', faction: 'Elyos', icon: FiSun, tone: 'primary' },
  { key: 'altgard', name: 'Altgard', faction: 'Asmodian', icon: FiMoon, tone: 'error' },
  { key: 'ishalgen', name: 'Ishalgen', faction: 'Asmodian', icon: FiMoon, tone: 'error' },
  { key: 'reshanta', name: 'Chaotic Lower Reshanta', faction: 'Abyss', icon: FiCompass, tone: 'info' },
] as const

export function OverviewSection() {
  const [selectedStats, setSelectedStats] = useState<Record<string, boolean>>({ owned: true })
  const [selectedZone, setSelectedZone] = useState('world')

  function handleToggleStat(key: string) {
    setSelectedStats((previous) => ({ ...previous, [key]: !previous[key] }))
  }

  return (
    <Stack gap={5} id="overview" scrollMarginTop="28">
      <SectionHeading
        eyebrow="Overview"
        subtitle="A shared navy and cyan palette, compact spacing and clear type hierarchy keep every screen consistent."
        title="One system across every screen"
      />

      <SimpleGrid columns={{ base: 1, lg: 3 }} gap={5}>
        <DocsCard title="Layout">
          <Text color="fg.subtle" textStyle="body">
            Every page uses the same header, navigation and workspace width. Tables scroll within their own surface on
            smaller screens.
          </Text>
        </DocsCard>

        <DocsCard title="Typography">
          <Text color="fg.subtle" textStyle="body">
            Titles use bold, labels use mid and supporting text uses normal. Compact text roles keep planner tables
            readable.
          </Text>
        </DocsCard>

        <DocsCard title="Color">
          <Text color="fg.subtle" textStyle="body">
            Cyan marks active controls. Gold, green, purple and blue identify priority tiers. Both light and dark modes
            use the same roles.
          </Text>
        </DocsCard>
      </SimpleGrid>

      <DocsCard title="Planner controls">
        <Tabs.Root defaultValue="priorities" variant="planner">
          <Tabs.List aria-label="Planner control example">
            <Tabs.Indicator />
            <Tabs.Trigger value="priorities">Priorities</Tabs.Trigger>
            <Tabs.Trigger value="progress">Progress</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="priorities">
            <HStack flexWrap="wrap" gap={3}>
              {(['top', 's', 'aplus', 'a'] as const).map((tone, index) => (
                <Button
                  aria-pressed={selectedStats[tone] === true}
                  data-tone={tone}
                  key={tone}
                  onClick={() => handleToggleStat(tone)}
                  variant="stat"
                >
                  {['S+', 'S', 'A+', 'A'][index]} · Stat option {selectedStats[tone] ? '✓' : ''}
                </Button>
              ))}
              <Button
                aria-pressed={selectedStats.owned === true}
                data-tone="s"
                onClick={() => handleToggleStat('owned')}
                variant="stat"
              >
                Owned stat {selectedStats.owned ? '✓' : ''}
              </Button>
              <Button data-tone="a" disabled variant="stat">
                Unavailable stat
              </Button>
            </HStack>
          </Tabs.Content>
          <Tabs.Content value="progress">
            <Text color="fg.muted" textStyle="body">
              Check a target below to preview its completed state.
            </Text>
          </Tabs.Content>
        </Tabs.Root>
        <SimpleGrid columns={{ base: 1, md: 3 }} gap={3}>
          <Checkbox.Root data-tone="top" variant="target">
            <Checkbox.HiddenInput />
            <Checkbox.Control>
              <Checkbox.Indicator />
            </Checkbox.Control>
            <Checkbox.Label>Target to keep · S+</Checkbox.Label>
          </Checkbox.Root>
          <Checkbox.Root data-tone="s" defaultChecked variant="target">
            <Checkbox.HiddenInput />
            <Checkbox.Control>
              <Checkbox.Indicator />
            </Checkbox.Control>
            <Checkbox.Label>Completed target · S</Checkbox.Label>
          </Checkbox.Root>
          <Checkbox.Root data-tone="a" disabled variant="target">
            <Checkbox.HiddenInput />
            <Checkbox.Control>
              <Checkbox.Indicator />
            </Checkbox.Control>
            <Checkbox.Label>Unavailable target · A</Checkbox.Label>
          </Checkbox.Root>
        </SimpleGrid>
      </DocsCard>
      <DocsCard title="Collapsible sections">
        <Text color="fg.muted" textStyle="bodyCompact">
          Section headers provide a full hover and focus area. Enter or Space toggles a section; arrow keys move between
          headers. Spaced cards use no dividers. Expand and collapse use the theme's slow timing and respect reduced
          motion. Independent actions stay outside the trigger.
        </Text>
        <Accordion.Root collapsible defaultValue={['visibility']} multiple>
          <Accordion.Item value="visibility">
            <Box as="h3">
              <Accordion.ItemTrigger>
                <Accordion.ItemIndicator />
                <Text as="span" flex={1}>
                  Visibility
                </Text>
                <Badge>2</Badge>
              </Accordion.ItemTrigger>
            </Box>
            <Accordion.ItemContent>
              <Accordion.ItemBody>
                <Stack gap={1}>
                  <Switch defaultChecked layerStyle="mapOption" size="sm">
                    Show names
                  </Switch>
                  <Switch layerStyle="mapOption" size="sm">
                    Show borders
                  </Switch>
                  <Switch disabled layerStyle="mapOption" size="sm">
                    Unavailable option
                  </Switch>
                  <Switch defaultChecked layerStyle="mapOption" readOnly size="sm">
                    Locked option
                  </Switch>
                </Stack>
              </Accordion.ItemBody>
            </Accordion.ItemContent>
          </Accordion.Item>
          <Accordion.Item value="progress">
            <Box as="h3">
              <Accordion.ItemTrigger>
                <Accordion.ItemIndicator />
                <Text as="span" flex={1}>
                  Progress
                </Text>
              </Accordion.ItemTrigger>
            </Box>
            <Accordion.ItemContent>
              <Accordion.ItemBody>
                Multiple sections can remain open. Closing a section keeps its controls mounted.
              </Accordion.ItemBody>
            </Accordion.ItemContent>
          </Accordion.Item>
          <Accordion.Item disabled value="unavailable">
            <Box as="h3">
              <Accordion.ItemTrigger>
                <Accordion.ItemIndicator />
                <Text as="span" flex={1}>
                  Unavailable section
                </Text>
              </Accordion.ItemTrigger>
            </Box>
            <Accordion.ItemContent>
              <Accordion.ItemBody>This section is disabled.</Accordion.ItemBody>
            </Accordion.ItemContent>
          </Accordion.Item>
        </Accordion.Root>
      </DocsCard>
      <DocsCard title="Map surfaces">
        <Stack gap={2} mb={3}>
          <Text color="fg.subtle" textStyle="meta">
            Zone card selector
          </Text>
          <SimpleGrid columns={2} gap={2}>
            {ZONE_CARD_EXAMPLES.map((item) => {
              const isSelected = selectedZone === item.key
              const Icon = item.icon
              return (
                <Button
                  aria-pressed={isSelected}
                  gridColumn={item.key === 'world' || item.faction === 'Abyss' ? 'span 2' : undefined}
                  key={item.key}
                  layerStyle="mapZoneOption"
                  onClick={() => setSelectedZone(item.key)}
                >
                  <HStack align="center" gap={2} minW={0} width="full">
                    <Box
                      aria-hidden="true"
                      bg={`${item.tone}.subtle`}
                      borderColor={`${item.tone}.border`}
                      borderRadius="full"
                      borderWidth="1px"
                      color={`${item.tone}.fg`}
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
                        {item.faction}
                      </Text>
                    </Stack>
                  </HStack>
                </Button>
              )
            })}
          </SimpleGrid>
        </Stack>
        <Box height="340px" layerStyle="mapShell" position="relative">
          <Box height="full" layerStyle="mapStage" tabIndex={0}>
            <Box
              css={{ '--map-inverse-scale': 0.8 }}
              height="full"
              layerStyle="mapWorld"
              transform="scale(1.25)"
              transformOrigin="0 0"
              width="full"
            >
              {(['idle', 'active', 'done', 'highlight'] as const).map((state, index) => (
                <chakra.button
                  aria-label={`Example ${state} map marker`}
                  aria-pressed={state === 'active'}
                  data-marker-state={state}
                  key={state}
                  layerStyle="mapMarker"
                  left={`${12 + index * 20}%`}
                  top="20%"
                  type="button"
                >
                  <FiMapPin />
                  {(state === 'done' || state === 'highlight') && (
                    <Box aria-hidden="true" data-marker-state={state} layerStyle="mapMarkerStatus">
                      {state === 'done' ? <FiCheck size={10} /> : <FiStar size={10} />}
                    </Box>
                  )}
                  <Text as="span" position="absolute" textStyle="bodyCompact" top="calc(100% + 8px)">
                    {state}
                  </Text>
                </chakra.button>
              ))}
              <Box data-marker-state="active" layerStyle="mapSpawn" left="32%" top="35%" />
              <Box data-marker-state="highlight" layerStyle="mapSpawn" left="72%" top="35%" />
            </Box>
            <Stack bottom={3} gap={2} layerStyle="mapCard" left={3} p={3} position="absolute" right={3}>
              <Text textStyle="titleCompact">Pet controls</Text>
              <HStack justify="space-between">
                <chakra.label htmlFor="guide-map-done" textStyle="actionCompact">
                  Done
                </chakra.label>
                <Switch
                  colorPalette="success"
                  hiddenInputProps={{ id: 'guide-map-done', 'aria-label': 'Example pet done' }}
                  size="sm"
                />
              </HStack>
              <HStack justify="space-between">
                <chakra.label htmlFor="guide-map-highlight" textStyle="actionCompact">
                  Highlight
                </chakra.label>
                <Switch
                  colorPalette="warning"
                  defaultChecked
                  hiddenInputProps={{ id: 'guide-map-highlight', 'aria-label': 'Example pet highlight' }}
                  size="sm"
                />
              </HStack>
              <Text color="fg.muted" textStyle="bodyCompact">
                Centered borders keep their size at every zoom. Highlight keeps spawn points visible. Border priority:
                Highlight → Done → Active → Idle.
              </Text>
            </Stack>
          </Box>
        </Box>
      </DocsCard>
    </Stack>
  )
}
