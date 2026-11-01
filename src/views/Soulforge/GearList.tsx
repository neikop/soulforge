import { Box, Flex, Heading, SimpleGrid, Text } from '@chakra-ui/react'

import type { GearSlot, OwnedLines } from './types'

import { StatPill } from './StatPill'

const STAT_GROUPS = [
  { index: 0, tier: 'S+' },
  { index: 1, tier: 'S' },
  { index: 2, tier: 'A+' },
  { index: 3, tier: 'PVP' },
] as const

const STAT_COLUMNS = [
  { category: 'attack', label: 'Attack' },
  { category: 'defense', label: 'Defense' },
] as const

type GearListProps = {
  onToggle: (key: string) => void
  ownedLines: OwnedLines
  slots: GearSlot[]
}

export function GearList({ slots, ownedLines, onToggle }: GearListProps) {
  return (
    <SimpleGrid aria-label="Gear and owned stats" columns={{ base: 1, lg: 2 }} gap={4} id="gearList">
      {slots.map((slot) => (
        <Box
          aria-labelledby={`gear-${slot.id}`}
          as="article"
          data-slot={slot.id}
          key={slot.id}
          layerStyle="panel"
          minW={0}
        >
          <Flex
            align="center"
            as="header"
            bg="bg.elevated"
            borderBottomWidth="1px"
            borderTopRadius="lg"
            gap={3}
            justify="space-between"
            px={4}
            py={3}
          >
            <Heading as="h2" id={`gear-${slot.id}`} textStyle="matrixSlot">
              {slot.label}
            </Heading>
            {slot.note && (
              <Text color="fg.muted" textStyle="matrixNote">
                {slot.note}
              </Text>
            )}
          </Flex>
          <SimpleGrid columnGap={3} columns={2} p={4} rowGap={2}>
            {STAT_COLUMNS.map((column) => (
              <Text color="fg.muted" key={column.category} textStyle="actionCompact">
                {column.label}
              </Text>
            ))}
            {(slot.lines.some((group) => group.length) ? STAT_GROUPS : STAT_GROUPS.slice(0, 1)).flatMap(
              ({ tier, index }) =>
                STAT_COLUMNS.map((column) => (
                  <Flex
                    align="start"
                    alignContent="start"
                    aria-label={`${column.label} · ${tier}`}
                    data-category={column.category}
                    data-tier={tier}
                    flexWrap="wrap"
                    gap={1.5}
                    key={`${tier}-${column.category}`}
                    minH={6}
                    minW={0}
                  >
                    {slot.lines[index]
                      .filter((line) => line.category === column.category)
                      .map((line) => (
                        <StatPill
                          isOwned={ownedLines[line.key] === true}
                          key={line.key}
                          line={line}
                          onToggle={onToggle}
                          slot={slot.label}
                        />
                      ))}
                  </Flex>
                )),
            )}
          </SimpleGrid>
        </Box>
      ))}
    </SimpleGrid>
  )
}
