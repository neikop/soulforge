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
  { category: 'attack', label: 'Tấn công' },
  { category: 'defense', label: 'Phòng thủ' },
] as const

type GearListProps = {
  onToggle: (key: string) => void
  ownedLines: OwnedLines
  slots: GearSlot[]
}

export function GearList({ slots, ownedLines, onToggle }: GearListProps) {
  return (
    <SimpleGrid aria-label="Danh sách đồ và tiến độ sở hữu" columns={{ base: 1, lg: 2 }} gap="16px" id="gearList">
      {slots.map((slot) => (
        <Box
          aria-labelledby={`gear-${slot.id}`}
          as="article"
          bg="matrix.field"
          borderColor="matrix.line"
          borderRadius="12px"
          borderWidth="1px"
          data-slot={slot.id}
          key={slot.id}
          minW="0"
        >
          <Flex
            align="center"
            as="header"
            bg="matrix.slot"
            borderBottomColor="matrix.line"
            borderBottomWidth="1px"
            borderTopRadius="12px"
            gap="12px"
            justify="space-between"
            px="14px"
            py="10px"
          >
            <Heading as="h2" id={`gear-${slot.id}`} textStyle="matrixSlot">
              {slot.label}
            </Heading>
            {slot.note && (
              <Text color="matrix.muted" textStyle="matrixNote">
                {slot.note}
              </Text>
            )}
          </Flex>
          {slot.lines.some((group) => group.length) && (
            <SimpleGrid columnGap="12px" columns={2} p="14px" rowGap="6px">
              {STAT_COLUMNS.map((column) => (
                <Text color="matrix.muted" key={column.category} textStyle="matrixNote">
                  {column.label}
                </Text>
              ))}
              {STAT_GROUPS.flatMap(({ tier, index }) =>
                STAT_COLUMNS.map((column) => (
                  <Flex
                    align="start"
                    alignContent="start"
                    aria-label={`${column.label} · ${tier}`}
                    data-category={column.category}
                    data-tier={tier}
                    flexWrap="wrap"
                    gap="6px"
                    key={`${tier}-${column.category}`}
                    minH="24px"
                    minW="0"
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
          )}
        </Box>
      ))}
    </SimpleGrid>
  )
}
