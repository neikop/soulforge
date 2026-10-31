import { Box, Flex, Stack, Table, Text } from '@chakra-ui/react'

import type { GearSlot, OwnedLines } from './types'

import styles from './Soulforge.module.scss'
import { StatPill } from './StatPill'

type GearListProps = {
  onToggle: (key: string) => void
  ownedLines: OwnedLines
  slots: GearSlot[]
}

export function GearList({ slots, ownedLines, onToggle }: GearListProps) {
  return (
    <Box className={styles.tableWrap}>
      <Table.Root
        aria-label="Danh sách đồ và tiến độ sở hữu"
        className={`${styles.table} ${styles.gearTable}`}
        id="gearList"
        unstyled
      >
        <colgroup>
          <col />
          <col />
          <col />
          <col />
        </colgroup>
        <thead>
          <tr>
            {['Đồ / slot', 'Dòng nên lấy PVE', 'Dòng nên lấy PVP', 'Dòng độc quyền'].map((label) => (
              <th key={label} scope="col">
                <Text textStyle="matrixHeader">{label}</Text>
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
              {(['pve', 'pvp'] as const).map((mode) => (
                <td className={mode === 'pvp' && slot.pvp.length ? styles.pvpCell : undefined} key={mode}>
                  <Stack align="start" gap="6px">
                    {slot[mode].map((group) => (
                      <Flex flexWrap="wrap" gap="6px" key={group.map((line) => line.key).join(',')}>
                        {group.map((line) => (
                          <StatPill
                            isOwned={ownedLines[line.key] === true}
                            key={line.key}
                            line={line}
                            onToggle={onToggle}
                            slot={slot.label}
                          />
                        ))}
                      </Flex>
                    ))}
                  </Stack>
                </td>
              ))}
              <td>
                <Flex flexWrap="wrap" gap="6px">
                  {slot.exclusive.map((line) => (
                    <StatPill
                      isOwned={ownedLines[line.key] === true}
                      key={line.key}
                      line={line}
                      onToggle={onToggle}
                      slot={slot.label}
                    />
                  ))}
                </Flex>
              </td>
            </tr>
          ))}
        </tbody>
      </Table.Root>
    </Box>
  )
}
