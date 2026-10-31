import { Box, Button, Flex, Heading, Input, Text } from '@chakra-ui/react'
import { useState } from 'react'

import type { TabId } from './types'

import { BraceletList } from './BraceletList'
import { GEAR_SLOTS, MATRIX_COLUMNS } from './data'
import { DpsMatrix } from './DpsMatrix'
import { GearList } from './GearList'
import styles from './Soulforge.module.scss'
import { useProgress } from './useProgress'

const TABS: { id: TabId; label: string }[] = [
  { id: 'dps', label: 'DPS Soul Binding' },
  { id: 'basic', label: 'Danh sách đồ' },
  { id: 'bracelet', label: 'Bracelet' },
]

export default function Soulforge() {
  const { activeTab, ownedLines, setActiveTab, toggleOwned } = useProgress()
  const [query, setQuery] = useState('')
  const normalizedQuery = query.trim().toLowerCase()
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
    <Box className={styles.page} color="matrix.text" minH="100vh">
      <Box className={styles.shell}>
        <Flex align="center" className={styles.controls} flexWrap="wrap" gap="10px">
          <Text asChild color="matrix.muted" textStyle="matrixControlLabel">
            <label htmlFor="gear-search">Lọc nhanh</label>
          </Text>
          <Input
            aria-label="Tìm slot hoặc substat"
            className={styles.search}
            flex="1 1 240px"
            id="gear-search"
            minW="180px"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Tìm slot hoặc substat…"
            type="search"
            value={query}
          />
          <Button className={styles.control} onClick={handleReset} textStyle="matrixAction" type="button" unstyled>
            Đặt lại
          </Button>
        </Flex>
        <Flex aria-label="Các phần matrix" as="nav" className={styles.tabs} flexWrap="wrap" gap="8px">
          {TABS.map((tab) => (
            <Button
              aria-controls={`panel-${tab.id}`}
              aria-pressed={activeTab === tab.id}
              className={styles.control}
              data-active={activeTab === tab.id || undefined}
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              textStyle="matrixAction"
              type="button"
              unstyled
            >
              {tab.label}
            </Button>
          ))}
        </Flex>
        <Box
          aria-label={TABS.find((tab) => tab.id === activeTab)?.label}
          as="section"
          className={styles.card}
          id={`panel-${activeTab}`}
        >
          <Heading as="h1" mb="16px" textStyle="matrixHeading">
            {TABS.find((tab) => tab.id === activeTab)?.label}
          </Heading>
          {activeTab === 'dps' && <DpsMatrix slots={slots} />}
          {activeTab === 'basic' && <GearList onToggle={toggleOwned} ownedLines={ownedLines} slots={slots} />}
          {activeTab === 'bracelet' && <BraceletList />}
        </Box>
      </Box>
    </Box>
  )
}
