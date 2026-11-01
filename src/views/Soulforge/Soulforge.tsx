import { Button, Flex, HStack, Icon, Input, InputGroup, Stack, Tabs, Text } from '@chakra-ui/react'
import { PageHeader } from 'components/layouts'
import { useState } from 'react'
import { FiSearch, FiSliders } from 'react-icons/fi'

import type { TabId } from './types'

import { BraceletList } from './BraceletList'
import { GEAR_SLOTS, MATRIX_COLUMNS } from './data'
import { DpsMatrix } from './DpsMatrix'
import { GearList } from './GearList'
import { isTabId } from './progress'
import { useProgress } from './useProgress'

const TABS: { id: TabId; label: string }[] = [
  { id: 'dps', label: 'DPS Matrix' },
  { id: 'basic', label: 'Gear List' },
  { id: 'bracelet', label: 'Bracelet' },
]

const TRACKED_KEYS = [...new Set(GEAR_SLOTS.flatMap((slot) => slot.lines.flat().map((line) => line.key)))]

export default function Soulforge() {
  const { activeTab, ownedLines, setActiveTab, toggleOwned } = useProgress()
  const [query, setQuery] = useState('')
  const normalizedQuery = query.trim().toLowerCase()
  const completedCount = TRACKED_KEYS.filter((key) => ownedLines[key]).length
  const slots = GEAR_SLOTS.filter((slot) => {
    if (!normalizedQuery) return true
    const labels =
      activeTab === 'dps'
        ? slot.matrix.flatMap((cell, index) => (cell.tier && cell.tier !== 'X' ? [MATRIX_COLUMNS[index]] : []))
        : slot.lines.flat().map((line) => line.label)
    return `${slot.search} ${slot.label} ${slot.note} ${labels.join(' ')}`.toLowerCase().includes(normalizedQuery)
  })

  function handleReset() {
    setQuery('')
  }

  return (
    <Stack gap={4}>
      <PageHeader
        context="Gladiator · PvE DPS"
        progress={{ label: 'owned', total: TRACKED_KEYS.length, value: completedCount }}
        title="Soul Binding"
      />

      <Tabs.Root
        colorPalette="primary"
        lazyMount
        onValueChange={({ value }) => {
          if (isTabId(value)) setActiveTab(value)
        }}
        unmountOnExit
        value={activeTab}
        variant="planner"
      >
        <Flex align="center" flexWrap="wrap" gap={3} justify="space-between" layerStyle="panel" p={3}>
          <Tabs.List aria-label="Soul Binding views">
            <Tabs.Indicator aria-hidden="true" />
            {TABS.map((tab) => (
              <Tabs.Trigger aria-label={tab.label} key={tab.id} value={tab.id}>
                {tab.label}
              </Tabs.Trigger>
            ))}
          </Tabs.List>
          {activeTab !== 'bracelet' && (
            <HStack flex={{ base: '1 1 100%', lg: '0 1 360px' }} gap={2} minW={0}>
              <InputGroup flex={1} startElement={<FiSearch aria-hidden="true" />}>
                <Input
                  aria-label="Search slots or stats"
                  id="gear-search"
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search slots or stats…"
                  type="search"
                  value={query}
                />
              </InputGroup>
              <Button disabled={!query} onClick={handleReset} variant="ghost">
                Clear search
              </Button>
            </HStack>
          )}
        </Flex>

        {TABS.map((tab) => (
          <Tabs.Content key={tab.id} p={0} pt={4} value={tab.id}>
            {tab.id !== 'bracelet' && slots.length === 0 ? (
              <Stack align="center" gap={3} layerStyle="panel" py={12}>
                <Icon aria-hidden="true" as={FiSliders} boxSize={6} color="fg.muted" />
                <Text textStyle="titleCompact">No matching slots</Text>
                <Button onClick={handleReset} variant="outline">
                  Clear search
                </Button>
              </Stack>
            ) : (
              <>
                {tab.id === 'dps' && <DpsMatrix slots={slots} />}
                {tab.id === 'basic' && <GearList onToggle={toggleOwned} ownedLines={ownedLines} slots={slots} />}
                {tab.id === 'bracelet' && <BraceletList />}
              </>
            )}
          </Tabs.Content>
        ))}
      </Tabs.Root>
      <Text color="fg.muted" textStyle="bodyCompact">
        Saved in this browser.
      </Text>
    </Stack>
  )
}
