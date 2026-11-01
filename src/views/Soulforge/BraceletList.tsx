import { Box, SimpleGrid, Text } from '@chakra-ui/react'

import { BRACELET_ENTRIES } from './data'

const ENTRY_TONES = { core: 's', optional: 'top', low: 'a' } as const

export function BraceletList() {
  return (
    <SimpleGrid columns={{ base: 1, sm: 2 }} gap={4}>
      {BRACELET_ENTRIES.map((entry) => (
        <Box data-tone={ENTRY_TONES[entry.tone]} key={entry.label} layerStyle="tierCard" p={4}>
          <Text textStyle="matrixSlot">{entry.label}</Text>
          <Text textStyle="matrixNote">{entry.rank}</Text>
        </Box>
      ))}
    </SimpleGrid>
  )
}
