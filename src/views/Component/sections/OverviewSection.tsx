import { Box, Button, chakra, Checkbox, HStack, SimpleGrid, Stack, Tabs, Text } from '@chakra-ui/react'
import { useState } from 'react'

import { DocsCard, SectionHeading } from '../shared'

export function OverviewSection() {
  const [selectedStats, setSelectedStats] = useState<Record<string, boolean>>({ owned: true })

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
      <DocsCard title="Map surfaces">
        <Box height="180px" layerStyle="mapShell" position="relative">
          <Box height="full" layerStyle="mapStage" tabIndex={0}>
            <chakra.button aria-label="Example map marker" layerStyle="mapMarker" left="20%" top="50%" type="button">
              <Box as="span" layerStyle="mapGroupBadge">
                2
              </Box>
              <chakra.svg
                aria-hidden="true"
                height="40px"
                left="-3px"
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
                  strokeDasharray="50 100"
                  strokeWidth="3"
                  transform="rotate(-90 20 20)"
                />
              </chakra.svg>
            </chakra.button>
            <Box layerStyle="mapSpawn" left="35%" top="65%" />
            <Box layerStyle="mapCard" maxW="55%" p={3} position="absolute" right={3} top={3}>
              <Text textStyle="titleCompact">Map details</Text>
              <Text color="fg.muted" textStyle="bodyCompact">
                Fixed-size markers, amber progress arcs and an 80% background.
              </Text>
            </Box>
          </Box>
        </Box>
      </DocsCard>
    </Stack>
  )
}
