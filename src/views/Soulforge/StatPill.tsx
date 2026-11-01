import { Box, Button, Icon } from '@chakra-ui/react'
import { FiCheck } from 'react-icons/fi'

import type { StatLine } from './types'

type StatPillProps = {
  isOwned: boolean
  line: StatLine
  onToggle: (key: string) => void
  slot: string
}

export function StatPill({ line, slot, isOwned, onToggle }: StatPillProps) {
  return (
    <Button
      aria-label={`${slot} · ${line.label}${line.isUnique ? ' · Unique' : ''} · ${isOwned ? 'Owned' : 'Not owned'}`}
      aria-pressed={isOwned}
      data-owned-key={line.key}
      data-stat={line.label}
      data-tone={line.tone}
      data-unique={line.isUnique || undefined}
      onClick={() => onToggle(line.key)}
      title={isOwned ? 'Owned · Click to unmark' : 'Not owned · Click to mark as owned'}
      type="button"
      variant="stat"
    >
      {line.label}
      {line.isUnique && (
        <Box as="span" color="warning.fg" flexShrink="0" fontWeight="mid">
          Unique
        </Box>
      )}
      <Icon aria-hidden="true" as={FiCheck} boxSize={3} flexShrink={0} opacity={isOwned ? 1 : 0} />
    </Button>
  )
}
