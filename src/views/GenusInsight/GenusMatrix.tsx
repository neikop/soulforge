import { Box, Checkbox, Flex, Stack, Table, Text, VisuallyHidden } from '@chakra-ui/react'

import { GENUS_BOARDS, GENUS_ROWS, GENUS_TIERS } from './data'

type GenusMatrixProps = {
  boardCounts: Record<string, number>
  completedLines: Record<string, boolean>
  onCompletedChange: (key: string, isCompleted: boolean) => void
}

export function GenusMatrix({ boardCounts, completedLines, onCompletedChange }: GenusMatrixProps) {
  return (
    <Box
      aria-label="Genus Insight boards and slots; scroll horizontally to view all five boards"
      layerStyle="tableContainer"
      role="region"
      tabIndex={0}
    >
      <Table.Root aria-label="Genus Insight targets and rolls to keep" variant="matrix">
        <colgroup>
          <Box as="col" w="matrixSlot" />
          {GENUS_BOARDS.map((board) => (
            <col key={board.id} />
          ))}
        </colgroup>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader scope="col">Slot / Priority</Table.ColumnHeader>
            {GENUS_BOARDS.map((board) => (
              <Table.ColumnHeader color="fg.default" key={board.id} scope="col">
                <Stack gap={1}>
                  <Text textStyle="title">{board.label}</Text>
                  <Text color="fg.muted" textStyle="bodyCompact">
                    {boardCounts[board.id] ?? 0}/9 to keep
                  </Text>
                </Stack>
              </Table.ColumnHeader>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {GENUS_ROWS.map((row) => (
            <Table.Row key={row.id}>
              <Table.ColumnHeader color="fg.default" scope="row">
                <Stack align="start" gap={2}>
                  <Text textStyle="titleCompact">Slot {row.id}</Text>
                  <Text color={row.priority === 1 ? 'matrix.top.fg' : 'fg.muted'} textStyle="actionCompact">
                    Priority {row.priority}
                  </Text>
                  <Text color="fg.muted" textStyle="bodyCompact">
                    {row.guidance}
                  </Text>
                </Stack>
              </Table.ColumnHeader>
              {row.lines.map((line) => {
                const isCompleted = completedLines[line.key] === true
                const { tone } = GENUS_TIERS[line.tier]

                // A definite cell height lets the checkbox fill the tallest content in its table row.
                return (
                  <Table.Cell h="1px" key={line.key} p={2}>
                    <Checkbox.Root
                      checked={isCompleted}
                      data-tier={line.tier}
                      data-tone={tone}
                      onCheckedChange={(details) => onCompletedChange(line.key, details.checked === true)}
                      size="sm"
                      variant="target"
                    >
                      <Checkbox.HiddenInput name={line.key} />
                      <Checkbox.Control>
                        <Checkbox.Indicator />
                      </Checkbox.Control>
                      <Checkbox.Label>
                        <VisuallyHidden as="span">
                          {line.boardLabel} · Slot {row.id} · Roll worth keeping ·
                        </VisuallyHidden>
                        <Flex align="start" as="span" gap={2} justify="space-between">
                          <Text as="span" textStyle="actionCompact">
                            {line.label}
                          </Text>
                          <Text as="span" flexShrink={0} textStyle="actionCompact">
                            {line.tier}
                          </Text>
                        </Flex>
                        {line.alternative && (
                          <Text as="span" textStyle="bodyCompact">
                            {line.alternative}
                          </Text>
                        )}
                      </Checkbox.Label>
                    </Checkbox.Root>
                  </Table.Cell>
                )
              })}
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  )
}
