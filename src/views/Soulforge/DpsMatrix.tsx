import { Box, Table, Text } from '@chakra-ui/react'

import type { GearSlot } from './types'

import { MATRIX_COLUMNS } from './data'

const TIER_TONES = { 'S+': 'top', S: 's', 'A+': 'aplus', A: 'a', X: undefined } as const

export function DpsMatrix({ slots }: { slots: GearSlot[] }) {
  return (
    <Box
      aria-label="DPS matrix; scroll horizontally to view all stats"
      layerStyle="tableContainer"
      role="region"
      tabIndex={0}
    >
      <Table.Root aria-label="DPS stat priorities by gear slot" id="dpsTable" variant="matrix">
        <colgroup>
          <Box as="col" w="matrixSlot" />
          {MATRIX_COLUMNS.map((column) => (
            <col key={column} />
          ))}
        </colgroup>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader scope="col">
              <Text textStyle="matrixHeader">Slot</Text>
            </Table.ColumnHeader>
            {MATRIX_COLUMNS.map((column) => (
              <Table.ColumnHeader key={column} scope="col" textAlign="center">
                <Text textStyle="matrixHeader">{column}</Text>
              </Table.ColumnHeader>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {slots.map((slot) => (
            <Table.Row key={slot.id}>
              <Table.ColumnHeader scope="row" verticalAlign="middle">
                <Text textStyle="matrixSlot">{slot.label}</Text>
                {slot.note && (
                  <Text color="fg.muted" textStyle="matrixNote">
                    {slot.note}
                  </Text>
                )}
              </Table.ColumnHeader>
              {slot.matrix.map((cell, index) => (
                <Table.Cell
                  data-tier={cell.tier ?? undefined}
                  data-tone={cell.tier ? TIER_TONES[cell.tier] : undefined}
                  key={MATRIX_COLUMNS[index]}
                  textAlign="center"
                  verticalAlign="middle"
                >
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
                </Table.Cell>
              ))}
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  )
}
