import { Box, Button } from '@chakra-ui/react'

import type { StatLine } from './types'

import styles from './Soulforge.module.scss'

type StatPillProps = {
  isOwned: boolean
  line: StatLine
  onToggle: (key: string) => void
  slot: string
}

export function StatPill({ line, slot, isOwned, onToggle }: StatPillProps) {
  return (
    <Button
      aria-label={`${slot} · ${line.label}${line.isUnique ? ' · Unique' : ''} · ${isOwned ? 'Đã sở hữu' : 'Chưa sở hữu'}`}
      aria-pressed={isOwned}
      className={styles.pill}
      data-owned-key={line.key}
      data-stat={line.label}
      data-tone={line.tone}
      data-unique={line.isUnique || undefined}
      onClick={() => onToggle(line.key)}
      textStyle="matrixPill"
      title={isOwned ? 'Đã sở hữu · Bấm để bỏ dấu tích' : 'Chưa sở hữu · Bấm để đánh dấu'}
      type="button"
      unstyled
    >
      {line.label}
      {line.isUnique && (
        <Box as="span" color="warning.fg" flexShrink="0" fontWeight="mid">
          Unique
        </Box>
      )}
      {isOwned && (
        <Box aria-hidden="true" as="span" className={styles.check} color="matrix.s.fg">
          ✓
        </Box>
      )}
    </Button>
  )
}
