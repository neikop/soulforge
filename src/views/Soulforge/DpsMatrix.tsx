import { Box, Table, Text } from '@chakra-ui/react'

import type { GearSlot } from './types'

import { MATRIX_COLUMNS } from './data'
import styles from './Soulforge.module.scss'

export function DpsMatrix({ slots }: { slots: GearSlot[] }) {
  return (
    <Box className={styles.tableWrap}>
      <Table.Root
        aria-label="DPS Soul Binding theo slot"
        className={`${styles.table} ${styles.matrixTable}`}
        id="dpsTable"
        unstyled
      >
        <colgroup>
          <col />
          {MATRIX_COLUMNS.map((column) => (
            <col key={column} />
          ))}
        </colgroup>
        <thead>
          <tr>
            <th scope="col">
              <Text textStyle="matrixHeader">Slot</Text>
            </th>
            {MATRIX_COLUMNS.map((column) => (
              <th key={column} scope="col">
                <Text textStyle="matrixHeader">{column}</Text>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {slots.map((slot) => (
            <tr key={slot.id}>
              <td>
                <Text textStyle="matrixSlot">{slot.label}</Text>
                {slot.note && (
                  <Text color="matrix.muted" textStyle="matrixNote">
                    {slot.note}
                  </Text>
                )}
              </td>
              {slot.matrix.map((cell, index) => (
                <td data-tier={cell.tier ?? undefined} key={MATRIX_COLUMNS[index]}>
                  {cell.tier !== 'X' && (
                    <Text as="span" textStyle="matrixTier">
                      {cell.tier}
                    </Text>
                  )}
                  {cell.isUnique && (
                    <Text color="matrix.top.fg" textStyle="matrixHeader">
                      Unique
                    </Text>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table.Root>
    </Box>
  )
}
