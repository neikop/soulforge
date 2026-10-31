import { Box, SimpleGrid, Text } from '@chakra-ui/react'

import { BRACELET_ENTRIES } from './data'
import styles from './Soulforge.module.scss'

export function BraceletList() {
  return (
    <SimpleGrid columns={{ base: 1, sm: 2 }} gap="10px">
      {BRACELET_ENTRIES.map((entry) => (
        <Box className={styles.bracelet} data-tone={entry.tone} key={entry.label} p="14px">
          <Text textStyle="matrixSlot">{entry.label}</Text>
          <Text color="matrix.muted" textStyle="matrixNote">
            {entry.rank}
          </Text>
        </Box>
      ))}
    </SimpleGrid>
  )
}
